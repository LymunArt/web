import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";
import { pasos } from "@/lib/como-trabajamos";

export const metadata: Metadata = {
  title: "Cómo trabajamos",
  description:
    "Tú tienes la última palabra en cada paso: nos cuentas, te proponemos, construimos contigo y te entregamos lo tuyo, a tu nombre.",
};

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

export default function PaginaComoTrabajamos() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-14 pb-14 sm:px-6 md:pt-24 md:pb-20">
        <h1 className="entrada font-titulo text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.035em]">
          Cómo trabajamos
        </h1>
        <p style={retraso(120)} className="entrada mt-5 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
          Tú tienes la última palabra en cada paso. Nosotros nos encargamos de
          que todo funcione.
        </p>
      </header>

      <ol className="mx-auto flex max-w-6xl flex-col px-4 pb-20 sm:px-6 md:pb-28">
        {pasos.map((paso, i) => {
          const ultimo = i === pasos.length - 1;
          return (
            <li key={paso.titulo}>
              <Revelar className="grid gap-6 border-t border-linea py-10 md:grid-cols-[5rem_1fr_1fr_1fr] md:gap-10 md:py-12">
                <span
                  className={`flex size-14 items-center justify-center rounded-full font-titulo text-xl font-bold ${
                    ultimo ? "bg-naranja text-white" : "border-2 border-cielo bg-superficie"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="font-titulo text-2xl font-semibold tracking-[-0.02em]">{paso.titulo}</h2>
                  {paso.decides && (
                    <span className="w-fit rounded-full bg-cielo px-2.5 py-1 text-xs font-semibold text-tinta-fija">
                      Tú decides
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold">Tú</h3>
                  <p className="text-tinta-suave">{paso.tu}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold">Nosotros</h3>
                  <p className="text-tinta-suave">{paso.nosotros}</p>
                </div>
              </Revelar>
            </li>
          );
        })}
      </ol>

      <Revelar>
        <section className="bg-cielo text-tinta-fija dark:bg-cielo/10 dark:text-tinta">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="font-titulo text-3xl font-semibold tracking-[-0.025em]">Hablemos de tu proyecto</h2>
              <p className="text-lg text-cielo-tinta dark:text-tinta-suave">
                El primer paso es contarnos qué necesitas. Y después de tu tercer
                servicio con nosotros se te abre{" "}
                <Link href="/dev" className="font-semibold text-tinta-fija underline decoration-2 underline-offset-[0.3em] dark:text-tinta">
                  LymunArt Dev
                </Link>
                .
              </p>
            </div>
            <Link
              href="/contacto"
              className="shrink-0 rounded-xl bg-naranja px-6 py-3.5 font-semibold text-white transition-[background-color,scale] duration-100 hover:bg-naranja-hover active:scale-[0.97]"
            >
              Cuéntanos tu idea
            </Link>
          </div>
        </section>
      </Revelar>
    </>
  );
}
