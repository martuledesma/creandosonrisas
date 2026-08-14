import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';

const bundledImageFallbacks = {
  'creando-sonrisas-comunidad.jpg': fotoComunidad,
  'creando-sonrisas-festejo.jpg': fotoFestejo,
  'creando-sonrisas-actividades.jpg': fotoActividades,
  'creando-sonrisas-infancias.jpg': fotoInfancias,
};

export const resolveSiteImage = (value, fallback = '') => {
  if (!value) return fallback;

  const normalizedValue = String(value).trim();
  const legacyName = Object.keys(bundledImageFallbacks)
    .find((name) => normalizedValue.includes(name));

  if (legacyName) return bundledImageFallbacks[legacyName];
  if (/^https?:\/\//i.test(normalizedValue) || normalizedValue.startsWith('data:') || normalizedValue.startsWith('blob:')) {
    return normalizedValue;
  }

  // Las rutas /src/... solo existen en desarrollo. En producción usamos
  // una imagen empaquetada para evitar recursos rotos guardados en el CMS.
  if (normalizedValue.startsWith('/src/') || normalizedValue.startsWith('src/')) return fallback;

  return normalizedValue;
};

