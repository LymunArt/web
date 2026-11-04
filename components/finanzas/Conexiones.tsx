"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { medioDeCuenta } from "@/lib/finanzas/calculos";
import { aMovimientos, leerExtracto, sugerirCategoria, type ResultadoExtracto } from "@/lib/finanzas/conexiones";
import { cop, fechaCorta } from "@/lib/finanzas/formato";
import type { Movimiento } from "@/lib/finanzas/tipos";
import { obtenerTasas } from "@/lib/finanzas/tasas";
import { useFinanzas } from "./Contexto";
import { Boton, Campo, Icono, Selector, Titulo } from "./Ui";

type Revision = { nuevos: Movimiento[]; repetidos: number; descartadas: number };

export default function Conexiones() {
  const { datos, guardar, borrar, avisar } = useFinanzas();
  const [revision, setRevision] = useState<Revision | null>(null);
  const [problema, setProblema] = useState<string | null>(null);
  const [leyendo, setLeyendo] = useState(false);
  const cuentasActivas = datos.cuentas.filter((c) => !c.archivada);
  const [cuentaId, setCuentaId] = useState(cuentasActivas.find((c) => c.tipo !== "efectivo")?.id ?? "");
  // Cada persona ve solo los bancos y billeteras que tiene en sus cuentas
  const entidades = [...new Set(cuentasActivas.filter((c) => c.tipo !== "efectivo").map((c) => c.entidad))];
  // Un PDF con clave queda esperando aquí hasta que la escribas
  const [conClave, setConClave] = useState<File | null>(null);
  const [clave, setClave] = useState("");

  async function procesar(archivo: File, claveDelPdf?: string) {
    setProblema(null);
    setRevision(null);
    if (archivo.size > 10_000_000) return setProblema("El archivo pesa más de 10 MB. Prueba con un rango de fechas más corto.");
    if (cuentasActivas.length && !cuentaId) return setProblema("Elige de qué cuenta es el extracto, para que su saldo cuadre.");
    const esPdf = archivo.type === "application/pdf" || /\.pdf$/i.test(archivo.name);
    let r: ResultadoExtracto;
    if (esPdf) {
      setLeyendo(true);
      try {
        const { lineasDePdf, interpretarLineas } = await import("@/lib/finanzas/extracto-pdf");
        r = interpretarLineas(await lineasDePdf(await archivo.arrayBuffer(), claveDelPdf));
        setConClave(null);
        setClave("");
      } catch (error) {
        const motivo = (error as { motivo?: string }).motivo;
        if (motivo === "pide-clave" || motivo === "clave-incorrecta") {
          setConClave(archivo);
          if (motivo === "clave-incorrecta") setProblema("Esa no es la clave del PDF. Revísala e inténtalo otra vez.");
        } else setProblema("No pudimos abrir ese PDF. Revisa que sea el extracto que descargaste de la entidad.");
        return;
      } finally {
        setLeyendo(false);
      }
    } else r = leerExtracto(await archivo.text());
    if (r.problema) return setProblema(r.problema);
    const cuenta = datos.cuentas.find((c) => c.id === cuentaId) ?? null;
    let tasa = 1;
    if (cuenta && cuenta.moneda !== "COP") {
      const tasas = await obtenerTasas();
      const hoyTasa = tasas?.pesosPor[cuenta.moneda];
      if (!hoyTasa) return setProblema("No pudimos traer la tasa de hoy para convertir a pesos. Revisa tu internet e inténtalo otra vez.");
      tasa = hoyTasa;
    }
    const { nuevos, repetidos } = aMovimientos(r.filas, datos.movimientos, "extracto", cuenta ? medioDeCuenta(cuenta) : "transferencia", cuenta, tasa);
    setRevision({ nuevos, repetidos, descartadas: r.descartadas });
  }

  function leerArchivo(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    setConClave(null);
    if (archivo) procesar(archivo);
  }

  // Si el extracto no dice con claridad si entró o salió, lo corriges con un toque antes de guardar
  function voltear(id: string) {
    setRevision((r) =>
      r && {
        ...r,
        nuevos: r.nuevos.map((m) => {
          if (m.id !== id) return m;
          const tipo = m.tipo === "ingreso" ? "gasto" : "ingreso";
          return { ...m, tipo, categoria: sugerirCategoria(m.descripcion, tipo === "ingreso") };
        }),
      },
    );
  }

  function importar() {
    if (!revision) return;
    const { nuevos } = revision;
    guardar("movimientos", nuevos);
    setRevision(null);
    avisar(`${nuevos.length} movimientos agregados`, () => nuevos.forEach((m) => borrar("movimientos", m.id)));
  }

  return (
    <>
      <Titulo>Conexiones</Titulo>
      <div className="flex flex-col gap-14">
        <section aria-labelledby="titulo-entidades">
          <h2 id="titulo-entidades" className="mb-2 font-titulo text-xl font-semibold tracking-[-0.015em]">Tus bancos y billeteras</h2>
          <p className="mb-5 max-w-2xl text-tinta-suave">
            Cuando se pueda conectar, tus ingresos, gastos y pagos llegarán solos. Tú das el permiso desde tu banco y lo quitas cuando quieras. Nunca te pediremos la clave de tu cuenta.
          </p>
          {entidades.length === 0 ? (
            <p className="max-w-2xl text-tinta-suave">
              Agrega tus cuentas y aquí aparecerán tus bancos.{" "}
              <Link href="/finanzas/cuentas" className="font-semibold text-tinta underline decoration-cielo decoration-2 underline-offset-4">Ir a Cuentas</Link>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-linea border-y border-linea">
              {entidades.map((entidad) => (
                <li key={entidad} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
                  <div className="min-w-0 max-w-xl">
                    <h3 className="font-titulo text-lg font-semibold tracking-[-0.015em]">{entidad}</h3>
                    <p id={`nota-${entidad}`} className="text-sm text-tinta-suave">
                      Estará listo cuando {entidad} comparta tus movimientos, con tu permiso, por las finanzas abiertas que está organizando la Superfinanciera.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled
                    aria-describedby={`nota-${entidad}`}
                    className="inline-flex min-h-11 shrink-0 cursor-not-allowed items-center gap-2 rounded-xl border border-linea px-4 text-sm font-semibold text-tinta-suave"
                  >
                    <Icono d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" className="size-4" />
                    Conectar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="titulo-extracto">
          <h2 id="titulo-extracto" className="mb-2 font-titulo text-xl font-semibold tracking-[-0.015em]">Mientras tanto, sube tu extracto</h2>
          <p className="mb-5 max-w-2xl text-tinta-suave">
            El PDF que descargas de tu banco o billetera, o un CSV. Lo revisas antes de guardar, y lo que ya esté registrado no se repite. El archivo se lee en tu dispositivo y no se sube a ningún lado.
          </p>
          <div className="flex max-w-md flex-col gap-4">
            {cuentasActivas.length > 0 && (
              <Selector etiqueta="¿De qué cuenta es el extracto?" value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
                {!cuentaId && <option value="">Elige una cuenta</option>}
                {cuentasActivas.map((c) => <option key={c.id} value={c.id}>{c.nombre} · {c.moneda}</option>)}
              </Selector>
            )}
            <label className="tactil inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-boton px-5 py-2.5 text-sm font-semibold text-white hover:bg-boton-hover focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-naranja">
              {leyendo ? "Leyendo el extracto…" : "Elegir extracto (PDF o CSV)"}
              <input type="file" accept=".pdf,application/pdf,.csv,text/csv" disabled={leyendo} onChange={leerArchivo} className="sr-only" />
            </label>
            {conClave && (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (clave) procesar(conClave, clave);
                }}
              >
                <Campo
                  etiqueta="Este PDF tiene clave"
                  type="password"
                  autoComplete="off"
                  autoFocus
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  ayuda="Es la clave del archivo, la que te indicó la entidad al enviarlo. Solo se usa para abrirlo aquí y no se guarda."
                />
                <Boton type="submit" variante="suave" disabled={!clave || leyendo}>Abrir el PDF</Boton>
              </form>
            )}
          </div>
          {problema && <p role="alert" className="mt-4 font-medium text-boton-hover dark:text-naranja">{problema}</p>}

          {revision && (
            <div className="mt-8">
              <h3 className="font-titulo text-lg font-semibold tracking-[-0.015em]">
                {revision.nuevos.length === 0 ? "Todo esto ya estaba registrado" : `${revision.nuevos.length} movimientos por agregar`}
              </h3>
              <p className="mt-1 mb-4 text-sm text-tinta-suave">
                {revision.repetidos > 0 && `${revision.repetidos} ya estaban y no se repetirán. `}
                {revision.descartadas > 0 && `${revision.descartadas} filas no se pudieron leer. `}
                Si alguno salió al revés, toca su valor para cambiarlo. La categoría la ajustas después en Movimientos.
              </p>
              {revision.nuevos.length > 0 && (
                <>
                  <ul className="mb-5 flex max-h-80 flex-col divide-y divide-linea overflow-y-auto border-y border-linea" tabIndex={0} aria-label="Movimientos por agregar">
                    {revision.nuevos.map((m) => (
                      <li key={m.id} className="flex items-center justify-between gap-4 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{m.descripcion}</span>
                          <span className="block text-sm text-tinta-suave">{fechaCorta(m.fecha)} · {m.categoria}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => voltear(m.id)}
                          aria-label={`${m.tipo === "ingreso" ? "Entró" : "Salió"} ${cop(m.monto)}. Tocar para cambiar`}
                          title="Tocar para cambiar entre entró y salió"
                          className={`tactil cifras min-h-11 shrink-0 rounded-lg px-2 font-semibold hover:bg-linea/60 ${m.tipo === "ingreso" ? "text-cielo-tinta dark:text-cielo" : ""}`}
                        >
                          {m.tipo === "ingreso" ? "+" : "−"}{cop(m.monto)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Boton onClick={importar}>Agregar movimientos</Boton>
                    <Boton variante="suave" onClick={() => setRevision(null)}>Cancelar</Boton>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
