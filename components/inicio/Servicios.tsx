const servicios = [
  {
    titulo: "Mantenimiento de equipos",
    descripcion:
      "Revisamos, limpiamos y optimizamos tus computadores para que trabajen sin interrupciones.",
    incluye: ["Limpieza física y de software", "Respaldo de tu información", "Diagnóstico y reparación"],
    color: "bg-cielo text-cielo-tinta",
  },
  {
    titulo: "Páginas web",
    descripcion:
      "Tu negocio en internet con una página rápida, fácil de encontrar en Google y que tú puedes actualizar.",
    incluye: ["Diseño con tu marca", "Adaptada a celulares", "Dominio a tu nombre"],
    color: "bg-lila text-lila-tinta",
  },
  {
    titulo: "Apps móviles",
    descripcion:
      "Aplicaciones para Play Store y App Store hechas a la medida de cómo trabaja tu empresa.",
    incluye: ["Android y iPhone", "Publicación en las tiendas", "Control total de tus datos"],
    color: "bg-naranja-claro text-naranja-hover",
  },
  {
    titulo: "Automatización",
    descripcion:
      "Lo que hoy haces a mano en hojas de cálculo, hecho solo: inventarios, citas, pedidos y reportes.",
    incluye: ["Menos trabajo repetitivo", "Menos errores", "Reportes al instante"],
    color: "bg-lila-claro text-lila-tinta",
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-20 border-t border-linea">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 className="font-titulo text-3xl font-semibold sm:text-4xl">
            Lo que hacemos por tu empresa
          </h2>
          <p className="text-lg text-tinta-suave">
            Desde el computador de la oficina hasta la app con la que manejas tu
            negocio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {servicios.map((servicio) => (
            <article
              key={servicio.titulo}
              className="flex flex-col gap-4 rounded-2xl border border-linea bg-superficie p-6"
            >
              <h3 className="font-titulo text-xl font-semibold">{servicio.titulo}</h3>
              <p className="text-tinta-suave">{servicio.descripcion}</p>
              <ul className="flex flex-wrap gap-2">
                {servicio.incluye.map((item) => (
                  <li key={item} className={`rounded-full px-3 py-1 text-sm ${servicio.color}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
