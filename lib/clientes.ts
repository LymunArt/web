// Clientes y testimonios REALES de LymunArt. Nunca inventados.
// Mientras no haya casos, la sección no aparece en la web.
//
// Cada caso es un trabajo entregado, con permiso del cliente para mostrarlo.
// - logo: opcional, en public/clientes/.
// - captura: opcional; nunca con datos reales de terceros (nombres, teléfonos, cifras privadas).
// - testimonio: solo con las palabras textuales del cliente y su permiso.

export type Testimonio = {
  cita: string;
  nombre: string;
  cargo?: string;
};

export type Caso = {
  cliente: string;
  descripcion: string;
  logo?: string;
  sitio?: string;
  proyecto: string;
  resumen: string;
  incluye: string[];
  captura?: { src: string; alt: string; ancho: number; alto: number };
  testimonio?: Testimonio;
};

export const casos: Caso[] = [
  {
    cliente: "MOVE",
    descripcion: "Fisioterapia a domicilio en Bogotá",
    logo: "/clientes/move-logo.jpg",
    proyecto: "MOVE Control",
    resumen:
      "Un sistema propio para manejar la agenda, los pacientes, las citas, los pagos y las finanzas del consultorio. Leo lo usa en su trabajo desde septiembre de 2026, y las cuentas, el código y los datos están a nombre de MOVE.",
    incluye: ["Agenda y citas", "Pacientes", "Pagos", "Finanzas"],
    // Permiso confirmado por Leo el 16/10/2026, con estas palabras.
    testimonio: {
      cita: "Ha facilitado más aún el control que tengo de mi contabilidad y veo la posibilidad de seguir mejorando mis sistemas con LymunArt.",
      nombre: "Leo Camacho",
      cargo: "MOVE",
    },
  },
];
