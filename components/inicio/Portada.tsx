import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

export default function Portada() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 md:grid-cols-[1.35fr_1fr] md:pt-24 md:pb-28">
      <div className="flex flex-col">
        <h1
          style={retraso(0)}
          className="entrada font-titulo text-[clamp(2.75rem,7.2vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.035em]"
        >
          No hay nada mejor que <span className="resaltado whitespace-nowrap">lo propio</span>
        </h1>
        <p style={retraso(140)} className="entrada mt-6 max-w-[34rem] text-lg leading-relaxed text-tinta-suave sm:text-xl">
          Mantenemos tus equipos, creamos tu página web y desarrollamos las apps
          de tu empresa. Todo queda a tu nombre: el código, los datos y el
          control.
        </p>
        <div style={retraso(260)} className="entrada mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/contacto"
            className="rounded-xl bg-boton px-6 py-3.5 font-semibold text-white shadow-[0_6px_16px_-6px] shadow-boton/60 transition-[background-color,scale] duration-100 hover:bg-boton-hover active:scale-[0.97]"
          >
            Cuéntanos qué necesitas
          </Link>
          <Link
            href="/servicios"
            className="group flex items-center gap-1.5 py-2 font-semibold underline decoration-cielo decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-tinta"
          >
            Ver servicios
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 ease-(--salida) group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* La guía pide la versión en negativo sobre fondos oscuros */}
      <div style={retraso(120)} className="entrada mx-auto w-52 sm:w-64 md:w-full md:max-w-sm">
        <Image
          src="/logo/lymunart-logo.svg"
          alt="Logo de LymunArt: una luna creciente junto a cinco edificios"
          width={590}
          height={695}
          loading="eager"
          className="w-full dark:hidden"
        />
        <Image
          src="/logo/lymunart-logo-negativo.svg"
          alt="Logo de LymunArt: una luna creciente junto a cinco edificios"
          width={590}
          height={695}
          loading="eager"
          className="hidden w-full dark:block"
        />
      </div>
    </section>
  );
}
