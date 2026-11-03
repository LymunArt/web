// Modelo de datos de la app de finanzas. Los nombres de los campos coinciden con las columnas
// de supabase/migrations, así el mismo objeto sirve para el modo de prueba y para la nube.

export type TipoMovimiento = "ingreso" | "gasto" | "pago_deuda";
export type MedioPago = "efectivo" | "débito" | "transferencia" | "Nequi" | "Nu" | "Daviplata" | "tarjeta";
export type OrigenMovimiento = "manual" | "extracto" | "nequi" | "nu" | "wallet";
export type EstadoProyecto = "idea" | "en_curso" | "pausado" | "terminado";
export type TipoCuenta = "ahorros" | "corriente" | "billetera" | "tarjeta" | "credito" | "efectivo" | "inversion";

// Una cuenta de cualquier banco o billetera, en su propia moneda (COP, USD, EUR...)
export type Cuenta = {
  id: string;
  nombre: string;
  entidad: string;
  tipo: TipoCuenta;
  moneda: string; // código ISO 4217
  // En la moneda de la cuenta. En una tarjeta de crédito es lo que se debe al agregarla.
  saldo_inicial: number;
  archivada: boolean;
  // Solo tarjetas de crédito
  cupo?: number | null;
  dia_corte?: number | null;
  dia_pago?: number | null;
};

// Permiso para que el Wallet del iPhone registre las compras de una cuenta. Solo se guarda la huella de la llave.
export type LlaveWallet = {
  id: string;
  cuenta_id: string;
  llave_hash: string;
  creada_en: string;
  ultimo_uso: string | null;
};

export type Movimiento = {
  id: string;
  fecha: string; // AAAA-MM-DD
  tipo: TipoMovimiento;
  categoria: string;
  descripcion: string;
  monto: number; // siempre positivo: el tipo define el signo. Va en la moneda del movimiento.
  moneda: string;
  // Pesos colombianos por unidad de la moneda, el día que se registró. Así el historial no cambia con el dólar.
  tasa: number;
  cuenta_id: string | null;
  medio_pago: MedioPago;
  deuda_id: string | null;
  proyecto_id: string | null;
  origen: OrigenMovimiento;
  // Identificador en la entidad de origen. Evita traer dos veces el mismo movimiento.
  id_externo: string | null;
};

export type Deuda = {
  id: string;
  nombre: string;
  entidad: string | null;
  saldo_inicial: number;
  tasa_mensual: number; // 0.0176 = 1,76 % mensual
  cuota: number;
  cuotas_totales: number;
  cuotas_pagadas: number; // las que ya estaban pagadas al registrar la deuda
  dia_pago: number | null;
  fecha_inicio: string;
};

export type PagoDeuda = {
  id: string;
  deuda_id: string;
  movimiento_id: string;
  numero_cuota: number;
  fecha: string;
  monto_pagado: number;
  interes: number;
  capital: number;
  otros_cobros: number;
  saldo_despues: number;
  abono_extra: number;
};

export type Proyecto = {
  id: string;
  nombre: string;
  descripcion: string;
  meta_monto: number | null;
  estado: EstadoProyecto;
  ideas: string[];
};

export type Presupuesto = {
  id: string;
  mes: string; // AAAA-MM
  categoria: string;
  limite: number;
};

// Lo que otras personas te deben (el "fiado" de Treinta, llevado a las finanzas personales)
export type PorCobrar = {
  id: string;
  persona: string;
  concepto: string;
  monto: number;
  fecha: string;
  cobrado: boolean;
};

export type Conexion = {
  id: string;
  proveedor: "nequi" | "nu";
  estado: "activa" | "vencida" | "revocada";
  referencia_externa: string; // nunca una clave: solo el identificador del consentimiento
  consentimiento_hasta: string | null;
  ultima_sincronizacion: string | null;
};

export type EstadoTaxFree = "pendiente" | "validada" | "enviada" | "recibida" | "rechazada";

