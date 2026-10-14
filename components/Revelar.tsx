"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Aparece suave cuando entra en pantalla. Sin JavaScript, o si ya estaba a la vista al cargar,
// el contenido se ve desde el principio: solo se oculta lo que todavía está más abajo.
// Al quedar "visible" también arrancan las animaciones de adentro (por ejemplo, las escenas de servicios).
export default function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el || !("IntersectionObserver" in window)) return;
    // Lo que ya está a la vista no se oculta; solo arranca sus animaciones internas.
    if (el.getBoundingClientRect().top < innerHeight) {
      el.dataset.revelar = "visible";
      return;
    }

    el.dataset.revelar = "oculto";
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.revelar = "visible";
        observador.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caja} data-revelar="" className={className}>
      {children}
    </div>
  );
}
