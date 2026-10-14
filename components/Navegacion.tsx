"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { enlaceContacto, enlacesPrincipales } from "@/lib/navegacion";
import BotonAccesoDev from "./BotonAccesoDev";
import BotonTema from "./BotonTema";

// Menú del encabezado: lista en computador y panel desplegable en celular.
// `servicios`: servicios completados del cliente reconocido (null si nadie ha iniciado sesión).
export default function Navegacion({ servicios }: { servicios: number | null }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  // Al cambiar de página el menú se cierra solo.
  const [rutaAnterior, setRutaAnterior] = useState(ruta);
  if (ruta !== rutaAnterior) {
    setRutaAnterior(ruta);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;

    // Mientras el menú está abierto, la página de atrás no se desplaza.
    const html = document.documentElement;
    html.style.overflow = "hidden";

    function alPresionar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    }
    // Si la pantalla crece hasta computador, el panel ya no hace falta.
    const computador = matchMedia("(min-width: 48rem)");
    function alCrecer() {
      if (computador.matches) setAbierto(false);
    }

    document.addEventListener("keydown", alPresionar);
    computador.addEventListener("change", alCrecer);
    return () => {
      html.style.overflow = "";
      document.removeEventListener("keydown", alPresionar);
      computador.removeEventListener("change", alCrecer);
    };
  }, [abierto]);

  const esActual = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <>
      <nav aria-label="Principal" className="ml-auto hidden md:block">
        <ul className="flex gap-1 text-sm">
          {enlacesPrincipales.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                aria-current={esActual(enlace.href) ? "page" : undefined}
                className="rounded-md px-3 py-2 text-tinta-suave underline decoration-transparent decoration-2 transition-[color,text-decoration-color] duration-200 hover:text-tinta hover:decoration-cielo aria-[current=page]:text-tinta aria-[current=page]:decoration-cielo"
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-2 md:ml-2">
        <BotonAccesoDev servicios={servicios} />
        <BotonTema />
        <Link
          href={enlaceContacto.href}
          className="hidden rounded-lg bg-naranja px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,scale] duration-100 hover:bg-naranja-hover active:scale-[0.97] sm:block"
        >
          {enlaceContacto.texto}
        </Link>
        <button
          ref={boton}
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className="relative flex size-10 items-center justify-center rounded-lg border border-linea text-tinta transition-[scale] duration-100 active:scale-[0.94] md:hidden"
        >
          {/* Dos líneas que se cruzan en una X al abrir */}
          <span
            aria-hidden="true"
            className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-(--salida) ${
              abierto ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-(--salida) ${
              abierto ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </button>
      </div>

      {/* Panel del celular: baja desde el encabezado y vuelve a subir por el mismo camino.
          El encabezado usa backdrop-filter, que vuelve "fixed" relativo a él: por eso la altura va explícita. */}
      <div
        id="menu-movil"
        inert={!abierto}
        className={`fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] origin-top bg-fondo transition-[opacity,translate,filter,visibility] duration-300 ease-(--salida) motion-reduce:transition-[opacity,visibility] md:hidden ${
          abierto
            ? "visible translate-y-0 opacity-100 blur-none"
            : "invisible -translate-y-2 opacity-0 blur-[2px]"
        }`}
      >
        <nav aria-label="Principal" className="flex h-full flex-col px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
          <ul>
            {enlacesPrincipales.map((enlace, i) => (
              <li
                key={enlace.href}
                style={{ transitionDelay: abierto ? `${60 + i * 40}ms` : "0ms" }}
                className={`border-b border-linea transition-[opacity,translate] duration-500 ease-(--salida) motion-reduce:transition-opacity ${
                  abierto ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
                }`}
              >
                <Link
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  aria-current={esActual(enlace.href) ? "page" : undefined}
                  className="group flex items-center justify-between py-4 font-titulo text-2xl font-semibold tracking-[-0.02em] active:opacity-60"
                >
                  <span className="underline decoration-transparent decoration-[3px] underline-offset-[0.3em] group-aria-[current=page]:decoration-cielo">
                    {enlace.texto}
                  </span>
                  <svg viewBox="0 0 24 24" className="size-5 text-tinta-suave" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <BotonAccesoDev servicios={servicios} enPanel />
            <Link
              href={enlaceContacto.href}
              onClick={() => setAbierto(false)}
              className="rounded-xl bg-naranja px-5 py-4 text-center font-semibold text-white transition-[background-color,scale] duration-100 hover:bg-naranja-hover active:scale-[0.98]"
            >
              {enlaceContacto.texto}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
