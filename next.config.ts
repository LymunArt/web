import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Sin el indicador "N" de Next.js en desarrollo; los errores se siguen mostrando
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // La app de finanzas no se deja incrustar en otras páginas ni filtra su dirección a otros sitios
  async headers() {
    return [
      {
        source: "/finanzas/:ruta*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  // Tailwind se procesa con PostCSS (postcss.config.mjs). El cargador @tailwindcss/turbopack
  // guardaba en caché la primera versión de globals.css y no veía los cambios posteriores.
};

export default nextConfig;
