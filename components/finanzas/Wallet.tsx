"use client";

import { useState } from "react";
import { fechaCorta } from "@/lib/finanzas/formato";
import type { Cuenta, LlaveWallet } from "@/lib/finanzas/tipos";
import { useFinanzas } from "./Contexto";
import { Boton, Hoja, Icono, Selector } from "./Ui";

// El atajo solo abre este enlace: la llave va dentro, y el iPhone cambia COMERCIO y MONTO por los datos de la compra
const enlaceWallet = (llave: string, prueba = false) =>
  `${window.location.origin}/api/finanzas/wallet?llave=${encodeURIComponent(llave)}${prueba ? "&prueba=1" : "&comercio=COMERCIO&monto=MONTO"}`;

const aHex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

// La llave es larga y al azar; en la base solo queda su huella, así que si alguien ve la base no puede usarla
async function crearLlave() {
  const azar = crypto.getRandomValues(new Uint8Array(32));
  const llave = btoa(String.fromCharCode(...azar)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const huella = aHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(llave)));
  return { llave, huella };
}

async function probar(llave: string) {
  const r = await fetch(enlaceWallet(llave, true), { cache: "no-store" });
  return r.ok;
}

function Copiar({ etiqueta, valor, secreto = false }: { etiqueta: string; valor: string; secreto?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold">{etiqueta}</span>
      <div className="flex items-center gap-2 rounded-xl border border-linea bg-fondo p-1.5 pl-3">
        <code className="min-w-0 flex-1 truncate text-sm text-tinta-suave">{secreto ? `${valor.slice(0, 6)}••••••••${valor.slice(-4)}` : valor}</code>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(valor);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2000);
            } catch {}
          }}
          className="tactil min-h-9 shrink-0 rounded-lg bg-cielo/45 px-3 text-sm font-semibold dark:bg-cielo/15"
        >
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-cielo text-sm font-semibold">{n}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5 text-sm">{children}</div>
    </li>
  );
}

function Conectar({ onCerrar }: { onCerrar: () => void }) {
  const { datos, guardar } = useFinanzas();
  const posibles = datos.cuentas.filter((c) => !c.archivada && c.tipo !== "efectivo" && c.tipo !== "inversion");
  const [cuentaId, setCuentaId] = useState(posibles.find((c) => c.tipo === "tarjeta" || c.tipo === "credito")?.id ?? posibles[0]?.id ?? "");
  const [llave, setLlave] = useState<string | null>(null);
  const [estado, setEstado] = useState<"probando" | "bien" | "mal" | null>(null);
  const cuenta = datos.cuentas.find((c) => c.id === cuentaId);

  async function generar() {
    const { llave, huella } = await crearLlave();
    guardar("llaves_wallet", [{ id: nuevoIdLlave(), cuenta_id: cuentaId, llave_hash: huella, creada_en: new Date().toISOString(), ultimo_uso: null }]);
    setLlave(llave);
  }

  return (
    <Hoja titulo="Conectar con Wallet" onCerrar={onCerrar}>
      {() =>
        posibles.length === 0 ? (
          <p className="pb-4 text-tinta-suave">Primero agrega la cuenta o la tarjeta que tienes en tu Wallet.</p>
        ) : !llave ? (
          <div className="flex flex-col gap-4">
            <p className="text-tinta-suave">Elige la tarjeta que tienes en el Wallet de tu iPhone. Cada compra con Apple Pay quedará en esa cuenta.</p>
            <Selector etiqueta="¿Qué tarjeta?" value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
              {posibles.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>)}
            </Selector>
            <Boton className="w-full" onClick={generar}>Crear mi llave</Boton>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="rounded-xl bg-cielo/35 p-3 text-sm dark:bg-cielo/10">
              Tu llave para <strong className="font-semibold">{cuenta?.nombre}</strong> está lista. Solo la verás esta vez: si cierras sin copiarla, crea otra.
            </p>
            <ol className="flex flex-col gap-5">
              <Paso n={1}>
                <p>Copia tu enlace. Lleva tu llave adentro, así que no lo compartas.</p>
                <Copiar etiqueta="Tu enlace" valor={enlaceWallet(llave)} secreto />
              </Paso>
              <Paso n={2}>
                <p>
                  En <strong className="font-semibold">Atajos</strong> → <strong className="font-semibold">Automatización</strong> → <strong className="font-semibold">+</strong> → <strong className="font-semibold">Wallet</strong>, elige tu tarjeta y
                  apaga <strong className="font-semibold">Confirmar antes de ejecutar</strong>.
                </p>
              </Paso>
              <Paso n={3}>
                <p>
                  Abajo, en <strong className="font-semibold">Buscar</strong>, escribe <strong className="font-semibold">URL</strong> y toca <strong className="font-semibold">Obtener contenido de URL</strong>.
                  Toca la palabra azul <strong className="font-semibold">URL</strong> y pega tu enlace.
                </p>
              </Paso>
              <Paso n={4}>
                <p>
                  En el enlace, borra la palabra <code className="font-semibold">COMERCIO</code> y elige la variable <strong className="font-semibold">Comerciante</strong> que aparece arriba del teclado.
                  Luego borra <code className="font-semibold">MONTO</code> y elige <strong className="font-semibold">Importe</strong>. Toca <strong className="font-semibold">Listo</strong>.
                </p>
              </Paso>
              <Paso n={5}>
                <p>Comprueba que la llave quedó activa:</p>
                <Boton
                  variante="suave"
                  onClick={async () => {
                    setEstado("probando");
                    setEstado((await probar(llave).catch(() => false)) ? "bien" : "mal");
                  }}
                >
                  {estado === "probando" ? "Probando…" : "Probar la llave"}
                </Boton>
                {estado === "bien" && <p role="status" className="font-medium">La llave funciona. Tu próxima compra con Apple Pay aparecerá sola en Movimientos.</p>}
                {estado === "mal" && <p role="alert" className="font-medium text-boton-hover dark:text-naranja">No funcionó todavía. Espera unos segundos y prueba otra vez; si sigue igual, revisa tu internet.</p>}
              </Paso>
            </ol>
            <p className="text-sm text-tinta-suave">Las compras llegan como gasto en la categoría &quot;Por revisar&quot;: ábrelas en Movimientos para ponerles categoría.</p>
          </div>
        )
      }
    </Hoja>
  );
}

