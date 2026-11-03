import { AHORRO_EMERGENCIA, APORTE_PROYECTO, type Datos, type Deuda, type Movimiento, type PagoDeuda, MEDIOS_PAGO, type Cuenta, type MedioPago } from "./tipos";

const redondear = (n: number) => Math.round(n);

// Todo resumen se hace en pesos. Los datos guardados antes de las monedas no traen tasa: eran pesos.
export const enPesos = (m: Pick<Movimiento, "monto" | "tasa">) => m.monto * (m.tasa ?? 1);

// Cuota del sistema francés: cuota = P * i / (1 - (1 + i)^-n)
export function cuotaFrancesa(capital: number, tasa: number, cuotas: number) {
  if (cuotas <= 0) return capital;
  if (tasa === 0) return capital / cuotas;
  return (capital * tasa) / (1 - Math.pow(1 + tasa, -cuotas));
}

export const tasaEfectivaAnual = (tasaMensual: number) => Math.pow(1 + tasaMensual, 12) - 1;

const pagosDe = (deuda: Deuda, pagos: PagoDeuda[]) =>
  pagos.filter((p) => p.deuda_id === deuda.id).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.numero_cuota - b.numero_cuota);

// El saldo no se guarda: siempre sale de los pagos, así borrar un pago deja todo correcto
export function saldoActual(deuda: Deuda, pagos: PagoDeuda[]) {
  const abonado = pagosDe(deuda, pagos).reduce((suma, p) => suma + p.capital + p.abono_extra, 0);
  return Math.max(0, deuda.saldo_inicial - abonado);
}

export const cuotasPagadas = (deuda: Deuda, pagos: PagoDeuda[]) =>
  deuda.cuotas_pagadas + pagosDe(deuda, pagos).length;

// La cuota solo de capital e interés, calculada con el saldo y las cuotas que faltaban al registrar la deuda
export const cuotaTeorica = (deuda: Deuda) =>
  cuotaFrancesa(deuda.saldo_inicial, deuda.tasa_mensual, deuda.cuotas_totales - deuda.cuotas_pagadas);

// Lo que la cuota real cobra por encima de capital e interés: seguros, comisiones
export const otrosCobrosPorCuota = (deuda: Deuda) => Math.max(0, redondear(deuda.cuota - cuotaTeorica(deuda)));

export type Desglose = {
  interes: number;
  capital: number;
  otros_cobros: number;
  abono_extra: number;
  saldo_despues: number;
};

// Separa un pago en interés, otros cobros y capital. Lo que pase de la cuota pactada es abono extra a capital.
export function desglosarPago(deuda: Deuda, pagos: PagoDeuda[], monto: number): Desglose {
  const saldo = saldoActual(deuda, pagos);
  const interes = redondear(Math.min(saldo * deuda.tasa_mensual, monto));
  const pagoNormal = Math.min(monto, deuda.cuota);
  const otros = redondear(Math.max(0, Math.min(pagoNormal - interes, pagoNormal - cuotaTeorica(deuda))));
  const capital = Math.min(saldo, Math.max(0, pagoNormal - interes - otros));
  const abono_extra = Math.min(saldo - capital, Math.max(0, monto - pagoNormal));
  return {
    interes,
    capital: redondear(capital),
    otros_cobros: otros,
    abono_extra: redondear(abono_extra),
    saldo_despues: redondear(saldo - capital - abono_extra),
  };
}

export type FilaAmortizacion = {
  numero: number;
  fecha: string | null;
  cuota: number;
  interes: number;
  capital: number;
  saldo: number;
  pagada: boolean;
};

function proyectar(saldoInicial: number, tasa: number, cuota: number) {
  const filas: { interes: number; capital: number; saldo: number; cuota: number }[] = [];
  let saldo = saldoInicial;
  // Con una cuota menor al interés la deuda no baja nunca: el tope evita un ciclo sin fin
  while (saldo > 0.5 && filas.length < 600) {
    const interes = saldo * tasa;
    const capital = Math.min(saldo, cuota - interes);
    if (capital <= 0) break;
    saldo -= capital;
    filas.push({ interes, capital, saldo, cuota: interes + capital });
  }
  return filas;
}

// La cuota no cambia con los pagos: un abono extra acorta el plazo y un pago incompleto lo alarga
const cuotaVigente = (deuda: Deuda) => cuotaTeorica(deuda);

