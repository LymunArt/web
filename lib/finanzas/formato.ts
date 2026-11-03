const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const miles = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

export const cop = (n: number) => pesos.format(n);

// Plata en cualquier moneda: "US$ 120,50", "€ 30", "$ 45.000"
export function dinero(n: number, moneda = "COP") {
  if (moneda === "COP") return pesos.format(n);
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: moneda, maximumFractionDigits: 2 }).format(n);
}
export const numero = (n: number) => miles.format(n);
export const porcentaje = (n: number, decimales = 0) =>
  `${(n * 100).toLocaleString("es-CO", { maximumFractionDigits: decimales, minimumFractionDigits: decimales })} %`;

// Fechas siempre en la hora de Colombia, sin importar dónde esté el dispositivo
export function hoy() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

export const mesActual = () => hoy().slice(0, 7);

// Se usa mediodía para que ningún huso horario cambie el día
const aFecha = (texto: string) => new Date(`${texto.length === 7 ? `${texto}-01` : texto}T12:00:00`);

export function nombreMes(mes: string, conAnio = true) {
  const texto = aFecha(mes).toLocaleDateString("es-CO", conAnio ? { month: "long", year: "numeric" } : { month: "long" });
  return texto.replace(" de ", " ");
}

export function moverMes(mes: string, delta: number) {
  const f = aFecha(mes);
  f.setDate(1);
  f.setMonth(f.getMonth() + delta);
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}`;
}

export function fechaCorta(fecha: string) {
  return aFecha(fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" }).replace(".", "");
}

export function diaLargo(fecha: string) {
  if (fecha === hoy()) return "Hoy";
  return aFecha(fecha).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
}

export const finEstimado = (cuotas: number) => nombreMes(moverMes(mesActual(), cuotas));

// Días hasta el próximo pago, para un día del mes (1 a 31)
export function proximoPago(dia: number) {
  const hoyTexto = hoy();
  const [a, m, d] = hoyTexto.split("-").map(Number);
  const ultimoDia = (anio: number, mes: number) => new Date(anio, mes, 0).getDate();
  const fecha = (anio: number, mes: number) =>
    `${anio}-${String(mes).padStart(2, "0")}-${String(Math.min(dia, ultimoDia(anio, mes))).padStart(2, "0")}`;
  const este = fecha(a, m);
  const proxima = Math.min(dia, ultimoDia(a, m)) >= d ? este : m === 12 ? fecha(a + 1, 1) : fecha(a, m + 1);
  const dias = Math.round((aFecha(proxima).getTime() - aFecha(hoyTexto).getTime()) / 86400000);
  return { fecha: proxima, dias };
}

export const nuevoId = () => crypto.randomUUID();
