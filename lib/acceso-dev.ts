// Regla de LymunArt Dev: con 2 servicios completados el cliente está a uno de ganarlo;
// al completar el tercero se le activa el acceso.
export const SERVICIOS_PARA_DEV = 3;

export type EstadoDev = "sin-acceso" | "a-uno" | "activo";

export function estadoDev(serviciosCompletados: number): EstadoDev {
  if (serviciosCompletados >= SERVICIOS_PARA_DEV) return "activo";
  if (serviciosCompletados === SERVICIOS_PARA_DEV - 1) return "a-uno";
  return "sin-acceso";
}

// Servicios completados del cliente que está viendo la página.
// Todavía no hay cuentas de clientes, así que nadie es reconocido (null) y el botón no aparece.
// Cuando exista el inicio de sesión, esta función debe leer la sesión y devolver su número de servicios.
export function serviciosDelClienteActual(): number | null {
  return null;
}
