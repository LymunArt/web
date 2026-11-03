import Cuentas from "@/components/finanzas/Cuentas";

export const metadata = { title: "Cuentas · Finanzas" };

// El contenido depende de la sesión de cada persona, que solo se conoce ya en el navegador
export const instant = false;

export default function Pagina() {
  return <Cuentas />;
}
