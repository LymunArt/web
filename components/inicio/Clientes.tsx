import Image from "next/image";
import Revelar from "@/components/Revelar";
import { clientes, testimonios } from "@/lib/clientes";

// Confianza con datos reales: logos de clientes y lo que dicen de LymunArt.
// Si no hay datos todavía, la sección no se muestra (ver lib/clientes.ts).
export default function Clientes() {
  if (clientes.length === 0 && testimonios.length === 0) return null;

  const [destacado, ...resto] = testimonios;

  return (
    <section aria-labelledby="titulo-clientes" className="border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-12 max-w-2xl">
          <h2 id="titulo-clientes" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
            Empresas que ya tienen lo suyo
          </h2>
        </Revelar>

        {clientes.length > 0 && (
          <Revelar className="mb-16">
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
              {clientes.map((cliente) => {
                const marca = cliente.logo ? (
                  <Image
                    src={cliente.logo}
                    alt={cliente.nombre}
                    width={160}
                    height={48}
                    className="h-10 w-auto opacity-80 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 dark:invert"
                  />
                ) : (
                  <span className="font-titulo text-lg font-semibold text-tinta-suave">{cliente.nombre}</span>
                );
                return (
                  <li key={cliente.nombre}>
                    {cliente.sitio ? (
                      <a href={cliente.sitio} target="_blank" rel="noopener noreferrer">
                        {marca}
                      </a>
                    ) : (
                      marca
                    )}
                  </li>
                );
              })}
            </ul>
          </Revelar>
        )}

        {destacado && (
          <Revelar>
            <figure className="max-w-4xl">
              <blockquote className="font-titulo text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-3xl">
                <span aria-hidden="true" className="text-naranja">“</span>
                {destacado.cita}
                <span aria-hidden="true" className="text-naranja">”</span>
              </blockquote>
              <Autor testimonio={destacado} />
            </figure>
          </Revelar>
        )}

        {resto.length > 0 && (
          <Revelar className="mt-14">
            <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
              {resto.map((t) => (
                <li key={`${t.nombre}-${t.empresa}`}>
                  <figure className="border-t border-linea pt-6">
                    <blockquote className="text-lg">“{t.cita}”</blockquote>
                    <Autor testimonio={t} />
                  </figure>
                </li>
              ))}
            </ul>
          </Revelar>
        )}
      </div>
    </section>
  );
}

function Autor({ testimonio }: { testimonio: (typeof testimonios)[number] }) {
  return (
    <figcaption className="mt-5 flex items-center gap-4">
      {testimonio.foto && (
        <Image src={testimonio.foto} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
      )}
      <div className="text-sm">
        <p className="font-semibold">{testimonio.nombre}</p>
        <p className="text-tinta-suave">
          {[testimonio.cargo, testimonio.empresa].filter(Boolean).join(", ")}
        </p>
      </div>
    </figcaption>
  );
}
