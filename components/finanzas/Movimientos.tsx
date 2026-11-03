"use client";

import { useMemo, useState } from "react";
import { movimientosACsv } from "@/lib/finanzas/conexiones";
import { cop, diaLargo, dinero, nombreMes } from "@/lib/finanzas/formato";
import type { Movimiento, TipoMovimiento } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Campo, Segmentado, Selector, SelectorMes, Titulo, Vacio } from "./Ui";

type FiltroTipo = TipoMovimiento | "todos";

const TIPOS: { valor: FiltroTipo; nombre: string }[] = [
  { valor: "todos", nombre: "Todos" },
  { valor: "ingreso", nombre: "Entró" },
  { valor: "gasto", nombre: "Salió" },
  { valor: "pago_deuda", nombre: "Deudas" },
];

export function descargarCsv(movimientos: Movimiento[], nombre: string) {
  const url = URL.createObjectURL(new Blob([movimientosACsv(movimientos)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Movimientos() {
  const { datos, mes, setMes, abrirRegistro } = useFinanzas();
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const delMes = useMemo(() => datos.movimientos.filter((m) => m.fecha.startsWith(mes)), [datos.movimientos, mes]);
  const categorias = useMemo(() => [...new Set(delMes.map((m) => m.categoria))].sort(), [delMes]);

  const texto = busqueda.trim().toLowerCase();
  const visibles = delMes
    .filter((m) => (tipo === "todos" || m.tipo === tipo) && (!categoria || m.categoria === categoria) && (!texto || m.descripcion.toLowerCase().includes(texto)))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const dias = new Map<string, Movimiento[]>();
  for (const m of visibles) dias.set(m.fecha, [...(dias.get(m.fecha) ?? []), m]);

  return (
    <>
      <Titulo accion={<SelectorMes mes={mes} onCambio={setMes} />}>Movimientos</Titulo>

      <div className="mb-8 flex flex-col gap-3">
        <Segmentado etiqueta="Filtrar por tipo" opciones={TIPOS} valor={tipo} onCambio={setTipo} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo etiqueta="Buscar" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <Selector etiqueta="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => <option key={c}>{c}</option>)}
          </Selector>
        </div>
      </div>

      {visibles.length === 0 ? (
        delMes.length === 0 ? (
          <Vacio titulo={`Nada en ${nombreMes(mes, false)} todavía`} texto="Cuando registres un ingreso, un gasto o un pago, aparecerá aquí." accion={<Boton onClick={() => abrirRegistro()}>Registrar</Boton>} />
        ) : (
          <Vacio titulo="No encontramos movimientos" texto="Prueba con otro filtro u otra palabra." accion={<Boton variante="suave" onClick={() => { setTipo("todos"); setCategoria(""); setBusqueda(""); }}>Quitar filtros</Boton>} />
        )
      ) : (
        <div className="flex flex-col gap-8">
          {[...dias].map(([fecha, lista]) => (
            <section key={fecha} aria-label={diaLargo(fecha)}>
              <h2 className="mb-1 text-sm font-semibold text-tinta-suave first-letter:uppercase">{diaLargo(fecha)}</h2>
              <ul className="flex flex-col divide-y divide-linea">
                {lista.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => abrirRegistro({ inicial: m })} className="tactil flex min-h-14 w-full items-center justify-between gap-4 py-2.5 text-left">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{m.descripcion}</span>
                        <span className="block truncate text-sm text-tinta-suave">
                          {m.categoria} · {datos.cuentas.find((c) => c.id === m.cuenta_id)?.nombre ?? m.medio_pago}{m.origen === "extracto" ? " · de un extracto" : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className={`cifras block font-semibold ${m.tipo === "ingreso" ? "text-cielo-tinta dark:text-cielo" : ""}`}>
                          {m.tipo === "ingreso" ? "+" : "−"}{dinero(m.monto, m.moneda ?? "COP")}
                        </span>
                        {m.moneda && m.moneda !== "COP" && <span className="cifras block text-sm text-tinta-suave">≈ {cop(m.monto * m.tasa)}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <div>
            <Boton variante="suave" onClick={() => descargarCsv(visibles, `movimientos-${mes}.csv`)}>Descargar para Excel</Boton>
          </div>
        </div>
      )}
    </>
  );
}
