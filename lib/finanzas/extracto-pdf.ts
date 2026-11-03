import { huella, leerMonto, sinTildes, type MovimientoExterno, type ResultadoExtracto } from "./conexiones";

// Lectura de extractos en PDF (Nequi, Nu y otros). Todo pasa en el navegador: el archivo no sale del dispositivo.

export type Celda = { texto: string; x: number; fin: number };
export type Linea = Celda[];

export class ErrorPdf extends Error {
  constructor(public motivo: "pide-clave" | "clave-incorrecta" | "ilegible") {
    super(motivo);
  }
}

type Trozo = { texto: string; x: number; y: number; ancho: number; alto: number };

// Une los trozos de texto del PDF en renglones (misma altura) y celdas (trozos cercanos entre sí)
export function armarLineas(trozos: Trozo[]): Linea[] {
  const ordenados = trozos.filter((t) => t.texto.trim()).sort((a, b) => b.y - a.y || a.x - b.x);
  const renglones: Trozo[][] = [];
  for (const t of ordenados) {
    const ultimo = renglones[renglones.length - 1];
    if (ultimo && Math.abs(ultimo[0].y - t.y) <= Math.max(2, t.alto * 0.4)) ultimo.push(t);
    else renglones.push([t]);
  }
  return renglones.map((renglon) => {
    const celdas: Celda[] = [];
    for (const t of renglon.sort((a, b) => a.x - b.x)) {
      const previa = celdas[celdas.length - 1];
      const hueco = previa ? t.x - previa.fin : Infinity;
      if (previa && hueco < Math.max(4, t.alto * 0.9)) {
        previa.texto += hueco > t.alto * 0.15 ? ` ${t.texto}` : t.texto;
        previa.fin = t.x + t.ancho;
      } else celdas.push({ texto: t.texto, x: t.x, fin: t.x + t.ancho });
    }
    return celdas.map((c) => ({ ...c, texto: c.texto.replace(/\s+/g, " ").trim() }));
  });
}

export async function lineasDePdf(datos: ArrayBuffer, clave?: string): Promise<Linea[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  let documento;
  try {
    documento = await pdfjs.getDocument({ data: new Uint8Array(datos), password: clave }).promise;
  } catch (error) {
    if ((error as { name?: string }).name === "PasswordException") {
      throw new ErrorPdf(clave ? "clave-incorrecta" : "pide-clave");
    }
    throw new ErrorPdf("ilegible");
  }
  const lineas: Linea[] = [];
  for (let n = 1; n <= documento.numPages; n++) {
    const pagina = await documento.getPage(n);
    const contenido = await pagina.getTextContent();
    const trozos = contenido.items.flatMap((item) =>
      "str" in item ? [{ texto: item.str, x: item.transform[4], y: item.transform[5], ancho: item.width, alto: Math.abs(item.transform[3]) || 8 }] : [],
    );
    lineas.push(...armarLineas(trozos));
  }
  await documento.destroy();
  return lineas;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const dos = (n: number | string) => String(n).padStart(2, "0");

// Fechas al inicio de un texto: 01/11/2026, 2026-11-01, 1 nov 2026, 01-nov-26 y, si el extracto no la trae, 01/11 con el año del extracto
export function fechaAlInicio(texto: string, anio: number | null): { fecha: string; resto: string } | null {
  const t = sinTildes(texto).trim();
  let r: RegExpMatchArray | null = null;
  // El resto se corta del texto original para conservar tildes y mayúsculas
  const valida = (a: number, m: number, d: number) =>
    m >= 1 && m <= 12 && d >= 1 && d <= 31
      ? { fecha: `${a}-${dos(m)}-${dos(d)}`, resto: texto.trim().slice((r as RegExpMatchArray)[0].length).trim() }
      : null;
  const anioCompleto = (a: string) => (a.length === 2 ? 2000 + Number(a) : Number(a));

  r = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (r) return valida(Number(r[1]), Number(r[2]), Number(r[3]));
  r = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4}|\d{2})\b/);
  if (r) return valida(anioCompleto(r[3]), Number(r[2]), Number(r[1]));
  r = t.match(/^(\d{1,2})[\s\-/.]+([a-z]{3})[a-z]*\.?(?:[\s\-/.]+(?:de\s+)?(\d{4}|\d{2}))?\b/);
  if (r && MESES.includes(r[2]) && (r[3] || anio)) return valida(r[3] ? anioCompleto(r[3]) : (anio as number), MESES.indexOf(r[2]) + 1, Number(r[1]));
  r = t.match(/^(\d{1,2})[/.](\d{1,2})\b(?![-/.]\d)/);
  if (r && anio) return valida(anio, Number(r[2]), Number(r[1]));
  return null;
}

