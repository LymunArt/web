// El cliente decide en cada paso; LymunArt propone y guía.
const pasos = [
  {
    titulo: "Nos cuentas",
    texto: "Nos explicas qué necesitas con tus palabras, sin términos técnicos.",
  },
  {
    titulo: "Te proponemos",
    texto: "Recibes una propuesta clara con tiempos y costos. Tú decides si seguimos.",
  },
  {
    titulo: "Construimos contigo",
    texto: "Te mostramos los avances y apruebas cada etapa antes de continuar.",
  },
  {
    titulo: "Te entregamos lo tuyo",
    texto: "El código, los datos y los accesos quedan a tu nombre.",
  },
];

export default function ComoTrabajamos() {
  return (
    <section id="como-trabajamos" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 className="font-titulo text-3xl font-semibold sm:text-4xl">Cómo trabajamos</h2>
          <p className="text-lg text-tinta-suave">
            Tú tienes la última palabra en cada paso. Nosotros nos encargamos de
            que todo funcione.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((paso, i) => (
            <li key={paso.titulo} className="flex flex-col gap-3 rounded-2xl border border-linea bg-superficie p-6">
              <span className="font-titulo text-3xl font-bold text-naranja">{i + 1}</span>
              <h3 className="font-titulo text-lg font-semibold">{paso.titulo}</h3>
              <p className="text-tinta-suave">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
