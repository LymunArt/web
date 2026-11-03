"use client";

import { useState } from "react";
import { ahorradoEnProyecto } from "@/lib/finanzas/calculos";
import { cop, nuevoId, porcentaje } from "@/lib/finanzas/formato";
import { APORTE_PROYECTO, ESTADOS_PROYECTO, type EstadoProyecto, type Proyecto } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Avance, Boton, Campo, CampoMonto, Hoja, Selector, Titulo, Vacio } from "./Ui";

function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  const { datos, guardar, borrar, abrirRegistro, avisar } = useFinanzas();
  const [idea, setIdea] = useState("");
  const ahorrado = ahorradoEnProyecto(datos, proyecto.id);
  const meta = proyecto.meta_monto;
  const p = meta ? ahorrado / meta : 0;

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-linea bg-superficie p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-titulo text-xl font-semibold tracking-[-0.015em] break-words">{proyecto.nombre}</h2>
          {proyecto.descripcion && <p className="text-tinta-suave">{proyecto.descripcion}</p>}
        </div>
        <div className="w-36">
          <Selector etiqueta="Estado" value={proyecto.estado} onChange={(e) => guardar("proyectos", [{ ...proyecto, estado: e.target.value as EstadoProyecto }])}>
            {ESTADOS_PROYECTO.map((e) => <option key={e.valor} value={e.valor}>{e.nombre}</option>)}
          </Selector>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="cifras">
          <span className="font-semibold">{cop(ahorrado)}</span>
          {meta ? <span className="text-tinta-suave"> de {cop(meta)} · {porcentaje(Math.min(p, 1))}</span> : <span className="text-tinta-suave"> guardados</span>}
        </p>
        {meta ? <Avance proporcion={p} etiqueta={`${porcentaje(Math.min(p, 1))} de la meta`} /> : null}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Ideas</h3>
        {proyecto.ideas.length > 0 && (
          <ul className="mb-2 flex flex-col divide-y divide-linea">
            {proyecto.ideas.map((i, n) => (
              <li key={`${i}-${n}`} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0 break-words">{i}</span>
                <button type="button" aria-label={`Quitar idea: ${i}`} onClick={() => guardar("proyectos", [{ ...proyecto, ideas: proyecto.ideas.filter((_, k) => k !== n) }])} className="min-h-9 shrink-0 text-tinta-suave hover:text-tinta">Quitar</button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!idea.trim()) return;
            guardar("proyectos", [{ ...proyecto, ideas: [...proyecto.ideas, idea.trim()] }]);
            setIdea("");
          }}
        >
          <input
            aria-label={`Nueva idea para ${proyecto.nombre}`}
            placeholder="Anota una idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-11 w-full min-w-0 rounded-xl border border-linea bg-superficie px-3.5 text-base placeholder:text-tinta-suave"
          />
          <Boton type="submit" variante="suave" disabled={!idea.trim()}>Anotar</Boton>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Boton onClick={() => abrirRegistro({ inicial: { tipo: "gasto", categoria: APORTE_PROYECTO, proyecto_id: proyecto.id } })}>Aportar</Boton>
        <button
          type="button"
          onClick={() => {
            borrar("proyectos", proyecto.id);
            avisar(`${proyecto.nombre} borrado`, () => guardar("proyectos", [proyecto]));
          }}
          className="min-h-11 text-sm font-medium text-tinta-suave hover:text-tinta"
        >
          Borrar
        </button>
      </div>
    </li>
  );
}

export default function Proyectos() {
  const { datos, guardar } = useFinanzas();
  const [agregar, setAgregar] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [meta, setMeta] = useState(0);

  return (
    <>
      <Titulo accion={datos.proyectos.length > 0 ? <Boton variante="suave" onClick={() => setAgregar(true)}>Nuevo proyecto</Boton> : undefined}>Proyectos</Titulo>
      {datos.proyectos.length === 0 ? (
        <Vacio titulo="¿Para qué estás guardando?" texto="Crea un proyecto con su meta, anota tus ideas y aporta cuando puedas. Cada aporte se resta de lo que te queda en el mes." accion={<Boton onClick={() => setAgregar(true)}>Crear mi primer proyecto</Boton>} />
      ) : (
        <ul className="flex flex-col gap-5">
          {datos.proyectos.map((p) => <TarjetaProyecto key={p.id} proyecto={p} />)}
        </ul>
      )}
      {agregar && (
        <Hoja titulo="Nuevo proyecto" onCerrar={() => setAgregar(false)}>
          {(cerrar) => (
            <form
              noValidate
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!nombre.trim()) return;
                guardar("proyectos", [{ id: nuevoId(), nombre: nombre.trim(), descripcion: descripcion.trim(), meta_monto: meta || null, estado: "idea", ideas: [] }]);
                setNombre(""); setDescripcion(""); setMeta(0);
                cerrar();
              }}
            >
              <Campo etiqueta="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <Campo etiqueta="Descripción (opcional)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              <CampoMonto etiqueta="Meta (opcional)" valor={meta} onCambio={setMeta} />
              <Boton type="submit" disabled={!nombre.trim()} className="w-full">Crear proyecto</Boton>
            </form>
          )}
        </Hoja>
      )}
    </>
  );
}
