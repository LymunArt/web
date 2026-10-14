import Link from "next/link";
import { serviciosDelClienteActual } from "@/lib/acceso-dev";
import Navegacion from "./Navegacion";

export default function Encabezado() {
  return (
    <header className="encabezado sticky top-0 z-20 border-b border-linea bg-fondo/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        {/* En el encabezado va el nombre, no el logo: la guía pide mínimo 64 px para el logo */}
        <Link href="/" className="font-titulo text-lg font-bold tracking-[-0.01em]">
          Lymun<span className="text-naranja">Art</span>
        </Link>
        <Navegacion servicios={serviciosDelClienteActual()} />
      </div>
    </header>
  );
}
