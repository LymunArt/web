"use client";

import { useEffect, useState } from "react";
import { saldoCuenta } from "@/lib/finanzas/calculos";
import { cop, dinero, nuevoId, proximoPago } from "@/lib/finanzas/formato";
import { obtenerTasas, type Tasas } from "@/lib/finanzas/tasas";
import { MONEDAS, TIPOS_CUENTA, type Cuenta, type TipoCuenta } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Campo, CampoMonto, Hoja, Icono, Pildoras, Selector, Titulo, Vacio } from "./Ui";
import Wallet from "./Wallet";

export function useTasas() {
  const [tasas, setTasas] = useState<Tasas | null>(null);
  useEffect(() => {
    obtenerTasas().then(setTasas);
  }, []);
  return tasas;
}


// Las cuentas se agrupan como las piensa la gente: dónde tengo la plata, qué tarjetas uso, qué debo
const GRUPOS: { nombre: string; tipos: TipoCuenta[] }[] = [
  { nombre: "Bancos y billeteras", tipos: ["ahorros", "corriente", "billetera"] },
  { nombre: "Tarjetas débito y prepago", tipos: ["tarjeta"] },
  { nombre: "Tarjetas de crédito", tipos: ["credito"] },
  { nombre: "Efectivo", tipos: ["efectivo"] },
  { nombre: "Inversiones", tipos: ["inversion"] },
];

const ICONOS: Record<TipoCuenta, string> = {
  ahorros: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18",
  corriente: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18",
  billetera: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7Zm0 0 11-3v3M16 13.5h.01",
  tarjeta: "M3 6h18v12H3zM3 10h18M7 15h3",
  credito: "M3 6h18v12H3zM3 10h18M7 15h3M15 15h2",
  efectivo: "M3 7h18v10H3zM12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M6 10v.01M18 14v.01",
  inversion: "M4 19V5M4 19h16M8 15l3-4 3 2 5-6",
};

function FilaCuenta({ c, tasas, onEditar }: { c: Cuenta; tasas: Tasas | null; onEditar: () => void }) {
  const { datos } = useFinanzas();
  const saldo = saldoCuenta(datos, c.id);
  const tasa = c.moneda === "COP" ? 1 : tasas?.pesosPor[c.moneda];
  const conWallet = datos.llaves_wallet.some((l) => l.cuenta_id === c.id);
  const credito = c.tipo === "credito";
  const disponible = credito && c.cupo ? c.cupo - saldo : null;
  const pago = credito && c.dia_pago ? proximoPago(c.dia_pago) : null;

  return (
    <li>
      <button type="button" onClick={onEditar} className="tactil flex min-h-16 w-full items-center gap-3 py-3 text-left">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cielo/45 text-tinta dark:bg-cielo/15">
          <Icono d={ICONOS[c.tipo]} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{c.nombre}</span>
            {conWallet && <span className="shrink-0 rounded-full border border-cielo px-2 py-0.5 text-[0.6875rem] font-semibold">Wallet</span>}
          </span>
          <span className="block truncate text-sm text-tinta-suave">
            {c.entidad}
            {credito && pago ? ` · paga en ${pago.dias === 0 ? "hoy" : `${pago.dias} días`}` : ""}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className={`cifras block font-semibold ${!credito && saldo < 0 ? "text-boton-hover dark:text-naranja" : ""}`}>
            {credito ? `Debes ${dinero(Math.max(saldo, 0), c.moneda)}` : dinero(saldo, c.moneda)}
          </span>
          <span className="cifras block text-sm text-tinta-suave">
            {credito && disponible !== null
              ? `Disponible ${dinero(Math.max(disponible, 0), c.moneda)}`
              : c.moneda !== "COP"
                ? tasa ? `≈ ${cop(saldo * tasa)}` : "Sin tasa"
                : ""}
          </span>
        </span>
      </button>
    </li>
  );
}