// Las cuotas ya pagadas, con sus valores reales, seguidas de las que faltan
export function tablaAmortizacion(deuda: Deuda, pagos: PagoDeuda[]): FilaAmortizacion[] {
  let saldo = deuda.saldo_inicial;
  const reales: FilaAmortizacion[] = pagosDe(deuda, pagos).map((p, i) => {
    saldo -= p.capital + p.abono_extra;
    return {
      numero: deuda.cuotas_pagadas + i + 1,
      fecha: p.fecha,
      cuota: p.monto_pagado,
      interes: p.interes,
      capital: p.capital + p.abono_extra,
      saldo: Math.max(0, saldo),
      pagada: true,
    };
  });
  const futuras = proyectar(saldoActual(deuda, pagos), deuda.tasa_mensual, cuotaVigente(deuda)).map((f, i) => ({
    numero: deuda.cuotas_pagadas + reales.length + i + 1,
    fecha: null,
    cuota: redondear(f.cuota + otrosCobrosPorCuota(deuda)),
    interes: redondear(f.interes),
    capital: redondear(f.capital),
    saldo: redondear(f.saldo),
    pagada: false,
  }));
  return [...reales, ...futuras];
}

export function cuotasRestantes(deuda: Deuda, pagos: PagoDeuda[]) {
  return proyectar(saldoActual(deuda, pagos), deuda.tasa_mensual, cuotaVigente(deuda)).length;
}

// Abono extra hoy: lo que ahorra si baja el plazo o si baja la cuota
export function simularAbono(deuda: Deuda, pagos: PagoDeuda[], abono: number) {
  const saldo = saldoActual(deuda, pagos);
  const cuota = cuotaVigente(deuda);
  const interesDe = (filas: { interes: number }[]) => filas.reduce((s, f) => s + f.interes, 0);
  const base = proyectar(saldo, deuda.tasa_mensual, cuota);
  const nuevoSaldo = Math.max(0, saldo - abono);

  const conPlazo = proyectar(nuevoSaldo, deuda.tasa_mensual, cuota);
  const cuotaNueva = base.length ? cuotaFrancesa(nuevoSaldo, deuda.tasa_mensual, base.length) : 0;
  const conCuota = proyectar(nuevoSaldo, deuda.tasa_mensual, cuotaNueva);

  return {
    plazo: {
      mesesAhorrados: base.length - conPlazo.length,
      interesAhorrado: redondear(interesDe(base) - interesDe(conPlazo)),
    },
    cuota: {
      bajaMensual: redondear(cuota - cuotaNueva),
      interesAhorrado: redondear(interesDe(base) - interesDe(conCuota)),
    },
  };
}

// Paga todas las deudas mes a mes: la plata extra, y la cuota de la que termine, van a la primera del orden
function simularEstrategia(orden: Deuda[], pagos: PagoDeuda[], extra: number) {
  const vivas = orden.map((d) => ({ tasa: d.tasa_mensual, saldo: saldoActual(d, pagos), cuota: cuotaVigente(d) }));
  const presupuesto = vivas.reduce((s, d) => s + d.cuota, 0) + extra;
  let meses = 0;
  let interes = 0;
  while (vivas.some((d) => d.saldo > 0.5) && meses < 600) {
    meses++;
    let disponible = presupuesto;
    for (const d of vivas) {
      if (d.saldo <= 0.5) continue;
      const i = d.saldo * d.tasa;
      interes += i;
      d.saldo += i;
      const pago = Math.min(d.saldo, d.cuota);
      d.saldo -= pago;
      disponible -= pago;
    }
    for (const d of vivas) {
      if (disponible <= 0) break;
      const pago = Math.min(d.saldo, disponible);
      d.saldo -= pago;
      disponible -= pago;
    }
  }
  return { meses, interes: redondear(interes) };
}

