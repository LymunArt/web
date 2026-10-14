import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// LymunArt Dev tiene su propia identidad: negro, vinotinto y blanco, siempre oscuro.
// Su navbar y su footer llevan de vuelta a LymunArt.
function Volver({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-1.5 rounded-lg text-sm font-medium text-dev-texto transition-colors duration-200 hover:text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 ease-(--salida) group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      Volver a LymunArt
    </Link>
  );
}

export default function LayoutDev({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-black text-white [color-scheme:dark] selection:bg-vino selection:text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dev" className="font-titulo text-lg font-bold tracking-[-0.01em]">
            LymunArt <span className="text-dev-texto">Dev</span>
          </Link>
          <Volver />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-4 py-10 sm:px-6">
          <div className="flex items-end gap-4">
            <Image src="/logo/lymunart-dev-logo.svg" alt="Logo de LymunArt Dev" width={64} height={75} />
            <div>
              <p className="font-titulo text-lg font-bold">
                LymunArt <span className="text-dev-texto">Dev</span>
              </p>
              <p className="text-sm text-dev-texto">Para clientes especiales de LymunArt</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <Volver />
            <p className="text-dev-texto/70">© 2026 LymunArt</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
