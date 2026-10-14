import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import Revelar from "@/components/Revelar";

export const metadata: Metadata = {
  title: "LymunArt Dev",
  description:
    "Desarrollo a la medida para clientes especiales de LymunArt, con atención directa y prioridad en cada entrega.",
};

// LymunArt Dev: solo negro, vinotinto y blanco. Títulos en Sora, texto en Inter, trato de "tú".
const beneficios = [
  {
    titulo: "Atención directa",
    texto: "Trabajas directamente con el fundador de LymunArt, sin intermediarios.",
  },
  {
    titulo: "Prioridad en cada entrega",
    texto: "Tus proyectos pasan primero en la agenda de desarrollo.",
  },
  {
    titulo: "Sistemas a la medida",
    texto: "Plataformas, aplicaciones y automatizaciones diseñadas alrededor de tu empresa.",
  },
  {
    titulo: "Acompañamiento continuo",
    texto: "Después de la entrega seguimos a tu lado para ajustar y mejorar lo que necesites.",
  },
];

// El camino hacia Dev: con el segundo servicio te avisamos, con el tercero se activa.
const camino = [
  { titulo: "Servicio 1", nota: "Empiezas con nosotros" },
  { titulo: "Servicio 2", nota: "Te avisamos que estás a uno" },
  { titulo: "Servicio 3", nota: "Se activa tu acceso a Dev" },
];

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Dev() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 md:grid-cols-[1fr_auto] md:pt-24 md:pb-28">
        <div className="flex flex-col gap-6">
          <h1 className="entrada font-titulo text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.035em]">
            Desarrollo a la medida
          </h1>
          <p style={retraso(140)} className="entrada max-w-xl text-lg leading-relaxed text-dev-texto sm:text-xl">
            LymunArt Dev es el área exclusiva para quienes ya han confiado en
            nosotros. Tu aplicación será tuya: el código, los datos y el dominio.
          </p>
        </div>
        <Image
          src="/logo/lymunart-dev-logo.svg"
          alt="Logo de LymunArt Dev"
          width={590}
          height={695}
          loading="eager"
          style={retraso(120)}
          className="entrada mx-auto w-40 sm:w-52"
        />
      </section>

      <section aria-labelledby="titulo-incluye" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        <Revelar>
          <h2 id="titulo-incluye" className="mb-10 font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
            Qué incluye
          </h2>
        </Revelar>
        <Revelar>
          <ul className="grid gap-4 sm:grid-cols-2">
            {beneficios.map((beneficio) => (
              <li key={beneficio.titulo} className="flex flex-col gap-2 rounded-2xl bg-vino p-7">
                <h3 className="font-titulo text-xl font-semibold tracking-[-0.015em]">{beneficio.titulo}</h3>
                <p className="text-dev-texto">{beneficio.texto}</p>
              </li>
            ))}
          </ul>
        </Revelar>
      </section>

      <section aria-labelledby="titulo-acceder" className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:gap-16 md:py-28">
          <Revelar className="flex flex-col gap-5">
            <h2 id="titulo-acceder" className="font-titulo text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-[2.75rem]">
              Cómo acceder
            </h2>
            <p className="max-w-xl text-lg text-dev-texto">
              LymunArt Dev se activa automáticamente cuando completas tu tercer
              servicio con nosotros. Con el segundo te avisamos que estás a uno.
              Muy pronto podrás ingresar con tu cuenta para ver tus proyectos.
            </p>
            <span className="mt-1 w-fit rounded-full border border-white/40 px-4 py-2 text-sm">
              Acceso de clientes · próximamente
            </span>
          </Revelar>

          <Revelar className="self-center rounded-2xl bg-vino p-7 sm:p-9">
            <p className="mb-8 text-sm font-semibold text-dev-texto">Tu camino hacia LymunArt Dev</p>
            <ol className="grid grid-cols-3">
              {camino.map((paso, i) => {
                const ultimo = i === camino.length - 1;
                return (
                  <li key={paso.titulo} className="relative flex flex-col items-center gap-3 text-center">
                    {!ultimo && (
                      <span
                        aria-hidden="true"
                        style={d(250 + i * 300)}
                        className="dev-linea absolute top-7 left-[calc(50%+2.25rem)] h-0.5 w-[calc(100%-4.5rem)] rounded-full bg-white/40"
                      />
                    )}
                    <span
                      style={d(100 + i * 300)}
                      className={`pasos-nodo flex size-14 items-center justify-center rounded-full font-titulo text-xl font-bold ${
                        ultimo ? "bg-white text-vino" : "border-2 border-white/40"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold">{paso.titulo}</span>
                      <span className="text-xs text-dev-texto">{paso.nota}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </Revelar>
        </div>
      </section>
    </>
  );
}
