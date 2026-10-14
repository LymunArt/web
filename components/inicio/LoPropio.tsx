import Link from "next/link";
import Revelar from "@/components/Revelar";
import Comparacion from "@/components/lo-propio/Comparacion";

export default function LoPropio() {
  return (
    <section aria-labelledby="titulo-lo-propio" className="bg-cielo text-tinta-fija dark:bg-cielo/10 dark:text-tinta">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Revelar className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 id="titulo-lo-propio" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
              ¿Por qué tener lo propio?
            </h2>
            <p className="text-lg text-cielo-tinta dark:text-tinta-suave">
              Dejar de depender de proveedores es tener más control sobre tu
              empresa.
            </p>
          </div>
          <Link
            href="/lo-propio"
            className="w-fit shrink-0 font-semibold underline decoration-cielo-tinta/40 decoration-2 underline-offset-[0.35em] transition-[text-decoration-color] duration-200 hover:decoration-current dark:decoration-cielo"
          >
            Qué queda a tu nombre
          </Link>
        </Revelar>
        <Revelar>
          <Comparacion />
        </Revelar>
      </div>
    </section>
  );
}
