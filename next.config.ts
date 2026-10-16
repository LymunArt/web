import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Sin el indicador "N" de Next.js en desarrollo; los errores se siguen mostrando
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind se procesa con PostCSS (postcss.config.mjs). El cargador @tailwindcss/turbopack
  // guardaba en caché la primera versión de globals.css y no veía los cambios posteriores.
};

export default nextConfig;
