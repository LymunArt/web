"use client";

import { useEffect, useState } from "react";
import { saldoCuenta } from "@/lib/finanzas/calculos";
import { cop, dinero, nuevoId } from "@/lib/finanzas/formato";
import { obtenerTasas, type Tasas } from "@/lib/finanzas/tasas";
import { MONEDAS, TIPOS_CUENTA, type Cuenta, type TipoCuenta } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Campo, CampoMonto, Hoja, Selector, Titulo, Vacio } from "./Ui";

export function useTasas() {
  const [tasas, setTasas] = useState<Tasas | null>(null);
  useEffect(() => {
    obtenerTasas().then(setTasas);
  }, []);
  return tasas;
}

const nombreTipo = (tipo: TipoCuenta) => TIPOS_CUENTA.find((t) => t.valor === tipo)?.nombre ?? tipo;

// Lista de cuentas con su saldo en su moneda y, si no es en pesos, cuánto vale hoy en pesos
export function ListaCuentas({ compacta = false }: { compacta?: boolean }) {
  const { datos } = useFinanzas();
  const tasas = useTasas();
  const [editar, setEditar] = useState<Cuenta | null>(null);
  const activas = datos.cuentas.filter((c) => !c.archivada);
  const total = activas.reduce((s, c) => {
    const tasa = c.moneda === "COP" ? 1 : tasas?.pesosPor[c.moneda];
    return tasa ? s + saldoCuenta(datos, c.id) * tasa : s;
  }, 0);
  const faltanTasas = activas.some((c) => c.moneda !== "COP" && !tasas?.pesosPor[c.moneda]);

  return (
    <>
      <ul className="flex flex-col divide-y divide-linea">
        {activas.map((c) => {
          const saldo = saldoCuenta(datos, c.id);
          const tasa = c.moneda === "COP" ? 1 : tasas?.pesosPor[c.moneda];
          return (
            <li key={c.id}>
              <button type="button" onClick={() => setEditar(c)} className="tactil flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.nombre}</span>
                  <span className="block truncate text-sm text-tinta-suave">{c.entidad} · {nombreTipo(c.tipo)}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className={`cifras block font-semibold ${saldo < 0 ? "text-boton-hover dark:text-naranja" : ""}`}>{dinero(saldo, c.moneda)}</span>
                  {c.moneda !== "COP" && <span className="cifras block text-sm text-tinta-suave">{tasa ? `≈ ${cop(saldo * tasa)}` : "Sin tasa"}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {activas.length > 1 && (
        <p className="cifras mt-3 flex items-baseline justify-between gap-4 border-t border-linea pt-3">
          <span className="text-tinta-suave">Todo junto, en pesos{faltanTasas ? " (sin las monedas sin tasa)" : ""}</span>
          <span className="font-semibold">{cop(total)}</span>
        </p>
      )}
      {!compacta && tasas && activas.some((c) => c.moneda !== "COP") && (
        <p className="mt-4 text-sm text-tinta-suave">
          Tasas de hoy: el dólar con la TRM oficial{tasas.trm ? "" : " (hoy no disponible, se usa la del mercado)"} y las demás monedas con{" "}
          <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline decoration-cielo decoration-2">ExchangeRate-API</a>.
        </p>
      )}
      {editar && <FormularioCuenta cuenta={editar} onCerrar={() => setEditar(null)} />}
    </>
  );
}

export function FormularioCuenta({ cuenta, onCerrar }: { cuenta?: Cuenta; onCerrar: () => void }) {
  const { datos, guardar, avisar } = useFinanzas();
  const [nombre, setNombre] = useState(cuenta?.nombre ?? "");
  const [entidad, setEntidad] = useState(cuenta?.entidad ?? "");
  const [tipo, setTipo] = useState<TipoCuenta>(cuenta?.tipo ?? "ahorros");
  const [moneda, setMoneda] = useState(cuenta?.moneda ?? "COP");
  const [saldo, setSaldo] = useState(cuenta?.saldo_inicial ?? 0);
  const [error, setError] = useState<string | null>(null);
  // Cambiar la moneda de una cuenta con movimientos los dejaría mal convertidos
  const tieneMovimientos = !!cuenta && datos.movimientos.some((m) => m.cuenta_id === cuenta.id);

  function enviar(cerrar: () => void) {
    if (!nombre.trim()) return setError("Ponle un nombre para reconocerla, por ejemplo \"Ahorros Bancolombia\".");
    if (!entidad.trim()) return setError("Escribe el banco o la billetera.");
    guardar("cuentas", [
      { id: cuenta?.id ?? nuevoId(), nombre: nombre.trim(), entidad: entidad.trim(), tipo, moneda, saldo_inicial: saldo, archivada: cuenta?.archivada ?? false },
    ]);
    cerrar();
  }

  return (
    <Hoja titulo={cuenta ? "Editar cuenta" : "Agregar cuenta"} onCerrar={onCerrar}>
      {(cerrar) => (
        <form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); enviar(cerrar); }}>
          <Campo etiqueta="Nombre" placeholder="Ej.: Ahorros Bancolombia" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Campo etiqueta="Banco o billetera" placeholder="Ej.: Nequi, Nu, Bancolombia" value={entidad} onChange={(e) => setEntidad(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoCuenta)}>
              {TIPOS_CUENTA.map((t) => <option key={t.valor} value={t.valor}>{t.nombre}</option>)}
            </Selector>
            <Selector etiqueta="Moneda" value={moneda} disabled={tieneMovimientos} onChange={(e) => setMoneda(e.target.value)}>
              {MONEDAS.map((m) => <option key={m.codigo} value={m.codigo}>{m.codigo} · {m.nombre}</option>)}
            </Selector>
          </div>
          {tieneMovimientos && <p className="-mt-2 text-sm text-tinta-suave">La moneda no se puede cambiar porque la cuenta ya tiene movimientos.</p>}
          <CampoMonto key={moneda} etiqueta="¿Cuánto tiene hoy?" valor={saldo} onCambio={setSaldo} moneda={moneda} />
          {error && <p role="alert" className="text-sm font-medium text-boton-hover dark:text-naranja">{error}</p>}
          <Boton type="submit" className="w-full">{cuenta ? "Guardar cambios" : "Agregar cuenta"}</Boton>
          {cuenta && (
            <Boton
              variante="suave"
              className="w-full"
              onClick={() => {
                guardar("cuentas", [{ ...cuenta, archivada: true }]);
                avisar(`${cuenta.nombre} archivada`, () => guardar("cuentas", [{ ...cuenta, archivada: false }]));
                cerrar();
              }}
            >
              Archivar cuenta
            </Boton>
          )}
        </form>
      )}
    </Hoja>
  );
}

export default function Cuentas() {
  const { datos } = useFinanzas();
  const [agregar, setAgregar] = useState(false);
  const hay = datos.cuentas.some((c) => !c.archivada);
  return (
    <>
      <Titulo accion={hay ? <Boton variante="suave" onClick={() => setAgregar(true)}>Agregar cuenta</Boton> : undefined}>Cuentas</Titulo>
      {hay ? (
        <ListaCuentas />
      ) : (
        <Vacio
          titulo="Agrega tus cuentas"
          texto="De cualquier banco o billetera, en pesos, dólares u otra moneda. Cada movimiento queda en su cuenta y los saldos se convierten a pesos con la tasa del día."
          accion={<Boton onClick={() => setAgregar(true)}>Agregar mi primera cuenta</Boton>}
        />
      )}
      {agregar && <FormularioCuenta onCerrar={() => setAgregar(false)} />}
    </>
  );
}
