"use client";

import { useCallback, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { moverMes, mesActual, nombreMes, numero } from "@/lib/finanzas/formato";

type Variante = "principal" | "pago" | "suave";

const estilosBoton: Record<Variante, string> = {
  principal: "bg-boton text-white hover:bg-boton-hover",
  // El lila de la guía está reservado para momentos de pago
  pago: "bg-lila text-tinta-fija hover:bg-[#A98BE4]",
  suave: "border border-linea text-tinta hover:border-tinta-suave",
};

export function Boton({ variante = "principal", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      type="button"
      {...props}
      className={`tactil inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${estilosBoton[variante]} ${className}`}
    />
  );
}

const estiloCampo =
  "min-h-11 w-full rounded-xl border border-linea bg-superficie px-3.5 py-2.5 text-base text-tinta placeholder:text-tinta-suave hover:border-tinta-suave";

export function Campo({ etiqueta, ayuda, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { etiqueta: string; ayuda?: string; error?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{etiqueta}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error || ayuda ? `${id}-nota` : undefined} {...props} className={`${estiloCampo} ${props.className ?? ""}`} />
      {(error || ayuda) && (
        <p id={`${id}-nota`} className={`text-sm ${error ? "font-medium text-boton-hover dark:text-naranja" : "text-tinta-suave"}`}>{error ?? ayuda}</p>
      )}
    </div>
  );
}

export function Selector({ etiqueta, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { etiqueta: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{etiqueta}</label>
      <select id={id} {...props} className={`${estiloCampo} ${props.className ?? ""}`}>{children}</select>
    </div>
  );
}

// Campo de plata: escribe solo dígitos y se formatea mientras escribes
// En pesos solo hay enteros; en otras monedas se aceptan centavos con coma ("120,50")
export function CampoMonto({ etiqueta, valor, onCambio, grande = false, autoFocus, moneda = "COP" }: { etiqueta: string; valor: number; onCambio: (n: number) => void; grande?: boolean; autoFocus?: boolean; moneda?: string }) {
  const id = useId();
  const [texto, setTexto] = useState<string | null>(null);
  const conDecimales = moneda !== "COP";
  const mostrado = texto ?? (valor ? (conDecimales ? valor.toLocaleString("es-CO", { maximumFractionDigits: 2 }) : numero(valor)) : "");

  function cambiar(entrada: string) {
    if (!conDecimales) return onCambio(Number(entrada.replace(/\D/g, "").slice(0, 12)));
    const [enteros = "", ...resto] = entrada.replace(/[^\d,]/g, "").split(",");
    const limpio = resto.length ? `${enteros.slice(0, 12)},${resto.join("").slice(0, 2)}` : enteros.slice(0, 12);
    setTexto(limpio);
    onCambio(Number(limpio.replace(",", ".")) || 0);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={grande ? "sr-only" : "text-sm font-semibold"}>{etiqueta}</label>
      <div className={grande ? "flex items-baseline justify-center gap-1 font-titulo font-semibold tracking-[-0.03em]" : "flex items-center rounded-xl border border-linea bg-superficie pl-3.5 hover:border-tinta-suave"}>
        <span aria-hidden="true" className={grande ? "text-3xl text-tinta-suave" : "text-tinta-suave"}>{conDecimales ? moneda : "$"}</span>
        <input
          id={id}
          inputMode={conDecimales ? "decimal" : "numeric"}
          autoComplete="off"
          data-autofoco={autoFocus ? "" : undefined}
          placeholder="0"
          value={mostrado}
          onChange={(e) => cambiar(e.target.value)}
          onBlur={() => setTexto(null)}
          className={
            grande
              ? "cifras max-w-full min-w-[1ch] bg-transparent text-left text-5xl outline-none placeholder:text-linea [field-sizing:content] sm:text-6xl"
              : "cifras min-h-11 w-full min-w-0 rounded-xl bg-transparent px-1.5 py-2.5 text-base outline-none"
          }
        />
      </div>
    </div>
  );
}

export function Segmentado<T extends string>({ etiqueta, opciones, valor, onCambio }: { etiqueta: string; opciones: { valor: T; nombre: string }[]; valor: T; onCambio: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="flex gap-1 rounded-xl bg-linea/60 p-1">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={o.valor === valor}
          onClick={() => onCambio(o.valor)}
          className={`tactil min-h-10 flex-1 rounded-lg px-2 text-sm font-semibold ${o.valor === valor ? "bg-superficie text-tinta shadow-[0_1px_3px_rgb(30_27_46/0.14)] dark:bg-white/15" : "text-tinta-suave hover:text-tinta"}`}
        >
          {o.nombre}
        </button>
      ))}
    </div>
  );
}

