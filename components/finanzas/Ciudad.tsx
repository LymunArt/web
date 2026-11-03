// La luna y los cinco edificios del logo. Cada edificio se llena de naranja a medida que pagas tus deudas:
// lo que ya pagaste es lo que ya es tuyo.
const EDIFICIOS = [
  { x: 547, y: 490, ancho: 46 },
  { x: 602, y: 430, ancho: 54 },
  { x: 662, y: 557, ancho: 22 },
  { x: 690, y: 442, ancho: 56 },
  { x: 767, y: 362, ancho: 86 },
];
const PISO = 812;

export default function Ciudad({ proporcion, className = "" }: { proporcion: number; className?: string }) {
  const p = Math.max(0, Math.min(1, proporcion));
  return (
    <svg viewBox="310 160 590 660" className={className} aria-hidden="true">
      <path d="M695,170 A352,352 0 0 0 493,810 L665,810 C570,780 525,640 530,490 C535,370 600,250 695,170 Z" className="fill-cielo dark:fill-cielo/80" />
      {EDIFICIOS.map((e, i) => {
        const relleno = Math.max(0, Math.min(1, p * EDIFICIOS.length - i));
        const alto = PISO - e.y;
        return (
          <g key={e.x}>
            <rect x={e.x} y={e.y} width={e.ancho} height={alto} className="fill-tinta/15" />
            <rect
              x={e.x}
              y={e.y}
              width={e.ancho}
              height={alto}
              style={{ scale: `1 ${relleno}`, transitionDelay: `${i * 90}ms` }}
              className="ciudad-relleno fill-naranja"
            />
          </g>
        );
      })}
    </svg>
  );
}
