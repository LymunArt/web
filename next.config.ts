import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind se procesa con PostCSS (postcss.config.mjs). El cargador @tailwindcss/turbopack
  // guardaba en caché la primera versión de globals.css y no veía los cambios posteriores.
};

export default nextConfig;
