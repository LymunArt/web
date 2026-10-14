---
name: LymunArt
description: Soluciones tecnológicas que quedan a nombre del cliente. No hay nada mejor que lo propio.
colors:
  naranja-atardecer: "#D9661A"
  naranja-atardecer-hondo: "#BF5612"
  naranja-brasa: "#A8490D"
  cielo-de-madrugada: "#B8E6F9"
  cielo-hondo: "#0D4A63"
  tinta-de-noche: "#1E1B2E"
  crema: "#FAF8F5"
  superficie: "#FFFFFF"
  tinta-suave: "#4A4560"
  linea: "#E4E0EA"
  noche-fondo: "#16141F"
  noche-superficie: "#221F2E"
  noche-tinta: "#F3F0F7"
  noche-tinta-suave: "#B9B3C6"
  noche-linea: "#34304A"
  lila-reservado: "#B79CED"
  dev-negro: "#000000"
  dev-vinotinto: "#330A15"
  dev-vinotinto-vivo: "#4A1422"
  dev-texto: "#E9DFE2"
typography:
  display:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7.2vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  gutter-movil: "16px"
  gutter: "24px"
  tarjetas: "20px"
  seccion: "80px"
  seccion-amplia: "112px"
  contenedor: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.naranja-atardecer-hondo}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.lg}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.naranja-brasa}"
    textColor: "{colors.superficie}"
  link-camino:
    textColor: "{colors.tinta-de-noche}"
    typography: "{typography.label}"
  chip-decides:
    backgroundColor: "{colors.cielo-de-madrugada}"
    textColor: "{colors.tinta-de-noche}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card-servicio:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta-de-noche}"
    rounded: "{rounded.xl}"
    padding: "28px"
  button-acceso-dev:
    backgroundColor: "{colors.dev-vinotinto}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-acceso-dev-hover:
    backgroundColor: "{colors.dev-vinotinto-vivo}"
    textColor: "{colors.superficie}"
  card-dev:
    backgroundColor: "{colors.dev-vinotinto}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.xl}"
    padding: "28px"
---

# Design System: LymunArt

## Overview

**Creative North Star: "Las llaves bajo la luna"**

La ciudad del logo (una luna creciente junto a cinco edificios) es el mundo: una ciudad tranquila, construida con orden, donde cada edificio es de alguien. Las llaves son el momento que importa en ese mundo: la entrega. Todo lo que la interfaz construye apunta a ese instante en que el cliente recibe lo suyo. El naranja marca lo que es o será del cliente, y el azul cielo ilumina el camino para llegar ahí.

La superficie es calma y clara: fondo crema, mucho aire entre secciones, tipografía firme en Sora para lo que se afirma e Inter para lo que se explica. La energía vive en la respuesta, no en el adorno. Cada elemento reacciona al tocarlo, las escenas de los servicios se arman frente al visitante, las líneas del proceso se trazan de un paso al siguiente y la llave del acceso a Dev brilla una sola vez. Es una interfaz táctil y viva sobre una base serena.

LymunArt Dev es el mismo mundo de noche cerrada: negro, vinotinto y blanco, siempre oscuro, con las mismas fuentes y el mismo trato de tú. Ahí se llega con las llaves ya ganadas.

**Key Characteristics:**
- Base clara y serena; máximo tres colores con trabajo en la web: crema/blanco, Naranja Atardecer y Cielo de Madrugada, más Tinta de Noche para el texto.
- El naranja nombra lo que es tuyo: la acción principal, "lo propio" en el titular, el último paso del proceso.
- El cielo ilumina el camino: subrayados de enlaces, la página actual, las líneas de tiempo y los fondos que resaltan.
- Movimiento como respuesta: entra al llegar, responde al tocar, nunca se repite sin razón.
- Modo claro y oscuro con los mismos roles; LymunArt Dev es siempre oscuro.

## Colors

Una paleta corta y con roles fijos: un naranja cálido para actuar, un azul cielo pálido para orientar y una tinta violácea casi negra para leer, sobre crema.

