"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { desglosarPago, enPesos } from "@/lib/finanzas/calculos";
import { datosEjemplo } from "@/lib/finanzas/ejemplo";
import { mesActual, nuevoId } from "@/lib/finanzas/formato";
import { obtenerBackend, type Backend, type Usuario } from "@/lib/finanzas/repositorio";
import { obtenerTasas } from "@/lib/finanzas/tasas";
import { datosVacios, type Coleccion, type Datos, type Movimiento, type PagoDeuda } from "@/lib/finanzas/tipos";

type Aviso = { id: number; texto: string; deshacer?: () => void };
export type PeticionRegistro = { inicial?: Partial<Movimiento> };

type Finanzas = {
  backend: Backend | null;
  usuario: Usuario | null;
  cargando: boolean;
  datos: Datos;
  mes: string;
  setMes: (mes: string) => void;
  aviso: Aviso | null;
  avisar: (texto: string, deshacer?: () => void) => void;
  cerrarAviso: () => void;
  registro: PeticionRegistro | null;
  abrirRegistro: (peticion?: PeticionRegistro) => void;
  cerrarRegistro: () => void;
  alEntrar: (usuario: Usuario) => Promise<void>;
  salir: () => Promise<void>;
  guardar: <C extends Coleccion>(coleccion: C, filas: Datos[C]) => void;
  borrar: (coleccion: Coleccion, id: string) => void;
  guardarMovimiento: (movimiento: Movimiento) => void;
  borrarMovimiento: (movimiento: Movimiento) => void;
  cargarEjemplo: () => void;
};

const Contexto = createContext<Finanzas | null>(null);

export function useFinanzas() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useFinanzas va dentro de ProveedorFinanzas");
  return valor;
}

const mezclar = <T extends { id: string }>(lista: T[], filas: T[]) => {
  const nuevas = new Map(filas.map((f) => [f.id, f]));
  const actualizada = lista.map((f) => {
    const nueva = nuevas.get(f.id);
    if (nueva) nuevas.delete(f.id);
    return nueva ?? f;
  });
  return [...actualizada, ...nuevas.values()];
};

