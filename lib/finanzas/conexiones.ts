import { CATEGORIAS, type Cuenta, type MedioPago, type Movimiento, type OrigenMovimiento } from "./tipos";
import { nuevoId } from "./formato";

// Un movimiento tal como llega de afuera, antes de categorizarlo. Toda fuente (extracto, Nequi, Nu) produce esto,
// y de ahí en adelante todo el camino es el mismo: normalizar, quitar repetidos, revisar y guardar.
export type MovimientoExterno = {
  id_externo: string;
  fecha: string;
  descripcion: string;
  monto: number; // con signo: positivo entra, negativo sale
};

// Lo que debe cumplir una conexión directa. La app nunca pide ni guarda la clave del banco:
// la persona autoriza en la entidad o en el agregador y aquí solo queda la referencia de ese permiso.
export type Conector = {
  proveedor: "nequi" | "nu";
  // Devuelve la dirección donde la persona da su consentimiento
  iniciarConsentimiento(usuarioId: string, regresarA: string): Promise<{ url: string }>;
  // Corre en el servidor: las llaves del agregador nunca llegan al navegador
  traerMovimientos(referencia: string, desde: string): Promise<MovimientoExterno[]>;
  revocar(referencia: string): Promise<void>;
};

export const PROVEEDORES = [
  {
    id: "nequi" as const,
    nombre: "Nequi",
    medio: "Nequi" as MedioPago,
    nota: "Nequi ya comparte datos con terceros autorizados a través de un agregador, con tu permiso. Falta contratar ese acceso.",
  },
  {
    id: "nu" as const,
    nombre: "Nu",
    medio: "Nu" as MedioPago,
    nota: "Esperamos el calendario de finanzas abiertas de la Superfinanciera. Aún no hay un acceso confirmado para traer tus movimientos.",
  },
];

// Lee texto separado por comas o punto y coma, respetando las comillas
function leerFilas(texto: string) {
  const limpio = texto.replace(/^﻿/, "");
  const primera = limpio.split(/\r?\n/, 1)[0] ?? "";
  const separador = (primera.match(/;/g)?.length ?? 0) >= (primera.match(/,/g)?.length ?? 0) ? ";" : ",";
  const filas: string[][] = [];
  let fila: string[] = [];
  let celda = "";
  let enComillas = false;
  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i];
    if (enComillas) {
      if (c === '"' && limpio[i + 1] === '"') {
        celda += '"';
        i++;
      } else if (c === '"') enComillas = false;
      else celda += c;
    } else if (c === '"') enComillas = true;
    else if (c === separador) {
      fila.push(celda.trim());
      celda = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && limpio[i + 1] === "\n") i++;
      fila.push(celda.trim());
      celda = "";
      if (fila.some(Boolean)) filas.push(fila);
      fila = [];
    } else celda += c;
  }
  fila.push(celda.trim());
  if (fila.some(Boolean)) filas.push(fila);
  return filas;
}

