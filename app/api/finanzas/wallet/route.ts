import type { NextRequest } from "next/server";

// La puerta simple para el Wallet del iPhone: el atajo solo abre un enlace, sin encabezados ni cuerpo.
// Este enlace le pasa la compra a la función de Supabase, que valida la llave y guarda el gasto en su cuenta.
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const LLAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const responder = (mensaje: string, estado: number) =>
  new Response(mensaje, { status: estado, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

async function registrar(request: NextRequest) {
  if (!URL_SUPABASE || !LLAVE_PUBLICA) return responder("La app no está conectada a la nube.", 503);
  const p = request.nextUrl.searchParams;
  const llave = p.get("llave") ?? "";
  const prueba = p.get("prueba") === "1";

  const r = await fetch(`${URL_SUPABASE}/rest/v1/rpc/registrar_compra_wallet`, {
    method: "POST",
    headers: { apikey: LLAVE_PUBLICA, "Content-Type": "application/json" },
    body: JSON.stringify({ p_llave: llave, p_comercio: p.get("comercio"), p_monto: p.get("monto"), p_prueba: prueba }),
    cache: "no-store",
  });
  if (r.ok) return responder(prueba ? "La llave funciona." : "Compra registrada en LymunArt Finanzas.", 200);
  const error = (await r.json().catch(() => null)) as { code?: string } | null;
  if (error?.code === "28000") return responder("Esa llave no existe o fue desconectada. Crea una nueva en la app.", 401);
  if (error?.code === "22023") return responder("La llave funciona, pero no llegó el valor de la compra. Si lo probaste con el botón de ejecutar, es normal: llegará solo con una compra con Apple Pay. Si no, revisa que el enlace tenga la variable Cantidad.", 400);
  return responder("No pudimos registrar la compra. Inténtalo más tarde.", 502);
}

export const GET = registrar;
export const POST = registrar;
