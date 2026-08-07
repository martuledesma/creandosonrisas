import { useCallback, useEffect, useState } from 'react';
import { getSiteContent, saveSiteContent } from '../supabase';

export default function useSiteContent(defaultContent) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getSiteContent()
      .then((remoteContent) => {
        if (active && remoteContent) {
          setContent({
            ...defaultContent,
            ...remoteContent,
            home: { ...defaultContent.home, ...(remoteContent.home || {}) },
            nosotros: { ...defaultContent.nosotros, ...(remoteContent.nosotros || {}) },
            proyectos: { ...defaultContent.proyectos, ...(remoteContent.proyectos || {}) },
            sumate: { ...defaultContent.sumate, ...(remoteContent.sumate || {}) },
          });
        }
      })
      .catch((loadError) => {
        console.error('Supabase content error:', loadError);
        if (active) setError('No se pudo cargar el contenido guardado.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [defaultContent]);

  const save = useCallback(async (nextContent) => {
    await saveSiteContent(nextContent);
    setContent(nextContent);
  }, []);

  return { content, loading, error, save };
}
