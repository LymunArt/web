import Conexiones from "@/components/finanzas/Conexiones";

export const metadata = { title: "Conexiones · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Conexiones />;
}
