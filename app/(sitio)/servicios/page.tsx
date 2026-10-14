import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";
import Escena from "@/components/servicios/Escena";
import { servicios } from "@/lib/servicios";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Mantenimiento de equipos, páginas web, apps móviles y automatización para tu empresa. Todo queda a tu nombre: el código, los datos y el control.",
};

export default function PaginaServicios() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 md:pt-24 md:pb-16">
        <h1 className="entrada font-titulo text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.035em]">
          Servicios
        </h1>
        <p className="entrada mt-5 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl" style={{ "--retraso": "120ms" } as CSSProperties}>
          Desde el computador de la oficina hasta la app con la que manejas tu
          negocio. Todo queda a tu nombre: el código, los datos y el control.
        </p>
        <nav aria-label="Servicios" className="entrada mt-8" style={{ "--retraso": "220ms" } as CSSProperties}>
          <ul className="flex flex-wrap gap-2">
            {servicios.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-full border border-linea bg-superficie px-4 py-2 text-sm font-medium transition-[border-color,background-color] duration-200 hover:border-cielo hover:bg-cielo/25"
                >
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 sm:px-6 md:gap-24 md:pb-28">
        {servicios.map((servicio, i) => (
          <Revelar key={servicio.id}>
            <section
              id={servicio.id}
              aria-labelledby={`titulo-${servicio.id}`}
              className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2 md:gap-16"
            >
              <div className={`rounded-2xl bg-cielo/35 p-6 dark:bg-cielo/10 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <Escena id={servicio.id} className="mx-auto w-full max-w-md" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 id={`titulo-${servicio.id}`} className="font-titulo text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {servicio.titulo}
                </h2>
                <p className="text-lg text-tinta-suave">{servicio.descripcion}</p>
                <h3 className="mt-2 text-sm font-semibold">Incluye</h3>
                <ul className="flex flex-col gap-2.5">
                  {servicio.incluye.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
                        <circle cx="10" cy="10" r="10" className="fill-naranja" />
                        <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Revelar>
        ))}
      </div>

      <Revelar>
        <section className="border-t border-linea">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="font-titulo text-3xl font-semibold tracking-[-0.025em]">Cuéntanos qué necesitas</h2>
              <p className="text-lg text-tinta-suave">
                Nos explicas con tus palabras, sin términos técnicos, y te
                proponemos el camino. Tú decides si seguimos.
              </p>
            </div>
            <Link
              href="/contacto"
              className="shrink-0 rounded-xl bg-boton px-6 py-3.5 font-semibold text-white transition-[background-color,scale] duration-100 hover:bg-boton-hover active:scale-[0.97]"
            >
              Cuéntanos tu idea
            </Link>
          </div>
        </section>
      </Revelar>
    </>
  );
}
