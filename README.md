# Fundación Creando Sonrisas

Sitio web de la Fundación Creando Sonrisas en Tucumán.

Incluye Inicio con próximos eventos destacados, Nosotros, Proyectos, Sumate y un panel de administración. Los espacios de imágenes comienzan vacíos para que la fundación cargue sus fotografías desde el administrador.

## Funcionalidades

- **Panel de administración**: Solo el administrador puede editar contenido.
- **Cards dinámicas**: Agregar, editar y eliminar cards con imágenes.
- **Eventos del calendario**: Gestionar eventos próximos.
- **Subida de imágenes**: Arrastrar imágenes al panel de administración para subirlas a Cloudinary.

## Configuración de Firebase

1. Crea un proyecto en Firebase Console.
2. Copia las credenciales en `src/firebase/config.js`.
3. Crea un usuario administrador con email `martinaledesma2@gmail.com`.
4. Habilita Email/Password en Authentication.
5. Agrega `localhost` a Authorized domains.
6. Sube las reglas de Firestore desde `firestore.rules`.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

Abre en `http://localhost:5173`.

## Configuración de Cloudinary

1. Crea una cuenta o inicia sesión en Cloudinary.
2. Copia el `Cloud name` del panel principal.
3. En `Settings > Upload > Upload presets`, crea un preset con `Signing Mode: Unsigned`.
4. Copia `.env.example` como `.env` y completa:

```bash
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_unsigned_upload_preset
```

5. En Netlify, agrega las mismas variables en `Site configuration > Environment variables`.

El preset debe limitar formatos permitidos, tamaño máximo de 10 MB y carpeta cuando publiques el sitio. No coloques el `API Secret` de Cloudinary en variables que comiencen con `VITE_`: esas variables quedan visibles en el navegador.

## Panel de admin

- URL: `http://localhost:5173/admin`
- Email: `martinaledesma2@gmail.com`
- Contraseña: la que asignaste en Firebase

## Reglas de seguridad

- Solo el admin puede escribir contenido en Firestore.
- La subida directa a Cloudinary usa un preset `Unsigned`. Su nombre queda visible en el navegador, por eso el preset debe restringir formatos y tamaño máximo.
- Todos pueden leer el contenido público.
