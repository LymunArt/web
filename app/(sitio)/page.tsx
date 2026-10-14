import Clientes from "@/components/inicio/Clientes";
import ComoTrabajamos from "@/components/inicio/ComoTrabajamos";
import Contacto from "@/components/inicio/Contacto";
import LoPropio from "@/components/inicio/LoPropio";
import Portada from "@/components/inicio/Portada";
import Servicios from "@/components/inicio/Servicios";

export default function Inicio() {
  return (
    <>
      <Portada />
      <Servicios />
      <LoPropio />
      <ComoTrabajamos />
      <Clientes />
      <Contacto />
    </>
  );
}
