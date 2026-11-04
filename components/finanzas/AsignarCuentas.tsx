"use client";

import { medioDeCuenta } from "@/lib/finanzas/calculos";
import { dinero, fechaCorta } from "@/lib/finanzas/formato";
import type { Datos, Movimiento } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Hoja } from "./Ui";

// Los movimientos que quedaron sin cuenta no mueven ningún saldo: por eso una cuenta puede verse en negativo
export const movimientosSinCuenta = (datos: Datos) =>
  datos.cuentas.some((c) => !c.archivada) ? datos.movimientos.filter((m) => !m.cuenta_id && m.tipo !== "transferencia") : [];

function Fila({ m }: { m: Movimiento }) {
  const { datos, guardar } = useFinanzas();
  const posibles = datos.cuentas.filter((c) => !c.archivada && c.moneda === (m.moneda ?? "COP"));
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="min-w-0">
          <span className="block truncate font-medium">{m.descripcion}</span>
          <span className="block text-sm text-tinta-suave">{fechaCorta(m.fecha)} · {m.categoria}</span>
        </span>
        <span className={`cifras shrink-0 font-semibold ${m.tipo === "ingreso" ? "text-cielo-tinta dark:text-cielo" : ""}`}>
          {m.tipo === "ingreso" ? "+" : "−"}{dinero(m.monto, m.moneda ?? "COP")}
        </span>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold">{m.tipo === "ingreso" ? "¿A qué cuenta llegó?" : "¿De qué cuenta salió?"}</span>
        <select
          defaultValue=""
          onChange={(e) => {
            const cuenta = posibles.find((c) => c.id === e.target.value);
            if (cuenta) guardar("movimientos", [{ ...m, cuenta_id: cuenta.id, medio_pago: medioDeCuenta(cuenta) }]);
          }}
          className="min-h-11 rounded-xl border border-linea bg-superficie px-3 text-base text-tinta"
        >
          <option value="" disabled>Elige una cuenta</option>
          {posibles.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </label>
    </li>
  );
}

export default function AsignarCuentas({ onCerrar }: { onCerrar: () => void }) {
  const { datos } = useFinanzas();
  const pendientes = movimientosSinCuenta(datos).sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <Hoja titulo="Movimientos sin cuenta" onCerrar={onCerrar}>
      {(cerrar) =>
        pendientes.length === 0 ? (
          <div className="flex flex-col gap-4 pb-2">
            <p>Listo: todos tus movimientos tienen cuenta y tus saldos ya cuadran.</p>
            <Boton className="w-full" onClick={cerrar}>Cerrar</Boton>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-tinta-suave">Estos movimientos no están en ninguna cuenta, así que no suman ni restan en tus saldos. Elige a cuál pertenece cada uno.</p>
            <ul className="flex flex-col divide-y divide-linea">
              {pendientes.map((m) => <Fila key={m.id} m={m} />)}
            </ul>
          </div>
        )
      }
    </Hoja>
  );
}
