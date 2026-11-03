"use client";

import { useState, type ChangeEvent } from "react";
import { cop, dinero, fechaCorta, hoy, nuevoId } from "@/lib/finanzas/formato";
import { estimarDevolucion, ivaIncluido, leerFactura, pais, PAISES, textoDeArchivo } from "@/lib/finanzas/taxfree";
import { obtenerTasas } from "@/lib/finanzas/tasas";
import { ESTADOS_TAX_FREE, type CompraTaxFree, type EstadoTaxFree } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { useTasas } from "./Cuentas";
import { Boton, Campo, CampoMonto, Hoja, Selector, Titulo, Vacio } from "./Ui";

const OPERADORES = ["Global Blue", "Planet", "La tienda", "Otro", "No sé"];
const nombreEstado = (e: EstadoTaxFree) => ESTADOS_TAX_FREE.find((x) => x.valor === e)?.nombre ?? e;
const abierta = (c: CompraTaxFree) => c.estado !== "recibida" && c.estado !== "rechazada";

function FormularioCompra({ compra, onCerrar }: { compra?: CompraTaxFree; onCerrar: () => void }) {
  const { guardar, guardarMovimiento, avisar } = useFinanzas();
  const [tienda, setTienda] = useState(compra?.tienda ?? "");
  const [codigoPais, setCodigoPais] = useState(compra?.pais ?? "FR");
  const [fecha, setFecha] = useState(compra?.fecha ?? hoy());
  const [total, setTotal] = useState(compra?.total ?? 0);
  const [iva, setIva] = useState<number | null>(compra?.iva ?? null);
  const [operador, setOperador] = useState(compra?.operador ?? "Global Blue");
  const [estado, setEstado] = useState<EstadoTaxFree>(compra?.estado ?? "pendiente");
  const [recibido, setRecibido] = useState(compra?.recibido ?? 0);
  const [leyendo, setLeyendo] = useState<number | null>(null);
  const [nota, setNota] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const elegido = pais(codigoPais) ?? PAISES[0];
  // El IVA se calcula con la tasa del país mientras la persona no escriba otro valor
  const ivaFinal = iva ?? ivaIncluido(total, elegido.iva);
  const rango = estimarDevolucion(ivaFinal);
  const bajoMinimo = elegido.minimo !== null && total > 0 && total < elegido.minimo;

  async function leer(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setNota(null);
    setLeyendo(0);
    try {
      const l = leerFactura(await textoDeArchivo(archivo, setLeyendo));
      if (l.tienda && !tienda) setTienda(l.tienda);
      if (l.pais) setCodigoPais(l.pais);
      if (l.fecha) setFecha(l.fecha);
      if (l.total) setTotal(l.total);
      if (l.iva) setIva(l.iva);
      const leidos = [l.tienda && "la tienda", l.total && "el total", l.iva && "el IVA", l.fecha && "la fecha", l.pais && "el país"].filter(Boolean);
      setNota(
        leidos.length
          ? `Leímos ${leidos.join(", ")}. Revisa que todo esté bien antes de guardar.`
          : "No logramos leer la factura. Escribe los datos a mano o prueba con una foto más nítida.",
      );
    } catch {
      setNota("No pudimos abrir ese archivo. Prueba con una foto (JPG o PNG) o con el PDF de la factura.");
    } finally {
      setLeyendo(null);
    }
  }

  async function enviar(cerrar: () => void) {
    if (!tienda.trim()) return setError("Escribe el nombre de la tienda.");
    if (total <= 0) return setError("Escribe cuánto pagaste.");
    const nueva: CompraTaxFree = {
      id: compra?.id ?? nuevoId(),
      fecha,
      tienda: tienda.trim(),
      pais: elegido.codigo,
      moneda: elegido.moneda,
      total,
      iva: Math.round(ivaFinal * 100) / 100,
      operador,
      estado,
      recibido: estado === "recibida" ? recibido || null : null,
      movimiento_id: compra?.movimiento_id ?? null,
    };
    // Lo que te devuelven entra a tus ingresos, convertido a pesos con la tasa de hoy
    if (estado === "recibida" && recibido > 0 && !nueva.movimiento_id) {
      const tasas = await obtenerTasas();
      const tasa = tasas?.pesosPor[elegido.moneda];
      if (!tasa) return setError("No pudimos traer la tasa de hoy para pasarlo a pesos. Revisa tu internet.");
      nueva.movimiento_id = nuevoId();
      guardarMovimiento({
        id: nueva.movimiento_id, fecha: hoy(), tipo: "ingreso", categoria: "Otros ingresos",
        descripcion: `Devolución de impuestos: ${nueva.tienda}`, monto: recibido, moneda: elegido.moneda, tasa,
        cuenta_id: null, medio_pago: "transferencia", deuda_id: null, proyecto_id: null, origen: "manual", id_externo: null,
      });
      avisar(`Listo: ${dinero(recibido, elegido.moneda)} entraron a tus ingresos`);
    }
    guardar("compras_tax_free", [nueva]);
    cerrar();
  }

  return (
    <Hoja titulo={compra ? "Editar compra" : "Agregar compra"} onCerrar={onCerrar}>
      {(cerrar) => (
        <form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); enviar(cerrar); }}>
          {!compra && (
            <div className="flex flex-col gap-2">
              <label className="tactil inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-linea px-5 py-2.5 text-sm font-semibold hover:border-tinta-suave focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-naranja">
                {leyendo !== null ? `Leyendo la factura… ${Math.round(leyendo * 100)} %` : "Leer una foto o PDF de la factura"}
                <input type="file" accept="image/*,.pdf,application/pdf" disabled={leyendo !== null} onChange={leer} className="sr-only" />
              </label>
              <p className="text-sm text-tinta-suave">La foto se lee en tu celular y no se guarda en ningún lado.</p>
              {nota && <p role="status" className="rounded-xl bg-cielo/35 p-3 text-sm dark:bg-cielo/10">{nota}</p>}
            </div>
          )}
          <Campo etiqueta="Tienda" value={tienda} onChange={(e) => setTienda(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="País" value={codigoPais} onChange={(e) => { setCodigoPais(e.target.value); setIva(null); }}>
              {PAISES.map((p) => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
            </Selector>
            <Campo etiqueta="Fecha" type="date" value={fecha} max={hoy()} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <CampoMonto key={`total-${elegido.moneda}`} etiqueta="Total pagado (con IVA)" valor={total} onCambio={setTotal} moneda={elegido.moneda} />
          <CampoMonto key={`iva-${elegido.moneda}-${iva === null}`} etiqueta={`IVA de la compra (${Math.round(elegido.iva * 1000) / 10} % en ${elegido.nombre})`} valor={Math.round(ivaFinal * 100) / 100} onCambio={setIva} moneda={elegido.moneda} />

          {total > 0 && (
            <div className="cifras rounded-xl bg-cielo/35 p-4 text-sm dark:bg-cielo/10">
              <p>Te devolverían entre <strong className="font-semibold">{dinero(rango.desde, elegido.moneda)}</strong> y <strong className="font-semibold">{dinero(rango.hasta, elegido.moneda)}</strong>, según las comisiones de la empresa de tax free.</p>
              {bajoMinimo && <p className="mt-2 font-semibold text-boton-hover dark:text-naranja">En {elegido.nombre} la compra mínima es de {dinero(elegido.minimo as number, elegido.moneda)} en una misma tienda: esta no alcanzaría.</p>}
              {elegido.minimo === null && <p className="mt-2 text-tinta-suave">Pregunta en la tienda cuál es la compra mínima en {elegido.nombre}.</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="¿Quién tramita?" value={operador} onChange={(e) => setOperador(e.target.value)}>
              {OPERADORES.map((o) => <option key={o}>{o}</option>)}
            </Selector>
            <Selector etiqueta="Estado" value={estado} onChange={(e) => setEstado(e.target.value as EstadoTaxFree)}>
              {ESTADOS_TAX_FREE.map((e) => <option key={e.valor} value={e.valor}>{e.nombre}</option>)}
            </Selector>
          </div>
          {estado === "recibida" && (
            <CampoMonto key={`recibido-${elegido.moneda}`} etiqueta="¿Cuánto te devolvieron?" valor={recibido} onCambio={setRecibido} moneda={elegido.moneda} />
          )}
          {error && <p role="alert" className="text-sm font-medium text-boton-hover dark:text-naranja">{error}</p>}
          <Boton type="submit" className="w-full">{compra ? "Guardar cambios" : "Agregar compra"}</Boton>
        </form>
      )}
    </Hoja>
  );
}

export default function TaxFree() {
  const { datos, borrar, guardar, avisar } = useFinanzas();
  const tasas = useTasas();
  const [editar, setEditar] = useState<CompraTaxFree | "nueva" | null>(null);
  const compras = [...datos.compras_tax_free].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const abiertas = compras.filter(abierta);
  const enPesos = (n: number, moneda: string) => (moneda === "COP" ? n : tasas?.pesosPor[moneda] ? n * tasas.pesosPor[moneda] : null);
  const desde = abiertas.reduce((s, c) => s + (enPesos(estimarDevolucion(c.iva).desde, c.moneda) ?? 0), 0);
  const hasta = abiertas.reduce((s, c) => s + (enPesos(estimarDevolucion(c.iva).hasta, c.moneda) ?? 0), 0);
  const porValidar = compras.filter((c) => c.estado === "pendiente").length;

  return (
    <>
      <Titulo accion={compras.length ? <Boton onClick={() => setEditar("nueva")}>Agregar compra</Boton> : undefined}>Tax free</Titulo>

      <div className="flex flex-col gap-12">
        {abiertas.length > 0 && (
          <section aria-labelledby="titulo-devolucion" className="flex flex-col gap-2">
            <h2 id="titulo-devolucion" className="text-lg text-tinta-suave">Te deberían devolver</h2>
            <p className="cifras font-titulo text-[clamp(2.25rem,7vw,3.75rem)] leading-none font-bold tracking-[-0.035em]">
              {cop(desde)} <span className="text-tinta-suave">a</span> {cop(hasta)}
            </p>
            <p className="text-tinta-suave">
              Es un estimado en pesos con la tasa de hoy. Lo exacto lo dice la empresa de tax free.
              {porValidar > 0 && <strong className="font-semibold text-tinta"> Tienes {porValidar} {porValidar === 1 ? "compra" : "compras"} por validar en aduana.</strong>}
            </p>
          </section>
        )}

        {porValidar > 0 || compras.length === 0 ? (
          <section aria-labelledby="titulo-aduana" className="rounded-2xl border-t-2 border-naranja bg-superficie p-5 sm:p-7">
            <h2 id="titulo-aduana" className="font-titulo text-lg font-semibold tracking-[-0.015em]">Antes de salir de Europa</h2>
            <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm">
              <li>En cada compra pide el formulario de tax free y muestra tu pasaporte.</li>
              <li>En el último aeropuerto de la Unión Europea, antes del check-in, valida las facturas en aduana o en el kiosco de tax free.</li>
              <li>Lleva los productos sin usar: te los pueden pedir. Si no validas antes de salir, normalmente pierdes la devolución.</li>
            </ol>
          </section>
        ) : null}

        {compras.length === 0 ? (
          <Vacio
            titulo="Lleva la cuenta de tu tax free"
            texto="Sube la foto o el PDF de cada factura y te decimos cuánto IVA pagaste y cuánto te podrían devolver."
            accion={<Boton onClick={() => setEditar("nueva")}>Agregar mi primera compra</Boton>}
          />
        ) : (
          <section aria-label="Compras">
            <ul className="flex flex-col divide-y divide-linea">
              {compras.map((c) => {
                const r = estimarDevolucion(c.iva);
                const p = pais(c.pais);
                return (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
                    <button type="button" onClick={() => setEditar(c)} className="tactil min-w-0 flex-1 text-left">
                      <span className="block truncate font-medium">{c.tienda}</span>
                      <span className="block text-sm text-tinta-suave">
                        {p?.nombre ?? c.pais} · {fechaCorta(c.fecha)} · {dinero(c.total, c.moneda)}
                      </span>
                      <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.estado === "pendiente" ? "bg-naranja/15 text-boton-hover dark:text-naranja" : "border border-cielo"}`}>
                        {nombreEstado(c.estado)}
                      </span>
                    </button>
                    <span className="cifras shrink-0 text-right">
                      <span className="block font-semibold">
                        {c.estado === "recibida" && c.recibido ? dinero(c.recibido, c.moneda) : `${dinero(r.desde, c.moneda)} – ${dinero(r.hasta, c.moneda)}`}
                      </span>
                      <span className="block text-sm text-tinta-suave">IVA {dinero(c.iva, c.moneda)}</span>
                    </span>
                    {c.estado === "pendiente" && (
                      <button
                        type="button"
                        onClick={() => {
                          guardar("compras_tax_free", [{ ...c, estado: "validada" }]);
                          avisar(`${c.tienda}: validada en aduana`, () => guardar("compras_tax_free", [c]));
                        }}
                        className="min-h-11 text-sm font-semibold underline decoration-cielo decoration-2 underline-offset-4 hover:decoration-naranja"
                      >
                        Ya la validé
                      </button>
                    )}
                    {c.estado !== "pendiente" && !c.movimiento_id && (
                      <button
                        type="button"
                        onClick={() => {
                          borrar("compras_tax_free", c.id);
                          avisar(`${c.tienda} borrada`, () => guardar("compras_tax_free", [c]));
                        }}
                        className="min-h-11 text-sm text-tinta-suave hover:text-tinta"
                      >
                        Borrar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {editar && <FormularioCompra compra={editar === "nueva" ? undefined : editar} onCerrar={() => setEditar(null)} />}
    </>
  );
}
