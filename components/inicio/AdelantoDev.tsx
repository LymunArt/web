import Link from "next/link";

// Esta sección usa la identidad de LymunArt Dev: negro, vinotinto, blanco y trato de "usted".
export default function AdelantoDev() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-dev-texto">
            Para clientes especiales
          </p>
          <h2 className="font-dev text-5xl font-semibold sm:text-6xl">LymunArt Dev</h2>
          <p className="max-w-md text-lg font-light text-dev-texto">
            A partir de su tercer servicio con nosotros se le abre LymunArt Dev:
            desarrollo a la medida, atención directa y prioridad en cada entrega.
          </p>
          <Link
            href="/dev"
            className="w-fit rounded-lg bg-white px-5 py-3 font-semibold text-vino hover:bg-dev-texto"
          >
            Conocer LymunArt Dev
          </Link>
        </div>

        <div className="rounded-2xl bg-vino p-8">
          <p className="mb-6 text-dev-texto">Su camino hacia LymunArt Dev</p>
          <ol className="flex items-center gap-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className={`flex size-14 items-center justify-center rounded-full border font-dev text-2xl font-semibold ${
                    n === 3 ? "border-white bg-white text-vino" : "border-white/40"
                  }`}
                >
                  {n}
                </span>
                <span className="text-center text-sm text-dev-texto">
                  {n === 3 ? "Acceso a Dev" : `Servicio ${n}`}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
