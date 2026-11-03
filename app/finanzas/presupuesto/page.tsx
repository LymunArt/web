import Presupuesto from "@/components/finanzas/Presupuesto";

export const metadata = { title: "Presupuesto · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Presupuesto />;
}
