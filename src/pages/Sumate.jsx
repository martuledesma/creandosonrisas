import React from 'react';
import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';

const Sumate = ({ content = {} }) => {
  const galleryImages = [
    { src: fotoComunidad, alt: 'Voluntarios, niños y familias de Creando Sonrisas' },
    { src: fotoFestejo, alt: 'Festejo comunitario junto a niños y voluntarios' },
    { src: fotoActividades, alt: 'Actividades recreativas con niños de la comunidad' },
    { src: fotoInfancias, alt: 'Un niño sonriendo durante una actividad de la fundación' },
  ];
  const editableCarouselImages = (content.carouselImages || [])
    .filter((image) => image?.url)
    .map((image, index) => ({
      src: image.url,
      alt: image.alt || `Foto ${index + 1} de la fundación`,
    }));
  const visibleCarouselImages = editableCarouselImages.length ? editableCarouselImages : galleryImages;

  const heroImage = content.heroImage || visibleCarouselImages[0]?.src || '';
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493816384353';

  return (
    <div className="sumate-page">
      <header
        className="sumate-compact-banner"
        style={heroImage ? {
          backgroundImage: `url('${heroImage}')`,
        } : undefined}
      >
        <div><span>Fundación Creando Sonrisas</span><h1>Sumate</h1></div>
      </header>

      <main className="sumate-template-shell">
        <section className="sumate-intro-template">
          <div className="sumate-intro-copy">
            <span className="template-kicker">Tu ayuda importa</span>
            <h2>Hay muchas maneras de crear oportunidades.</h2>
            <p>{content.content || 'Tu ayuda es fundamental para seguir transformando Tucumán.'}</p>
            {content.contactInfo && <p>{content.contactInfo}</p>}
          </div>
          <aside className="sumate-contact-actions" aria-label="Redes y medios de contacto">
            <span>Comunicate con nosotros</span>
            <h3>Elegí el medio que prefieras</h3>
            <a className="sumate-social-button" href={content.instagramUrl || 'https://www.instagram.com/creandosonrisas.tuc/'} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="sumate-social-button" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="sumate-sponsor-button" href={`https://wa.me/${whatsappNumber}?text=Hola%2C%20quiero%20recibir%20informaci%C3%B3n%20para%20apadrinar`} target="_blank" rel="noreferrer">
              Apadrinar
            </a>
          </aside>
        </section>

        <section id="formas-de-participar" className="sumate-ways-template" aria-labelledby="sumate-ways-title">
          <header className="template-section-title">
            <span className="template-kicker">Elegí cómo participar</span>
            <h2 id="sumate-ways-title">Sumate a la comunidad</h2>
          </header>
          <div className="sumate-ways-grid">
            {['Voluntariado', 'Donaciones', 'Difusión'].map((title, index) => {
              const image = visibleCarouselImages[index % visibleCarouselImages.length];
              return (
                <article className={`sumate-way-card sumate-way-${index + 1}`} key={title}>
                  {image && <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />}
                  <div><span>0{index + 1}</span><h3>{title}</h3></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sumate-contact-band">
          <div>
            <span>Donaciones</span>
            <h2>Alias: {content.donationAlias || 'CREANDOSONRISASTUC'}</h2>
            <p>Cada aporte, sin importar el monto, ayuda a sostener nuestro trabajo cotidiano.</p>
          </div>
          <a href={content.instagramUrl || 'https://www.instagram.com/creandosonrisas.tuc/'} target="_blank" rel="noreferrer">
            Contactar por Instagram
          </a>
        </section>
      </main>

    </div>
  );
};

export default Sumate;
