import Image from "next/image";
import Revelar from "@/components/Revelar";
import { casos, type Caso } from "@/lib/clientes";

// Confianza con trabajos reales: qué se entregó, a quién y qué dice el cliente.
// Si no hay casos todavía, la sección no se muestra (ver lib/clientes.ts).
export default function Clientes() {
  if (casos.length === 0) return null;

  return (
    <section aria-labelledby="titulo-clientes" className="border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-12 max-w-2xl">
          <h2 id="titulo-clientes" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
            Quienes ya tienen lo suyo
          </h2>
        </Revelar>

        <ul className="flex flex-col gap-16">
          {casos.map((caso) => (
            <li key={caso.cliente}>
              <Revelar>
                <CasoCliente caso={caso} />
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CasoCliente({ caso }: { caso: Caso }) {
  return (
    <article className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-16">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          {caso.logo && (
            <Image src={caso.logo} alt={`Logo de ${caso.cliente}`} width={64} height={64} className="size-16 rounded-xl" />
          )}
          <div>
            <h3 className="font-titulo text-xl font-semibold tracking-[-0.015em]">{caso.cliente}</h3>
            <p className="text-sm text-tinta-suave">{caso.descripcion}</p>
          </div>
        </div>
        <p className="text-lg">
          <span className="font-semibold">{caso.proyecto}.</span>{" "}
          <span className="text-tinta-suave">{caso.resumen}</span>
        </p>
        <ul className="flex flex-wrap gap-2">
          {caso.incluye.map((item) => (
            <li key={item} className="rounded-full border border-linea bg-superficie px-3 py-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
        {caso.captura && (
          <Image
            src={caso.captura.src}
            alt={caso.captura.alt}
            width={caso.captura.ancho}
            height={caso.captura.alto}
            className="mt-2 w-full rounded-2xl border border-linea"
          />
        )}
      </div>

      {caso.testimonio && (
        <figure className="flex flex-col justify-center gap-6 md:border-l md:border-linea md:pl-16">
          <blockquote className="font-titulo text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl">
            <span aria-hidden="true" className="text-naranja">“</span>
            {caso.testimonio.cita}
            <span aria-hidden="true" className="text-naranja">”</span>
          </blockquote>
          <figcaption className="text-sm">
            <p className="font-semibold">{caso.testimonio.nombre}</p>
            {caso.testimonio.cargo && <p className="text-tinta-suave">{caso.testimonio.cargo}</p>}
          </figcaption>
        </figure>
      )}
    </article>
  );
}
