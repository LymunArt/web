import { leerMonto, sinTildes } from "./conexiones";

// Devolución de impuestos (tax free) para compras de turista fuera de Colombia.
// Las tasas son el IVA general de cada país en 2026. Los mínimos por compra cambian y las fuentes no coinciden,
// así que solo se dan los que coinciden en varias fuentes; para los demás, se le pide confirmar en la tienda.
export type Pais = { codigo: string; nombre: string; iva: number; moneda: string; minimo: number | null };

export const PAISES: Pais[] = [
  { codigo: "DE", nombre: "Alemania", iva: 0.19, moneda: "EUR", minimo: null },
  { codigo: "AT", nombre: "Austria", iva: 0.2, moneda: "EUR", minimo: null },
  { codigo: "BE", nombre: "Bélgica", iva: 0.21, moneda: "EUR", minimo: null },
  { codigo: "HR", nombre: "Croacia", iva: 0.25, moneda: "EUR", minimo: null },
  { codigo: "DK", nombre: "Dinamarca", iva: 0.25, moneda: "DKK", minimo: null },
  { codigo: "ES", nombre: "España", iva: 0.21, moneda: "EUR", minimo: 0 },
  { codigo: "FI", nombre: "Finlandia", iva: 0.255, moneda: "EUR", minimo: null },
  { codigo: "FR", nombre: "Francia", iva: 0.2, moneda: "EUR", minimo: 100.01 },
  { codigo: "GR", nombre: "Grecia", iva: 0.24, moneda: "EUR", minimo: null },
  { codigo: "HU", nombre: "Hungría", iva: 0.27, moneda: "HUF", minimo: null },
  { codigo: "IE", nombre: "Irlanda", iva: 0.23, moneda: "EUR", minimo: 0 },
  { codigo: "IT", nombre: "Italia", iva: 0.22, moneda: "EUR", minimo: null },
  { codigo: "LU", nombre: "Luxemburgo", iva: 0.17, moneda: "EUR", minimo: null },
  { codigo: "NO", nombre: "Noruega", iva: 0.25, moneda: "NOK", minimo: null },
  { codigo: "NL", nombre: "Países Bajos", iva: 0.21, moneda: "EUR", minimo: null },
  { codigo: "PL", nombre: "Polonia", iva: 0.23, moneda: "PLN", minimo: null },
  { codigo: "PT", nombre: "Portugal", iva: 0.23, moneda: "EUR", minimo: null },
  { codigo: "CZ", nombre: "República Checa", iva: 0.21, moneda: "CZK", minimo: null },
  { codigo: "SE", nombre: "Suecia", iva: 0.25, moneda: "SEK", minimo: null },
  { codigo: "CH", nombre: "Suiza", iva: 0.081, moneda: "CHF", minimo: null },
];

export const pais = (codigo: string) => PAISES.find((p) => p.codigo === codigo);

// El IVA ya viene dentro del precio: total × tasa / (1 + tasa)
export const ivaIncluido = (total: number, tasa: number) => (total * tasa) / (1 + tasa);

// Las empresas de tax free (Global Blue, Planet...) cobran comisión: al turista le llega más o menos
// entre el 55 % y el 85 % del IVA, es decir, cerca de 10 a 18 % de la compra. Es un rango, nunca una promesa.
export const PARTE_DEVUELTA = { minima: 0.55, maxima: 0.85 };

export function estimarDevolucion(iva: number) {
  return { desde: iva * PARTE_DEVUELTA.minima, hasta: iva * PARTE_DEVUELTA.maxima };
}

export type LecturaFactura = {
  tienda: string | null;
  fecha: string | null;
  total: number | null;
  iva: number | null;
  tasa: number | null; // la tasa de IVA que aparece en la factura, si aparece
  pais: string | null;
};

const PALABRAS_TOTAL = /total|summe|gesamt|totale|montant|importe|a pagar|bedrag|totaal|zu zahlen|sum\b/;
const PALABRAS_IVA = /\b(iva|vat|tva|mwst|ust|btw|moms|alv|dph|fpa|mva)\b/;
const IMPORTE = /-?\d{1,3}(?:[.\s]\d{3})*(?:[.,]\d{2})|-?\d+[.,]\d{2}/g;

