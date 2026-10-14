import Image from "next/image";
import Link from "next/link";

export default function Portada() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr] md:py-24">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-widest text-tinta-suave">
          Soluciones tecnológicas
        </p>
        <h1 className="font-titulo text-4xl font-bold leading-tight sm:text-6xl">
          No hay nada mejor que lo propio
        </h1>
        <p className="max-w-xl text-lg text-tinta-suave">
          Mantenemos tus equipos, creamos tu página web y desarrollamos las apps
          de tu empresa. Todo queda a tu nombre: el código, los datos y el
          control.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#contacto"
            className="rounded-lg bg-naranja px-5 py-3 font-semibold text-white hover:bg-naranja-hover"
          >
            Cuéntanos qué necesitas
          </Link>
          <Link
            href="#servicios"
            className="rounded-lg border border-linea bg-superficie px-5 py-3 font-semibold hover:border-tinta-suave"
          >
            Ver servicios
          </Link>
        </div>
      </div>

      {/* La guía pide la versión en negativo sobre fondos oscuros */}
      <div className="mx-auto w-48 sm:w-64 md:w-full md:max-w-sm">
        <Image
          src="/logo/lymunart-logo.svg"
          alt="Logo de LymunArt: una luna creciente junto a cinco edificios"
          width={590}
          height={695}
          priority
          className="w-full dark:hidden"
        />
        <Image
          src="/logo/lymunart-logo-negativo.svg"
          alt="Logo de LymunArt: una luna creciente junto a cinco edificios"
          width={590}
          height={695}
          priority
          className="hidden w-full dark:block"
        />
      </div>
    </section>
  );
}
