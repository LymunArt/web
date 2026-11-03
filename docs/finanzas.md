# App de finanzas personales

Vive en `/finanzas`, con la marca LymunArt. Tiene su propio menú y no aparece en buscadores.

## Modo de prueba y nube

Sin configuración, la app corre en **modo de prueba**: las cuentas y los datos quedan solo en ese navegador.
Sirve para probarla, no para guardar información real.

Para tener cuentas de verdad:

1. Crea un proyecto de Supabase solo para esta app.
2. Aplica `supabase/migrations/20261102000000_finanzas.sql`.
3. Configura en `.env.local` y en el hosting:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

La app detecta las variables y cambia sola. Las reglas por fila de la migración hacen que cada persona vea solo lo suyo.

## Conexión con Nequi y Nu

Todo movimiento externo sigue el mismo camino (`lib/finanzas/conexiones.ts`):

```
fuente → MovimientoExterno → quitar repetidos (id_externo) → revisar → guardar
```

El extracto ya usa ese camino, en PDF (`lib/finanzas/extracto-pdf.ts`, con pdf.js en el navegador) o en CSV. Una conexión directa solo tiene que implementar el tipo `Conector`.

El lector de PDF no depende de un formato fijo: busca la fila de títulos (fecha, valor, débito, crédito, saldo) y usa la posición de cada columna para no confundir el valor con el saldo. Se probó con PDF de ejemplo, no con un extracto real de Nequi o Nu: cuando haya uno, conviene confirmar que lo lee bien.

Reglas que no se negocian:

- La app nunca pide ni guarda la clave de Nequi, de Nu o de ningún banco. Nada de leer la cuenta entrando con la clave de la persona.
- La persona autoriza en la entidad o en el agregador. En `conexiones` solo queda la referencia de ese permiso.
- Las llaves del agregador van en el servidor (route handlers), nunca en variables `NEXT_PUBLIC_`.

### Qué se sabe (consultado el 2026-11-02)

- **Decreto 0368 de 2026:** vuelve obligatorias las finanzas abiertas en Colombia. La Superfinanciera aún debe publicar el cronograma; ese plazo ya se amplió.
- **Nequi:** Belvo y Nequi anunciaron un acuerdo para compartir la información transaccional de la billetera, con permiso del usuario. Falta confirmar con Belvo la cobertura para personas naturales, el costo y los requisitos.
- **Nu Colombia:** no se encontró ningún acceso confirmado para traer movimientos.

### Pasos para activar una conexión

1. Pedirle a Belvo (u otro agregador) cobertura, precio y requisitos para Nequi y Nu en Colombia.
2. Revisar la autorización de tratamiento de datos (Ley 1581 de 2012) con quien asesore a LymunArt.
3. Implementar `Conector` en un route handler y sincronizar con `aMovimientos`.
4. Cambiar el estado del proveedor en la pantalla de Conexiones.
