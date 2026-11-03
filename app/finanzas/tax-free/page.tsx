import TaxFree from "@/components/finanzas/TaxFree";

export const metadata = { title: "Tax free · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <TaxFree />;
}
