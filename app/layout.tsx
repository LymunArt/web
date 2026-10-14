import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

// Fuentes de la guía de marca: Sora (títulos) e Inter (texto), en todo el sitio, incluido LymunArt Dev
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LymunArt · Soluciones tecnológicas",
    template: "%s · LymunArt",
  },
  description:
    "Mantenimiento de equipos, páginas web, apps y automatización para que tu empresa tenga su propia tecnología. No hay nada mejor que lo propio.",
};

// Se ejecuta antes de pintar la página: aplica el tema guardado o, si no hay, el del computador.
// Así no hay un "parpadeo" de tema claro al cargar en modo oscuro.
const scriptTema = `(function(){try{
var d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");
function aplicar(){var t=localStorage.getItem("tema");d.setAttribute("data-theme",t||(m.matches?"dark":"light"))}
aplicar();m.addEventListener("change",aplicar);
}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
