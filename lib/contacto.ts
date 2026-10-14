// Canales de atención. Fase 1: todavía no están activos.
// El asistente de IA llega en la fase 3 y WhatsApp cuando haya número de empresa.
// Cuando un canal se active, ponle su enlace en `href` y cambia `activo` a true.
export const canales = [
  {
    id: "asistente",
    titulo: "Asistente LymunArt",
    texto: "Cuéntale tu idea a cualquier hora. Te hará las preguntas necesarias y nos pasará tu solicitud.",
    activo: false,
    href: "",
  },
  {
    id: "whatsapp",
    titulo: "WhatsApp",
    texto: "Escríbenos directamente para hablar de tu proyecto con una persona.",
    activo: false,
    href: "",
  },
] as const satisfies readonly { id: string; titulo: string; texto: string; activo: boolean; href: string }[];
