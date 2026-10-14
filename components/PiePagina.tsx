import Image from "next/image";
import Link from "next/link";

export default function PiePagina() {
  return (
    <footer className="border-t border-linea">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4 py-10 sm:px-6">
        <div className="flex items-end gap-4">
          <Image src="/logo/lymunart-logo.svg" alt="Logo de LymunArt" width={64} height={75} className="dark:hidden" />
          <Image
            src="/logo/lymunart-logo-negativo.svg"
            alt="Logo de LymunArt"
            width={64}
            height={75}
            className="hidden dark:block"
          />
          <div>
            <p className="font-titulo text-lg font-bold">
              Lymun<span className="text-naranja">Art</span>
            </p>
            <p className="text-sm text-tinta-suave">No hay nada mejor que lo propio</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm text-tinta-suave sm:items-end">
          <Link href="/dev" className="hover:text-tinta">
            LymunArt Dev
          </Link>
          <p>© 2026 LymunArt</p>
        </div>
      </div>
    </footer>
  );
}