// Un valor lleva separadores, signo o "$". Un número suelto (una referencia, por ejemplo) solo cuenta en la columna del valor.
const pareceMonto = (texto: string) => /^[-+(]?\s*\$?\s*-?\s*\d[\d.,]*\)?\s*-?$/.test(texto.trim());
const esMonto = (texto: string) => pareceMonto(texto) && /[.,]\d{2,3}\b|\$|^\s*[-+(]/.test(texto);

// "otra" es una columna que no nos sirve (sucursal, documento): existe para que sus números no se confundan con el valor
type Rol = "fecha" | "descripcion" | "valor" | "debito" | "credito" | "saldo" | "otra";

function rolDeTitulo(texto: string): Rol | null {
  const t = sinTildes(texto);
  if (/saldo/.test(t)) return "saldo";
  if (/fecha/.test(t)) return "fecha";
  if (/debito|cargo|retiro|salida/.test(t)) return "debito";
  if (/credito|abono|deposito|entrada/.test(t)) return "credito";
  if (/valor|monto|importe|cantidad/.test(t)) return "valor";
  if (/descrip|detalle|concepto|movimiento|referencia|comercio/.test(t)) return "descripcion";
  return null;
}

const centro = (c: { x: number; fin: number }) => (c.x + c.fin) / 2;

export function interpretarLineas(lineas: Linea[]): ResultadoExtracto {
  const texto = lineas.map((l) => l.map((c) => c.texto).join(" ")).join("\n");
  const anios = [...texto.matchAll(/\b(20\d{2})\b/g)].map((m) => Number(m[1]));
  const anio = anios.length ? Math.max(...anios) : null;

  // La fila de títulos dice qué columna es el valor y cuál el saldo, para no confundirlos
  let columnas: { rol: Rol; centro: number }[] = [];
  const filas: MovimientoExterno[] = [];
  const repetidos = new Map<string, number>();
  let descartadas = 0;
  let ultima: { descripcion: string[]; fecha: string; monto: number } | null = null;
  const pendientes: { descripcion: string[]; fecha: string; monto: number }[] = [];

  for (const linea of lineas) {
    const roles = linea.map((c) => rolDeTitulo(c.texto));
    if (roles.includes("fecha") && roles.some((r) => r === "valor" || r === "debito" || r === "credito")) {
      columnas = linea.map((c, i) => ({ rol: roles[i] ?? "otra", centro: centro(c) }));
      ultima = null;
      continue;
    }

    const inicio = fechaAlInicio(linea[0]?.texto ?? "", anio);
    const fecha = inicio?.fecha;
    const columnaDe = (c: Celda) =>
      columnas.length ? columnas.reduce((a, b) => (Math.abs(b.centro - centro(c)) < Math.abs(a.centro - centro(c)) ? b : a)).rol : null;
    const enColumnaDeValor = (c: Celda) => ["valor", "debito", "credito", "saldo"].includes(columnaDe(c) ?? "");
    const montos = linea
      .map((c, i) => ({ c, i }))
      .filter(({ c, i }) => i > 0 && (esMonto(c.texto) || (pareceMonto(c.texto) && enColumnaDeValor(c))));

    if (!fecha) {
      // Un renglón sin fecha ni valor suele ser la continuación de la descripción anterior
      if (ultima && montos.length === 0 && linea.length <= 2 && !rolDeTitulo(linea[0]?.texto ?? "")) {
        ultima.descripcion.push(...linea.map((c) => c.texto));
      } else ultima = null;
      continue;
    }

    let monto: number | null = null;
    if (columnas.length) {
      for (const { c } of montos) {
        const rol = columnaDe(c);
        const n = leerMonto(c.texto);
        if (n === null || n === 0) continue;
        if (rol === "valor") monto = n;
        else if (rol === "debito") monto = -Math.abs(n);
        else if (rol === "credito") monto = Math.abs(n);
        if (monto !== null) break;
      }
    } else if (montos.length) {
      // Sin títulos: cuando hay dos valores, el último suele ser el saldo
      monto = leerMonto(montos[0].c.texto);
    }

    if (!monto) {
      descartadas++;
      ultima = null;
      continue;
    }

    // La primera celda puede traer la fecha y el inicio de la descripción juntos
    const descripcion = [inicio?.resto ?? "",...linea.slice(1).filter((c, i) => !montos.some((m) => m.i === i + 1) && !["saldo", "fecha", "otra"].includes(columnaDe(c) ?? "")).map((c) => c.texto)].filter(Boolean);
    ultima = { descripcion, fecha, monto };
    pendientes.push(ultima);
  }

  for (const p of pendientes) {
    const descripcion = p.descripcion.join(" ").replace(/\s+/g, " ").trim() || "Sin descripción";
    const base = huella(p.fecha, p.monto, descripcion, 0);
    const repeticion = repetidos.get(base) ?? 0;
    repetidos.set(base, repeticion + 1);
    filas.push({ id_externo: huella(p.fecha, p.monto, descripcion, repeticion), fecha: p.fecha, descripcion, monto: p.monto });
  }

  return {
    filas,
    descartadas,
    problema: filas.length ? null : "No encontramos movimientos en ese PDF. ¿Es el extracto con la lista de movimientos?",
  };
}
