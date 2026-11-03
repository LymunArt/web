import { datosVacios, type Coleccion, type Datos } from "./tipos";

export type Usuario = { id: string; nombre: string; correo: string };

// Todo lo que la app necesita de un backend. La interfaz no sabe si habla con este navegador o con la nube.
export type Backend = {
  modo: "prueba" | "nube";
  sesion(): Promise<Usuario | null>;
  // Devuelve null cuando el correo pide confirmación antes de poder entrar
  registrar(nombre: string, correo: string, clave: string): Promise<Usuario | null>;
  entrar(correo: string, clave: string): Promise<Usuario>;
  salir(): Promise<void>;
  cargar(usuario: Usuario): Promise<Datos>;
  guardar<C extends Coleccion>(usuario: Usuario, coleccion: C, filas: Datos[C]): Promise<void>;
  borrar(usuario: Usuario, coleccion: Coleccion, id: string): Promise<void>;
  // Entrada con la huella o el rostro del dispositivo (passkeys). Solo existe con cuentas en la nube.
  huella?: {
    entrar(): Promise<Usuario>;
    registrar(): Promise<void>;
    tieneAlguna(): Promise<boolean>;
  };
};

// El dispositivo puede pedir huella, rostro o PIN para entrar
export const dispositivoAdmiteHuella = () =>
  typeof window !== "undefined" && "PublicKeyCredential" in window && window.isSecureContext;

export class ErrorDeCuenta extends Error {}

// Lo que Supabase responde, dicho en palabras de la persona. Así sabe qué hacer en vez de un "no se pudo".
function motivoDeCuenta(codigo: string | undefined, porDefecto: string) {
  switch (codigo) {
    case "email_address_not_authorized":
      return "Todavía no podemos enviar correos a esa dirección. Avísale a quien te invitó para que habilite el registro.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Se enviaron muchos correos en poco tiempo. Espera unos minutos e inténtalo otra vez.";
    case "user_already_exists":
    case "email_exists":
      return "Ya hay una cuenta con ese correo. Toca Entrar.";
    case "weak_password":
      return "Esa clave es muy fácil de adivinar. Usa una más larga, con letras y números.";
    case "email_address_invalid":
      return "Revisa tu correo: no parece una dirección válida.";
    case "email_not_confirmed":
      return "Todavía no confirmas tu correo. Abre el enlace que te enviamos y vuelve a entrar.";
    case "signup_disabled":
      return "El registro de cuentas nuevas está cerrado por ahora.";
    default:
      return porDefecto;
  }
}

const CLAVE_USUARIOS = "finanzas:usuarios";
const CLAVE_SESION = "finanzas:sesion";
const claveDatos = (id: string) => `finanzas:datos:${id}`;

type UsuarioLocal = Usuario & { sal: string; huella: string };

const leerUsuarios = (): UsuarioLocal[] => JSON.parse(localStorage.getItem(CLAVE_USUARIOS) ?? "[]");
const aHex = (bytes: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(bytes as ArrayBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function huellaDeClave(clave: string, sal: string) {
  const llave = await crypto.subtle.importKey("raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(sal), iterations: 150000 },
    llave,
    256,
  );
  return aHex(bits);
}

const publico = ({ id, nombre, correo }: UsuarioLocal): Usuario => ({ id, nombre, correo });

function leerDatos(id: string): Datos {
  return { ...datosVacios(), ...JSON.parse(localStorage.getItem(claveDatos(id)) ?? "{}") };
}

// Modo de prueba: cuentas y datos solo en este navegador. Sirve para probar la app, no para guardar plata de verdad.
export const backendPrueba: Backend = {
  modo: "prueba",
  async sesion() {
    const id = localStorage.getItem(CLAVE_SESION);
    const usuario = leerUsuarios().find((u) => u.id === id);
    return usuario ? publico(usuario) : null;
  },
  async registrar(nombre, correo, clave) {
    const usuarios = leerUsuarios();
    const correoLimpio = correo.trim().toLowerCase();
    if (usuarios.some((u) => u.correo === correoLimpio)) {
      throw new ErrorDeCuenta("Ya hay una cuenta con ese correo. Prueba entrando.");
    }
    const sal = aHex(crypto.getRandomValues(new Uint8Array(16)));
    const usuario: UsuarioLocal = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      correo: correoLimpio,
      sal,
      huella: await huellaDeClave(clave, sal),
    };
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, usuario]));
    localStorage.setItem(CLAVE_SESION, usuario.id);
    return publico(usuario);
  },
  async entrar(correo, clave) {
    const usuario = leerUsuarios().find((u) => u.correo === correo.trim().toLowerCase());
    if (!usuario || (await huellaDeClave(clave, usuario.sal)) !== usuario.huella) {
      throw new ErrorDeCuenta("El correo o la clave no coinciden. Revísalos e inténtalo otra vez.");
    }
    localStorage.setItem(CLAVE_SESION, usuario.id);
    return publico(usuario);
  },
  async salir() {
    localStorage.removeItem(CLAVE_SESION);
  },
  async cargar(usuario) {
    return leerDatos(usuario.id);
  },
  async guardar(usuario, coleccion, filas) {
    const datos = leerDatos(usuario.id);
    const nuevas = new Map((filas as { id: string }[]).map((f) => [f.id, f]));
    const lista = (datos[coleccion] as { id: string }[]).map((f) => {
      const nueva = nuevas.get(f.id);
      if (nueva) nuevas.delete(f.id);
      return nueva ?? f;
    });
    (datos[coleccion] as unknown[]) = [...lista, ...nuevas.values()];
    localStorage.setItem(claveDatos(usuario.id), JSON.stringify(datos));
  },
  async borrar(usuario, coleccion, id) {
    const datos = leerDatos(usuario.id);
    (datos[coleccion] as unknown[]) = (datos[coleccion] as { id: string }[]).filter((f) => f.id !== id);
    localStorage.setItem(claveDatos(usuario.id), JSON.stringify(datos));
  },
};

