import Link from "next/link";
import Revelar from "@/components/Revelar";
import Escena from "@/components/servicios/Escena";
import { servicios } from "@/lib/servicios";

// Resumen en la landing; el detalle de cada servicio vive en /servicios.
export default function Servicios() {
  return (
    <section aria-labelledby="titulo-servicios" className="border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 id="titulo-servicios" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
              Lo que hacemos por tu empresa
            </h2>
            <p className="text-lg text-tinta-suave">
              Desde el computador de la oficina hasta la app con la que manejas tu
              negocio.
            </p>
          </div>
          <Link
            href="/servicios"
            className="w-fit shrink-0 font-semibold underline decoration-cielo decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-tinta"
          >
            Ver todos los servicios
          </Link>
        </Revelar>

        <ul className="grid gap-5 sm:grid-cols-2">
          {servicios.map((servicio) => (
            <li key={servicio.id}>
              <Revelar className="h-full">
                <Link
                  href={`/servicios#${servicio.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-linea bg-superficie transition-[border-color,scale] duration-200 hover:border-tinta-suave/50 active:scale-[0.99]"
                >
                  <div className="bg-cielo/35 px-6 pt-6 dark:bg-cielo/10">
                    <Escena
                      id={servicio.id}
                      className="mx-auto w-full max-w-[22rem] transition-transform duration-500 ease-(--salida) group-hover:-translate-y-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                    <h3 className="font-titulo text-xl font-semibold tracking-[-0.015em]">{servicio.titulo}</h3>
                    <p className="text-tinta-suave">{servicio.descripcion}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold">
                      Ver qué incluye
                      <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 ease-(--salida) group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
