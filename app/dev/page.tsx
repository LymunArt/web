import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LymunArt Dev",
  description:
    "Desarrollo a la medida para clientes especiales de LymunArt, con atención directa y prioridad en cada entrega.",
};

// LymunArt Dev: solo negro, vinotinto y blanco. Títulos en Cormorant, texto en Inter ligera, trato de "usted".
const beneficios = [
  {
    titulo: "Atención directa",
    texto: "Trabaja directamente con el fundador de LymunArt, sin intermediarios.",
  },
  {
    titulo: "Prioridad en cada entrega",
    texto: "Sus proyectos pasan primero en la agenda de desarrollo.",
  },
  {
    titulo: "Sistemas a la medida",
    texto: "Plataformas, aplicaciones y automatizaciones diseñadas alrededor de su empresa.",
  },
  {
    titulo: "Acompañamiento continuo",
    texto: "Después de la entrega seguimos a su lado para ajustar y mejorar lo que necesite.",
  },
];

export default function Dev() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-titulo text-lg font-bold">
          LymunArt
        </Link>
        <Link href="/" className="text-sm text-dev-texto hover:text-white">
          Volver a LymunArt
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:py-24">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs uppercase tracking-widest text-dev-texto">
              Para clientes especiales
            </p>
            <h1 className="font-dev text-6xl font-semibold leading-none sm:text-7xl">
              Desarrollo a la medida
            </h1>
            <p className="max-w-xl text-lg font-light text-dev-texto">
              LymunArt Dev es el área exclusiva para quienes ya han confiado en
              nosotros. Su aplicación será suya: el código, los datos y el
              dominio.
            </p>
          </div>
          <Image
            src="/logo/lymunart-dev-logo.svg"
            alt="Logo de LymunArt Dev"
            width={590}
            height={695}
            priority
            className="mx-auto w-40 sm:w-52"
          />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 font-dev text-4xl font-semibold">Qué incluye</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {beneficios.map((beneficio) => (
              <article key={beneficio.titulo} className="flex flex-col gap-2 rounded-2xl bg-vino p-6">
                <h3 className="font-dev text-3xl font-semibold">{beneficio.titulo}</h3>
                <p className="font-light text-dev-texto">{beneficio.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-vino-borde p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-dev text-4xl font-semibold">Cómo acceder</h2>
              <p className="max-w-xl font-light text-dev-texto">
                LymunArt Dev se activa automáticamente cuando completa su tercer
                servicio con nosotros. Muy pronto podrá ingresar con su cuenta
                para ver sus proyectos.
              </p>
            </div>
            <span className="w-fit rounded-full border border-white/40 px-4 py-2 text-sm">
              Acceso de clientes · próximamente
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
