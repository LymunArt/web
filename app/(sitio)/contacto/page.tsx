import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";
import Canales from "@/components/contacto/Canales";
import { pasos } from "@/lib/como-trabajamos";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cuéntanos qué necesitas para tu empresa: mantenimiento de equipos, página web, app o automatización. Muy pronto por nuestro asistente y por WhatsApp.",
};

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

// Los dos primeros pasos del proceso son lo que pasa justo después de escribirnos.
const primerosPasos = pasos.slice(0, 2);

export default function PaginaContacto() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-20 sm:px-6 md:grid-cols-[1fr_1.1fr] md:gap-16 md:pt-24 md:pb-28">
        <div className="flex flex-col gap-5">
          <h1 className="entrada font-titulo text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.035em]">
            Hablemos de tu proyecto
          </h1>
          <p style={retraso(120)} className="entrada max-w-md text-lg leading-relaxed text-tinta-suave sm:text-xl">
            Estamos preparando nuestros canales de atención. Muy pronto podrás
            escribirnos por aquí.
          </p>
        </div>
        <div style={retraso(220)} className="entrada">
          <Canales />
        </div>
      </section>

      <section aria-labelledby="titulo-despues" className="border-t border-linea">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <Revelar className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 id="titulo-despues" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
              Qué pasa cuando nos escribes
            </h2>
            <Link
              href="/como-trabajamos"
              className="w-fit shrink-0 font-semibold underline decoration-cielo decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-tinta"
            >
              Ver el proceso completo
            </Link>
          </Revelar>
          <Revelar>
            <ol className="grid gap-10 md:grid-cols-2">
              {primerosPasos.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-cielo bg-superficie font-titulo text-lg font-bold">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-2 pt-2.5">
                    <h3 className="font-titulo text-lg font-semibold tracking-[-0.015em]">{paso.titulo}</h3>
                    <p className="text-tinta-suave">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Revelar>
        </div>
      </section>
    </>
  );
}
