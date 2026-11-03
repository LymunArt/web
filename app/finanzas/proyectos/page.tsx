import Proyectos from "@/components/finanzas/Proyectos";

export const metadata = { title: "Proyectos · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Proyectos />;
}