export function Pildoras({ etiqueta, opciones, valor, onCambio }: { etiqueta: string; opciones: readonly string[]; valor: string; onCambio: (v: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{etiqueta}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={o === valor}
            onClick={() => onCambio(o)}
            className={`tactil min-h-10 rounded-full border px-3.5 text-sm font-medium ${o === valor ? "border-cielo bg-cielo text-tinta-fija" : "border-linea text-tinta-suave hover:border-tinta-suave hover:text-tinta"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// Una sola proporción, en un solo tono. Con el aviso, el color nunca va solo: el texto siempre acompaña.
export function Avance({ proporcion, alerta = false, etiqueta }: { proporcion: number; alerta?: boolean; etiqueta: string }) {
  const p = Math.max(0, Math.min(1, proporcion));
  return (
    <div role="img" aria-label={etiqueta} className="h-2 w-full overflow-hidden rounded-full bg-linea">
      <div
        style={{ scale: `${p} 1` }}
        className={`barra-avance h-full w-full rounded-full ${alerta ? "bg-naranja" : "bg-cielo-tinta dark:bg-cielo"}`}
      />
    </div>
  );
}

export function SelectorMes({ mes, onCambio }: { mes: string; onCambio: (m: string) => void }) {
  const flecha = "tactil flex size-11 items-center justify-center rounded-lg text-tinta-suave hover:text-tinta disabled:opacity-30";
  return (
    <div className="flex items-center">
      <button type="button" aria-label="Mes anterior" onClick={() => onCambio(moverMes(mes, -1))} className={flecha}>
        <Icono d="M15 18l-6-6 6-6" />
      </button>
      <span aria-live="polite" className="min-w-36 text-center text-sm font-semibold capitalize">{nombreMes(mes)}</span>
      <button type="button" aria-label="Mes siguiente" disabled={mes >= mesActual()} onClick={() => onCambio(moverMes(mes, 1))} className={flecha}>
        <Icono d="M9 18l6-6-6-6" />
      </button>
    </div>
  );
}

export function Icono({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Titulo({ children, accion }: { children: ReactNode; accion?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <h1 className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-4xl">{children}</h1>
      {accion}
    </header>
  );
}

export function Subtitulo({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 font-titulo text-lg font-semibold tracking-[-0.015em]">{children}</h2>;
}

export function Vacio({ titulo, texto, accion }: { titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-linea p-7">
      <h2 className="font-titulo text-lg font-semibold tracking-[-0.015em]">{titulo}</h2>
      <p className="max-w-md text-tinta-suave">{texto}</p>
      {accion}
    </div>
  );
}

// Hoja inferior. Sigue al dedo 1:1, y al soltar proyecta el impulso para decidir si se cierra o vuelve.
export function Hoja({ titulo, onCerrar, children }: { titulo: string; onCerrar: () => void; children: (cerrar: () => void) => ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const arrastre = useRef<{ inicio: number; y: number; tiempo: number; velocidad: number } | null>(null);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    const hoja = ref.current;
    if (hoja && !hoja.open) {
      hoja.showModal();
      hoja.querySelector<HTMLElement>("[data-autofoco]")?.focus();
    }
  }, []);

  const cerrar = useCallback(() => {
    const hoja = ref.current;
    if (!hoja) return;
    hoja.removeAttribute("data-arrastrando");
    hoja.style.removeProperty("--y");
    setCerrando(true);
    const movimientoReducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onCerrar, movimientoReducido ? 200 : 300);
  }, [onCerrar]);

  function alPresionar(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { inicio: e.clientY, y: e.clientY, tiempo: e.timeStamp, velocidad: 0 };
    ref.current?.setAttribute("data-arrastrando", "");
  }

  function alMover(e: React.PointerEvent) {
    const a = arrastre.current;
    if (!a || !ref.current) return;
    const dt = e.timeStamp - a.tiempo;
    if (dt > 0) a.velocidad = ((e.clientY - a.y) / dt) * 1000;
    a.y = e.clientY;
    a.tiempo = e.timeStamp;
    const delta = e.clientY - a.inicio;
    // Hacia arriba no hay a dónde ir: resiste cada vez más en lugar de frenar en seco
    const y = delta >= 0 ? delta : (delta * 60 * 0.55) / (60 + 0.55 * Math.abs(delta));
    ref.current.style.setProperty("--y", `${y}px`);
  }

  function alSoltar(e: React.PointerEvent) {
    const a = arrastre.current;
    const hoja = ref.current;
    if (!a || !hoja) return;
    arrastre.current = null;
    const delta = e.clientY - a.inicio;
    const proyectado = delta + (a.velocidad / 1000) * (0.99 / 0.01);
    hoja.removeAttribute("data-arrastrando");
    if (proyectado > hoja.offsetHeight / 2) cerrar();
    else hoja.style.removeProperty("--y");
  }

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      data-cerrando={cerrando ? "" : undefined}
      className="hoja"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onClick={(e) => {
        if (e.target === ref.current) cerrar();
      }}
    >
      <div className="flex max-h-[92dvh] flex-col">
        <div onPointerDown={alPresionar} onPointerMove={alMover} onPointerUp={alSoltar} onPointerCancel={alSoltar} className="flex shrink-0 cursor-grab touch-none flex-col px-5 pt-2.5 active:cursor-grabbing">
          <span aria-hidden="true" className="mx-auto mb-2 h-1 w-9 rounded-full bg-linea" />
          <div className="flex min-h-11 items-center justify-between">
            <h2 className="font-titulo text-lg font-semibold tracking-[-0.015em]">{titulo}</h2>
            <button type="button" aria-label="Cerrar" onPointerDown={(e) => e.stopPropagation()} onClick={cerrar} className="tactil -mr-2 flex size-11 items-center justify-center rounded-lg text-tinta-suave hover:text-tinta">
              <Icono d="M18 6L6 18M6 6l12 12" />
            </button>
          </div>
        </div>
        {/* cerrar solo lee la referencia al usarse en un evento, nunca durante el render */}
        {/* eslint-disable-next-line react-hooks/refs */}
        <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">{children(cerrar)}</div>
      </div>
    </dialog>
  );
}
