import Encabezado from "@/components/Encabezado";
import PiePagina from "@/components/PiePagina";
import AdelantoDev from "@/components/inicio/AdelantoDev";
import ComoTrabajamos from "@/components/inicio/ComoTrabajamos";
import Contacto from "@/components/inicio/Contacto";
import LoPropio from "@/components/inicio/LoPropio";
import Portada from "@/components/inicio/Portada";
import Servicios from "@/components/inicio/Servicios";

export default function Inicio() {
  return (
    <>
      <Encabezado />
      <main className="flex-1">
        <Portada />
        <Servicios />
        <LoPropio />
        <ComoTrabajamos />
        <AdelantoDev />
        <Contacto />
      </main>
      <PiePagina />
    </>
  );
}
