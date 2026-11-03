import { mesActual, moverMes, nuevoId } from "./formato";
import { desglosarPago } from "./calculos";
import type { Cuenta, Datos, Deuda, MedioPago, Movimiento, PagoDeuda, TipoMovimiento } from "./tipos";

// Datos inventados para probar la app. Se ofrecen solo en el modo de prueba y la interfaz los marca como ejemplo.
export function datosEjemplo(): Datos {
  const mes = mesActual();
  const anterior = moverMes(mes, -1);

  const cuentas: Cuenta[] = [
    { id: nuevoId(), nombre: "Mi Nequi (ejemplo)", entidad: "Nequi", tipo: "billetera", moneda: "COP", saldo_inicial: 350000, archivada: false },
    { id: nuevoId(), nombre: "Tarjeta en dólares (ejemplo)", entidad: "Otra entidad", tipo: "tarjeta", moneda: "USD", saldo_inicial: 120, archivada: false },
  ];

  const mov = (dia: string, tipo: TipoMovimiento, categoria: string, descripcion: string, monto: number, medio_pago: MedioPago): Movimiento => ({
    id: nuevoId(), fecha: dia, tipo, categoria, descripcion, monto, moneda: "COP", tasa: 1,
    cuenta_id: medio_pago === "Nequi" ? cuentas[0].id : null, medio_pago,
    deuda_id: null, proyecto_id: null, origen: "manual", id_externo: null,
  });

  const deudas: Deuda[] = [
    { id: nuevoId(), nombre: "Deuda 1", entidad: null, saldo_inicial: 3500000, tasa_mensual: 0.018, cuota: 260000, cuotas_totales: 18, cuotas_pagadas: 0, dia_pago: 5, fecha_inicio: `${anterior}-01` },
    { id: nuevoId(), nombre: "Deuda 2", entidad: null, saldo_inicial: 4800000, tasa_mensual: 0.015, cuota: 250000, cuotas_totales: 24, cuotas_pagadas: 0, dia_pago: 15, fecha_inicio: `${anterior}-01` },
  ];

  const movimientos: Movimiento[] = [
    mov(`${anterior}-01`, "ingreso", "Salario", "Pago del mes (ejemplo)", 2100000, "transferencia"),
    mov(`${anterior}-06`, "gasto", "Alimentación", "Mercado (ejemplo)", 310000, "Nu"),
    mov(`${anterior}-12`, "gasto", "Transporte", "Recarga de transporte (ejemplo)", 120000, "Nequi"),
    mov(`${mes}-01`, "ingreso", "Salario", "Pago del mes (ejemplo)", 2100000, "transferencia"),
    mov(`${mes}-01`, "gasto", "Vivienda y servicios", "Arriendo (ejemplo)", 650000, "transferencia"),
    mov(`${mes}-02`, "gasto", "Alimentación", "Mercado (ejemplo)", 185000, "Nu"),
    mov(`${mes}-02`, "gasto", "Transporte", "Recarga de transporte (ejemplo)", 60000, "Nequi"),
    mov(`${mes}-02`, "gasto", "Celular e internet", "Plan de celular (ejemplo)", 45000, "Nequi"),
  ];

  // Una cuota ya pagada en cada deuda para que se vean el saldo y la tabla en movimiento
  const pagos_deuda: PagoDeuda[] = [];
  for (const deuda of deudas) {
    const fecha = `${anterior}-${String(deuda.dia_pago).padStart(2, "0")}`;
    const movimiento = { ...mov(fecha, "pago_deuda", "Pago de deuda", `Cuota de ${deuda.nombre}`, deuda.cuota, "Nequi"), deuda_id: deuda.id };
    movimientos.push(movimiento);
    pagos_deuda.push({
      id: nuevoId(), deuda_id: deuda.id, movimiento_id: movimiento.id, numero_cuota: 1, fecha,
      monto_pagado: deuda.cuota, ...desglosarPago(deuda, [], deuda.cuota),
    });
  }

  return {
    cuentas,
    movimientos,
    deudas,
    pagos_deuda,
    proyectos: [{ id: nuevoId(), nombre: "Computador nuevo (ejemplo)", descripcion: "Para trabajar desde la casa", meta_monto: 2500000, estado: "en_curso", ideas: ["Mirar opciones reacondicionadas"] }],
    presupuesto: [
      { id: nuevoId(), mes, categoria: "Alimentación", limite: 220000 },
      { id: nuevoId(), mes, categoria: "Transporte", limite: 150000 },
    ],
    por_cobrar: [],
    conexiones: [],
  };
}
