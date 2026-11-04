import { Suspense } from "react";
import Movimientos from "@/components/finanzas/Movimientos";

export const metadata = { title: "Movimientos · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  // Movimientos lee los filtros de la URL (?cuenta=…), que solo se conocen en el navegador
  return (
    <Suspense>
      <Movimientos />
    </Suspense>
  );
}
