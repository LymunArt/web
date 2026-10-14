// La comparación entre depender de un proveedor y tener lo propio.
export const comparacion = [
  {
    proveedor: "Pagas cada mes por usar un sistema que no es tuyo.",
    propio: "Pagas por construirlo una vez, y queda a tu nombre.",
  },
  {
    proveedor: "Tus datos viven en los servidores de otra empresa.",
    propio: "Tus datos son tuyos y los llevas a donde quieras.",
  },
  {
    proveedor: "Si el proveedor sube precios o cierra, te quedas sin herramienta.",
    propio: "Tu sistema sigue funcionando, decida lo que decida otro.",
  },
  {
    proveedor: "El sistema es igual para todos sus clientes.",
    propio: "Se adapta a cómo trabaja tu empresa, no al revés.",
  },
] as const;

// Lo que queda a nombre del cliente al terminar cada proyecto (/lo-propio).
export const aTuNombre = [
  {
    titulo: "El código",
    texto: "El programa que hace funcionar tu página, tu app o tu sistema. Es tuyo, y si un día quieres trabajar con otra persona, se lo puedes entregar.",
  },
  {
    titulo: "Los datos",
    texto: "Tus clientes, inventarios, pedidos y reportes. Viven donde tú decidas y los puedes llevar a donde quieras.",
  },
  {
    titulo: "El dominio",
    texto: "La dirección de tu página en internet queda registrada a tu nombre, no al nuestro.",
  },
  {
    titulo: "Los accesos",
    texto: "Las cuentas y contraseñas de cada servicio te las entregamos a ti. Nadie más tiene la última palabra.",
  },
] as const;
