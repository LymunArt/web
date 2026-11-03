import Deudas from "@/components/finanzas/Deudas";

export const metadata = { title: "Deudas · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Deudas />;
}
