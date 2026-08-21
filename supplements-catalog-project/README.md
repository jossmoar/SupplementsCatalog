# RM — Catálogo de suplementos

Tienda de suplementos (proteínas, creatinas, vitaminas, colágeno, bienestar y
accesorios) con catálogo, carrito y checkout por WhatsApp. Panel de
administración exclusivo para agregar/editar productos.

**Stack:** React + TypeScript + Vite + Tailwind CSS + Firebase (Auth,
Firestore) + Cloudinary (fotos de producto). Todo corre 100% en el
navegador (sin backend propio), así que se aloja gratis en **Vercel**
(igual que tus otros proyectos del portafolio) y se queda en el plan
gratuito **Spark** de Firebase — no hace falta activar facturación
(Blaze) ni tarjeta de crédito en ningún lado.

> Nota: no usamos Firebase Storage para las fotos porque Google cambió esa
> parte de Firebase para que pida el plan de pago (Blaze) incluso para uso
> mínimo. En su lugar, las fotos se suben a **Cloudinary**, que tiene un
> plan gratuito generoso y no pide tarjeta.

## 1. Crear el proyecto de Firebase (gratis)

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) y creá un proyecto nuevo (plan Spark, gratuito).
2. En **Compilación → Authentication**, activá el método "Correo electrónico/contraseña".
3. En **Compilación → Firestore Database**, creá la base de datos (modo producción).
4. En **Configuración del proyecto → Tus apps**, agregá una app web (ícono `</>`) y copiá el objeto `firebaseConfig` que te muestra.

No actives Storage — no lo necesitamos.

## 2. Crear la cuenta gratuita de Cloudinary (para las fotos)

1. Entrá a [cloudinary.com](https://cloudinary.com) y creá una cuenta gratuita (no pide tarjeta).
2. En el Dashboard vas a ver tu **"Cloud name"** — copialo.
3. Andá a **Settings (ícono de engranaje) → Upload** → sección "Upload presets" → **"Add upload preset"**.
4. Ponele un nombre fácil de recordar (ej. `supplements_unsigned`), y en "Signing Mode" elegí **"Unsigned"**. Guardá.
5. Ya tenés los dos datos que necesitás: el **Cloud name** y el **nombre del upload preset**.

## 3. Configurar las variables de entorno

Copiá `.env.example` como `.env` y completá los valores de Firebase (paso 1) y Cloudinary (paso 2):

```
cp .env.example .env
```

`VITE_ADMIN_EMAIL` y `VITE_WHATSAPP_NUMBER` ya vienen puestos con tus datos
(`jmonteroa1@ucenfotec.ac.cr` y `50263461211`, Guatemala). Cambialos ahí si
alguno cambia.

**El archivo `.env` nunca se sube a GitHub** (ya está en `.gitignore`).

## 4. Instalar dependencias y correr en local

```
npm install
npm run dev
```

Abrí `http://localhost:5173` — vas a poder registrarte, ver el catálogo
(vacío al inicio) y navegar. Iniciá sesión con
`jmonteroa1@ucenfotec.ac.cr` para ver el link "Admin" en el menú y cargar
los primeros productos ahí.

## 5. Publicar las reglas de seguridad de Firestore

Estas reglas son las que impiden que un cliente modifique precios o stock
desde el navegador — solo la cuenta admin puede escribir productos.

1. Instalá la CLI de Firebase una sola vez: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init firestore` (elegí el proyecto que creaste, aceptá usar `firestore.rules` que ya está en este repo)
4. `firebase deploy --only firestore:rules`

## 6. Publicar gratis en Vercel

Igual que `job-application-tracker` y `smart-expense-tracker`: se conecta
el repo de GitHub a Vercel y cada push a `main` se publica solo.

1. Subí el proyecto a tu repo de GitHub `SupplementsCatalog` (el `.env` no se sube, ya está en `.gitignore`).
2. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de GitHub.
3. Clic en **"Add New… → Project"**, elegí el repo `SupplementsCatalog` e **"Import"**.
4. Vercel detecta automáticamente que es un proyecto Vite — dejá el framework preset y los comandos de build por defecto.
5. Antes de darle a "Deploy", abrí la sección **"Environment Variables"** y agregá estas 7 (los mismos valores de tu `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
6. Clic en **"Deploy"**. En uno o dos minutos vas a tener tu URL, algo como `https://supplements-catalog-tu-usuario.vercel.app`.
7. En Firebase → Authentication → Settings → **Authorized domains**, agregá ese dominio de Vercel (sin `https://`), por ejemplo `supplements-catalog-tu-usuario.vercel.app`. Sin esto, el login funciona en tu compu pero no en el sitio publicado.
8. Desde ese momento, cada vez que hagas push a `main` en GitHub, Vercel vuelve a compilar y publicar automáticamente — nada manual.

## Cómo agregar productos (como admin)

1. Iniciá sesión con `jmonteroa1@ucenfotec.ac.cr`.
2. Andá a **Admin** en el menú.
3. Completá nombre, precio, género (Unisex/Hombres/Mujeres), categoría,
   presentación, beneficios, modo de uso, stock y subí una foto (se sube a
   Cloudinary automáticamente).
4. El producto aparece al instante en el catálogo para todos los visitantes.

## Cómo funciona el pedido por WhatsApp

Cuando alguien da clic en "Enviar pedido por WhatsApp" en el carrito, la app
vuelve a leer el precio real de cada producto directo desde Firestore (no
el que quedó guardado en el navegador), arma un mensaje con el desglose y el
total, y abre WhatsApp con ese mensaje ya escrito, listo para enviar al
número configurado (`63461211`, con código de país 502 de Guatemala).

## Notas sobre costo

Hosting (Vercel, plan Hobby), Firebase Auth, Firestore y Cloudinary se
mantienen en sus planes gratuitos, sin tarjeta de crédito. Los límites
gratuitos son generosos para una tienda chica; si algún día el tráfico
crece mucho, cada servicio avisa antes de que haya que considerar un plan
pago.

## Estructura del proyecto

```
src/
  components/   Navbar, Footer, tarjetas y modal de producto, rutas protegidas
  context/      Autenticación (AuthContext) y carrito (CartContext)
  firebase/     Configuración del SDK de Firebase (Auth + Firestore)
  hooks/        Lectura de productos desde Firestore en tiempo real
  pages/        Landing, Login, Catálogo, Carrito, Mi cuenta, Admin
  types/        Tipos de Producto, género y categorías
  utils/        Subida de fotos a Cloudinary + armado del mensaje de WhatsApp
firestore.rules Reglas de seguridad de la base de datos
```
