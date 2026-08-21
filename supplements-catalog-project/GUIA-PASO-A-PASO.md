# Guía paso a paso — Publicar tu tienda de suplementos

Esta guía cubre los pasos que faltan para dejar la tienda funcionando en
línea, gratis y sin tarjeta de crédito. Hacelos en este orden.

> **Actualización:** Firebase cambió Storage para que pida el plan de pago
> (Blaze) incluso para uso mínimo — por eso este proyecto ya NO usa Firebase
> Storage. Las fotos de producto se suben a **Cloudinary** (gratis, sin
> tarjeta). Si ya habías intentado activar Storage y te salió el aviso de
> "upgrade your project's pricing plan", ignoralo: simplemente no lo
> actives, no lo necesitás.

## Paso 1 — Crear el proyecto de Firebase (plan gratuito)

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
2. Clic en **"Crear un proyecto"** (o "Add project").
3. Ponele un nombre, por ejemplo `supplements-catalog`. Firebase le agrega un ID único automáticamente.
4. Te va a preguntar sobre Google Analytics — podés desactivarlo, no lo necesitás para esto.
5. Esperá a que termine de crear el proyecto y entrá al panel principal.
6. En el menú izquierdo, buscá **Authentication**. Clic en "Comenzar" (Get started) y activá el proveedor **"Correo electrónico/contraseña"** (Email/Password) — solo ese, no hace falta ninguno más.
7. En el menú izquierdo, **Firestore Database**. Clic en "Crear base de datos". Elegí una ubicación (cualquiera cercana, ej. `us-central` o `southamerica-east1`) y el modo **"Producción"**.
8. **No entres a "Storage"** — no lo vamos a usar, y si entrás te va a pedir upgrade a un plan de pago. Simplemente lo salteamos.
9. Ahora registrá la app web: en la página principal del proyecto (ícono de engranaje → "Configuración del proyecto", o el botón `</>` en la pantalla de inicio), clic en **"Agregar app" → ícono web `</>`**.
10. Ponele un apodo (ej. "RM web") y **NO** marques "Firebase Hosting" (vamos a usar Vercel, igual que tus otros proyectos).
11. Te va a mostrar un bloque de código con `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`. **Copiá esos valores**, los vas a necesitar en el paso 3. Podés volver a verlos después en Configuración del proyecto → tus apps.

En este punto tu proyecto sigue en el plan gratuito **Spark** — no hace falta tarjeta de crédito para nada de esto, siempre y cuando no entres a activar Storage.

## Paso 2 — Crear la cuenta gratuita de Cloudinary (para las fotos de producto)