// Lista de cuentas agrupadas, con lo que tienes y lo que debes en tarjetas, todo en pesos con la tasa de hoy
export function ListaCuentas({ compacta = false }: { compacta?: boolean }) {
  const { datos } = useFinanzas();
  const tasas = useTasas();
  const [editar, setEditar] = useState<Cuenta | null>(null);
  const activas = datos.cuentas.filter((c) => !c.archivada);
  const enPesos = (c: Cuenta) => {
    const tasa = c.moneda === "COP" ? 1 : tasas?.pesosPor[c.moneda];
    return tasa ? saldoCuenta(datos, c.id) * tasa : 0;
  };
  const tienes = activas.filter((c) => c.tipo !== "credito").reduce((s, c) => s + enPesos(c), 0);
  const debes = activas.filter((c) => c.tipo === "credito").reduce((s, c) => s + Math.max(enPesos(c), 0), 0);

  return (
    <>
      {activas.length > 1 && (
        <dl className="cifras mb-6 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-tinta-suave">Tienes</dt>
            <dd className="font-titulo text-2xl font-semibold tracking-[-0.02em]">{cop(tienes)}</dd>
          </div>
          {debes > 0 && (
            <div>
              <dt className="text-sm text-tinta-suave">Debes en tarjetas</dt>
              <dd className="font-titulo text-2xl font-semibold tracking-[-0.02em]">{cop(debes)}</dd>
            </div>
          )}
        </dl>
      )}
      <div className="flex flex-col gap-6">
        {GRUPOS.map((g) => {
          const deGrupo = activas.filter((c) => g.tipos.includes(c.tipo));
          if (!deGrupo.length) return null;
          return (
            <section key={g.nombre} aria-label={g.nombre}>
              {!compacta && <h2 className="mb-1 text-sm font-semibold text-tinta-suave">{g.nombre}</h2>}
              <ul className="flex flex-col divide-y divide-linea">
                {deGrupo.map((c) => <FilaCuenta key={c.id} c={c} tasas={tasas} onEditar={() => setEditar(c)} />)}
              </ul>
            </section>
          );
        })}
      </div>
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

// Las entidades más comunes en Colombia para cada tipo: un toque en vez de escribir
const ENTIDADES: Record<TipoCuenta, string[]> = {
  billetera: ["Nequi", "Daviplata", "RappiPay", "Dale!", "Movii"],
  ahorros: ["Bancolombia", "Davivienda", "Nu", "BBVA", "Banco de Bogotá", "Lulo Bank", "Caja Social"],
  corriente: ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Caja Social"],
  tarjeta: ["ARQ", "Nu", "Global66", "Wise", "Bancolombia"],
  credito: ["Nu", "Bancolombia", "Davivienda", "BBVA", "Falabella", "RappiCard"],
  efectivo: [],
  inversion: ["Trii", "Tyba", "Bancolombia", "Davivienda"],
};
const OTRA = "Otra";

export function FormularioCuenta({ cuenta, onCerrar }: { cuenta?: Cuenta; onCerrar: () => void }) {
  const { datos, guardar, avisar } = useFinanzas();
  const [tipo, setTipo] = useState<TipoCuenta>(cuenta?.tipo ?? "billetera");
  const [entidad, setEntidad] = useState(cuenta?.entidad ?? "");
  const conocida = (e: string, t: TipoCuenta) => ENTIDADES[t].includes(e);
  const [otra, setOtra] = useState(!!cuenta && !conocida(cuenta.entidad, cuenta.tipo) && cuenta.tipo !== "efectivo");
  // El apodo solo hace falta si tiene dos cuentas del mismo banco; si es igual a la entidad, no se muestra
  const [apodo, setApodo] = useState(cuenta && cuenta.nombre !== cuenta.entidad ? cuenta.nombre : "");
  const [moneda, setMoneda] = useState(cuenta?.moneda ?? "COP");
  const [saldo, setSaldo] = useState(Number(cuenta?.saldo_inicial ?? 0));
  const [cupo, setCupo] = useState(Number(cuenta?.cupo ?? 0));
  const [diaCorte, setDiaCorte] = useState(cuenta?.dia_corte ? String(cuenta.dia_corte) : "");
  const [diaPago, setDiaPago] = useState(cuenta?.dia_pago ? String(cuenta.dia_pago) : "");
  const [error, setError] = useState<string | null>(null);
  // Cambiar la moneda de una cuenta con movimientos los dejaría mal convertidos
  const tieneMovimientos = !!cuenta && datos.movimientos.some((m) => m.cuenta_id === cuenta.id);
  const credito = tipo === "credito";

  function enviar(cerrar: () => void) {
    const entidadFinal = tipo === "efectivo" ? "Efectivo" : entidad.trim();
    if (!entidadFinal) return setError(otra ? "Escribe el nombre del banco o la billetera." : "Elige de qué banco o billetera es.");
    const dia = (t: string) => (t ? Math.min(31, Math.max(1, Number(t))) : null);
    guardar("cuentas", [
      {
        id: cuenta?.id ?? nuevoId(),
        nombre: apodo.trim() || entidadFinal,
        entidad: entidadFinal,
        tipo,
        moneda,
        saldo_inicial: saldo,
        archivada: cuenta?.archivada ?? false,
        cupo: credito ? cupo || null : null,
        dia_corte: credito ? dia(diaCorte) : null,
        dia_pago: credito ? dia(diaPago) : null,
      },
    ]);
    cerrar();
  }

  return (
    <Hoja titulo={cuenta ? "Editar cuenta" : "Agregar cuenta"} onCerrar={onCerrar}>
      {(cerrar) => (
        <form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); enviar(cerrar); }}>
          <Selector
            etiqueta="¿Qué es?"
            value={tipo}
            onChange={(e) => {
              const nuevo = e.target.value as TipoCuenta;
              setTipo(nuevo);
              if (!otra && !conocida(entidad, nuevo)) setEntidad("");
            }}
          >
            {TIPOS_CUENTA.map((t) => <option key={t.valor} value={t.valor}>{t.nombre}</option>)}
          </Selector>
          {tipo !== "efectivo" && (
            <>
              <Pildoras
                etiqueta="¿De cuál?"
                opciones={[...ENTIDADES[tipo], OTRA]}
                valor={otra ? OTRA : entidad}
                onCambio={(v) => {
                  setOtra(v === OTRA);
                  setEntidad(v === OTRA ? "" : v);
                }}
              />
              {otra && <Campo etiqueta="¿Cuál?" autoComplete="off" placeholder="Ej.: Banco Popular" value={entidad} onChange={(e) => setEntidad(e.target.value)} />}
            </>
          )}
          <Campo
            etiqueta="Apodo (opcional)"
            autoComplete="off"
            placeholder={credito ? "Ej.: Tarjeta de compras" : "Ej.: Ahorros nómina"}
            ayuda="Solo si tienes dos del mismo banco. Si lo dejas vacío, se llama como el banco."
            value={apodo}
            onChange={(e) => setApodo(e.target.value)}
          />
          <Selector etiqueta="Moneda" value={moneda} disabled={tieneMovimientos} onChange={(e) => setMoneda(e.target.value)}>
            {MONEDAS.map((m) => <option key={m.codigo} value={m.codigo}>{m.nombre} ({m.codigo})</option>)}
          </Selector>
          {tieneMovimientos && <p className="-mt-2 text-sm text-tinta-suave">La moneda no se puede cambiar porque la cuenta ya tiene movimientos.</p>}
          <CampoMonto key={`saldo-${moneda}`} etiqueta={credito ? "¿Cuánto debes hoy en la tarjeta?" : "¿Cuánto tiene hoy?"} valor={saldo} onCambio={setSaldo} moneda={moneda} />
          {credito && (
            <>
              <CampoMonto key={`cupo-${moneda}`} etiqueta="Cupo total" valor={cupo} onCambio={setCupo} moneda={moneda} />
              <div className="grid grid-cols-2 gap-3">
                <Campo etiqueta="Día de corte" inputMode="numeric" placeholder="Ej.: 25" value={diaCorte} onChange={(e) => setDiaCorte(e.target.value.replace(/\D/g, "").slice(0, 2))} />
                <Campo etiqueta="Día de pago" inputMode="numeric" placeholder="Ej.: 10" value={diaPago} onChange={(e) => setDiaPago(e.target.value.replace(/\D/g, "").slice(0, 2))} />
              </div>
              <p className="-mt-2 text-sm text-tinta-suave">Cada compra con la tarjeta sube lo que debes, y cada pago que le hagas lo baja.</p>
            </>
          )}
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
      <div className="flex flex-col gap-12">
        {hay ? (
          <ListaCuentas />
        ) : (
          <Vacio
            titulo="Agrega tus cuentas"
            texto="Tu Nequi, tu banco, tus tarjetas de crédito o débito y tu efectivo, en pesos, dólares u otra moneda. Los saldos se convierten a pesos con la tasa del día."
            accion={<Boton onClick={() => setAgregar(true)}>Agregar mi primera cuenta</Boton>}
          />
        )}
        <Wallet />
      </div>
      {agregar && <FormularioCuenta onCerrar={() => setAgregar(false)} />}
    </>
  );
}
