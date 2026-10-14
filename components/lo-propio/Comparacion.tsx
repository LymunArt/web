import { comparacion } from "@/lib/lo-propio";

function Equis() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" className="stroke-linea" strokeWidth="2" />
      <path d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6" className="stroke-tinta-suave" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Visto() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" className="fill-naranja" />
      <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dos columnas: lo que pasa con un proveedor y lo que pasa con LymunArt.
// En celular cada fila se apila: primero el problema, luego la respuesta.
export default function Comparacion() {
  return (
    <div className="overflow-hidden rounded-2xl bg-superficie text-tinta shadow-[0_12px_32px_-16px] shadow-cielo-tinta/30 dark:shadow-black/50">
      <div className="hidden grid-cols-2 text-sm font-semibold sm:grid">
        <p className="px-7 pt-6 pb-4 text-tinta-suave">Con un proveedor</p>
        <p className="bg-cielo/20 px-7 pt-6 pb-4 dark:bg-cielo/8">
          Con Lymun<span className="text-naranja">Art</span>
        </p>
      </div>
      <ul>
        {comparacion.map((fila) => (
          <li key={fila.propio} className="grid border-t border-linea first:border-t-0 sm:grid-cols-2 sm:first:border-t">
            <p className="flex gap-3 px-6 pt-5 pb-2 text-tinta-suave sm:px-7 sm:py-5">
              <Equis />
              <span>
                <span className="sr-only">Con un proveedor: </span>
                {fila.proveedor}
              </span>
            </p>
            <p className="flex gap-3 px-6 pt-2 pb-5 font-medium sm:bg-cielo/20 sm:px-7 sm:py-5 sm:dark:bg-cielo/8">
              <Visto />
              <span>
                <span className="sr-only">Con LymunArt: </span>
                {fila.propio}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
