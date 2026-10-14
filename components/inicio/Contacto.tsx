// Fase 1: los canales todavía no están activos.
// El asistente de IA llega en la fase 3 y WhatsApp cuando haya número de empresa.
const canales = [
  {
    titulo: "Asistente LymunArt",
    texto: "Cuéntale tu idea a cualquier hora. Te hará las preguntas necesarias y nos pasará tu solicitud.",
    estilo: "bg-lila text-lila-tinta",
  },
  {
    titulo: "WhatsApp",
    texto: "Escríbenos directamente para hablar de tu proyecto con una persona.",
    estilo: "bg-cielo text-cielo-tinta",
  },
];

export default function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-20 border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 className="font-titulo text-3xl font-semibold sm:text-4xl">Hablemos de tu proyecto</h2>
          <p className="text-lg text-tinta-suave">
            Estamos preparando nuestros canales de atención. Muy pronto podrás
            escribirnos por aquí.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {canales.map((canal) => (
            <article key={canal.titulo} className={`flex flex-col gap-3 rounded-2xl p-6 ${canal.estilo}`}>
              <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                Próximamente
              </span>
              <h3 className="font-titulo text-xl font-semibold">{canal.titulo}</h3>
              <p>{canal.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
