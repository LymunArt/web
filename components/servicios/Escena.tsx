import type { CSSProperties, JSX } from "react";
import type { IdServicio } from "@/lib/servicios";

// Una escena vectorial por servicio. Las piezas se arman al entrar en pantalla
// (las animaciones viven en globals.css, bajo ".escena"). Sin JavaScript o con
// movimiento reducido se ve la escena terminada.
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const trazo = "stroke-tinta";
const marco = `fill-superficie ${trazo}`;

function Mantenimiento() {
  return (
    <>
      {/* Monitor */}
      <rect x="70" y="26" width="180" height="118" rx="10" className={marco} strokeWidth="2.5" />
      <rect x="82" y="38" width="156" height="94" rx="4" className="fill-fondo" />
      <path d="M146 144h28l5 20h-38z" className={marco} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M124 166h72" className={trazo} strokeWidth="2.5" strokeLinecap="round" />
      {/* Revisión: tres puntos que quedan listos */}
      {[60, 85, 110].map((y, i) => (
        <g key={y}>
          <rect x="112" y={y - 4} width="104" height="8" rx="4" className="e-crece-x fill-cielo" style={d(350 + i * 170)} />
          <g className="e-escala" style={d(520 + i * 170)}>
            <circle cx="98" cy={y} r="7" className="fill-naranja" />
            <path d={`M94.5 ${y}l2.5 2.5 4.5-5`} className="stroke-white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      ))}
      {/* Barrido del diagnóstico */}
      <rect x="82" y="38" width="156" height="3" className="e-barrido fill-naranja opacity-0" style={d(0)} />
      {/* Destellos de limpio */}
      <path d="M262 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" className="e-escala fill-naranja" style={d(1050)} />
      <path d="M54 118l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" className="e-escala fill-cielo" style={d(1180)} />
    </>
  );
}

function PaginasWeb() {
  return (
    <>
      {/* Navegador */}
      <rect x="40" y="22" width="240" height="156" rx="10" className={marco} strokeWidth="2.5" />
      <path d="M40 46h240" className={trazo} strokeWidth="2.5" />
      {[56, 68, 80].map((x) => (
        <circle key={x} cx={x} cy="34" r="3.5" className="fill-linea" />
      ))}
      <rect x="98" y="28" width="124" height="12" rx="6" className="fill-fondo" />
      {/* La página se arma por bloques */}
      <rect x="56" y="60" width="122" height="12" rx="3" className="e-crece-x fill-tinta" style={d(150)} />
      <rect x="56" y="78" width="92" height="7" rx="3" className="e-crece-x fill-linea" style={d(260)} />
      <rect x="56" y="91" width="74" height="7" rx="3" className="e-crece-x fill-linea" style={d(330)} />
      <rect x="56" y="108" width="50" height="15" rx="5" className="e-escala fill-naranja" style={d(480)} />
      <rect x="194" y="60" width="70" height="63" rx="6" className="e-aparece fill-cielo" style={d(380)} />
      {[56, 126, 196].map((x, i) => (
        <rect key={x} x={x} y="136" width="68" height="30" rx="5" className="e-aparece fill-fondo stroke-linea" strokeWidth="2" style={d(560 + i * 90)} />
      ))}
      {/* Cursor que llega al botón */}
      <path
        d="M0 0v17l4.6-4.4 3.2 7 3-1.4-3.2-6.8H14z"
        transform="translate(96 114)"
        className="e-cursor fill-superficie stroke-tinta"
        strokeWidth="1.6"
        strokeLinejoin="round"
        style={d(800)}
      />
    </>
  );
}

function Apps() {
  const casillas = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const relleno = ["fill-naranja", "fill-cielo", "fill-fondo", "fill-cielo", "fill-fondo", "fill-naranja", "fill-fondo", "fill-naranja", "fill-cielo"];
  return (
    <>
      {/* Teléfono */}
      <rect x="112" y="12" width="86" height="176" rx="16" className={marco} strokeWidth="2.5" />
      <rect x="141" y="21" width="28" height="6" rx="3" className="fill-tinta" />
      {casillas.map((n) => (
        <rect
          key={n}
          x={125 + (n % 3) * 21}
          y={42 + Math.floor(n / 3) * 21}
          width="16"
          height="16"
          rx="4.5"
          className={`e-escala ${relleno[n]} ${relleno[n] === "fill-fondo" ? "stroke-linea" : ""}`}
          strokeWidth="1.5"
          style={d(140 + n * 55)}
        />
      ))}
      <rect x="125" y="114" width="58" height="7" rx="3" className="e-crece-x fill-linea" style={d(640)} />
      <rect x="125" y="127" width="40" height="7" rx="3" className="e-crece-x fill-linea" style={d(700)} />
      <rect x="135" y="172" width="40" height="4" rx="2" className="fill-tinta" />
      {/* Aviso que sale de la app */}
      <g className="e-desliza" style={d(900)}>
        <rect x="186" y="86" width="104" height="38" rx="9" className={marco} strokeWidth="2.5" />
        <circle cx="204" cy="105" r="8" className="fill-naranja" />
        <rect x="218" y="97" width="56" height="6" rx="3" className="fill-tinta" />
        <rect x="218" y="108" width="40" height="5" rx="2.5" className="fill-linea" />
      </g>
    </>
  );
}

function Automatizacion() {
  const barras = [
    { x: 202, h: 30, c: "fill-cielo" },
    { x: 226, h: 50, c: "fill-cielo" },
    { x: 250, h: 40, c: "fill-cielo" },
    { x: 274, h: 74, c: "fill-naranja" },
  ];
  return (
    <>
      {/* La hoja de cálculo de hoy */}
      <rect x="22" y="38" width="112" height="124" rx="8" className={marco} strokeWidth="2.5" />
      {[66, 90, 114, 138].map((y) => (
        <path key={y} d={`M22 ${y}h112`} className="stroke-linea" strokeWidth="2" />
      ))}
      <path d="M60 38v124" className="stroke-linea" strokeWidth="2" />
      <rect x="22" y="38" width="112" height="28" rx="8" className="fill-none stroke-tinta" strokeWidth="2.5" />
      {[74, 98, 122, 146].map((y, i) => (
        <rect key={y} x="70" y={y} width={[44, 30, 52, 36][i]} height="8" rx="3" className="e-crece-x fill-cielo" style={d(120 + i * 90)} />
      ))}
      {/* El flujo que lo hace solo */}
      <path d="M140 100h40" className="stroke-tinta" strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
      <circle cx="140" cy="100" r="5" className="e-viaja fill-naranja" style={d(500)} />
      {/* El reporte que sale al instante */}
      <rect x="186" y="38" width="112" height="124" rx="8" className={marco} strokeWidth="2.5" />
      <path d="M198 146h88" className={trazo} strokeWidth="2.5" strokeLinecap="round" />
      {barras.map((b, i) => (
        <rect key={b.x} x={b.x} y={146 - b.h} width="14" height={b.h} rx="3" className={`e-crece-y ${b.c}`} style={d(600 + i * 110)} />
      ))}
    </>
  );
}

const escenas: Record<IdServicio, () => JSX.Element> = {
  mantenimiento: Mantenimiento,
  "paginas-web": PaginasWeb,
  apps: Apps,
  automatizacion: Automatizacion,
};

export default function Escena({ id, className }: { id: IdServicio; className?: string }) {
  const Contenido = escenas[id];
  return (
    <svg viewBox="0 0 320 200" className={`escena ${className ?? ""}`} fill="none" aria-hidden="true">
      <Contenido />
    </svg>
  );
}