// Una compra hecha como turista que da derecho a pedir de vuelta el IVA
export type CompraTaxFree = {
  id: string;
  fecha: string;
  tienda: string;
  pais: string; // código de país (FR, ES, DE...)
  moneda: string;
  total: number; // lo que pagó, con IVA incluido, en la moneda del país
  iva: number; // el IVA que trae la compra
  operador: string; // Global Blue, Planet, la tienda misma...
  estado: EstadoTaxFree;
  recibido: number | null; // lo que de verdad le devolvieron
  movimiento_id: string | null; // el ingreso que se registró al recibir la devolución
};

export const ESTADOS_TAX_FREE: { valor: EstadoTaxFree; nombre: string }[] = [
  { valor: "pendiente", nombre: "Por validar en aduana" },
  { valor: "validada", nombre: "Validada" },
  { valor: "enviada", nombre: "Enviada" },
  { valor: "recibida", nombre: "Recibida" },
  { valor: "rechazada", nombre: "Rechazada" },
];

export type Datos = {
  cuentas: Cuenta[];
  movimientos: Movimiento[];
  deudas: Deuda[];
  pagos_deuda: PagoDeuda[];
  proyectos: Proyecto[];
  presupuesto: Presupuesto[];
  por_cobrar: PorCobrar[];
  conexiones: Conexion[];
  compras_tax_free: CompraTaxFree[];
  llaves_wallet: LlaveWallet[];
};

export type Coleccion = keyof Datos;

export const datosVacios = (): Datos => ({
  cuentas: [],
  movimientos: [],
  deudas: [],
  pagos_deuda: [],
  proyectos: [],
  presupuesto: [],
  por_cobrar: [],
  conexiones: [],
  compras_tax_free: [],
  llaves_wallet: [],
});

export const CATEGORIAS = {
  ingreso: ["Salario", "Apoyo de sostenimiento SENA", "Trabajos", "Ventas", "Otros ingresos"],
  gasto: [
    "Alimentación",
    "Transporte",
    "Vivienda y servicios",
    "Celular e internet",
    "Estudio",
    "Salud",
    "Ropa",
    "Ocio",
    "Donaciones",
    "Imprevistos",
  ],
} as const;

export const AHORRO_EMERGENCIA = "Ahorro de emergencia";
export const APORTE_PROYECTO = "Aporte a proyecto";
export const PAGO_DEUDA = "Pago de deuda";
// Las compras que llegan solas (Wallet) quedan aquí hasta que la persona les pone categoría
export const POR_REVISAR = "Por revisar";

export const MEDIOS_PAGO: MedioPago[] = ["Nequi", "Nu", "efectivo", "débito", "transferencia", "Daviplata", "tarjeta"];

export const ESTADOS_PROYECTO: { valor: EstadoProyecto; nombre: string }[] = [
  { valor: "idea", nombre: "Idea" },
  { valor: "en_curso", nombre: "En curso" },
  { valor: "pausado", nombre: "En pausa" },
  { valor: "terminado", nombre: "Terminado" },
];

export const TIPOS_CUENTA: { valor: TipoCuenta; nombre: string }[] = [
  { valor: "ahorros", nombre: "Ahorros" },
  { valor: "corriente", nombre: "Corriente" },
  { valor: "billetera", nombre: "Billetera digital" },
  { valor: "tarjeta", nombre: "Tarjeta débito o prepago" },
  { valor: "credito", nombre: "Tarjeta de crédito" },
  { valor: "efectivo", nombre: "Efectivo" },
  { valor: "inversion", nombre: "Inversión" },
];

export const MONEDAS: { codigo: string; nombre: string }[] = [
  { codigo: "COP", nombre: "Peso colombiano" },
  { codigo: "USD", nombre: "Dólar" },
  { codigo: "EUR", nombre: "Euro" },
  { codigo: "MXN", nombre: "Peso mexicano" },
  { codigo: "BRL", nombre: "Real brasileño" },
  { codigo: "ARS", nombre: "Peso argentino" },
  { codigo: "CLP", nombre: "Peso chileno" },
  { codigo: "PEN", nombre: "Sol peruano" },
  { codigo: "GBP", nombre: "Libra esterlina" },
  { codigo: "CAD", nombre: "Dólar canadiense" },
];
