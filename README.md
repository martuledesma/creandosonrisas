# Fundación Creando Sonrisas

Sitio institucional de la Fundación Creando Sonrisas en Tucumán.

## Secciones

- Inicio con próximos eventos destacados
- Nosotros
- Proyectos
- Sumate, voluntariado y donaciones

El contenido y la autenticación del panel se gestionan con Supabase.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

Abrí `http://127.0.0.1:5173/`.

## Variables de entorno

```bash
VITE_WHATSAPP_NUMBER=5493810000000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

## Configurar el panel

1. Creá un proyecto en Supabase.
2. Ejecutá `supabase/schema.sql` desde SQL Editor.
3. Creá el usuario administrador en Authentication > Users.
4. Copiá su UUID y ejecutá: `insert into public.admin_users (user_id) values ('UUID_DEL_USUARIO');`.
5. Completá las variables de Supabase en `.env` y reiniciá Vite.
6. Ingresá a `/admin` con el correo y contraseña del usuario.

## Producción

```bash
npm run build
```

Netlify está configurado para publicar la carpeta `dist` y redirigir las rutas a la aplicación React.
