# Stilista

App para peluquerías, centros de estilistas y salones de uñas. Un solo archivo (`index.html`), sin dependencias ni build.

## Qué incluye

**Para la clienta**
- Cuenta con email y contraseña
- Reserva de turnos: servicio → profesional → día y hora
- Avisos de turno confirmado, horario propuesto por el salón, cancelación
- Cambio y cancelación de turnos (hasta X horas antes, configurable)
- Seña opcional para reservar (transferencia o Mercado Pago)
- Tienda online con retiro en el salón (también sin cuenta)
- Pasaporte de color: historial de tonos, fórmulas y esmaltes

**Para el salón** (acceso con usuario y contraseña)
- Agenda del día y solicitudes de turno: aceptar, rechazar o proponer otro horario
- Fichas de clientas y registro de cada servicio en su pasaporte
- Pedidos y stock de la tienda
- Ajustes: datos del salón, horarios, servicios y precios, datos para el pago, seña

## Demo

- Clienta demo: botón "Probar como clienta demo" (sofia@demo.com / 1234)
- Salón: "Acceso salón" → usuario `salon` / contraseña `admin` (cambiarlos en Ajustes)

## Importante

Esta versión guarda los datos en el navegador (localStorage): sirve como demo. Para uso real con varios dispositivos hay que conectarla a una base de datos (Firebase).

## Deploy

Vercel → Add New → Project → importar este repo → Deploy. No requiere configuración.
