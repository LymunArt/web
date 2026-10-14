import type { ReactNode } from "react";
import Encabezado from "@/components/Encabezado";
import PiePagina from "@/components/PiePagina";

// Encabezado y pie de LymunArt para la landing y sus páginas.
// LymunArt Dev (app/dev) queda fuera de este grupo: tiene su propio navbar y footer.
export default function LayoutSitio({ children }: { children: ReactNode }) {
  return (
    <>
      <Encabezado />
      <main className="flex-1">{children}</main>
      <PiePagina />
    </>
  );
}
