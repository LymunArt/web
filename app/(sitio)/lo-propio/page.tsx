import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";
import Comparacion from "@/components/lo-propio/Comparacion";
import { aTuNombre } from "@/lib/lo-propio";

export const metadata: Metadata = {
  title: "Lo propio",
  description:
    "Por qué tener tu propia tecnología en vez de depender de un proveedor: el código, los datos, el dominio y los accesos quedan a tu nombre.",
};

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

export default function PaginaLoPropio() {
  return (
    <>
      <section className="bg-cielo text-tinta-fija dark:bg-cielo/10 dark:text-tinta">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 md:pt-24 md:pb-28">
          <h1 className="entrada max-w-3xl font-titulo text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] font-bold tracking-[-0.035em]">
            ¿Por qué tener lo propio?
          </h1>
          <p style={retraso(120)} className="entrada mt-5 max-w-2xl text-lg leading-relaxed text-cielo-tinta sm:text-xl dark:text-tinta-suave">
            Dejar de depender de proveedores es tener más control sobre tu
            empresa.
          </p>
          <div style={retraso(220)} className="entrada mt-12">
            <Comparacion />
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-a-tu-nombre" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-12 flex max-w-2xl flex-col gap-4">
          <h2 id="titulo-a-tu-nombre" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
            Lo que queda a tu nombre
          </h2>
          <p className="text-lg text-tinta-suave">
            Al terminar cada proyecto te entregamos lo tuyo. Esto es lo que
            significa en la práctica.
          </p>
        </Revelar>
        <Revelar>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {aTuNombre.map((item) => (
              <div key={item.titulo} className="flex flex-col gap-3 border-t-2 border-naranja pt-5">
                <dt className="font-titulo text-xl font-semibold tracking-[-0.015em]">{item.titulo}</dt>
                <dd className="text-tinta-suave">{item.texto}</dd>
              </div>
            ))}
          </dl>
        </Revelar>
      </section>

      <Revelar>
        <section className="border-t border-linea">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="font-titulo text-3xl font-semibold tracking-[-0.025em]">Empieza a tener lo tuyo</h2>
              <p className="text-lg text-tinta-suave">
                Cuéntanos qué usas hoy y qué te gustaría que fuera tuyo. Te
                proponemos el camino y tú decides si seguimos.
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
