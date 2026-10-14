const comparacion = [
  {
    proveedor: "Pagas cada mes por usar un sistema que no es tuyo.",
    propio: "Pagas por construirlo una vez, y queda a tu nombre.",
  },
  {
    proveedor: "Tus datos viven en los servidores de otra empresa.",
    propio: "Tus datos son tuyos y los llevas a donde quieras.",
  },
  {
    proveedor: "Si el proveedor sube precios o cierra, te quedas sin herramienta.",
    propio: "Tu sistema sigue funcionando, decida lo que decida otro.",
  },
  {
    proveedor: "El sistema es igual para todos sus clientes.",
    propio: "Se adapta a cómo trabaja tu empresa, no al revés.",
  },
];

export default function LoPropio() {
  return (
    <section id="lo-propio" className="scroll-mt-20 bg-cielo text-tinta-fija">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2 className="font-titulo text-3xl font-semibold sm:text-4xl">
            ¿Por qué tener lo propio?
          </h2>
          <p className="text-lg text-cielo-tinta">
            Dejar de depender de proveedores es tener más control sobre tu
            empresa.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cielo-tinta/15 bg-superficie text-tinta">
          <div className="hidden grid-cols-2 border-b border-linea text-sm font-semibold sm:grid">
            <p className="px-6 py-4 text-tinta-suave">Con un proveedor</p>
            <p className="px-6 py-4 text-naranja-hover dark:text-naranja">Con LymunArt</p>
          </div>
          {comparacion.map((fila) => (
            <div key={fila.propio} className="grid border-b border-linea last:border-b-0 sm:grid-cols-2">
              <p className="px-6 pt-4 text-tinta-suave line-through decoration-linea sm:py-4">
                {fila.proveedor}
              </p>
              <p className="px-6 pb-4 pt-1 font-medium sm:py-4">{fila.propio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
