// Clientes y testimonios REALES de LymunArt. Nunca inventados.
// Mientras no haya casos, la sección no aparece en la web.
//
// Cada caso es un trabajo entregado, con permiso del cliente para mostrarlo.
// - marcas: las empresas del cliente que usan el trabajo, con logo opcional en public/clientes/.
// - capturas: opcionales; nunca con datos reales de terceros (nombres, teléfonos, cifras privadas).
// - testimonio: solo con las palabras textuales del cliente y su permiso.

export type Marca = {
  nombre: string;
  descripcion: string;
  logo?: string;
};

export type Captura = {
  src: string;
  alt: string;
  etiqueta: string;
  ancho: number;
  alto: number;
};

export type Testimonio = {
  cita: string;
  nombre: string;
  cargo?: string;
};

export type Caso = {
  cliente: string;
  marcas: Marca[];
  proyecto: string;
  resumen: string;
  incluye: string[];
  capturas?: Captura[];
  testimonio?: Testimonio;
};

export const casos: Caso[] = [
  {
    // Permiso de Leo para mostrar MOVE y PhisioCare, y su testimonio, confirmado el 16/10/2026.
    cliente: "Leo Camacho",
    marcas: [
      { nombre: "MOVE", descripcion: "Fisioterapia a domicilio en Bogotá", logo: "/clientes/move-logo.jpg" },
      { nombre: "PhisioCare", descripcion: "Fisioterapia y bienestar corporal", logo: "/clientes/phisiocare-logo.jpg" },
    ],
    proyecto: "MOVE Control",
    resumen:
      "Un solo sistema propio para sus dos empresas. Leo ve una sola agenda y una sola ruta del día para las dos; cada empresa conserva su marca, sus pacientes y su contabilidad, con una vista que las consolida, y su equipo entra solo a lo que le corresponde. Lo usa en su trabajo desde septiembre de 2026, y las cuentas, el código y los datos están a nombre de sus empresas.",
    incluye: ["Agenda y ruta unificadas", "Pacientes", "Pagos", "Finanzas por empresa", "Acceso para su equipo"],
    // Capturas con las cifras difuminadas: la misma pantalla de Finanzas con la marca de cada empresa.
    capturas: [
      {
        src: "/clientes/move-finanzas.jpg",
        alt: "Pantalla de finanzas de MOVE en MOVE Control, en morado, con las cifras difuminadas",
        etiqueta: "MOVE",
        ancho: 694,
        alto: 470,
      },
      {
        src: "/clientes/phisiocare-finanzas.jpg",
        alt: "La misma pantalla de finanzas para PhisioCare, en marfil y dorado, con las cifras difuminadas",
        etiqueta: "PhisioCare",
        ancho: 694,
        alto: 470,
      },
    ],
    testimonio: {
      cita: "Ha facilitado más aún el control que tengo de mi contabilidad y veo la posibilidad de seguir mejorando mis sistemas con LymunArt.",
      nombre: "Leo Camacho",
      cargo: "MOVE y PhisioCare",
    },
  },
];
