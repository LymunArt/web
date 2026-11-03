"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { desglosarPago, medioDeCuenta } from "@/lib/finanzas/calculos";
import { cop, hoy, nuevoId } from "@/lib/finanzas/formato";
import { obtenerTasas, type Tasas } from "@/lib/finanzas/tasas";
import { AHORRO_EMERGENCIA, APORTE_PROYECTO, CATEGORIAS, MEDIOS_PAGO, PAGO_DEUDA, POR_REVISAR, type MedioPago, type Movimiento, type TipoMovimiento } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, CampoMonto, Campo, Hoja, Pildoras, Segmentado, Selector } from "./Ui";

const TIPOS: { valor: TipoMovimiento; nombre: string }[] = [
  { valor: "gasto", nombre: "Gasto" },
  { valor: "ingreso", nombre: "Ingreso" },
  { valor: "pago_deuda", nombre: "Cuota deuda" },
];

const OTRA_CATEGORIA = "Otra…";


// Registrar en segundos, como en Treinta: el valor primero, un toque para la categoría y listo.
export default function Registrar() {
  const { registro, cerrarRegistro, datos, guardarMovimiento, borrarMovimiento, avisar } = useFinanzas();
  const inicial = registro?.inicial ?? {};
  const editando = !!inicial.id;

  const [tipo, setTipo] = useState<TipoMovimiento>(inicial.tipo ?? "gasto");
  const [monto, setMonto] = useState(inicial.monto ?? 0);
  const [categoria, setCategoria] = useState(inicial.categoria ?? "");
  const [descripcion, setDescripcion] = useState(inicial.descripcion ?? "");
  const [medio, setMedio] = useState<MedioPago>(inicial.medio_pago ?? "Nequi");
  const [fecha, setFecha] = useState(inicial.fecha ?? hoy());
  const [deudaId, setDeudaId] = useState(inicial.deuda_id ?? datos.deudas[0]?.id ?? "");
  const [proyectoId, setProyectoId] = useState(inicial.proyecto_id ?? "");
  const [intento, setIntento] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const cuentasActivas = datos.cuentas.filter((c) => !c.archivada || c.id === inicial.cuenta_id);
  const [cuentaId, setCuentaId] = useState(inicial.cuenta_id ?? (editando ? "" : cuentasActivas[0]?.id ?? ""));
  const [tasas, setTasas] = useState<Tasas | null>(null);
  const [sinTasa, setSinTasa] = useState(false);

  useEffect(() => {
    obtenerTasas().then((t) => (t ? setTasas(t) : setSinTasa(true)));
  }, []);

  const cuenta = datos.cuentas.find((c) => c.id === cuentaId);
  const moneda = cuenta?.moneda ?? (editando ? inicial.moneda ?? "COP" : "COP");
  // Al editar se respeta la tasa con que se registró; uno nuevo usa la de hoy
  const tasa =
    moneda === "COP" ? 1 : editando && inicial.moneda === moneda && inicial.tasa ? inicial.tasa : tasas?.pesosPor[moneda] ?? null;
  const montoEnPesos = tasa ? monto * tasa : 0;

  const deuda = datos.deudas.find((d) => d.id === deudaId);
  // Al editar un pago, el desglose se calcula como si ese pago aún no existiera
  const pagosSinEste = datos.pagos_deuda.filter((p) => p.movimiento_id !== inicial.id);
  const desglose = tipo === "pago_deuda" && deuda && montoEnPesos > 0 ? desglosarPago(deuda, pagosSinEste, Math.round(montoEnPesos)) : null;

  const base: readonly string[] =
    tipo === "ingreso" ? CATEGORIAS.ingreso : [...CATEGORIAS.gasto, AHORRO_EMERGENCIA, ...(datos.proyectos.length ? [APORTE_PROYECTO] : [])];
  // Las categorías que cada persona crea con "Otra…" se le sugieren después solo a ella
  const propias = [
    ...new Set(
      datos.movimientos
        .filter((m) => m.tipo === tipo && m.categoria && !base.includes(m.categoria) && m.categoria !== POR_REVISAR && m.categoria !== PAGO_DEUDA)
        .map((m) => m.categoria),
    ),
  ];
  const categorias = [...base, ...propias, OTRA_CATEGORIA];
  const categoriaFinal = categoria === OTRA_CATEGORIA ? nuevaCategoria.trim() : categoria;

  const faltaCategoria = tipo !== "pago_deuda" && !categoriaFinal;
  const faltaProyecto = categoria === APORTE_PROYECTO && !proyectoId;
  const faltaDeuda = tipo === "pago_deuda" && !deuda;
  const valido = monto > 0 && !faltaCategoria && !faltaProyecto && !faltaDeuda && tasa !== null;

  function cambiarTipo(nuevo: TipoMovimiento) {
    setTipo(nuevo);
    setCategoria("");
    if (nuevo === "pago_deuda" && deuda && !monto) setMonto(deuda.cuota);
  }

  function enviar(cerrar: () => void) {
    setIntento(true);
    if (!valido) return;
    const movimiento: Movimiento = {
      id: inicial.id ?? nuevoId(),
      fecha,
      tipo,
      categoria: tipo === "pago_deuda" ? PAGO_DEUDA : categoriaFinal,
      descripcion: descripcion.trim() || (tipo === "pago_deuda" && deuda ? `Cuota de ${deuda.nombre}` : categoriaFinal),
      monto,
      moneda,
      tasa: tasa ?? 1,
      cuenta_id: cuentaId || null,
      medio_pago: cuenta ? medioDeCuenta(cuenta) : medio,
      deuda_id: tipo === "pago_deuda" ? deudaId : null,
      proyecto_id: categoria === APORTE_PROYECTO ? proyectoId : null,
      origen: inicial.origen ?? "manual",
      id_externo: inicial.id_externo ?? null,
    };
    guardarMovimiento(movimiento);
    avisar(editando ? "Cambios guardados" : "Registrado", editando ? undefined : () => borrarMovimiento(movimiento));
    cerrar();
  }

  return (
    <Hoja titulo={editando ? "Editar movimiento" : "Registrar"} onCerrar={cerrarRegistro}>
      {(cerrar) => (
        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(cerrar);
          }}
        >
          <Segmentado etiqueta="Tipo de movimiento" opciones={TIPOS} valor={tipo} onCambio={cambiarTipo} />
          <div className="py-3">
            <CampoMonto key={moneda} etiqueta={`Valor en ${moneda}`} valor={monto} onCambio={setMonto} grande autoFocus={!editando} moneda={moneda} />
            {intento && monto <= 0 && <p className="mt-1 text-center text-sm font-medium text-boton-hover dark:text-naranja">Escribe cuánto fue.</p>}
            {moneda !== "COP" && (
              <p className="cifras mt-2 text-center text-sm text-tinta-suave">
                {tasa
                  ? `≈ ${cop(montoEnPesos)} · 1 ${moneda} = ${cop(tasa)}${moneda === "USD" && tasas?.trm && !editando ? " (TRM de hoy)" : ""}`
                  : sinTasa
                    ? "No pudimos traer la tasa de hoy. Revisa tu internet e inténtalo otra vez."
                    : "Buscando la tasa de hoy…"}
              </p>
            )}
          </div>

          {cuentasActivas.length > 0 && (
            <Selector etiqueta="¿De qué cuenta?" value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
              {cuentasActivas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} · {c.moneda}</option>
              ))}
              <option value="">Sin cuenta (en pesos)</option>
            </Selector>
          )}

          {tipo === "pago_deuda" ? (
            datos.deudas.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-xl bg-cielo/35 p-4 text-sm dark:bg-cielo/10">
                <p>Aquí van las cuotas de un crédito o préstamo que tengas registrado. ¿Es otro tipo de pago, como un servicio o una compra? Regístralo como <strong className="font-semibold">Gasto</strong>.</p>
                <div className="flex flex-wrap gap-3">
                  <Boton variante="suave" onClick={() => cambiarTipo("gasto")}>Registrarlo como gasto</Boton>
                  <Link href="/finanzas/deudas" onClick={cerrar} className="inline-flex min-h-11 items-center text-sm font-semibold underline decoration-cielo decoration-2 underline-offset-4">Agregar una deuda</Link>
                </div>
              </div>
            ) : (
              <>
                <Selector
                  etiqueta="¿A qué deuda?"
                  value={deudaId}
                  onChange={(e) => {
                    setDeudaId(e.target.value);
                    const elegida = datos.deudas.find((d) => d.id === e.target.value);
                    if (elegida) setMonto(elegida.cuota);
                  }}
                >
                  {datos.deudas.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </Selector>
                {desglose && (
                  <dl className="cifras grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl bg-cielo/35 p-4 text-sm dark:bg-cielo/10">
                    <dt>Interés</dt><dd className="text-right">{cop(desglose.interes)}</dd>
                    <dt>Abono a capital</dt><dd className="text-right">{cop(desglose.capital)}</dd>
                    <dt>Otros cobros</dt><dd className="text-right">{cop(desglose.otros_cobros)}</dd>
                    {desglose.abono_extra > 0 && <><dt>Abono extra</dt><dd className="text-right">{cop(desglose.abono_extra)}</dd></>}
                    <dt className="mt-1.5 font-semibold">Te queda debiendo</dt><dd className="mt-1.5 text-right font-semibold">{cop(desglose.saldo_despues)}</dd>
                  </dl>
                )}
              </>
            )
          ) : (
            <div>
              <Pildoras etiqueta="Categoría" opciones={categorias} valor={categoria} onCambio={setCategoria} />
              {categoria === OTRA_CATEGORIA && (
                <div className="mt-3">
                  <Campo etiqueta="¿Cuál categoría?" autoComplete="off" placeholder="Escríbela como quieras" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} maxLength={40} />
                </div>
              )}
              {intento && faltaCategoria && <p className="mt-2 text-sm font-medium text-boton-hover dark:text-naranja">Elige una categoría.</p>}
            </div>
          )}

          {categoria === APORTE_PROYECTO && (
            <Selector etiqueta="¿A qué proyecto?" value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}>
              <option value="">Elige un proyecto</option>
              {datos.proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </Selector>
          )}

          <Campo etiqueta="Descripción (opcional)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={120} />
          <div className={cuenta ? "" : "grid grid-cols-2 gap-3"}>
            {!cuenta && (
              <Selector etiqueta="Medio de pago" value={medio} onChange={(e) => setMedio(e.target.value as MedioPago)}>
                {MEDIOS_PAGO.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </Selector>
            )}
            <Campo etiqueta="Fecha" type="date" value={fecha} max={hoy()} onChange={(e) => setFecha(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Boton type="submit" variante={tipo === "pago_deuda" ? "pago" : "principal"} className="w-full">
              {editando ? "Guardar cambios" : tipo === "pago_deuda" ? "Registrar pago" : `Registrar ${tipo}`}
            </Boton>
            {editando && (
              <Boton
                variante="suave"
                className="w-full"
                onClick={() => {
                  borrarMovimiento(inicial as Movimiento);
                  cerrar();
                }}
              >
                Borrar movimiento
              </Boton>
            )}
          </div>
        </form>
      )}
    </Hoja>
  );
}
