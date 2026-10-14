"use client";

// Cambia entre modo claro y oscuro y recuerda la elección en este navegador.
// El ícono no usa estado de React: el CSS muestra la luna en modo claro y el sol en modo oscuro,
// así el botón se ve bien desde el primer momento, sin esperar a que cargue JavaScript.
export default function BotonTema() {
  function cambiarTema() {
    const html = document.documentElement;
    const nuevo = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", nuevo);
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      // Si el navegador no deja guardar (modo privado), el cambio vale solo para esta visita.
    }
  }

  return (
    <button
      type="button"
      onClick={cambiarTema}
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar entre modo claro y oscuro"
      className="flex size-10 items-center justify-center rounded-lg border border-linea text-tinta-suave hover:border-tinta-suave hover:text-tinta"
    >
      {/* Luna: se ve en modo claro (invita a pasar a oscuro) */}
      <svg viewBox="0 0 24 24" className="size-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
      {/* Sol: se ve en modo oscuro (invita a pasar a claro) */}
      <svg viewBox="0 0 24 24" className="hidden size-5 dark:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
