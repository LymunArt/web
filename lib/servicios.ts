// Los cuatro servicios de LymunArt. La landing muestra el resumen y /servicios el detalle.
export const servicios = [
  {
    id: "mantenimiento",
    titulo: "Mantenimiento de equipos",
    descripcion:
      "Revisamos, limpiamos y optimizamos tus computadores para que trabajen sin interrupciones.",
    incluye: ["Limpieza física y de software", "Respaldo de tu información", "Diagnóstico y reparación"],
  },
  {
    id: "paginas-web",
    titulo: "Páginas web",
    descripcion:
      "Tu negocio en internet con una página rápida, fácil de encontrar en Google y que tú puedes actualizar.",
    incluye: ["Diseño con tu marca", "Adaptada a celulares", "Dominio a tu nombre"],
  },
  {
    id: "apps",
    titulo: "Apps móviles",
    descripcion:
      "Aplicaciones para Play Store y App Store hechas a la medida de cómo trabaja tu empresa.",
    incluye: ["Android y iPhone", "Publicación en las tiendas", "Control total de tus datos"],
  },
  {
    id: "automatizacion",
    titulo: "Automatización",
    descripcion:
      "Lo que hoy haces a mano en hojas de cálculo, hecho solo: inventarios, citas, pedidos y reportes.",
    incluye: ["Menos trabajo repetitivo", "Menos errores", "Reportes al instante"],
  },
] as const;

export type IdServicio = (typeof servicios)[number]["id"];
