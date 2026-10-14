import { canales } from "@/lib/contacto";

function Icono({ id }: { id: (typeof canales)[number]["id"] }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {id === "asistente" ? (
        <>
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />
          <path d="M12 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />
          <path d="M9.2 8.8c.3-.5.9-.5 1.1 0l.6 1.3c.1.3 0 .6-.2.8l-.4.4a5 5 0 0 0 2.4 2.4l.4-.4c.2-.2.5-.3.8-.2l1.3.6c.5.2.5.8 0 1.1-.6.4-1.4.6-2.1.3a7.5 7.5 0 0 1-4.2-4.2c-.3-.7-.1-1.5.3-2.1Z" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

// Los canales de atención. Si un canal no está activo se muestra como "Próximamente", sin enlace.
// `sobreOscuro` adapta los colores a la franja oscura del cierre de la landing.
export default function Canales({ sobreOscuro = false }: { sobreOscuro?: boolean }) {
  const linea = sobreOscuro ? "border-white/15" : "border-linea";
  const suave = sobreOscuro ? "text-white/70" : "text-tinta-suave";

  return (
    <ul className={`border-t ${linea}`}>
      {canales.map((canal) => {
        const contenido = (
          <>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cielo text-tinta-fija">
              <Icono id={canal.id} />
            </span>
            <span className="flex flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-titulo text-lg font-semibold">{canal.titulo}</span>
                {!canal.activo && (
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${sobreOscuro ? "border-cielo/60 text-cielo" : "border-cielo bg-cielo/25"}`}>
                    Próximamente
                  </span>
                )}
              </span>
              <span className={suave}>{canal.texto}</span>
            </span>
          </>
        );
        return (
          <li key={canal.id} className={`border-b ${linea}`}>
            {canal.activo ? (
              <a href={canal.href} className="flex items-start gap-5 py-6 transition-opacity hover:opacity-80">
                {contenido}
              </a>
            ) : (
              <div className="flex items-start gap-5 py-6">{contenido}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