export function compararEstrategias(deudas: Deuda[], pagos: PagoDeuda[], extra: number) {
  const vivas = deudas.filter((d) => saldoActual(d, pagos) > 0);
  const interesRestante = (d: Deuda) =>
    proyectar(saldoActual(d, pagos), d.tasa_mensual, cuotaVigente(d)).reduce((s, f) => s + f.interes, 0);
  // Avalancha: mayor tasa primero; si empatan, la que más intereses tiene por delante
  const avalancha = [...vivas].sort((a, b) => b.tasa_mensual - a.tasa_mensual || interesRestante(b) - interesRestante(a));
  // Bola de nieve: menor saldo primero
  const bola = [...vivas].sort((a, b) => saldoActual(a, pagos) - saldoActual(b, pagos));
  return {
    avalancha: { ...simularEstrategia(avalancha, pagos, extra), primera: avalancha[0] },
    bola: { ...simularEstrategia(bola, pagos, extra), primera: bola[0] },
  };
}

export const esAhorro = (m: Movimiento) => m.categoria === APORTE_PROYECTO || m.categoria === AHORRO_EMERGENCIA;

export function resumenMes(datos: Datos, mes: string) {
  const delMes = datos.movimientos.filter((m) => m.fecha.startsWith(mes));
  const suma = (filtro: (m: Movimiento) => boolean) => delMes.filter(filtro).reduce((s, m) => s + enPesos(m), 0);
  const ingresos = suma((m) => m.tipo === "ingreso");
  const pagos = suma((m) => m.tipo === "pago_deuda");
  const ahorro = suma((m) => m.tipo === "gasto" && esAhorro(m));
  const gastos = suma((m) => m.tipo === "gasto" && !esAhorro(m));
  return { ingresos, gastos, pagos, ahorro, disponible: ingresos - gastos - pagos - ahorro };
}

export function gastosPorCategoria(datos: Datos, mes: string) {
  const totales = new Map<string, number>();
  for (const m of datos.movimientos) {
    if (m.tipo !== "gasto" || esAhorro(m) || !m.fecha.startsWith(mes)) continue;
    totales.set(m.categoria, (totales.get(m.categoria) ?? 0) + enPesos(m));
  }
  return [...totales].map(([categoria, total]) => ({ categoria, total })).sort((a, b) => b.total - a.total);
}

// Total de cuotas de las deudas que siguen vivas, frente a los ingresos del mes. Lo ideal es menos de 30-35 %.
export function cargaDeuda(datos: Datos, mes: string) {
  const cuotas = datos.deudas.filter((d) => saldoActual(d, datos.pagos_deuda) > 0).reduce((s, d) => s + d.cuota, 0);
  const { ingresos } = resumenMes(datos, mes);
  return { cuotas, ingresos, proporcion: ingresos > 0 ? cuotas / ingresos : null };
}

export function ahorradoEnProyecto(datos: Datos, proyectoId: string) {
  return datos.movimientos.filter((m) => m.proyecto_id === proyectoId).reduce((s, m) => s + enPesos(m), 0);
}

// Cuánto de todas las deudas ya pagaste: lo que ya es tuyo
export function progresoDeudas(deudas: Deuda[], pagos: PagoDeuda[]) {
  const total = deudas.reduce((s, d) => s + d.saldo_inicial, 0);
  const saldo = deudas.reduce((s, d) => s + saldoActual(d, pagos), 0);
  return { total, saldo, proporcion: total > 0 ? (total - saldo) / total : 0 };
}

// Saldo de una cuenta en su propia moneda: lo que tenía al agregarla, más lo que entró, menos lo que salió.
// En una tarjeta de crédito es al revés: es lo que se debe, y cada compra lo sube y cada pago lo baja.
export function saldoCuenta(datos: Datos, cuentaId: string) {
  const cuenta = datos.cuentas.find((c) => c.id === cuentaId);
  if (!cuenta) return 0;
  const signo = cuenta.tipo === "credito" ? -1 : 1;
  return datos.movimientos
    .filter((m) => m.cuenta_id === cuentaId)
    .reduce((s, m) => s + signo * (m.tipo === "ingreso" ? m.monto : -m.monto), cuenta.saldo_inicial);
}

// Si el movimiento sale de una cuenta, el medio de pago se deduce de ella: no hay que preguntarlo
export function medioDeCuenta(cuenta: Cuenta): MedioPago {
  const porNombre = MEDIOS_PAGO.find((m) => m.toLowerCase() === cuenta.entidad.trim().toLowerCase());
  if (porNombre) return porNombre;
  if (cuenta.tipo === "efectivo") return "efectivo";
  if (cuenta.tipo === "tarjeta" || cuenta.tipo === "credito") return "tarjeta";
  return "débito";
}
