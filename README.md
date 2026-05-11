# Airbnb Group Frontend

Aplicación frontend del proyecto académico de arquitectura en la nube y microservicios, inspirada en flujos clave de Airbnb: autenticación, publicación de alojamientos, reservas y reseñas.

## Características principales

- Registro y confirmación de cuenta.
- Inicio/cierre de sesión con refresco automático de sesión.
- Dashboard con comportamiento por rol (`guest` y `host`).
- Publicación y gestión local de alojamientos.
- Creación y consulta de reservas.
- Reseñas por alojamiento (con bloqueo de autorreseña para el dueño).
- UI moderna con `Tailwind CSS v4` + componentes `shadcn`.

## Stack tecnológico

- `React 18` + `TypeScript`
- `Vite 6`
- `Tailwind CSS v4`
- `shadcn/ui` + `lucide-react`
- `Zustand` (estado global y persistencia local)
- `Axios` (cliente HTTP con interceptores de auth)

## Estructura del proyecto

```txt
src/
  components/         # UI reutilizable y layout
  features/
    auth/             # login, tokens, store e interceptor
    listings/         # alta/listado de alojamientos
    bookings/         # creación y detalle de reservas
    reviews/          # creación y listado de reseñas
    users/            # sincronización de usuario interno
  pages/              # pantallas por ruta
  routers/            # definición de rutas protegidas/públicas
  main.tsx            # punto de entrada real (usa AppRouter)
```

Nota: `src/App.tsx` quedó como archivo de plantilla, pero la app corre con `src/main.tsx` + `src/routers/AppRouter.tsx`.

## Requisitos

- `Node.js` 20 o superior (recomendado)
- `npm` 10 o superior
- Backend/API Gateway de microservicios disponible

## Configuración de entorno

1. Copia el archivo de variables:

```bash
cp template.env .env
```

2. Configura las variables:

```env
VITE_API_URL=/v1
VITE_API_TARGET=https://tu-api-gateway.amazonaws.com/prod
```

### ¿Para qué sirve cada variable?

- `VITE_API_URL`: base URL usada por Axios en el frontend.
- `VITE_API_TARGET`: destino del proxy de Vite para desarrollo local.

En desarrollo, Vite proxya rutas `/v1/*` hacia `VITE_API_TARGET`.

## Ejecución local

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev`: levanta servidor de desarrollo.
- `npm run build`: compila TypeScript y genera build de producción.
- `npm run preview`: sirve localmente el build generado.
- `npm run lint`: ejecuta ESLint.

## Rutas principales

### Públicas

- `/`
- `/login`
- `/register`

### Protegidas

- `/dashboard`
- `/host/listings`
- `/host/listings/new`
- `/trips`
- `/trips/new`
- `/trips/:bookingId`
- `/listings/:listingId/reviews`

## Integración con backend (endpoints esperados)

El frontend consume principalmente estos endpoints:

- Auth: `POST /auth/register`, `POST /auth/confirm`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- Listings: `GET /listings`, `GET /listings/my`, `POST /listings`
- Bookings: `GET /bookings/my`, `GET /bookings/:bookingId`, `POST /bookings`
- Reviews: `GET /reviews/listing/:listingId`, `POST /reviews`
- Users interno: `POST /users`

## Notas importantes de autenticación

- El cliente usa `withCredentials: true` para enviar cookies (refresh token).
- Se inyecta `Authorization: Bearer <token>` en requests autenticados.
- Si llega un `401`, se intenta `refresh` automático y se reintenta la petición original.

## Estado actual del proyecto

- Incluye linting con ESLint.
- No hay tests automatizados configurados aún.
- Se usa persistencia local (`localStorage`) para stores de listings/bookings.