1. Entrá a [cloudinary.com](https://cloudinary.com) y creá una cuenta gratuita con tu correo (no pide tarjeta).
2. Al entrar al Dashboard vas a ver, arriba, tu **"Cloud name"** — copialo, lo vas a necesitar.
3. Andá al ícono de engranaje (Settings) → pestaña **"Upload"**.
4. Bajá hasta "Upload presets" y clic en **"Add upload preset"**.
5. Ponele un nombre simple, por ejemplo `supplements_unsigned`.
6. En **"Signing Mode"** cambialo de "Signed" a **"Unsigned"** (esto es lo que permite subir fotos directo desde la página, sin backend). Guardá.
7. Ya tenés los dos datos que necesitás para el siguiente paso: el **Cloud name** y el **nombre del upload preset** que acabás de crear.

## Paso 3 — Configurar las variables de entorno del proyecto

1. Extraé el zip del proyecto dentro de `C:\Users\josim\OneDrive\Documentos\GitHub\SupplementsCatalog` (si todavía no lo hiciste).
2. Dentro de esa carpeta, hacé una copia del archivo `.env.example` y renombrala a `.env`.
3. Abrí `.env` con el Bloc de notas (o VS Code) y completá:

   ```
   VITE_FIREBASE_API_KEY=el-valor-de-apiKey
   VITE_FIREBASE_AUTH_DOMAIN=el-valor-de-authDomain
   VITE_FIREBASE_PROJECT_ID=el-valor-de-projectId
   VITE_FIREBASE_MESSAGING_SENDER_ID=el-valor-de-messagingSenderId
   VITE_FIREBASE_APP_ID=el-valor-de-appId

   VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=supplements_unsigned
   ```

4. Las líneas de `VITE_ADMIN_EMAIL` y `VITE_WHATSAPP_NUMBER` ya vienen con tus datos correctos — no las toques salvo que cambien.
5. Guardá el archivo. Este `.env` **no se sube a GitHub** (ya está excluido en `.gitignore`), así que tus claves quedan solo en tu computadora.

## Paso 4 — Instalar dependencias y probarlo en tu computadora

Necesitás tener [Node.js](https://nodejs.org) instalado (versión 20 o más reciente). Si no lo tenés, descargalo e instalalo primero.

1. Abrí una terminal en la carpeta del proyecto (en el Explorador de Windows: clic en la barra de direcciones, escribí `cmd`, Enter).
2. Corré:

   ```
   npm install
   ```

3. Cuando termine, corré:

   ```
   npm run dev
   ```

4. Abrí en el navegador la dirección que te muestre (`http://localhost:5173/`).
5. Probá: registrate con un correo de prueba, iniciá sesión con `jmonteroa1@ucenfotec.ac.cr` para ver el link "Admin", y cargá 1 o 2 productos de prueba con foto para confirmar que la subida a Cloudinary funciona y que el flujo completo (catálogo → modal → carrito → botón de WhatsApp) anda bien.
6. Para detener el servidor, volvé a la terminal y presioná `Ctrl + C`.

## Paso 5 — Publicar las reglas de seguridad de Firestore

Estas reglas impiden que alguien manipule precios o stock desde el navegador — solo tu hermana (con el correo admin) puede escribir productos.

1. Instalá la CLI de Firebase una sola vez:

   ```
   npm install -g firebase-tools
   ```

2. Iniciá sesión:

   ```
   firebase login
   ```

3. Dentro de la carpeta del proyecto, corré:

   ```
   firebase init firestore
   ```

4. Te va a preguntar "¿Usar un proyecto existente?" → Sí, elegí el proyecto que creaste en el paso 1. Para el archivo de reglas, dejá `firestore.rules` (ya existe con las reglas correctas — si pregunta si sobrescribir, decí que **no**).
5. Publicá las reglas:

   ```
   firebase deploy --only firestore:rules
   ```

6. Deberías ver "Deploy complete!".

## Paso 6 — Publicar el sitio gratis en Vercel

Igual que hiciste con `job-application-tracker` y `smart-expense-tracker`:
se conecta el repo de GitHub a Vercel y listo.

1. Subí el proyecto a GitHub (agregá, commit y push a `main` en tu repo `SupplementsCatalog`). El archivo `.env` no debería subirse (está en `.gitignore`).
2. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de GitHub (la misma con la que ya conectaste tus otros proyectos).
3. Clic en **"Add New… → Project"**.
4. Buscá y elegí el repo **`SupplementsCatalog`** → **"Import"**.
5. Vercel va a detectar solo que es un proyecto Vite (Framework Preset: Vite) — no hace falta tocar los comandos de build.
6. Antes de darle a "Deploy", desplegá la sección **"Environment Variables"** y agregá, una por una, estas 7 (los mismos valores que pusiste en tu `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
7. Clic en **"Deploy"**. En uno o dos minutos vas a tener una URL como `https://supplements-catalog-tu-usuario.vercel.app` (parecida a las de tus otros proyectos).
8. **Importante:** volvé a Firebase → Authentication → pestaña "Settings" → **"Authorized domains"** → agregá ese dominio de Vercel (sin `https://`, solo por ejemplo `supplements-catalog-tu-usuario.vercel.app`). Sin esto, el login funciona en tu compu pero falla en el sitio publicado.
9. De ahí en adelante, cada push a `main` en GitHub hace que Vercel vuelva a compilar y publicar solo, sin que tengas que hacer nada más.

## Un paso extra opcional — agregarlo a tu portafolio

Una vez publicado, podés agregar una tarjeta más en la sección "Proyectos"
de tu portafolio (`jossmoar.github.io`), igual que las de Job Application
Tracker y Smart Expense Tracker: nombre, descripción corta, badges de
tecnologías (React, TypeScript, Tailwind, Firebase, Cloudinary) y los
botones "Ver en vivo" (tu URL de Vercel) y "Ver código" (tu repo de
GitHub).

## Verificación final

Entrá al link de Vercel desde el celular y desde la computadora, registrate
con un correo de prueba, agregá un producto al carrito y confirmá que el
botón de WhatsApp abra el mensaje correcto con el número `63461211`. Si
algo no funciona, lo más común es: falta alguna variable de entorno en
Vercel, falta agregar el dominio autorizado en Firebase, o las reglas de
Firestore no se publicaron — avisame en qué paso te trabaste y lo
revisamos.
