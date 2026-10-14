import Link from "next/link";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";
import { pasos } from "@/lib/como-trabajamos";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Línea de tiempo: horizontal en computador, vertical en celular.
// Al entrar en pantalla la línea se traza de un paso al siguiente.
export default function ComoTrabajamos() {
  return (
    <section aria-labelledby="titulo-como-trabajamos" className="border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 id="titulo-como-trabajamos" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
              Cómo trabajamos
            </h2>
            <p className="text-lg text-tinta-suave">
              Tú tienes la última palabra en cada paso. Nosotros nos encargamos de
              que todo funcione.
            </p>
          </div>
          <Link
            href="/como-trabajamos"
            className="w-fit shrink-0 font-semibold underline decoration-cielo decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-tinta"
          >
            Ver el proceso completo
          </Link>
        </Revelar>

        <Revelar>
          <ol className="grid gap-0 md:grid-cols-4 md:gap-8">
            {pasos.map((paso, i) => {
              const ultimo = i === pasos.length - 1;
              return (
                <li key={paso.titulo} className="relative flex gap-5 pb-10 last:pb-0 md:flex-col md:gap-6 md:pb-0">
                  {!ultimo && (
                    <span
                      aria-hidden="true"
                      style={d(250 + i * 280)}
                      className="pasos-linea absolute top-14 bottom-2 left-6 w-0.5 rounded-full bg-cielo md:top-6 md:right-[-1.5rem] md:bottom-auto md:left-14 md:h-0.5 md:w-auto"
                    />
                  )}
                  <span
                    style={d(100 + i * 280)}
                    className={`pasos-nodo relative flex size-12 shrink-0 items-center justify-center rounded-full font-titulo text-lg font-bold ${
                      ultimo ? "bg-naranja text-white" : "border-2 border-cielo bg-superficie text-tinta"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-2 pt-2.5 md:pt-0">
                    <h3 className="font-titulo text-lg font-semibold tracking-[-0.015em]">{paso.titulo}</h3>
                    <p className="text-tinta-suave">{paso.texto}</p>
                    {paso.decides && (
                      <span className="mt-1 w-fit rounded-full bg-cielo px-2.5 py-1 text-xs font-semibold text-tinta-fija">
                        Tú decides
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Revelar>
      </div>
    </section>
  );
}
