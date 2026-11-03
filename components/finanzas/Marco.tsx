"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import BotonTema from "@/components/BotonTema";
import { dispositivoAdmiteHuella, ErrorDeCuenta } from "@/lib/finanzas/repositorio";
import { ProveedorFinanzas, useFinanzas } from "./Contexto";
import Registrar from "./Registrar";
import { Boton, Campo, Hoja, Icono, Segmentado } from "./Ui";

const SECCIONES = [
  { href: "/finanzas", nombre: "Inicio", icono: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" },
  { href: "/finanzas/movimientos", nombre: "Movimientos", icono: "M7 4v16M7 20l-4-4M7 20l4-4M17 20V4M17 4l-4 4M17 4l4 4" },
  { href: "/finanzas/deudas", nombre: "Deudas", icono: "M5 21V9h6v12M13 21V4h6v17M3 21h18" },
  { href: "/finanzas/presupuesto", nombre: "Presupuesto", icono: "M4 7h16M4 12h10M4 17h6" },
  { href: "/finanzas/proyectos", nombre: "Proyectos", icono: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" },
];
const CUENTAS = { href: "/finanzas/cuentas", nombre: "Cuentas", icono: "M3 7h18v12H3zM3 11h18M7 15h3" };
const TAX_FREE = { href: "/finanzas/tax-free", nombre: "Tax free", icono: "M3 10l9-6 9 6M5 10v9h14v-9M9 19v-5h6v5M12 7.5v.01" };
const MAS_ICONO = "M5 12h.01M12 12h.01M19 12h.01";

// En el celular caben cinco botones abajo: los de todos los días, y "Más" para el resto
const porHref = (href: string) => SECCIONES.find((s) => s.href === href)!;
const CONEXIONES = { href: "/finanzas/conexiones", nombre: "Conexiones", icono: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" };

function Marca() {
  return (
    <Link href="/finanzas" className="font-titulo text-lg font-bold tracking-[-0.01em]">
      Lymun<span className="text-naranja">Art</span> <span className="font-semibold text-tinta-suave">Finanzas</span>
    </Link>
  );
}

function Acceso() {
  const { backend, alEntrar } = useFinanzas();
  const [modo, setModo] = useState<"entrar" | "registrar">(backend?.huella ? "entrar" : "registrar");
  const [conHuella] = useState(() => !!backend?.huella && dispositivoAdmiteHuella());
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [nota, setNota] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!backend) return;
    setError(null);
    setNota(null);
    if (modo === "registrar" && !nombre.trim()) return setError("Escribe tu nombre.");
    if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError("Revisa tu correo: parece que le falta algo.");
    if (clave.length < 10) return setError("Tu clave debe tener al menos 10 caracteres.");
    setEnviando(true);
    try {
      if (modo === "registrar") {
        const usuario = await backend.registrar(nombre, correo, clave);
        if (usuario) await alEntrar(usuario);
        else setNota("Te enviamos un correo. Confírmalo y luego entra con tu clave.");
      } else {
        await alEntrar(await backend.entrar(correo, clave));
      }
    } catch (err) {
      setError(err instanceof ErrorDeCuenta ? err.message : "No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.");
    } finally {
      setEnviando(false);
    }
  }

  async function entrarConHuella() {
    if (!backend?.huella) return;
    setError(null);
    setEnviando(true);
    try {
      await alEntrar(await backend.huella.entrar());
    } catch (err) {
      setError(err instanceof ErrorDeCuenta ? err.message : "No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-5xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] md:gap-20">
      <div className="flex flex-col gap-6">
        <Image src="/logo/lymunart-logo-tinta.svg" alt="LymunArt" width={590} height={695} priority className="w-24 dark:hidden" />
        <Image src="/logo/lymunart-logo-negativo.svg" alt="LymunArt" width={590} height={695} priority className="hidden w-24 dark:block" />
        <h1 className="font-titulo text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] font-bold tracking-[-0.035em]">
          Tu plata, clara y <span className="text-naranja">a tu nombre</span>
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-tinta-suave">
          Lo que entra, lo que sale y lo que debes, en un solo lugar. Cada cuota separada en capital, interés y otros cobros.
        </p>
      </div>
      <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-2xl border border-linea bg-superficie p-6 sm:p-7">
        <Segmentado
          etiqueta="Crear cuenta o entrar"
          opciones={[{ valor: "registrar", nombre: "Crear cuenta" }, { valor: "entrar", nombre: "Entrar" }]}
          valor={modo}
          onCambio={(m) => { setModo(m); setError(null); }}
        />
        {modo === "entrar" && conHuella && (
          <>
            <Boton variante="suave" disabled={enviando} onClick={entrarConHuella} className="w-full">
              <Icono d="M12 11v3M8.5 8.5a5 5 0 0 1 8.5 3.5v2a14 14 0 0 1-1 5M7 12a5 5 0 0 1 .3-1.7M7 15a14 14 0 0 0 1.5 5.5M12 17a20 20 0 0 1-1 4.5M3.6 9a9 9 0 0 1 16.8 0M4 13.5c0-.7.1-1.3.2-2" />
              Entrar con tu huella
            </Boton>
            <p className="text-center text-sm text-tinta-suave">o con tu correo y clave</p>
          </>
        )}
        {modo === "registrar" && <Campo etiqueta="Tu nombre" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} />}
        <Campo etiqueta="Correo" type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Campo etiqueta="Clave" type="password" autoComplete={modo === "registrar" ? "new-password" : "current-password"} value={clave} onChange={(e) => setClave(e.target.value)} ayuda={modo === "registrar" ? "Mínimo 10 caracteres. Usa una nueva, no la de tu banco." : undefined} />
        {error && <p role="alert" className="text-sm font-medium text-boton-hover dark:text-naranja">{error}</p>}
        {nota && <p role="status" className="rounded-xl bg-cielo/35 p-3 text-sm dark:bg-cielo/10">{nota}</p>}
        <Boton type="submit" disabled={enviando} className="w-full">
          {enviando ? "Un momento…" : modo === "registrar" ? "Crear mi cuenta" : "Entrar"}
        </Boton>
        {backend?.modo === "prueba" && (
          <p className="text-sm text-tinta-suave">Modo de prueba: tu cuenta y tus datos quedan solo en este navegador. No registres información real todavía.</p>
        )}
      </form>
    </main>
  );
}

// Después de entrar con clave, invita una vez a activar la huella en este dispositivo
function ActivarHuella() {
  const { backend, avisar } = useFinanzas();
  const [visible, setVisible] = useState(false);
  const [activando, setActivando] = useState(false);

  useEffect(() => {
    let vigente = true;
    let descartado = false;
    try {
      descartado = localStorage.getItem("finanzas:huella-descartada") === "1";
    } catch {}
    if (!backend?.huella || descartado || !dispositivoAdmiteHuella()) return;
    backend.huella.tieneAlguna().then((tiene) => vigente && setVisible(!tiene), () => {});
    return () => {
      vigente = false;
    };
  }, [backend]);

  if (!visible || !backend?.huella) return null;

  function descartar() {
    setVisible(false);
    try {
      localStorage.setItem("finanzas:huella-descartada", "1");
    } catch {}
  }

  async function activar() {
    setActivando(true);
    try {
      await backend!.huella!.registrar();
      setVisible(false);
      avisar("Listo: la próxima vez entras con tu huella");
    } catch (err) {
      avisar(err instanceof ErrorDeCuenta ? err.message : "No se activó la huella. Inténtalo otra vez.");
    } finally {
      setActivando(false);
    }
  }

  return (
    <section aria-labelledby="titulo-huella" className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cielo/35 p-5 dark:bg-cielo/10">
      <div className="max-w-md">
        <h2 id="titulo-huella" className="font-titulo font-semibold tracking-[-0.015em]">Entra más rápido con tu huella</h2>
        <p className="text-sm text-tinta-suave">Tu huella o tu rostro no salen del celular: el dispositivo solo confirma que eres tú.</p>
      </div>
      <div className="flex items-center gap-4">
        <Boton onClick={activar} disabled={activando}>{activando ? "Un momento…" : "Activar"}</Boton>
        <button type="button" onClick={descartar} className="min-h-11 text-sm font-medium text-tinta-suave hover:text-tinta">Ahora no</button>
      </div>
    </section>
  );
}

function EnlaceLateral({ s, actual }: { s: { href: string; nombre: string; icono: string }; actual: boolean }) {
  return (
    <Link
      href={s.href}
      aria-current={actual ? "page" : undefined}
      className={`tactil flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${actual ? "bg-cielo/45 text-tinta dark:bg-cielo/15" : "text-tinta-suave hover:text-tinta"}`}
    >
      <Icono d={s.icono} />
      {s.nombre}
    </Link>
  );
}

function Aplicacion({ children }: { children: ReactNode }) {
  const { usuario, cargando, backend, salir, abrirRegistro, registro, aviso, cerrarAviso } = useFinanzas();
  const ruta = usePathname();
  const [mas, setMas] = useState(false);
  const MAS = [porHref("/finanzas/presupuesto"), porHref("/finanzas/proyectos"), TAX_FREE, CONEXIONES];
  const enMas = MAS.some((s) => s.href === ruta);

  if (cargando) {
    return <p role="status" className="flex min-h-dvh items-center justify-center text-tinta-suave">Abriendo tus finanzas…</p>;
  }
  if (!usuario) return <Acceso />;

  const botonSalir = (
    <button type="button" onClick={salir} aria-label="Cerrar sesión" title="Cerrar sesión" className="tactil flex size-10 items-center justify-center rounded-lg border border-linea text-tinta-suave hover:border-tinta-suave hover:text-tinta">
      <Icono d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </button>
  );

  return (
    <div className="md:pl-64">
      {/* Computador: menú lateral */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-6 border-r border-linea p-5 md:flex">
        <Marca />
        <Boton className="w-full" onClick={() => abrirRegistro()}>
          <Icono d="M12 5v14M5 12h14" className="size-4" /> Registrar
        </Boton>
        <nav aria-label="Secciones" className="flex flex-col gap-1">
          {SECCIONES.slice(0, 1).map((s) => <EnlaceLateral key={s.href} s={s} actual={ruta === s.href} />)}
          <EnlaceLateral s={CUENTAS} actual={ruta === CUENTAS.href} />
          {SECCIONES.slice(1).map((s) => <EnlaceLateral key={s.href} s={s} actual={ruta === s.href} />)}
          <EnlaceLateral s={TAX_FREE} actual={ruta === TAX_FREE.href} />
          <EnlaceLateral s={CONEXIONES} actual={ruta === CONEXIONES.href} />
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <p className="truncate text-sm text-tinta-suave" title={usuario.correo}>{usuario.nombre}</p>
          <div className="flex gap-2"><BotonTema />{botonSalir}</div>
          <Link href="/" className="text-sm text-tinta-suave underline decoration-cielo decoration-2 hover:text-tinta">Volver a LymunArt</Link>
        </div>
      </aside>

      {/* Celular: encabezado y barra inferior */}
      <header className="capa sticky top-0 z-20 flex h-16 items-center justify-between gap-2 px-4 md:hidden">
        <Marca />
        <div className="flex gap-2">
          <BotonTema />
          {botonSalir}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pt-6 pb-40 sm:px-6 md:pt-12 md:pb-16">
        {backend?.modo === "prueba" && (
          <p className="mb-6 text-sm text-tinta-suave">
            <span className="mr-2 rounded-full border border-cielo px-2.5 py-0.5 text-xs font-semibold text-tinta">Modo de prueba</span>
            Tus datos quedan solo en este navegador.
          </p>
        )}
        <ActivarHuella />
        {children}
      </main>

      <button
        type="button"
        onClick={() => abrirRegistro()}
        aria-label="Registrar un movimiento"
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
        className="tactil fixed right-4 z-30 flex size-14 items-center justify-center rounded-2xl bg-boton text-white shadow-[0_6px_16px_-6px_rgb(191_86_18/0.6)] hover:bg-boton-hover md:hidden"
      >
        <Icono d="M12 5v14M5 12h14" className="size-6" />
      </button>

      <nav aria-label="Secciones" className="capa fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-linea pb-[env(safe-area-inset-bottom)] md:hidden">
        {[porHref("/finanzas"), porHref("/finanzas/movimientos"), CUENTAS, porHref("/finanzas/deudas")].map((s) => {
          const actual = ruta === s.href;
          return (
            <Link key={s.href} href={s.href} aria-current={actual ? "page" : undefined} className={`tactil flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium ${actual ? "text-tinta" : "text-tinta-suave"}`}>
              <span className={`flex h-7 w-12 items-center justify-center rounded-full ${actual ? "bg-cielo/60 dark:bg-cielo/20" : ""}`}><Icono d={s.icono} /></span>
              <span className="max-w-full truncate px-0.5">{s.nombre}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMas(true)}
          aria-haspopup="dialog"
          className={`tactil flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium ${enMas ? "text-tinta" : "text-tinta-suave"}`}
        >
          <span className={`flex h-7 w-12 items-center justify-center rounded-full ${enMas ? "bg-cielo/60 dark:bg-cielo/20" : ""}`}><Icono d={MAS_ICONO} className="size-6" /></span>
          <span>Más</span>
        </button>
      </nav>

      {mas && (
        <Hoja titulo="Más" onCerrar={() => setMas(false)}>
          {(cerrar) => (
            <nav aria-label="Más secciones">
              <ul className="flex flex-col divide-y divide-linea">
                {MAS.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} onClick={cerrar} aria-current={ruta === s.href ? "page" : undefined} className="tactil flex min-h-14 items-center gap-3 py-2">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-cielo/45 dark:bg-cielo/15"><Icono d={s.icono} /></span>
                      <span className="flex-1 font-medium">{s.nombre}</span>
                      <Icono d="M9 18l6-6-6-6" className="size-5 text-tinta-suave" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Hoja>
      )}

      {registro && <Registrar key={registro.inicial?.id ?? "nuevo"} />}

      {aviso && (
        <div role="status" key={aviso.id} style={{ bottom: "calc(9.5rem + env(safe-area-inset-bottom))" }} className="aviso fixed inset-x-4 z-40 mx-auto flex max-w-sm items-center justify-between gap-4 rounded-xl bg-tinta-fija px-4 py-3 text-sm text-white shadow-[0_12px_32px_-16px_rgb(30_27_46/0.6)] md:bottom-8!">
          <span>{aviso.texto}</span>
          {aviso.deshacer && (
            <button type="button" onClick={() => { aviso.deshacer?.(); cerrarAviso(); }} className="min-h-8 shrink-0 font-semibold underline decoration-cielo decoration-2 underline-offset-4">
              Deshacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Marco({ children }: { children: ReactNode }) {
  return (
    <ProveedorFinanzas>
      <Aplicacion>{children}</Aplicacion>
    </ProveedorFinanzas>
  );
}
