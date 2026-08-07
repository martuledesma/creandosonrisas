# Fundación Creando Sonrisas

Sitio institucional de la Fundación Creando Sonrisas en Tucumán.

## Secciones

- Inicio con próximos eventos destacados
- Nosotros
- Proyectos
- Sumate, voluntariado y donaciones

La versión actual es un frontend estático, sin fotografías precargadas. La persistencia de contenidos y la autenticación se conectarán posteriormente con Supabase.

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
```

## Producción

```bash
npm run build
```

Netlify está configurado para publicar la carpeta `dist` y redirigir las rutas a la aplicación React.
