# Rediseño de la landing de LymunArt

Brief para el rediseño, a partir de una revisión externa y de las decisiones del fundador (14 de octubre de 2026).
Hacerlo con las skills **Impeccable** y **apple-design** (Emil Kowalski), siguiendo los patrones de una buena landing page.

## Decisiones ya tomadas

| Tema | Decisión |
|---|---|
| Colores de la web | Máximo 3: base clara (fondo crema / blanco), **naranja** `#D9661A` como primario (botones, acciones) y **azul cielo** `#B8E6F9` para resaltar enlaces y palabras. Tinta `#1E1B2E` para el texto. |
| Resto de la paleta | El lila `#B79CED` y los demás colores siguen en la guía de marca, pero en la web se reservan para momentos especiales, por ejemplo los botones de finalizar o pagar. |
| Fuentes | Solo **Sora** (títulos) e **Inter** (texto), en toda la web, incluida LymunArt Dev. |
| Tono | **Tú** en toda la web, incluida LymunArt Dev. |
| LymunArt Dev | Conserva su identidad negro `#000000` + vinotinto `#330A15` + texto blanco. **No aparece como sección de la landing principal**: vive en su propio apartado (`/dev`), con su propio navbar y footer, y una forma clara de volver a LymunArt. |
| Logo | No se modifica. Versiones en `public/logo/`. En modo oscuro se usa la versión negativa. |
| Modo claro/oscuro | Ya existe el botón sol/luna (`components/BotonTema.tsx`); se mantiene. |

## Cambios pedidos

1. **Menú en celular**: hoy las opciones del menú no aparecen en mobile. Agregar un menú móvil.
2. **Sección de clientes** para generar confianza. ⚠️ Solo con clientes y testimonios **reales**, nunca inventados. Datos pendientes del fundador.
3. **Redes sociales**: enlaces externos en el footer. Pendiente: el fundador aún no tiene cuentas de la empresa.
4. **Tarjetas de servicios**: agregar una imagen, ilustración o animación a cada una.
5. **Páginas propias para cada opción del navbar** (por ejemplo `/servicios`, `/como-trabajamos`), para SEO y *sitelinks* de Google, cada una con su `metadata`.
6. **Animaciones de entrada** tipo *fade in* en cada sección, sutiles. Respetar `prefers-reduced-motion`.
7. **Hero**: resaltar las palabras "lo propio" del eslogan *No hay nada mejor que lo propio*.
8. **Quitar la franja de LymunArt Dev** de la landing principal (ver decisiones).

## Contexto del negocio

- LymunArt ofrece mantenimiento de equipos, páginas web, apps (Play Store / App Store) y automatización, para que las empresas tengan su propia tecnología en vez de depender de proveedores.
- El cliente debe sentirse el que decide ("el patrón"), sin sentir que sabe más que LymunArt.
- LymunArt Dev se desbloquea cuando un cliente completa su tercer servicio.
- Contacto: asistente de IA (fase 3) y WhatsApp (sin número todavía). Por ahora se muestran como "Próximamente".
- Stack: Next.js 16 (App Router, `cacheComponents`), Tailwind v4 con PostCSS, TypeScript. Despliegue automático en Vercel con cada push a `main`.