const nuevoIdLlave = () => crypto.randomUUID();

function FilaLlave({ llave, cuenta }: { llave: LlaveWallet; cuenta: Cuenta | undefined }) {
  const { borrar, avisar } = useFinanzas();
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <span className="min-w-0">
        <span className="block truncate font-medium">{cuenta?.nombre ?? "Cuenta borrada"}</span>
        <span className="block text-sm text-tinta-suave">
          {llave.ultimo_uso ? `Última compra o prueba: ${fechaCorta(llave.ultimo_uso.slice(0, 10))}` : "Aún no ha llegado nada"}
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          borrar("llaves_wallet", llave.id);
          avisar("Desconectada. Borra también la automatización en Atajos.");
        }}
        className="min-h-11 shrink-0 text-sm font-medium text-tinta-suave hover:text-tinta"
      >
        Desconectar
      </button>
    </li>
  );
}

// Para quienes tienen iPhone: el Wallet manda cada compra con Apple Pay a la app, sin escribir nada
export default function Wallet() {
  const { datos, backend } = useFinanzas();
  const [conectar, setConectar] = useState(false);
  const enNube = backend?.modo === "nube";

  return (
    <section aria-labelledby="titulo-wallet" className="rounded-2xl border border-linea bg-superficie p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tinta-fija text-white dark:bg-white dark:text-tinta-fija">
          <Icono d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7Zm0 0 11-3v3M16 13.5h.01" />
        </span>
        <div className="min-w-0">
          <h2 id="titulo-wallet" className="font-titulo text-lg font-semibold tracking-[-0.015em]">Apple Wallet</h2>
          <p className="text-sm text-tinta-suave">
            Si tienes iPhone y pagas con Apple Pay, cada compra puede llegar sola a tu cuenta: el comercio y el valor, sin escribir nada.
          </p>
        </div>
      </div>

      {datos.llaves_wallet.length > 0 && (
        <ul className="mt-4 flex flex-col divide-y divide-linea border-t border-linea">
          {datos.llaves_wallet.map((l) => <FilaLlave key={l.id} llave={l} cuenta={datos.cuentas.find((c) => c.id === l.cuenta_id)} />)}
        </ul>
      )}

      <div className="mt-4">
        {enNube ? (
          <Boton variante="suave" onClick={() => setConectar(true)}>Conectar una tarjeta</Boton>
        ) : (
          <p className="text-sm text-tinta-suave">Disponible cuando la app guarda tus datos en la nube.</p>
        )}
      </div>
      <p className="mt-3 text-sm text-tinta-suave">Solo llegan las compras pagadas con Apple Pay desde el iPhone. Las de la tarjeta física o en internet sin Apple Pay se registran a mano.</p>
      {conectar && <Conectar onCerrar={() => setConectar(false)} />}
    </section>
  );
}
