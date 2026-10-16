import Image from "next/image";
import Link from "next/link";
import { enlaceContacto, enlacesPrincipales } from "@/lib/navegacion";
import { redes } from "@/lib/redes";

const enlaceFooter =
  "text-tinta-suave underline decoration-transparent decoration-2 underline-offset-[0.3em] transition-[color,text-decoration-color] duration-200 hover:text-tinta hover:decoration-cielo";

export default function PiePagina() {
  return (
    <footer className="border-t border-linea">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex items-end gap-4">
          {/* La guía pide mínimo 64 px para el logo y la versión negativa sobre fondo oscuro */}
          <Image src="/logo/lymunart-logo.svg" alt="Logo de LymunArt" width={64} height={75} className="dark:hidden" />
          <Image src="/logo/lymunart-logo-negativo.svg" alt="Logo de LymunArt" width={64} height={75} className="hidden dark:block" />
          <div>
            <p className="font-titulo text-xl font-bold tracking-[-0.01em]">
              Lymun<span className="text-naranja">Art</span>
            </p>
            <p className="text-sm text-tinta-suave">No hay nada mejor que lo propio</p>
          </div>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="mb-4 text-sm font-semibold">Sitio</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[...enlacesPrincipales, { href: enlaceContacto.href, texto: "Contacto" }].map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className={enlaceFooter}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold">Para clientes</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/dev" className={enlaceFooter}>
                LymunArt Dev
              </Link>
            </li>
          </ul>
          {redes.length > 0 && (
            <>
              <h2 className="mt-8 mb-4 text-sm font-semibold">Síguenos</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {redes.map((red) => (
                  <li key={red.href}>
                    <a href={red.href} target="_blank" rel="noopener noreferrer" className={enlaceFooter}>
                      {red.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* La matrícula da confianza: cualquiera puede verificarla en el RUES */}
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 border-t border-linea px-4 py-6 text-sm text-tinta-suave sm:px-6">
        <p>© 2026 LymunArt</p>
        <p>
          Matrícula mercantil n.º{" "}
          <a
            href="https://www.rues.org.co/buscar/RM/LymunArt"
            target="_blank"
            rel="noopener noreferrer"
            className="tabular-nums underline decoration-cielo decoration-2 transition-[color] duration-200 hover:text-tinta"
          >
            4167058
          </a>{" "}
          · Cámara de Comercio de Bogotá
        </p>
      </div>
    </footer>
  );
}
