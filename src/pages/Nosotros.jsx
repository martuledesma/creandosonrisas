import React from 'react';
import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';

const defaultValues = [
  { id: 1, titulo: 'Compromiso', descripcion: 'Sostenemos cada acción con responsabilidad, presencia y trabajo constante.' },
  { id: 2, titulo: 'Solidaridad', descripcion: 'Compartimos tiempo y recursos para acompañar necesidades concretas.' },
  { id: 3, titulo: 'Comunidad', descripcion: 'Construimos oportunidades junto a niños, familias, voluntarios e instituciones.' },
];

const defaultGallery = [
  { id: 1, url: fotoFestejo, alt: 'Voluntarios, niños y familias durante un festejo de la fundación' },
  { id: 2, url: fotoActividades, alt: 'Actividad comunitaria organizada por Creando Sonrisas' },
  { id: 3, url: fotoInfancias, alt: 'Niño participando de una jornada de la fundación' },
];

function Nosotros({ content = {} }) {
  const values = content.values || defaultValues;
  const gallery = (content.gallery || defaultGallery).filter((photo) => photo?.url);
  const visibility = {
    mission: true,
    values: true,
    gallery: true,
    ...(content.sectionVisibility || {}),
  };
  const bannerImage = content.missionImage || gallery[0]?.url || fotoComunidad;
  const introPhotos = gallery.length ? gallery : defaultGallery;

  return (
    <div className="nosotros-page nosotros-page-without-hero">
      <main>
        <header className="nosotros-compact-banner" style={{ backgroundImage: `url('${bannerImage}')` }}>
          <div><span>Fundación Creando Sonrisas</span><h1>Nosotros</h1></div>
        </header>

        <section className="nosotros-intro-section" aria-labelledby="nosotros-intro-title">
          <div className="nosotros-background-words" aria-hidden="true">
            <span>Solidaridad</span>
            <span>Compromiso</span>
            <span>Empatía</span>
            <span>Comunidad</span>
          </div>
          <div className="nosotros-intro-collage" aria-label="Comunidad de Creando Sonrisas">
            <img src={introPhotos[0]?.url || fotoComunidad} alt={introPhotos[0]?.alt || 'Comunidad de Creando Sonrisas'} />
            <img src={introPhotos[1]?.url || fotoActividades} alt={introPhotos[1]?.alt || 'Actividad de Creando Sonrisas'} />
            <strong><span>+150</span> niños acompañados</strong>
          </div>
          <article className="nosotros-intro-copy">
            <span>Quiénes somos</span>
            <h2 id="nosotros-intro-title">{content.introTitle || 'Transformamos realidades creando oportunidades'}</h2>
            <p>{content.introPhrase || content.content || 'Somos una organización impulsada por jóvenes tucumanos que trabaja desde el encuentro, la educación y el compromiso con la comunidad.'}</p>
          </article>
        </section>

        {visibility.values && (
          <section className="nosotros-values-section" aria-labelledby="valores-title">
            <header>
              <span>Lo que nos guía</span>
              <h2 id="valores-title">Nuestros valores</h2>
            </header>
            {values.length ? (
              <div className="nosotros-values-grid">
                {values.map((value, index) => (
                  <article className="nosotros-value-card" key={value.id || index}>
                    <span>0{index + 1}</span>
                    <h3>{value.titulo}</h3>
                    <p>{value.descripcion}</p>
                  </article>
                ))}
              </div>
            ) : <p className="nosotros-empty-state">Los valores se están actualizando.</p>}
          </section>
        )}

        {visibility.gallery && (
          <section className="nosotros-gallery-section" aria-labelledby="galeria-nosotros-title">
            <header>
              <span>Momentos compartidos</span>
              <h2 id="galeria-nosotros-title">La comunidad también se cuenta en imágenes.</h2>
            </header>
            {gallery.length ? (
              <div className={`nosotros-group-gallery gallery-count-${Math.min(gallery.length, 3)}`}>
                {gallery.map((photo, index) => (
                  <figure key={photo.id || `${photo.url}-${index}`} className={`nosotros-group-photo photo-${(index % 3) + 1}`}>
                    <img src={photo.url} alt={photo.alt || `Momento compartido ${index + 1}`} loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>
            ) : <p className="nosotros-empty-state">La galería se está actualizando.</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default Nosotros;