// El idioma de la palabra del impuesto ayuda a adivinar el país; la persona siempre puede cambiarlo
function adivinarPais(texto: string, tasa: number | null): string | null {
  const candidatos = (codigos: string[]) => {
    const conTasa = tasa ? codigos.find((c) => Math.abs((pais(c)?.iva ?? 0) - tasa) < 0.006) : null;
    return conTasa ?? codigos[0];
  };
  if (/\b(mwst|ust)\b/.test(texto)) return candidatos(["DE", "AT"]);
  if (/\btva\b/.test(texto)) return candidatos(["FR", "BE", "LU"]);
  if (/\bbtw\b/.test(texto)) return candidatos(["NL", "BE"]);
  if (/\biva\b/.test(texto)) return candidatos(["ES", "IT", "PT"]);
  if (/\bmoms\b/.test(texto)) return candidatos(["DK", "SE"]);
  if (tasa) return PAISES.find((p) => Math.abs(p.iva - tasa) < 0.006)?.codigo ?? null;
  return null;
}

function fechaEnTexto(texto: string): string | null {
  const r = texto.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4}|\d{2})\b/) ?? null;
  if (r) {
    const anio = r[3].length === 2 ? 2000 + Number(r[3]) : Number(r[3]);
    const [d, m] = [Number(r[1]), Number(r[2])];
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return `${anio}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  const iso = texto.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  return iso ? `${iso[1]}-${iso[2]}-${iso[3]}` : null;
}

// Saca de una factura o recibo lo que sirve para el tax free. Lo que no encuentre queda vacío para llenarlo a mano.
export function leerFactura(textoOriginal: string): LecturaFactura {
  const renglones = textoOriginal.split(/\r?\n/).map((r) => r.replace(/\s+/g, " ").trim()).filter(Boolean);
  const importes = (r: string) => (r.match(IMPORTE) ?? []).map((m) => leerMonto(m)).filter((n): n is number => n !== null && n > 0);

  // El total: el mayor importe de los renglones que dicen "total" (sin contar "subtotal")
  let total: number | null = null;
  for (const r of renglones) {
    const t = sinTildes(r);
    if (PALABRAS_TOTAL.test(t) && !/sub\s*-?total|zwischen/.test(t)) {
      const mayor = Math.max(...importes(r), 0);
      if (mayor > (total ?? 0)) total = mayor;
    }
  }
  // Sin la palabra "total", el mayor importe del recibo suele serlo
  if (total === null) {
    const todos = renglones.flatMap(importes);
    total = todos.length ? Math.max(...todos) : null;
  }

  let tasa: number | null = null;
  let iva: number | null = null;
  for (const r of renglones) {
    const t = sinTildes(r);
    if (!PALABRAS_IVA.test(t)) continue;
    const porcentaje = t.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*%/);
    if (porcentaje && !tasa) tasa = Number(porcentaje[1].replace(",", ".")) / 100;
    // El IVA es el importe del renglón que sea menor que el total (el otro suele ser la base)
    const candidatos = importes(r).filter((n) => !total || n < total * 0.35);
    if (candidatos.length && !iva) iva = Math.max(...candidatos);
  }

  // La tienda suele ser el primer renglón con letras y sin importes
  const tienda = renglones.find((r) => /[a-z]{3,}/i.test(r) && !/\d+[.,]\d{2}/.test(r) && !/^\d/.test(r))?.slice(0, 60) ?? null;

  return {
    tienda,
    fecha: fechaEnTexto(textoOriginal),
    total,
    iva,
    tasa,
    pais: adivinarPais(sinTildes(textoOriginal), tasa),
  };
}

// Leer el texto de una foto (en el celular, sin enviarla a ningún lado) o de un PDF
export async function textoDeArchivo(archivo: File, alAvanzar?: (p: number) => void): Promise<string> {
  const esPdf = archivo.type === "application/pdf" || /\.pdf$/i.test(archivo.name);
  if (esPdf) {
    const { lineasDePdf } = await import("./extracto-pdf");
    const lineas = await lineasDePdf(await archivo.arrayBuffer());
    return lineas.map((l) => l.map((c) => c.texto).join(" ")).join("\n");
  }
  const { createWorker } = await import("tesseract.js");
  const trabajador = await createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text") alAvanzar?.(m.progress);
    },
  });
  try {
    const { data } = await trabajador.recognize(archivo);
    return data.text;
  } finally {
    await trabajador.terminate();
  }
}
