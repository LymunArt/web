import Link from "next/link";
import Revelar from "@/components/Revelar";
import Canales from "@/components/contacto/Canales";

// Cierre de la landing: una franja de tinta que ancla el final de la página.
export default function Contacto() {
  return (
    <section aria-labelledby="titulo-contacto" className="bg-tinta-fija text-white dark:bg-superficie">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
        <Revelar className="flex flex-col gap-5">
          <h2 id="titulo-contacto" className="font-titulo text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.03em]">
            Hablemos de tu proyecto
          </h2>
          <p className="max-w-md text-lg text-white/75">
            Estamos preparando nuestros canales de atención. Muy pronto podrás
            escribirnos por aquí.
          </p>
          <Link
            href="/contacto"
            className="mt-2 w-fit font-semibold underline decoration-cielo decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-white"
          >
            Qué pasa cuando nos escribes
          </Link>
        </Revelar>
        <Revelar>
          <Canales sobreOscuro />
        </Revelar>
      </div>
    </section>
  );
}