### Primary
- **Naranja Atardecer** (#D9661A): el naranja de la marca para resaltar: las palabras "lo propio" del titular, el "Art" del logo de texto, los vistos de lo que incluye cada servicio y el anillo de foco del teclado.
- **Naranja Atardecer Hondo** (#BF5612): el fondo de todo lo que lleva texto blanco encima: los botones de acción ("Cuéntanos tu idea") y el círculo del último paso del proceso. Da 4.61:1 con blanco; el naranja de marca solo llega a 3.58:1. En hover baja a **Naranja Brasa** (#A8490D, 5.80:1).

### Secondary
- **Cielo de Madrugada** (#B8E6F9): el color del camino. Subraya enlaces y marca la página actual en el menú, traza las líneas de tiempo y los bordes de los pasos, rellena las etiquetas "Tú decides", tiñe el fondo de las escenas de servicios y de la franja de "Lo propio", y colorea la selección de texto. Nunca va como color de texto sobre crema (contraste 1,2:1); en modo oscuro sí puede pintar texto. Para texto sobre una franja cielo se usa **Cielo Hondo** (#0D4A63).

### Tertiary
- **Lila** (#B79CED), reservado: sigue en la guía de marca, pero en la web solo aparece en momentos especiales, como los botones de finalizar o pagar. Hoy no se usa.

### Neutral
- **Tinta de Noche** (#1E1B2E): todo el texto principal en modo claro y la franja del cierre de contacto.
- **Crema** (#FAF8F5): el fondo de la página en modo claro.
- **Superficie** (#FFFFFF): tarjetas, la tabla de comparación y los círculos de los pasos.
- **Tinta Suave** (#4A4560): texto secundario, descripciones y enlaces del footer.
- **Línea** (#E4E0EA): divisiones entre secciones y bordes de tarjetas.
- **Modo oscuro**: fondo (#16141F), superficie (#221F2E), tinta (#F3F0F7), tinta suave (#B9B3C6) y línea (#34304A). Mismos roles, otro valor.

### LymunArt Dev
- **Negro** (#000000) de fondo, **Vinotinto** (#330A15) para las tarjetas y el botón de acceso, **Vinotinto Vivo** (#4A1422) en hover, y **Texto Dev** (#E9DFE2) para el texto secundario.

**The Tres Colores Rule.** En la web trabajan solo crema/blanco, Naranja Atardecer y Cielo de Madrugada, más la tinta para leer. Cualquier otro color de la guía espera un momento especial y nombrado.

**The Naranja Es Tuyo Rule.** El naranja marca lo que el cliente hace o lo que recibe: la acción principal, lo que es suyo, la entrega. Si un elemento no es ni una acción ni algo del cliente, no es naranja.

**The Texto Blanco Va Sobre Hondo Rule.** Si un naranja lleva texto blanco encima, es Naranja Atardecer Hondo, nunca el naranja de marca: así el texto cumple el contraste AA (4.5:1).

**The Cielo No Se Lee Rule.** El cielo se ve, no se lee: va como subrayado, fondo, línea o borde, nunca como texto sobre fondo claro.

## Typography

**Display Font:** Sora (con system-ui, sans-serif)
**Body Font:** Inter (con system-ui, sans-serif)

**Character:** Sora es geométrica y firme: afirma ("No hay nada mejor que lo propio"). Inter es clara y neutra: explica sin términos técnicos. Son las únicas dos fuentes del sitio, LymunArt Dev incluido.

### Hierarchy
- **Display** (700, clamp(2.75rem, 7.2vw, 4.75rem), 1.02): el titular de la portada y de cada página. Espaciado de letras negativo (-0.035em) porque las letras grandes se ven separadas.
- **Headline** (600, 1.875rem en celular y 2.75rem desde 640 px, 1.25): el título de cada sección.
- **Title** (600, 1.125–1.25rem, 1.4): títulos de tarjetas, pasos y canales; -0.015em.
- **Body** (400, 1.125rem, 1.625): el párrafo introductorio de cada sección, con un ancho máximo cercano a 34–42rem. El texto corriente de tarjetas va a 1rem.
- **Label** (600, 0.875rem): encabezados de columna, "Incluye", "Tú" y "Nosotros", títulos del footer y enlaces de acción secundarios.

**The Tracking Por Tamaño Rule.** Cuanto más grande el texto, más apretado: -0.035em en display, -0.025em en headline, -0.015em en title y normal en el cuerpo. Nunca un mismo espaciado de letras para todos los tamaños.

**The Sin Etiqueta Rule.** Ningún título lleva una etiqueta pequeña en mayúsculas o monoespaciada encima. El título se sostiene solo.

## Layout

Un contenedor central de 72rem con márgenes laterales de 16 px en celular y 24 px desde 640 px. Las secciones respiran: 80 px arriba y abajo en celular y 112 px desde 768 px, separadas por una línea fina o por un cambio de fondo (franja cielo, franja de tinta), nunca por las dos cosas a la vez.

Cada sección de la landing abre con el mismo encabezado: el título y una frase a la izquierda y, en computador, un enlace a su página completa alineado abajo a la derecha. Las rejillas pasan a dos columnas desde 640 px (servicios, comparación) o a cuatro desde 768 px (línea de tiempo, lo que queda a tu nombre), con 20 px entre tarjetas. La portada y el cierre de contacto usan dos columnas asimétricas (aproximadamente 1.35 : 1) desde 768 px.

En celular todo se apila en orden de lectura: la comparación pone el problema arriba y la respuesta debajo, la línea de tiempo se vuelve vertical y el menú se abre como un panel a pantalla completa con la acción principal abajo, donde llega el pulgar.

**The Más Aire Arriba Rule.** Siempre hay más espacio encima de un título que debajo: el título pertenece a lo que sigue, no a lo que termina.

## Elevation & Depth

Plano por defecto. La profundidad viene del tono (crema, blanco, franja cielo, franja de tinta) y de líneas finas, no de sombras. Solo dos elementos flotan, y por una razón: el botón principal de la portada, para que sea lo primero que se toca, y la tabla de comparación, para que se despegue de la franja cielo. El encabezado es una capa translúcida que deja pasar el contenido por debajo, y su línea inferior aparece solo cuando hay algo debajo.

### Shadow Vocabulary
- **Brillo de acción** (`box-shadow: 0 6px 16px -6px rgb(191 86 18 / 0.6)`): solo bajo el botón principal de la portada.
- **Tarjeta sobre franja** (`box-shadow: 0 12px 32px -16px rgb(13 74 99 / 0.3)`): la tabla de comparación sobre la franja cielo. En oscuro, la misma forma en negro al 50%.
- **Capa del encabezado** (`backdrop-filter: blur(24px) saturate(1.5)` sobre el fondo al 80%): el encabezado fijo.

**The Una Elevación Rule.** Un elemento usa borde o sombra, nunca los dos. Una tarjeta con borde no lleva sombra.

## Shapes

Esquinas suaves y consistentes por tamaño: 6 px para el anillo de foco, 8 px para los botones pequeños del encabezado, 12 px para los botones principales, 16 px para tarjetas y paneles, y forma de píldora solo para etiquetas pequeñas ("Tú decides", "Próximamente"). Los pasos del proceso son círculos.

Las escenas de los servicios son geometría vectorial con el mismo lenguaje: contornos de 2.5 px en tinta, esquinas redondeadas proporcionales y rellenos planos de naranja, cielo y superficie. No hay sombreado ni perspectiva: son dibujos técnicos amables, no ilustraciones de personas.

## Components

### Buttons
Táctiles: responden en el instante en que se presionan.
- **Shape:** esquinas suaves (12 px).
- **Primary:** fondo Naranja Atardecer Hondo, texto blanco en Inter 600, 14 px × 24 px. Un solo botón principal por vista.
- **Hover / Active:** el fondo baja a Naranja Brasa; al presionar, el botón se encoge a 97% en 100 ms.
- **Focus:** anillo naranja de 2 px separado 3 px del botón.
- **Secundario:** no es un botón, es un enlace con subrayado cielo de 2 px y una flecha que avanza 2 px en hover.

### Chips
- **"Tú decides":** píldora con fondo cielo y texto tinta en 0.75rem 600. Marca los pasos en los que el cliente aprueba.
- **"Próximamente":** píldora con borde cielo. Marca lo que todavía no está activo; nunca se presenta algo inactivo como si funcionara.

### Cards / Containers
- **Corner Style:** 16 px.
- **Background:** superficie blanca (o superficie oscura en modo oscuro).
- **Shadow Strategy:** sin sombra; un borde de línea de 1 px que se oscurece en hover.
- **Internal Padding:** 24–28 px.
- **Tarjeta de servicio:** toda la tarjeta es un enlace. Arriba, la escena sobre un panel cielo al 35% (10% en oscuro), que sube 4 px en hover; abajo, el título, la descripción y "Ver qué incluye →".

### Navigation
- **Computador:** el logo de texto Lymun**Art** a la izquierda y los enlaces en Inter 0.875rem tinta suave. En hover y en la página actual el texto pasa a tinta con un subrayado cielo de 2 px. A la derecha van el botón de tema y "Cuéntanos tu idea".
- **Celular:** botón de dos líneas que se cruzan en una X. El panel a pantalla completa baja 8 px desde el encabezado y sube por el mismo camino; los enlaces en Sora 1.5rem entran uno tras otro (40 ms entre cada uno). La acción principal queda abajo.

### Línea de tiempo del proceso
Círculos de 48 px con borde cielo unidos por una línea cielo de 2 px. Al entrar en pantalla, la línea se traza de un paso al siguiente y cada número aparece cuando la línea llega. El último paso, la entrega, es un círculo relleno de Naranja Atardecer Hondo con el número en blanco.

### Escenas de servicios
Una escena vectorial de 320 × 200 por servicio que se arma al entrar en pantalla: bloques que crecen desde su borde, piezas que aparecen escaladas, un cursor que hace clic. Solo el dato que viaja en Automatización se repite. Sin JavaScript o con movimiento reducido se ve la escena terminada.

### Botón de acceso a Dev
La llave de la metáfora. Fondo vinotinto, texto blanco, ícono de llave y un brillo que cruza una sola vez al aparecer. Solo lo ve un cliente reconocido con tres servicios completados; con dos ve una nota discreta, "Te falta un servicio para LymunArt Dev".

## Do's and Don'ts

### Do:
- **Do** usar el naranja solo para la acción principal y para lo que es del cliente: Naranja Atardecer Hondo (#BF5612) cuando lleva texto blanco encima y Naranja Atardecer (#D9661A) para resaltar.
- **Do** resaltar enlaces y la página actual con un subrayado Cielo de Madrugada (#B8E6F9) de 2 px, dejando el texto en tinta.
- **Do** animar con la curva de salida `cubic-bezier(0.16, 1, 0.3, 1)`: entradas de 900–1000 ms con un desplazamiento de 12–20 px y un desenfoque de 6 px que se aclara, y respuesta al presionar en 100 ms (escala 0.97).
- **Do** dejar todo visible por defecto: las animaciones de entrada solo ocultan lo que todavía no está en pantalla, y con `prefers-reduced-motion` solo cambia la opacidad.
- **Do** marcar lo que aún no existe con "Próximamente" y mostrar secciones de clientes, testimonios y redes solo con datos reales.
- **Do** usar la versión negativa del logo sobre fondos oscuros y nunca mostrarlo por debajo de 64 px; en el encabezado va el logo de texto.

### Don't:
- **Don't** usar el azul cielo como color de texto sobre crema o blanco.
- **Don't** usar el lila ni otros colores de la guía en la web salvo en un momento especial nombrado, como finalizar o pagar.
- **Don't** usar otras fuentes que Sora e Inter, tampoco en LymunArt Dev.
- **Don't** poner etiquetas pequeñas en mayúsculas o monoespaciadas encima de los títulos.
- **Don't** combinar borde y sombra en el mismo elemento, ni anidar tarjetas dentro de tarjetas.
- **Don't** traer los colores de LymunArt Dev (negro y vinotinto) a la web principal, salvo el botón de acceso.
- **Don't** repetir una animación en bucle sin que cuente algo; el único bucle del sitio es el dato que viaja en Automatización.
