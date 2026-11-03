import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Marco from "@/components/finanzas/Marco";

export const metadata: Metadata = {
  title: "Finanzas",
  description: "Tus ingresos, gastos, deudas y proyectos en un solo lugar.",
  // Es una app privada: no debe aparecer en buscadores
  robots: { index: false, follow: false },
  // Se puede instalar en el celular como una app
  manifest: "/finanzas/manifest.webmanifest",
  icons: { apple: "/finanzas/icono-apple-180.png" },
  appleWebApp: { capable: true, title: "Finanzas", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#16141F" },
  ],
};

export default function LayoutFinanzas({ children }: { children: ReactNode }) {
  return <Marco>{children}</Marco>;
}
