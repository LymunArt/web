"use client";

import { useState } from "react";
import { gastosPorCategoria } from "@/lib/finanzas/calculos";
import { cop, moverMes, nuevoId, numero, porcentaje } from "@/lib/finanzas/formato";
import { CATEGORIAS } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Avance, SelectorMes, Titulo } from "./Ui";

function Fila({ categoria, gastado, limite, onLimite }: { categoria: string; gastado: number; limite: number; onLimite: (n: number) => void }) {
  const [editando, setEditando] = useState<string | null>(null);
  const p = limite > 0 ? gastado / limite : 0;
  const estado = limite <= 0 ? null : p >= 1 ? `Te pasaste por ${cop(gastado - limite)}` : p >= 0.8 ? `Vas en ${porcentaje(p)}: cuídalo` : `Te quedan ${cop(limite - gastado)}`;

  return (
    <li className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{categoria}</span>
        <label className="flex items-center gap-1.5 text-sm text-tinta-suave">
          <span className="sr-only">Límite de {categoria}</span>
          <span aria-hidden="true">Límite $</span>
          <input
            inputMode="numeric"
            placeholder="Sin límite"
            value={editando ?? (limite ? numero(limite) : "")}
            onFocus={(e) => setEditando(e.target.value)}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/\D/g, "").slice(0, 12));
              setEditando(n ? numero(n) : "");
            }}
            onBlur={() => {
              onLimite(Number((editando ?? "").replace(/\D/g, "")));
              setEditando(null);
            }}
            className="cifras min-h-11 w-28 rounded-lg border border-linea bg-superficie px-2 text-right text-base text-tinta placeholder:text-sm placeholder:text-tinta-suave"
          />
        </label>
      </div>
      {limite > 0 && <Avance proporcion={p} alerta={p >= 0.8} etiqueta={`${categoria}: ${porcentaje(p)} del límite`} />}
      <p className="cifras text-sm text-tinta-suave">
        {gastado > 0 ? `Llevas ${cop(gastado)}` : "Sin gastos"}
        {estado && <span className={p >= 0.8 ? "font-semibold text-boton-hover dark:text-naranja" : ""}> · {estado}</span>}
      </p>
    </li>
  );
}

export default function Presupuesto() {
  const { datos, mes, setMes, guardar, borrar, avisar } = useFinanzas();
  const gastos = new Map(gastosPorCategoria(datos, mes).map((g) => [g.categoria, g.total]));
  const delMes = datos.presupuesto.filter((p) => p.mes === mes);
  const limite = (categoria: string) => delMes.find((p) => p.categoria === categoria)?.limite ?? 0;
  const total = delMes.reduce((s, p) => s + p.limite, 0);
  const anterior = datos.presupuesto.filter((p) => p.mes === moverMes(mes, -1));

  function fijar(categoria: string, valor: number) {
    const existente = delMes.find((p) => p.categoria === categoria);
    if (valor <= 0) {
      if (existente) borrar("presupuesto", existente.id);
      return;
    }
    if (existente?.limite === valor) return;
    guardar("presupuesto", [{ id: existente?.id ?? nuevoId(), mes, categoria, limite: valor }]);
  }

  return (
    <>
      <Titulo accion={<SelectorMes mes={mes} onCambio={setMes} />}>Presupuesto</Titulo>
      <p className="cifras mb-4 text-lg text-tinta-suave">
        {total > 0 ? `Te pusiste un límite de ${cop(total)} este mes.` : "Ponle un límite a lo que quieras cuidar. Te avisamos al llegar a 80 % y a 100 %."}
      </p>
      {delMes.length === 0 && anterior.length > 0 && (
        <button
          type="button"
          onClick={() => {
            guardar("presupuesto", anterior.map((p) => ({ ...p, id: nuevoId(), mes })));
            avisar("Copiamos los límites del mes pasado");
          }}
          className="mb-4 min-h-11 text-sm font-semibold underline decoration-cielo decoration-2 underline-offset-4 hover:decoration-naranja"
        >
          Usar los límites del mes pasado
        </button>
      )}
      <ul className="flex flex-col divide-y divide-linea">
        {CATEGORIAS.gasto.map((c) => (
          <Fila key={`${mes}-${c}-${limite(c)}`} categoria={c} gastado={gastos.get(c) ?? 0} limite={limite(c)} onLimite={(n) => fijar(c, n)} />
        ))}
      </ul>
    </>
  );
}
