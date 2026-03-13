# Portero App

Aplicación web de comunicación entre portería y residentes de un edificio. Permite al portero iniciar llamadas a departamentos y mantener un chat en tiempo real con los residentes.

## Características

- **Panel Portero**: Selección de departamentos (1-6) para iniciar llamadas
- **Panel Residente**: Atender o rechazar llamadas entrantes
- **Chat en tiempo real**: Comunicación bidireccional entre portero y residente
- **PWA**: Instalable como app en móvil, funciona offline
- **Notificaciones push**: El residente recibe una notificación cuando el portero llama (aunque la app esté cerrada)
- **Diseño responsive**: Optimizado para móviles Android y tablets
- **Firebase**: Backend con Firestore para llamadas y mensajes

## Tecnologías

- React 19 + TypeScript
- Vite 7 + vite-plugin-pwa
- React Router 7
- Firebase (Firestore)
- Web Push API + Vercel Serverless (notificaciones push, **100% gratis**)

## Requisitos previos

- Node.js 18+
- npm o pnpm

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd Portero-app

# Instalar dependencias
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las variables de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Web Push (generar con: npm run generate-vapid)
VITE_VAPID_PUBLIC_KEY=tu_clave_publica
VAPID_PUBLIC_KEY=tu_clave_publica
VAPID_PRIVATE_KEY=tu_clave_privada
```

### Configurar notificaciones push (gratis con Vercel)

1. **Generar claves VAPID:**
   ```bash
   npm run generate-vapid
   ```
   Copia las claves al `.env` local.

2. **Variables en Vercel** (Settings > Environment Variables):
   - `VAPID_PUBLIC_KEY` – clave pública (misma que VITE_VAPID_PUBLIC_KEY)
   - `VAPID_PRIVATE_KEY` – clave privada
   - `FIREBASE_SERVICE_ACCOUNT` – JSON completo de la cuenta de servicio (una sola línea, sin saltos)

3. **Desarrollo local**: Añade `VITE_API_URL=https://tu-app.vercel.app` al `.env` para que el proxy reenvíe /api a producción.

### Push no funciona – revisar

- **Residente**: Abre `/resident/X`, acepta notificaciones cuando el navegador lo pida.
- **HTTPS**: Push solo funciona con HTTPS (o localhost).
- **Vercel**: Variables correctas en Production, Preview y Development.
- **Consola**: Si hay errores al llamar (portero), revisa la consola del navegador.
- **Firestore**: Revisa que en `departments` existan documentos con `pushSubscription`.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Build

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

## Preview de producción

```bash
npm run preview
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/portero` |
| `/portero` | Panel del portero (selección de departamento) |
| `/resident/:departmentIdNumber` | Panel del residente |
| `/chat/:id` | Chat (con `?role=portero` o `?role=resident`) |
| `/waiting/:id` | Espera de respuesta del residente |

## Estructura del proyecto

```
src/
├── main.tsx
├── App.tsx
├── index.css           # Estilos globales (mobile-first)
├── router/
│   └── AppRouter.tsx
├── pages/
│   ├── PorteroPage.tsx
│   ├── Resident/ResidentPage.tsx
│   ├── Chat/ChatPage.tsx
│   └── Waiting/WaitingPage.tsx
├── componets/
│   └── MessageBubble.tsx
└── services/
    ├── firebase/
    ├── calls/          # createCall, listenCalls, finalizeCall, etc.
    ├── chat/           # sendMessage, listenMessages
    ├── device/         # registerDevice (incluye pushSubscription)
    └── messaging/      # subscribeToPush, sendPushNotification

api/                    # Vercel Serverless
└── send-push.ts        # POST /api/send-push – envía push al residente
```

## Despliegue

El proyecto está configurado para Vercel (`vercel.json`). Los deploys desde la rama principal se despliegan automáticamente.

## Licencia

Proyecto privado.
