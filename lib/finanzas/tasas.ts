import { hoy } from "./formato";

// Tasas del día: cuántos pesos colombianos vale una unidad de cada moneda.
// El dólar usa la TRM oficial (Superfinanciera, en datos.gov.co); las demás, ExchangeRate-API.
export type Tasas = { fecha: string; pesosPor: Record<string, number>; trm: boolean };

const CLAVE = "finanzas:tasas";
let pendiente: Promise<Tasas | null> | null = null;

function leerGuardadas(): Tasas | null {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Tasas | null;
    return guardadas?.fecha === hoy() ? guardadas : null;
  } catch {
    return null;
  }
}

async function descargar(): Promise<Tasas | null> {
  const pesosPor: Record<string, number> = { COP: 1 };
  let trm = false;
  const [mercado, oficial] = await Promise.allSettled([
    fetch("https://open.er-api.com/v6/latest/COP").then((r) => r.json()),
    fetch("https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC").then((r) => r.json()),
  ]);
  if (mercado.status === "fulfilled" && mercado.value?.result === "success") {
    for (const [codigo, porPeso] of Object.entries(mercado.value.rates as Record<string, number>)) {
      if (porPeso > 0) pesosPor[codigo] = 1 / porPeso;
    }
  }
  if (oficial.status === "fulfilled") {
    const valor = Number(oficial.value?.[0]?.valor);
    if (valor > 0) {
      pesosPor.USD = valor;
      trm = true;
    }
  }
  if (Object.keys(pesosPor).length === 1) return null;
  const tasas = { fecha: hoy(), pesosPor, trm };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(tasas));
  } catch {}
  return tasas;
}

// Una sola descarga al día por dispositivo. Sin internet devuelve las últimas guardadas, si las hay.
export function obtenerTasas(): Promise<Tasas | null> {
  const guardadas = leerGuardadas();
  if (guardadas) return Promise.resolve(guardadas);
  pendiente ??= descargar().catch(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Tasas | null;
    } catch {
      return null;
    }
  });
  return pendiente;
}
