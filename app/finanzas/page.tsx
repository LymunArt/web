import Inicio from "@/components/finanzas/Inicio";

export const metadata = { title: "Inicio · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Inicio />;
}
