"use client";

import Link from "next/link";
import { cargaDeuda, gastosPorCategoria, progresoDeudas, resumenMes, saldoActual } from "@/lib/finanzas/calculos";
import { cop, fechaCorta, mesActual, nombreMes, porcentaje, proximoPago } from "@/lib/finanzas/formato";
import Ciudad from "./Ciudad";
import { FormularioCuenta, ListaCuentas } from "./Cuentas";
import { useFinanzas } from "./Contexto";
import { Avance, Boton, Icono, SelectorMes, Subtitulo } from "./Ui";
import { useState } from "react";

const enlace = "text-sm font-semibold underline decoration-cielo decoration-2 hover:decoration-naranja";

export default function Inicio() {
  const { datos, mes, setMes, usuario, abrirRegistro, cargarEjemplo, backend } = useFinanzas();
  const [agregarCuenta, setAgregarCuenta] = useState(false);

  if (datos.movimientos.length === 0 && datos.deudas.length === 0) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-5 pt-6">
        <h1 className="font-titulo text-4xl leading-[1.1] font-bold tracking-[-0.03em] sm:text-5xl">
          Hola, {usuario?.nombre.split(" ")[0]}. Empecemos por <span className="text-naranja">lo tuyo</span>.
        </h1>
        <p className="text-lg leading-relaxed text-tinta-suave">
          Registra lo primero que te entró este mes. Con eso ya sabemos cuánto tienes para moverte.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Boton onClick={() => abrirRegistro({ inicial: { tipo: "ingreso" } })}>Registrar mi primer ingreso</Boton>
          <Link href="/finanzas/deudas" className={enlace}>Agregar una deuda</Link>
        </div>
        {backend?.modo === "prueba" && (
          <button type="button" onClick={cargarEjemplo} className={`${enlace} mt-2 text-tinta-suave`}>Ver la app con datos de ejemplo</button>
        )}
      </div>
    );
  }

  const r = resumenMes(datos, mes);
  const categorias = gastosPorCategoria(datos, mes);
  const carga = cargaDeuda(datos, mes);
  const avance = progresoDeudas(datos.deudas, datos.pagos_deuda);
  const base = Math.max(r.ingresos, r.gastos + r.pagos + r.ahorro, 1);
  const esteMes = mes === mesActual();

  const proximos = datos.deudas
    .filter((d) => d.dia_pago && saldoActual(d, datos.pagos_deuda) > 0)
    .map((d) => ({ deuda: d, ...proximoPago(d.dia_pago as number) }))
    .sort((a, b) => a.dias - b.dias);

  const filas = [
    { nombre: "Entró", valor: r.ingresos },
    { nombre: "Gastos", valor: r.gastos },
    { nombre: "Cuotas de deudas", valor: r.pagos },
    { nombre: "Ahorro y proyectos", valor: r.ahorro },
  ];

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="titulo-disponible" className="flex flex-col items-start gap-2">
        <div className="-ml-3 mb-2"><SelectorMes mes={mes} onCambio={setMes} /></div>
        <h1 id="titulo-disponible" className="text-lg text-tinta-suave">
          {r.disponible >= 0 ? (esteMes ? "Te quedan para moverte" : `Te quedaron en ${nombreMes(mes, false)}`) : "Saliste por encima de lo que entró"}
        </h1>
        <p className="cifras font-titulo text-[clamp(3rem,10vw,5.5rem)] leading-none font-bold tracking-[-0.04em]">
          <span className={r.disponible >= 0 ? "text-tinta" : "text-boton-hover dark:text-naranja"}>{cop(Math.abs(r.disponible))}</span>
        </p>
      </section>

      <section aria-label="Resumen del mes">
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {filas.map((f) => (
            <li key={f.nombre} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-tinta-suave">{f.nombre}</span>
                <span className="cifras font-semibold">{cop(f.valor)}</span>
              </div>
              <Avance proporcion={f.valor / base} etiqueta={`${f.nombre}: ${porcentaje(f.valor / base)} del mes`} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-cuentas">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 id="titulo-cuentas" className="font-titulo text-lg font-semibold tracking-[-0.015em]">Tus cuentas</h2>
          {datos.cuentas.some((c) => !c.archivada) ? (
            <Link href="/finanzas/cuentas" className={enlace}>Ver todas</Link>
          ) : null}
        </div>
        {datos.cuentas.some((c) => !c.archivada) ? (
          <ListaCuentas compacta />
        ) : (
          <p className="text-tinta-suave">
            Agrega tus cuentas de cualquier banco o billetera, en pesos o en otra moneda.{" "}
            <button type="button" onClick={() => setAgregarCuenta(true)} className={enlace}>Agregar cuenta</button>
          </p>
        )}
        {agregarCuenta && <FormularioCuenta onCerrar={() => setAgregarCuenta(false)} />}
      </section>

      <Link href="/finanzas/tax-free" className="tactil -mt-6 flex items-center justify-between gap-4 rounded-2xl border border-linea px-5 py-4 hover:border-tinta-suave md:hidden">
        <span>
          <span className="block font-medium">Tax free</span>
          <span className="block text-sm text-tinta-suave">Lo que te devuelven de las compras en el exterior</span>
        </span>
        <Icono d="M9 18l6-6-6-6" className="size-5 shrink-0 text-tinta-suave" />
      </Link>

      <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:gap-14">
        <section aria-labelledby="titulo-gastos">
          <h2 id="titulo-gastos" className="mb-4 font-titulo text-lg font-semibold tracking-[-0.015em]">En qué se fue</h2>
          {categorias.length === 0 ? (
            <p className="text-tinta-suave">Todavía no hay gastos en {nombreMes(mes, false)}.</p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {categorias.map((c) => (
                <li key={c.categoria} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span>{c.categoria}</span>
                    <span className="cifras font-medium">{cop(c.total)}</span>
                  </div>
                  <Avance proporcion={c.total / categorias[0].total} etiqueta={`${c.categoria}: ${cop(c.total)}`} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-10">
          {datos.deudas.length > 0 && (
            <section aria-labelledby="titulo-tuyo">
              <div className="flex items-center gap-4">
                <Ciudad proporcion={avance.proporcion} className="w-20 shrink-0" />
                <div className="flex flex-col gap-1">
                  <h2 id="titulo-tuyo" className="font-titulo text-lg font-semibold tracking-[-0.015em]">
                    {porcentaje(avance.proporcion)} ya es tuyo
                  </h2>
                  <p className="cifras text-sm text-tinta-suave">Debes {cop(avance.saldo)}</p>
                  <Link href="/finanzas/deudas" className={enlace}>Ver mis deudas</Link>
                </div>
              </div>
            </section>
          )}

          {carga.proporcion !== null && carga.cuotas > 0 && (
            <section aria-labelledby="titulo-carga">
              <Subtitulo><span id="titulo-carga">Tus cuotas se llevan {porcentaje(carga.proporcion)}</span></Subtitulo>
              <p className="text-sm text-tinta-suave">
                {carga.proporcion <= 0.35
                  ? "Vas bien: lo sano es que no pasen de 30 a 35 % de lo que entra."
                  : "Es más de lo sano, que es hasta 30 a 35 % de lo que entra. Mira el simulador en Deudas."}
              </p>
            </section>
          )}

          {proximos.length > 0 && (
            <section aria-labelledby="titulo-proximos">
              <h2 id="titulo-proximos" className="mb-3 font-titulo text-lg font-semibold tracking-[-0.015em]">Próximos pagos</h2>
              <ul className="flex flex-col divide-y divide-linea">
                {proximos.map(({ deuda, fecha, dias }) => (
                  <li key={deuda.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span>
                      <span className="font-medium">{deuda.nombre}</span>
                      <span className="block text-tinta-suave">{dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`}, {fechaCorta(fecha)}</span>
                    </span>
                    <span className="cifras font-semibold">{cop(deuda.cuota)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
