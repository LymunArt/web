"use client";

import { useState } from "react";
import { saldoCuenta } from "@/lib/finanzas/calculos";
import { dinero, hoy, nuevoId } from "@/lib/finanzas/formato";
import { obtenerTasas } from "@/lib/finanzas/tasas";
import { ENTRE_CUENTAS, PAGO_TARJETA, type Cuenta, type Movimiento } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Campo, CampoMonto, Hoja, Selector } from "./Ui";

// Mover plata entre cuentas propias: pagar la tarjeta de crédito, pasar de Nequi a Nu...
// No es gasto ni ingreso, así que no se cuenta en el resumen del mes: el gasto ya fue la compra.
export default function Transferir({ destino, movimiento, onCerrar }: { destino?: Cuenta; movimiento?: Movimiento; onCerrar: () => void }) {
  const { datos } = useFinanzas();
  const hacia = datos.cuentas.find((c) => c.id === (movimiento?.cuenta_destino_id ?? destino?.id));
  return (
    <Hoja titulo={hacia?.tipo === "credito" ? `Pagar ${hacia.nombre}` : "Mover plata entre cuentas"} onCerrar={onCerrar}>
      {(cerrar) => <FormularioTransferencia destino={destino} movimiento={movimiento} cerrar={cerrar} />}
    </Hoja>
  );
}

// El formulario solo, para usarlo también dentro de Registrar
export function FormularioTransferencia({ destino, movimiento, cerrar }: { destino?: Cuenta; movimiento?: Movimiento; cerrar: () => void }) {
  const { datos, guardar, borrarMovimiento, avisar } = useFinanzas();
  const activas = datos.cuentas.filter((c) => !c.archivada || c.id === movimiento?.cuenta_id || c.id === movimiento?.cuenta_destino_id);
  const [haciaId, setHaciaId] = useState(movimiento?.cuenta_destino_id ?? destino?.id ?? "");
  const hacia = datos.cuentas.find((c) => c.id === haciaId);
  // Se paga desde cuentas con plata (no desde otra tarjeta de crédito) y en la misma moneda
  const posiblesOrigen = activas.filter((c) => c.tipo !== "credito" && c.id !== haciaId && (!hacia || c.moneda === hacia.moneda));
  const [desdeId, setDesdeId] = useState(movimiento?.cuenta_id ?? posiblesOrigen[0]?.id ?? "");
  const desde = datos.cuentas.find((c) => c.id === desdeId);
  const deuda = hacia?.tipo === "credito" ? Math.max(saldoCuenta(datos, hacia.id), 0) : 0;
  const [monto, setMonto] = useState(movimiento?.monto ?? deuda);
  const [fecha, setFecha] = useState(movimiento?.fecha ?? hoy());
  const [error, setError] = useState<string | null>(null);
  const pagoTarjeta = hacia?.tipo === "credito";

  async function enviar() {
    if (!desde || !hacia) return setError("Elige de qué cuenta sale y a cuál llega.");
    if (desde.id === hacia.id) return setError("La cuenta de origen y la de destino deben ser distintas.");
    if (monto <= 0) return setError("Escribe cuánto vas a mover.");
    const tasa = desde.moneda === "COP" ? 1 : (await obtenerTasas())?.pesosPor[desde.moneda] ?? movimiento?.tasa ?? 1;
    guardar("movimientos", [
      {
        id: movimiento?.id ?? nuevoId(),
        fecha,
        tipo: "transferencia",
        categoria: pagoTarjeta ? PAGO_TARJETA : ENTRE_CUENTAS,
        descripcion: `${desde.nombre} → ${hacia.nombre}`,
        monto,
        moneda: desde.moneda,
        tasa,
        cuenta_id: desde.id,
        cuenta_destino_id: hacia.id,
        medio_pago: "transferencia",
        deuda_id: null,
        proyecto_id: null,
        origen: movimiento?.origen ?? "manual",
        id_externo: movimiento?.id_externo ?? null,
      },
    ]);
    avisar(pagoTarjeta ? `Listo: le abonaste ${dinero(monto, desde.moneda)} a ${hacia.nombre}` : "Listo: plata movida");
    cerrar();
  }

  return (
        <form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
          {pagoTarjeta && (
            <p className="rounded-xl bg-cielo/35 p-3 text-sm dark:bg-cielo/10">
              Debes {dinero(deuda, hacia.moneda)}. Pagar la tarjeta no es un gasto nuevo: el gasto fue cada compra. Aquí solo baja tu deuda y baja la cuenta desde donde pagas.
            </p>
          )}
          <Selector etiqueta="¿Desde qué cuenta?" value={desdeId} onChange={(e) => setDesdeId(e.target.value)}>
            {posiblesOrigen.length === 0 && <option value="">No tienes otra cuenta en {hacia?.moneda ?? "esa moneda"}</option>}
            {posiblesOrigen.map((c) => <option key={c.id} value={c.id}>{c.nombre} · {dinero(saldoCuenta(datos, c.id), c.moneda)}</option>)}
          </Selector>
          {!destino && (
            <Selector
              etiqueta="¿A qué cuenta llega?"
              value={haciaId}
              onChange={(e) => {
                const nueva = datos.cuentas.find((c) => c.id === e.target.value);
                setHaciaId(e.target.value);
                // Al elegir una tarjeta se propone pagar lo que se debe, y el origen se ajusta a la moneda
                if (nueva?.tipo === "credito" && !monto) setMonto(Math.max(saldoCuenta(datos, nueva.id), 0));
                const valido = activas.find((c) => c.id === desdeId && c.id !== nueva?.id && c.tipo !== "credito" && (!nueva || c.moneda === nueva.moneda));
                if (!valido) setDesdeId(activas.find((c) => c.tipo !== "credito" && c.id !== nueva?.id && (!nueva || c.moneda === nueva.moneda))?.id ?? "");
              }}
            >
              <option value="">Elige una cuenta</option>
              {activas.filter((c) => c.id !== desdeId).map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
            </Selector>
          )}
          <CampoMonto key={desde?.moneda ?? "COP"} etiqueta="¿Cuánto?" valor={monto} onCambio={setMonto} moneda={desde?.moneda ?? hacia?.moneda ?? "COP"} />
          <Campo etiqueta="Fecha" type="date" value={fecha} max={hoy()} onChange={(e) => setFecha(e.target.value)} />
          {error && <p role="alert" className="text-sm font-medium text-boton-hover dark:text-naranja">{error}</p>}
          <Boton type="submit" variante={pagoTarjeta ? "pago" : "principal"} className="w-full">
            {movimiento ? "Guardar cambios" : pagoTarjeta ? "Pagar tarjeta" : "Mover plata"}
          </Boton>
          {movimiento && (
            <Boton variante="suave" className="w-full" onClick={() => { borrarMovimiento(movimiento); cerrar(); }}>
              Borrar
            </Boton>
          )}
        </form>
  );
}
