import Link from "next/link";
import { estadoDev } from "@/lib/acceso-dev";

function Llave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="15" r="4" />
      <path d="M10.8 12.2L20 3M16 7l3 3M18.5 4.5l2 2" />
    </svg>
  );
}

// Aviso del encabezado para clientes reconocidos:
// - con 2 servicios, una nota de que les falta uno;
// - con 3 o más, el botón vinotinto que les da el acceso a LymunArt Dev.
// Sin cliente reconocido (null) o con menos de 2 servicios, no muestra nada.
export default function BotonAccesoDev({
  servicios,
  enPanel = false,
}: {
  servicios: number | null;
  enPanel?: boolean;
}) {
  if (servicios === null) return null;
  const estado = estadoDev(servicios);
  if (estado === "sin-acceso") return null;

  if (estado === "a-uno") {
    return (
      <p className={`items-center gap-2 text-sm text-tinta-suave ${enPanel ? "flex py-3" : "hidden lg:flex"}`}>
        <Llave className="size-4 text-vino dark:text-dev-texto" />
        Te falta un servicio para LymunArt Dev
      </p>
    );
  }

  return (
    <Link
      href="/dev"
      className={`acceso-dev items-center gap-2 rounded-xl bg-vino font-semibold text-white transition-[background-color,scale] duration-100 hover:bg-vino-hover active:scale-[0.97] dark:ring-1 dark:ring-white/15 ${
        enPanel ? "flex justify-center px-5 py-4" : "hidden px-4 py-2.5 text-sm lg:flex"
      }`}
    >
      <Llave className="size-4" />
      Ganaste tu acceso a LymunArt Dev
    </Link>
  );
}
