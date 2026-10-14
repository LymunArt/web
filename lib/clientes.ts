// Clientes y testimonios REALES de LymunArt. Nunca inventados.
// Mientras las dos listas estén vacías, la sección no aparece en la web.
//
// Para agregar un cliente:
//   { nombre: "Ferretería El Tornillo", logo: "/clientes/el-tornillo.svg", sitio: "https://..." }
//   El logo es opcional: va en public/clientes/. Sin logo se muestra el nombre.
//
// Para agregar un testimonio (solo con permiso del cliente para publicarlo):
//   { cita: "...", nombre: "Ana Pérez", cargo: "Gerente", empresa: "Ferretería El Tornillo" }

export type Cliente = {
  nombre: string;
  logo?: string;
  sitio?: string;
};

export type Testimonio = {
  cita: string;
  nombre: string;
  cargo?: string;
  empresa: string;
  foto?: string;
};

export const clientes: Cliente[] = [];

export const testimonios: Testimonio[] = [];