const COLECCIONES: Coleccion[] = ["cuentas", "movimientos", "deudas", "pagos_deuda", "proyectos", "presupuesto", "por_cobrar", "conexiones", "compras_tax_free"];

// Nube: se activa sola al configurar las dos variables de entorno de Supabase (ver docs/finanzas.md).
// Cada usuario solo ve sus filas porque la base lo impone con reglas de seguridad por fila.
async function crearBackendNube(url: string, llave: string): Promise<Backend> {
  const { createClient } = await import("@supabase/supabase-js");
  const cliente = createClient(url, llave);

  const aUsuario = (u: { id: string; email?: string; user_metadata?: { nombre?: string } }): Usuario => ({
    id: u.id,
    correo: u.email ?? "",
    nombre: u.user_metadata?.nombre ?? u.email ?? "",
  });
  const fallo = (error: { message: string } | null) => {
    if (error) throw new Error(error.message);
  };

  return {
    modo: "nube",
    async sesion() {
      const { data } = await cliente.auth.getSession();
      return data.session ? aUsuario(data.session.user) : null;
    },
    async registrar(nombre, correo, clave) {
      const { data, error } = await cliente.auth.signUp({
        email: correo.trim(),
        password: clave,
        // El enlace del correo de confirmación vuelve a la app, en el sitio donde se creó la cuenta
        options: { data: { nombre: nombre.trim() }, emailRedirectTo: `${window.location.origin}/finanzas` },
      });
      if (error) throw new ErrorDeCuenta(motivoDeCuenta(error.code, "No pudimos crear tu cuenta. Inténtalo otra vez en unos minutos."));
      return data.session && data.user ? aUsuario(data.user) : null;
    },
    async entrar(correo, clave) {
      const { data, error } = await cliente.auth.signInWithPassword({ email: correo.trim(), password: clave });
      if (error || !data.user) {
        throw new ErrorDeCuenta(motivoDeCuenta(error?.code, "El correo o la clave no coinciden. Revísalos e inténtalo otra vez."));
      }
      return aUsuario(data.user);
    },
    async salir() {
      fallo((await cliente.auth.signOut()).error);
    },
    async cargar() {
      const datos = datosVacios();
      await Promise.all(
        COLECCIONES.map(async (coleccion) => {
          const { data, error } = await cliente.from(coleccion).select("*");
          // Una tabla que todavía no existe (se publicó la app antes de crearla) no debe tumbar todo lo demás
          if (error?.code === "PGRST205") return;
          fallo(error);
          (datos[coleccion] as unknown[]) = data ?? [];
        }),
      );
      return datos;
    },
    async guardar(_usuario, coleccion, filas) {
      if (filas.length) fallo((await cliente.from(coleccion).upsert(filas as object[])).error);
    },
    async borrar(_usuario, coleccion, id) {
      fallo((await cliente.from(coleccion).delete().eq("id", id)).error);
    },
    huella: {
      async entrar() {
        const { data, error } = await cliente.auth.signInWithPasskey();
        if (error || !data.user) {
          throw new ErrorDeCuenta("No pudimos entrar con tu huella. Inténtalo otra vez o entra con tu correo y clave.");
        }
        return aUsuario(data.user);
      },
      async registrar() {
        const { error } = await cliente.auth.registerPasskey();
        if (error) throw new ErrorDeCuenta("No se activó la huella. Puedes intentarlo otra vez cuando quieras.");
      },
      async tieneAlguna() {
        const { data } = await cliente.auth.passkey.list();
        return (data?.length ?? 0) > 0;
      },
    },
  };
}

export async function obtenerBackend(): Promise<Backend> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && llave ? crearBackendNube(url, llave) : backendPrueba;
}