export function ProveedorFinanzas({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<Datos>(datosVacios);
  // La fecha se lee ya en el navegador: la página se prepara de antemano y allí aún no hay "hoy"
  const [mes, setMes] = useState("");
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [registro, setRegistro] = useState<PeticionRegistro | null>(null);

  // Referencias para que las acciones lean siempre lo último sin esperar a otro render
  const datosRef = useRef(datos);
  const contadorAviso = useRef(0);

  const fijarDatos = useCallback((siguiente: Datos) => {
    datosRef.current = siguiente;
    setDatos(siguiente);
  }, []);

  const avisar = useCallback((texto: string, deshacer?: () => void) => {
    contadorAviso.current += 1;
    setAviso({ id: contadorAviso.current, texto, deshacer });
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const reloj = setTimeout(() => setAviso(null), aviso.deshacer ? 6000 : 3500);
    return () => clearTimeout(reloj);
  }, [aviso]);

  useEffect(() => {
    (async () => {
      setMes(mesActual());
      try {
        const elegido = await obtenerBackend();
        setBackend(elegido);
        const sesion = await elegido.sesion();
        if (sesion) {
          fijarDatos(await elegido.cargar(sesion));
          setUsuario(sesion);
        }
      } catch {
        avisar("No pudimos cargar tus datos. Revisa tu conexión y recarga la página.");
      } finally {
        setCargando(false);
      }
    })();
  }, [avisar, fijarDatos]);

  const persistir = useCallback(
    (accion: () => Promise<void>) => {
      accion().catch(() => avisar("No se pudo guardar el último cambio. Revisa tu conexión y vuelve a intentarlo."));
    },
    [avisar],
  );

  const guardar = useCallback(
    <C extends Coleccion>(coleccion: C, filas: Datos[C]) => {
      if (!backend || !usuario) return;
      const actual = datosRef.current;
      fijarDatos({ ...actual, [coleccion]: mezclar(actual[coleccion] as { id: string }[], filas as { id: string }[]) });
      persistir(() => backend.guardar(usuario, coleccion, filas));
    },
    [backend, usuario, fijarDatos, persistir],
  );

  const borrar = useCallback(
    (coleccion: Coleccion, id: string) => {
      if (!backend || !usuario) return;
      const actual = datosRef.current;
      fijarDatos({ ...actual, [coleccion]: (actual[coleccion] as { id: string }[]).filter((f) => f.id !== id) });
      persistir(() => backend.borrar(usuario, coleccion, id));
    },
    [backend, usuario, fijarDatos, persistir],
  );

  // Un pago de deuda guarda dos cosas: el movimiento y su desglose en interés, capital y otros cobros
  const guardarMovimiento = useCallback(
    (movimiento: Movimiento) => {
      const anterior = datosRef.current.pagos_deuda.find((p) => p.movimiento_id === movimiento.id);
      guardar("movimientos", [movimiento]);
      if (anterior) borrar("pagos_deuda", anterior.id);
      if (movimiento.tipo !== "pago_deuda" || !movimiento.deuda_id) return;
      const deuda = datosRef.current.deudas.find((d) => d.id === movimiento.deuda_id);
      if (!deuda) return;
      const pagos = datosRef.current.pagos_deuda;
      const pago: PagoDeuda = {
        id: nuevoId(),
        deuda_id: deuda.id,
        movimiento_id: movimiento.id,
        numero_cuota: deuda.cuotas_pagadas + pagos.filter((p) => p.deuda_id === deuda.id).length + 1,
        fecha: movimiento.fecha,
        // Las deudas van en pesos: un pago desde una cuenta en dólares se convierte con su tasa
        monto_pagado: Math.round(enPesos(movimiento)),
        ...desglosarPago(deuda, pagos, Math.round(enPesos(movimiento))),
      };
      guardar("pagos_deuda", [pago]);
    },
    [guardar, borrar],
  );

  const borrarMovimiento = useCallback(
    (movimiento: Movimiento) => {
      const pago = datosRef.current.pagos_deuda.find((p) => p.movimiento_id === movimiento.id);
      if (pago) borrar("pagos_deuda", pago.id);
      borrar("movimientos", movimiento.id);
      avisar("Movimiento borrado", () => guardarMovimiento(movimiento));
    },
    [borrar, avisar, guardarMovimiento],
  );

  const alEntrar = useCallback(
    async (nuevo: Usuario) => {
      if (!backend) return;
      fijarDatos(await backend.cargar(nuevo));
      setUsuario(nuevo);
    },
    [backend, fijarDatos],
  );

  const salir = useCallback(async () => {
    await backend?.salir();
    setUsuario(null);
    fijarDatos(datosVacios());
  }, [backend, fijarDatos]);

  // Por seguridad: si la app pasa más de 10 minutos en segundo plano, hay que volver a entrar (con la huella es un toque)
  useEffect(() => {
    if (!usuario || backend?.modo !== "nube") return;
    let ocultaDesde = 0;
    const alCambiar = () => {
      if (document.hidden) ocultaDesde = Date.now();
      else if (ocultaDesde && Date.now() - ocultaDesde > 10 * 60_000) {
        salir();
        avisar("Por seguridad cerramos tu sesión. Entra de nuevo.");
      }
    };
    document.addEventListener("visibilitychange", alCambiar);
    return () => document.removeEventListener("visibilitychange", alCambiar);
  }, [usuario, backend, salir, avisar]);

  // Lo que manda el Wallet en otra moneda llega sin tasa (la base no la conoce): se completa con la del día
  useEffect(() => {
    const sinTasa = datos.movimientos.filter((m) => m.origen === "wallet" && m.moneda !== "COP" && Number(m.tasa) === 1);
    if (!usuario || !sinTasa.length) return;
    obtenerTasas().then((tasas) => {
      const conTasa = sinTasa.flatMap((m) => (tasas?.pesosPor[m.moneda] ? [{ ...m, tasa: tasas.pesosPor[m.moneda] }] : []));
      if (conTasa.length) guardar("movimientos", conTasa);
    });
  }, [usuario, datos.movimientos, guardar]);

  const cargarEjemplo = useCallback(() => {
    const ejemplo = datosEjemplo();
    (Object.keys(ejemplo) as Coleccion[]).forEach((c) => {
      if (ejemplo[c].length) guardar(c, ejemplo[c] as never);
    });
    avisar("Listo: estos datos son de ejemplo");
  }, [guardar, avisar]);

  const valor = useMemo<Finanzas>(
    () => ({
      backend, usuario, cargando, datos, mes, setMes, aviso, avisar,
      cerrarAviso: () => setAviso(null),
      registro,
      abrirRegistro: (peticion = {}) => setRegistro(peticion),
      cerrarRegistro: () => setRegistro(null),
      alEntrar, salir, guardar, borrar, guardarMovimiento, borrarMovimiento, cargarEjemplo,
    }),
    [backend, usuario, cargando, datos, mes, aviso, avisar, registro, alEntrar, salir, guardar, borrar, guardarMovimiento, borrarMovimiento, cargarEjemplo],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
