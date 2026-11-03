"use client";

import { useState } from "react";
import {
  compararEstrategias, cuotasPagadas, cuotasRestantes, otrosCobrosPorCuota, progresoDeudas,
  saldoActual, simularAbono, tablaAmortizacion, tasaEfectivaAnual,
} from "@/lib/finanzas/calculos";
import { cop, fechaCorta, finEstimado, hoy, nuevoId, porcentaje } from "@/lib/finanzas/formato";
import type { Deuda, PorCobrar } from "@/lib/finanzas/tipos";
import Ciudad from "./Ciudad";
import { useFinanzas } from "./Contexto";
import { Avance, Boton, Campo, CampoMonto, Hoja, Titulo, Vacio } from "./Ui";

function GraficaSaldo({ puntos }: { puntos: { numero: number; saldo: number }[] }) {
  const [activo, setActivo] = useState<number | null>(null);
  if (puntos.length < 2) return null;
  const ancho = 600;
  const alto = 160;
  const margen = 8;
  const max = Math.max(...puntos.map((p) => p.saldo), 1);
  const x = (i: number) => margen + (i / (puntos.length - 1)) * (ancho - margen * 2);
  const y = (s: number) => margen + (1 - s / max) * (alto - margen * 2);
  const seleccionado = activo === null ? null : puntos[activo];

  return (
    <figure className="relative">
      <figcaption className="cifras mb-2 min-h-5 text-sm text-tinta-suave">
        {seleccionado ? `Cuota ${seleccionado.numero}: quedas debiendo ${cop(seleccionado.saldo)}` : "Cómo baja tu saldo, cuota a cuota"}
      </figcaption>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        className="h-36 w-full touch-pan-y text-cielo-tinta dark:text-cielo"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Saldo de ${cop(puntos[0].saldo)} a ${cop(puntos[puntos.length - 1].saldo)} en ${puntos.length} cuotas. El detalle está en la tabla.`}
        onPointerMove={(e) => {
          const caja = e.currentTarget.getBoundingClientRect();
          setActivo(Math.round(((e.clientX - caja.left) / caja.width) * (puntos.length - 1)));
        }}
        onPointerLeave={() => setActivo(null)}
      >
        <line x1={margen} x2={ancho - margen} y1={alto - margen} y2={alto - margen} className="stroke-linea" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polyline points={puntos.map((p, i) => `${x(i)},${y(p.saldo)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {activo !== null && (
          <line x1={x(activo)} x2={x(activo)} y1={margen} y2={alto - margen} className="stroke-tinta-suave" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </figure>
  );
}

function Simulador({ deuda }: { deuda: Deuda }) {
  const { datos } = useFinanzas();
  const [abono, setAbono] = useState(500000);
  const saldo = saldoActual(deuda, datos.pagos_deuda);
  const r = simularAbono(deuda, datos.pagos_deuda, Math.min(abono, saldo));
  return (
    <div className="flex flex-col gap-4">
      <CampoMonto etiqueta="Si le abonas a capital hoy" valor={abono} onCambio={setAbono} />
      {abono > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-cielo/35 p-4 dark:bg-cielo/10">
            <h4 className="font-semibold">Para terminar antes</h4>
            <p className="cifras mt-1 text-sm">
              Sigues pagando igual, terminas {r.plazo.mesesAhorrados} {r.plazo.mesesAhorrados === 1 ? "mes" : "meses"} antes y te ahorras {cop(r.plazo.interesAhorrado)} en intereses.
            </p>
          </div>
          <div className="rounded-xl bg-cielo/35 p-4 dark:bg-cielo/10">
            <h4 className="font-semibold">Para pagar menos al mes</h4>
            <p className="cifras mt-1 text-sm">
              Tu cuota baja {cop(r.cuota.bajaMensual)} y te ahorras {cop(r.cuota.interesAhorrado)} en intereses.
            </p>
          </div>
        </div>
      )}
      <p className="text-sm text-tinta-suave">Es un cálculo aproximado. Antes de abonar, pregúntale a la entidad cómo lo aplica.</p>
    </div>
  );
}

function TarjetaDeuda({ deuda }: { deuda: Deuda }) {
  const { datos, abrirRegistro, borrar, guardar, avisar } = useFinanzas();
  const [abierto, setAbierto] = useState(false);
  const [editar, setEditar] = useState(false);
  const pagos = datos.pagos_deuda;
  const saldo = saldoActual(deuda, pagos);
  const restantes = cuotasRestantes(deuda, pagos);
  const tabla = tablaAmortizacion(deuda, pagos);
  const otros = otrosCobrosPorCuota(deuda);
  const proporcion = deuda.saldo_inicial > 0 ? 1 - saldo / deuda.saldo_inicial : 1;
  const terminada = saldo <= 0;

  return (
    <li className="rounded-2xl border border-linea bg-superficie p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h3 className="font-titulo text-xl font-semibold tracking-[-0.015em]">{deuda.nombre}</h3>
          {deuda.entidad && <p className="text-sm text-tinta-suave">{deuda.entidad}</p>}
        </div>
        <p className="cifras font-titulo text-2xl font-semibold tracking-[-0.02em]">{cop(saldo)}</p>
      </div>

      <div className="mt-4"><Avance proporcion={proporcion} etiqueta={`${porcentaje(proporcion)} pagado`} /></div>

      <dl className="cifras mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
        <div><dt className="text-tinta-suave">Pagado</dt><dd className="font-medium">{porcentaje(proporcion)}</dd></div>
        <div><dt className="text-tinta-suave">Cuotas</dt><dd className="font-medium">{cuotasPagadas(deuda, pagos)} de {cuotasPagadas(deuda, pagos) + restantes}</dd></div>
        <div><dt className="text-tinta-suave">Cuota</dt><dd className="font-medium">{cop(deuda.cuota)}</dd></div>
        <div><dt className="text-tinta-suave">Terminas</dt><dd className="font-medium first-letter:uppercase">{terminada ? "Ya terminaste" : finEstimado(restantes)}</dd></div>
      </dl>
      <p className="cifras mt-3 text-sm text-tinta-suave">
        Interés de {porcentaje(deuda.tasa_mensual, 2)} mensual ({porcentaje(tasaEfectivaAnual(deuda.tasa_mensual), 2)} efectivo anual).
        {otros > 0 && ` Cada cuota trae cerca de ${cop(otros)} que no son capital ni interés: revisa en tu extracto si son seguros o comisiones.`}
      </p>

      {terminada && (
        <p className="mt-4 rounded-xl bg-cielo/35 p-4 text-sm dark:bg-cielo/10">
          ¡Terminaste esta deuda! Esos {cop(deuda.cuota)} al mes ya son tuyos. Puedes mandarlos a tu ahorro o a un proyecto.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {!terminada && (
          <Boton variante="pago" onClick={() => abrirRegistro({ inicial: { tipo: "pago_deuda", deuda_id: deuda.id, monto: deuda.cuota } })}>Pagar cuota</Boton>
        )}
        <button type="button" aria-expanded={abierto} onClick={() => setAbierto(!abierto)} className="min-h-11 text-sm font-semibold underline decoration-cielo decoration-2 underline-offset-4 hover:decoration-naranja">
          {abierto ? "Ocultar detalle" : "Ver tabla y simulador"}
        </button>
        <button type="button" onClick={() => setEditar(true)} className="min-h-11 text-sm font-medium text-tinta-suave hover:text-tinta">Editar</button>
      </div>

      {abierto && (
        <div className="mt-6 flex flex-col gap-8 border-t border-linea pt-6">
          <GraficaSaldo puntos={tabla.map((f) => ({ numero: f.numero, saldo: f.saldo }))} />
          {!terminada && (
            <div>
              <h4 className="mb-3 font-titulo font-semibold tracking-[-0.015em]">¿Y si abonas?</h4>
              <Simulador deuda={deuda} />
            </div>
          )}
          <div>
            <h4 className="mb-3 font-titulo font-semibold tracking-[-0.015em]">Tabla de amortización</h4>
            <div className="max-h-96 overflow-auto rounded-xl border border-linea" tabIndex={0} role="region" aria-label={`Tabla de amortización de ${deuda.nombre}`}>
              <table className="cifras w-full min-w-[34rem] text-right text-sm">
                <thead className="sticky top-0 bg-superficie text-tinta-suave">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left font-semibold">Cuota</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Pago</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Interés</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Capital</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linea">
                  {tabla.map((f) => (
                    <tr key={f.numero} className={f.pagada ? "bg-cielo/20 dark:bg-cielo/5" : ""}>
                      <td className="px-3 py-2 text-left">{f.numero}{f.fecha ? <span className="ml-2 text-tinta-suave">{fechaCorta(f.fecha)}</span> : null}</td>
                      <td className="px-3 py-2">{cop(f.cuota)}</td>
                      <td className="px-3 py-2">{cop(f.interes)}</td>
                      <td className="px-3 py-2">{cop(f.capital)}</td>
                      <td className="px-3 py-2">{cop(f.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-tinta-suave">Las filas resaltadas ya están pagadas. Las demás son una proyección.</p>
          </div>
        </div>
      )}

      {editar && (
        <FormularioDeuda
          deuda={deuda}
          onCerrar={() => setEditar(false)}
          onGuardar={(d) => guardar("deudas", [d])}
          onBorrar={() => {
            borrar("deudas", deuda.id);
            datos.pagos_deuda.filter((p) => p.deuda_id === deuda.id).forEach((p) => borrar("pagos_deuda", p.id));
            avisar(`${deuda.nombre} borrada`, () => {
              guardar("deudas", [deuda]);
              const pagosDeuda = datos.pagos_deuda.filter((p) => p.deuda_id === deuda.id);
              if (pagosDeuda.length) guardar("pagos_deuda", pagosDeuda);
            });
          }}
        />
      )}
    </li>
  );
}

function FormularioDeuda({ deuda, onCerrar, onGuardar, onBorrar }: { deuda?: Deuda; onCerrar: () => void; onGuardar: (d: Deuda) => void; onBorrar?: () => void }) {
  const [nombre, setNombre] = useState(deuda?.nombre ?? "");
  const [entidad, setEntidad] = useState(deuda?.entidad ?? "");
  const [saldo, setSaldo] = useState(deuda?.saldo_inicial ?? 0);
  const [cuota, setCuota] = useState(deuda?.cuota ?? 0);
  const [tasa, setTasa] = useState(deuda ? String(deuda.tasa_mensual * 100).replace(".", ",") : "");
  const [cuotas, setCuotas] = useState(deuda ? String(deuda.cuotas_totales - deuda.cuotas_pagadas) : "");
  const [dia, setDia] = useState(deuda?.dia_pago ? String(deuda.dia_pago) : "");
  const [error, setError] = useState<string | null>(null);

  function enviar(cerrar: () => void) {
    const tasaNumero = Number(tasa.replace(",", ".")) / 100;
    const n = Number(cuotas);
    const diaNumero = dia ? Number(dia) : null;
    if (!nombre.trim()) return setError("Ponle un nombre para reconocerla.");
    if (saldo <= 0) return setError("Escribe cuánto debes hoy.");
    if (cuota <= 0) return setError("Escribe el valor de la cuota.");
    if (Number.isNaN(tasaNumero) || tasaNumero < 0 || tasaNumero > 0.1) return setError("Revisa el interés: va en porcentaje mensual, por ejemplo 1,76.");
    if (!Number.isInteger(n) || n <= 0) return setError("Escribe cuántas cuotas te faltan.");
    if (diaNumero !== null && (diaNumero < 1 || diaNumero > 31)) return setError("El día de pago va de 1 a 31.");
    onGuardar({
      id: deuda?.id ?? nuevoId(),
      nombre: nombre.trim(),
      entidad: entidad.trim() || null,
      saldo_inicial: saldo,
      tasa_mensual: tasaNumero,
      cuota,
      cuotas_totales: n + (deuda?.cuotas_pagadas ?? 0),
      cuotas_pagadas: deuda?.cuotas_pagadas ?? 0,
      dia_pago: diaNumero,
      fecha_inicio: deuda?.fecha_inicio ?? hoy(),
    });
    cerrar();
  }

  return (
    <Hoja titulo={deuda ? "Editar deuda" : "Agregar deuda"} onCerrar={onCerrar}>
      {(cerrar) => (
        <form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); enviar(cerrar); }}>
          <Campo etiqueta="Nombre" placeholder="Ej.: Crédito de la moto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Campo etiqueta="Entidad (opcional)" value={entidad} onChange={(e) => setEntidad(e.target.value)} />
          <CampoMonto etiqueta="¿Cuánto debes hoy?" valor={saldo} onCambio={setSaldo} />
          <CampoMonto etiqueta="Cuota mensual" valor={cuota} onCambio={setCuota} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Interés mensual (%)" inputMode="decimal" placeholder="1,76" value={tasa} onChange={(e) => setTasa(e.target.value)} />
            <Campo etiqueta="Cuotas que faltan" inputMode="numeric" value={cuotas} onChange={(e) => setCuotas(e.target.value.replace(/\D/g, ""))} />
          </div>
          <Campo etiqueta="Día de pago (opcional)" inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value.replace(/\D/g, ""))} ayuda="Lo usamos para recordarte el pago en Inicio." />
          {error && <p role="alert" className="text-sm font-medium text-boton-hover dark:text-naranja">{error}</p>}
          <Boton type="submit" className="w-full">{deuda ? "Guardar cambios" : "Agregar deuda"}</Boton>
          {onBorrar && <Boton variante="suave" className="w-full" onClick={() => { onBorrar(); cerrar(); }}>Borrar deuda</Boton>}
        </form>
      )}
    </Hoja>
  );
}

function Estrategias() {
  const { datos } = useFinanzas();
  const [extra, setExtra] = useState(100000);
  const vivas = datos.deudas.filter((d) => saldoActual(d, datos.pagos_deuda) > 0);
  if (vivas.length < 2) return null;
  const { avalancha, bola } = compararEstrategias(datos.deudas, datos.pagos_deuda, extra);
  const opciones = [
    { nombre: "Avalancha", idea: "La plata extra va a la que más interés te cobra.", r: avalancha },
    { nombre: "Bola de nieve", idea: "La plata extra va a la más pequeña. Cuando la terminas, su cuota pasa a la otra.", r: bola },
  ];
  return (
    <section aria-labelledby="titulo-estrategias">
      <h2 id="titulo-estrategias" className="mb-4 font-titulo text-xl font-semibold tracking-[-0.015em]">¿A cuál le metes más?</h2>
      <div className="mb-5 max-w-xs"><CampoMonto etiqueta="Plata extra al mes" valor={extra} onCambio={setExtra} /></div>
      {avalancha.interes === bola.interes && (
        <p className="mb-5 max-w-2xl text-sm text-tinta-suave">
          Con estos números las dos cuestan lo mismo. Elige la que te anime más: con la bola de nieve terminas una deuda más pronto.
        </p>
      )}
      <ul className="grid gap-5 sm:grid-cols-2">
        {opciones.map((o) => (
          <li key={o.nombre} className="flex flex-col gap-2 border-t-2 border-cielo pt-4">
            <h3 className="font-titulo font-semibold tracking-[-0.015em]">{o.nombre}</h3>
            <p className="text-sm text-tinta-suave">{o.idea}</p>
            <p className="cifras text-sm">
              Empiezas con <strong className="font-semibold">{o.r.primera?.nombre}</strong>. Terminas todo en {o.r.meses} meses y pagas {cop(o.r.interes)} en intereses.
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MeDeben() {
  const { datos, guardar, borrar, guardarMovimiento, avisar } = useFinanzas();
  const [agregar, setAgregar] = useState(false);
  const [persona, setPersona] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState(0);
  const pendientes = datos.por_cobrar.filter((p) => !p.cobrado);

  function cobrar(p: PorCobrar) {
    guardar("por_cobrar", [{ ...p, cobrado: true }]);
    guardarMovimiento({
      id: nuevoId(), fecha: hoy(), tipo: "ingreso", categoria: "Otros ingresos",
      descripcion: `${p.persona} me pagó${p.concepto ? `: ${p.concepto}` : ""}`,
      monto: p.monto, moneda: "COP", tasa: 1, cuenta_id: null, medio_pago: "Nequi", deuda_id: null, proyecto_id: null, origen: "manual", id_externo: null,
    });
    avisar(`Listo: ${cop(p.monto)} entraron a tus ingresos`);
  }

  return (
    <section aria-labelledby="titulo-me-deben">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="titulo-me-deben" className="font-titulo text-xl font-semibold tracking-[-0.015em]">Lo que te deben</h2>
        <Boton variante="suave" onClick={() => setAgregar(true)}>Agregar</Boton>
      </div>
      {pendientes.length === 0 ? (
        <p className="text-tinta-suave">Nadie te debe nada por ahora. Si prestas plata o fías, anótalo aquí para que no se te olvide.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-linea">
          {pendientes.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <span className="min-w-0">
                <span className="block font-medium">{p.persona}</span>
                {p.concepto && <span className="block text-sm text-tinta-suave">{p.concepto}</span>}
              </span>
              <span className="flex items-center gap-4">
                <span className="cifras font-semibold">{cop(p.monto)}</span>
                <button type="button" onClick={() => cobrar(p)} className="min-h-11 text-sm font-semibold underline decoration-cielo decoration-2 underline-offset-4 hover:decoration-naranja">Ya me pagó</button>
                <button type="button" onClick={() => borrar("por_cobrar", p.id)} className="min-h-11 text-sm text-tinta-suave hover:text-tinta">Borrar</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {agregar && (
        <Hoja titulo="Alguien me debe" onCerrar={() => setAgregar(false)}>
          {(cerrar) => (
            <form
              noValidate
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!persona.trim() || monto <= 0) return;
                guardar("por_cobrar", [{ id: nuevoId(), persona: persona.trim(), concepto: concepto.trim(), monto, fecha: hoy(), cobrado: false }]);
                setPersona(""); setConcepto(""); setMonto(0);
                cerrar();
              }}
            >
              <Campo etiqueta="¿Quién?" value={persona} onChange={(e) => setPersona(e.target.value)} />
              <CampoMonto etiqueta="¿Cuánto?" valor={monto} onCambio={setMonto} />
              <Campo etiqueta="¿Por qué? (opcional)" value={concepto} onChange={(e) => setConcepto(e.target.value)} />
              <Boton type="submit" disabled={!persona.trim() || monto <= 0} className="w-full">Guardar</Boton>
            </form>
          )}
        </Hoja>
      )}
    </section>
  );
}

export default function Deudas() {
  const { datos, guardar } = useFinanzas();
  const [agregar, setAgregar] = useState(false);
  const avance = progresoDeudas(datos.deudas, datos.pagos_deuda);
  const botonAgregar = <Boton variante="suave" onClick={() => setAgregar(true)}>Agregar deuda</Boton>;

  return (
    <>
      <Titulo accion={datos.deudas.length > 0 ? botonAgregar : undefined}>Deudas</Titulo>
      <div className="flex flex-col gap-14">
        {datos.deudas.length === 0 ? (
          <Vacio titulo="No tienes deudas registradas" texto="Agrega la primera con su saldo, cuota e interés. Separaremos cada pago en capital, interés y otros cobros." accion={<Boton onClick={() => setAgregar(true)}>Agregar deuda</Boton>} />
        ) : (
          <>
            <section aria-labelledby="titulo-ciudad" className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-2">
                <h2 id="titulo-ciudad" className="font-titulo text-[clamp(2.5rem,7vw,4rem)] leading-none font-bold tracking-[-0.035em]">
                  <span className="text-naranja">{porcentaje(avance.proporcion)}</span> ya es tuyo
                </h2>
                <p className="cifras text-lg text-tinta-suave">Has pagado {cop(avance.total - avance.saldo)} y faltan {cop(avance.saldo)}. Cada pago llena la ciudad.</p>
              </div>
              <Ciudad proporcion={avance.proporcion} className="w-36 justify-self-start sm:w-44" />
            </section>
            <ul className="flex flex-col gap-5">
              {datos.deudas.map((d) => <TarjetaDeuda key={d.id} deuda={d} />)}
            </ul>
            <Estrategias />
          </>
        )}
        <MeDeben />
      </div>
      {agregar && <FormularioDeuda onCerrar={() => setAgregar(false)} onGuardar={(d) => guardar("deudas", [d])} />}
    </>
  );
}

