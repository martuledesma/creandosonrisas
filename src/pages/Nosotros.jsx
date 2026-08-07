import React from 'react';
import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';

const groupPhotos = [
  { src: fotoFestejo, alt: 'Voluntarios, niños y familias durante un festejo de la fundación' },
  { src: fotoActividades, alt: 'Actividad comunitaria organizada por Creando Sonrisas' },
  { src: fotoInfancias, alt: 'Niño participando de una jornada de la fundación' },
];

function Nosotros({ content = {} }) {
  const heroImage = content.heroImage || fotoComunidad;

  return (
    <div className="nosotros-page">
      <header
        className="nosotros-hero page-hero-photo"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="nosotros-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Nosotros</span>
            <h1>{content.title || 'Quiénes somos'}</h1>
            <p>{content.heroSubtitle || 'Jóvenes tucumanos que transforman realidades con educación y trabajo territorial.'}</p>
          </div>
          <div className="page-hero-card">
            <span>Fundación Creando Sonrisas</span>
            <strong>Educación, solidaridad y compromiso comunitario.</strong>
          </div>
        </div>
      </header>

      <main>
        <section className="nosotros-history-section" aria-labelledby="historia-title">
          <div className="nosotros-history-photo">
            <img src={fotoComunidad} alt="Comunidad de la Fundación Creando Sonrisas" loading="lazy" decoding="async" />
          </div>
          <article className="nosotros-history-copy">
            <span>Nuestra historia</span>
            <h2 id="historia-title">Una comunidad que crece desde el encuentro.</h2>
            <p>
              {content.content || 'Somos una organización civil impulsada por jóvenes tucumanos. A través del merendero, el apoyo escolar, el acompañamiento en salud y distintas acciones solidarias, generamos oportunidades para niños, adolescentes y familias.'}
            </p>
            {content.additionalText && <p>{content.additionalText}</p>}
          </article>
        </section>

        <section className="nosotros-gallery-section" aria-labelledby="galeria-nosotros-title">
          <header>
            <span>Momentos compartidos</span>
            <h2 id="galeria-nosotros-title">La historia también se cuenta en imágenes.</h2>
          </header>
          <div className="nosotros-group-gallery">
            {groupPhotos.map((photo, index) => (
              <figure key={photo.src} className={`nosotros-group-photo photo-${index + 1}`}>
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Nosotros;
