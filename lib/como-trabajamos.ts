// El cliente decide en cada paso; LymunArt propone y guía.
export const pasos = [
  {
    titulo: "Nos cuentas",
    texto: "Nos explicas qué necesitas con tus palabras, sin términos técnicos.",
    tu: "Explicas qué necesitas, como lo dirías en tu negocio.",
    nosotros: "Escuchamos y te hacemos las preguntas necesarias para entenderlo bien.",
    decides: false,
  },
  {
    titulo: "Te proponemos",
    texto: "Recibes una propuesta clara con tiempos y costos. Tú decides si seguimos.",
    tu: "Revisas la propuesta y decides si seguimos.",
    nosotros: "Preparamos una propuesta clara, con tiempos y costos.",
    decides: true,
  },
  {
    titulo: "Construimos contigo",
    texto: "Te mostramos los avances y apruebas cada etapa antes de continuar.",
    tu: "Apruebas cada etapa antes de continuar.",
    nosotros: "Construimos y te mostramos los avances.",
    decides: true,
  },
  {
    titulo: "Te entregamos lo tuyo",
    texto: "El código, los datos y los accesos quedan a tu nombre.",
    tu: "Recibes tu sistema funcionando, y con él el control.",
    nosotros: "Dejamos el código, los datos y los accesos a tu nombre.",
    decides: false,
  },
] as const;
