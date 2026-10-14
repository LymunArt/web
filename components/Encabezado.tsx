import Link from "next/link";
import BotonTema from "./BotonTema";

const enlaces = [
  { href: "#servicios", texto: "Servicios" },
  { href: "#lo-propio", texto: "Lo propio" },
  { href: "#como-trabajamos", texto: "Cómo trabajamos" },
  { href: "/dev", texto: "LymunArt Dev" },
];

export default function Encabezado() {
  return (
    <header className="sticky top-0 z-10 border-b border-linea bg-fondo/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
        {/* En el encabezado va el nombre, no el logo: la guía pide mínimo 64 px para el logo */}
        <Link href="/" className="font-titulo text-lg font-bold">
          Lymun<span className="text-naranja">Art</span>
        </Link>

        <nav aria-label="Secciones" className="ml-auto hidden md:block">
          <ul className="flex gap-6 text-sm text-tinta-suave">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="hover:text-tinta">
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <BotonTema />
          <Link
            href="#contacto"
            className="rounded-lg bg-naranja px-4 py-2 text-sm font-semibold text-white hover:bg-naranja-hover"
          >
            Cuéntanos tu idea
          </Link>
        </div>
      </div>
    </header>
  );
}