// Entiende "-25.000", "$ 1.234.567,50", "1,234.50" y "(25.000)"
export function leerMonto(texto: string): number | null {
  const negativo = /^\s*-|^\s*\(|-\s*$/.test(texto);
  let t = texto.replace(/[^\d.,]/g, "");
  if (!/\d/.test(t)) return null;
  const coma = t.lastIndexOf(",");
  const punto = t.lastIndexOf(".");
  const decimal = Math.max(coma, punto);
  // El último separador es decimal solo si le siguen 1 o 2 dígitos; si no, es de miles
  if (decimal >= 0 && t.length - decimal - 1 <= 2) {
    t = `${t.slice(0, decimal).replace(/[.,]/g, "")}.${t.slice(decimal + 1)}`;
  } else t = t.replace(/[.,]/g, "");
  const n = Number(t);
  return Number.isNaN(n) ? null : negativo ? -n : n;
}

export function leerFecha(texto: string): string | null {
  const iso = texto.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  const latina = texto.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  const [a, m, d] = iso ? [iso[1], iso[2], iso[3]] : latina ? [latina[3], latina[2], latina[1]] : [];
  if (!a || !m || !d || Number(m) > 12 || Number(d) > 31) return null;
  return `${a}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export const sinTildes = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const huella = (fecha: string, monto: number, descripcion: string, repeticion: number) =>
  `extracto:${fecha}:${monto}:${sinTildes(descripcion).replace(/\s+/g, " ")}:${repeticion}`;

export type ResultadoExtracto = { filas: MovimientoExterno[]; descartadas: number; problema: string | null };

// Convierte un extracto en movimientos. Reconoce las columnas por su nombre.
export function leerExtracto(texto: string): ResultadoExtracto {
  const filas = leerFilas(texto);
  const indice = filas.findIndex((f) => {
    const t = f.map(sinTildes);
    return t.some((c) => c.includes("fecha")) && t.some((c) => /valor|monto|importe|cantidad/.test(c));
  });
  if (indice < 0) {
    return { filas: [], descartadas: 0, problema: "No encontramos las columnas de fecha y valor. El archivo necesita una fila de títulos con esos nombres." };
  }
  const titulos = filas[indice].map(sinTildes);
  const columna = (patron: RegExp) => titulos.findIndex((c) => patron.test(c));
  const cFecha = columna(/fecha/);
  const cValor = columna(/valor|monto|importe|cantidad/);
  const cDescripcion = columna(/descrip|detalle|concepto|movimiento|comercio/);

  const repetidos = new Map<string, number>();
  const resultado: MovimientoExterno[] = [];
  let descartadas = 0;
  for (const fila of filas.slice(indice + 1)) {
    const fecha = leerFecha(fila[cFecha] ?? "");
    const monto = leerMonto(fila[cValor] ?? "");
    if (!fecha || !monto) {
      descartadas++;
      continue;
    }
    const descripcion = (cDescripcion >= 0 ? fila[cDescripcion] : "") || "Sin descripción";
    // Dos compras iguales el mismo día son dos movimientos: el contador las distingue
    const base = huella(fecha, monto, descripcion, 0);
    const repeticion = repetidos.get(base) ?? 0;
    repetidos.set(base, repeticion + 1);
    resultado.push({ id_externo: huella(fecha, monto, descripcion, repeticion), fecha, descripcion, monto });
  }
  return { filas: resultado, descartadas, problema: null };
}

const PISTAS: [RegExp, string][] = [
  [/exito|carulla|d1|ara|jumbo|olimpica|mercado|rappi|restaurante|panaderia/, "Alimentación"],
  [/uber|didi|taxi|transmilenio|tullave|gasolina|peaje/, "Transporte"],
  [/arriendo|enel|codensa|acueducto|vanti|gas natural/, "Vivienda y servicios"],
  [/claro|movistar|tigo|wom|etb/, "Celular e internet"],
  [/sena|universidad|curso|matricula/, "Estudio"],
  [/farmacia|drogueria|eps|clinica|medico/, "Salud"],
  [/netflix|spotify|cine/, "Ocio"],
  [/nomina|salario|sueldo/, "Salario"],
];

export function sugerirCategoria(descripcion: string, esIngreso: boolean) {
  const texto = sinTildes(descripcion);
  const permitidas: readonly string[] = esIngreso ? CATEGORIAS.ingreso : CATEGORIAS.gasto;
  const pista = PISTAS.find(([patron, categoria]) => patron.test(texto) && permitidas.includes(categoria));
  return pista?.[1] ?? (esIngreso ? "Otros ingresos" : "Imprevistos");
}

// El último paso común: quita lo que ya está guardado y deja los movimientos listos para revisar
export function aMovimientos(
  externos: MovimientoExterno[],
  existentes: Movimiento[],
  origen: OrigenMovimiento,
  medio_pago: MedioPago,
  // Si el extracto es de una cuenta registrada, los movimientos quedan en ella y en su moneda
  cuenta: Cuenta | null = null,
  tasa = 1,
): { nuevos: Movimiento[]; repetidos: number } {
  const vistos = new Set(existentes.map((m) => m.id_externo).filter(Boolean));
  const unicos = externos.filter((e) => !vistos.has(e.id_externo));
  return {
    repetidos: externos.length - unicos.length,
    nuevos: unicos.map((e) => ({
      id: nuevoId(),
      fecha: e.fecha,
      tipo: e.monto > 0 ? "ingreso" : "gasto",
      categoria: sugerirCategoria(e.descripcion, e.monto > 0),
      descripcion: e.descripcion,
      monto: Math.abs(e.monto),
      moneda: cuenta?.moneda ?? "COP",
      tasa: cuenta && cuenta.moneda !== "COP" ? tasa : 1,
      cuenta_id: cuenta?.id ?? null,
      medio_pago,
      deuda_id: null,
      proyecto_id: null,
      origen,
      id_externo: e.id_externo,
    })),
  };
}

export function movimientosACsv(movimientos: Movimiento[]) {
  const celda = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const titulos = ["Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Moneda", "En pesos", "Medio de pago"];
  const filas = [...movimientos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((m) =>
      [m.fecha, m.tipo, m.categoria, m.descripcion, m.monto, m.moneda ?? "COP", Math.round(m.monto * (m.tasa ?? 1)), m.medio_pago]
        .map(celda)
        .join(";"),
    );
  // La marca inicial hace que Excel lea bien las tildes
  return `﻿${[titulos.map(celda).join(";"), ...filas].join("\r\n")}`;
}
