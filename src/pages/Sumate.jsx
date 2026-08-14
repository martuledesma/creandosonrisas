import React from 'react';
import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';
import iconoApadrinar from '../Assets/icono-apadrinar-transparente.png';
import { resolveSiteImage } from '../utils/siteImages';

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
      src: resolveSiteImage(image.url, galleryImages[index % galleryImages.length]?.src || fotoComunidad),
      alt: image.alt || `Foto ${index + 1} de la fundación`,
    }));
  const visibleCarouselImages = editableCarouselImages.length ? editableCarouselImages : galleryImages;

  const heroImage = resolveSiteImage(content.heroImage || visibleCarouselImages[0]?.src, fotoComunidad);
  const campaignImage = resolveSiteImage(content.campaignImage, fotoComunidad);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493816384353';

  return (
    <div className="sumate-page">
      <header
        className="sumate-compact-banner"
        style={heroImage ? {
          backgroundImage: `url('${heroImage}')`,
        } : undefined}
      >
        <div><span>{content.bannerKicker || 'Fundación Creando Sonrisas'}</span><h1>{content.bannerTitle || 'Sumate'}</h1></div>
      </header>

      <main className="sumate-template-shell">
        <section id="formas-de-participar" className="sumate-ways-template" aria-label="Formas de participar">
          <header className="template-section-title">
            <span className="template-kicker">{content.waysKicker || 'Elegí cómo participar'}</span>
          </header>
          <div className="sumate-ways-grid">
            <article className="sumate-way-card sumate-way-1">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" /></svg>
              </span>
              <div><span>01</span><h3>{content.ways?.[0]?.titulo || 'Voluntariado'}</h3></div>
            </article>
            <article className="sumate-way-card sumate-way-2">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
              </span>
              <div><span>02</span><h3>{content.ways?.[1]?.titulo || 'Donaciones'}</h3></div>
            </article>
            <article className="sumate-way-card sumate-way-3">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m3 11 18-5-5 18-4-8-9-5ZM12 16l4-4" /></svg>
              </span>
              <div><span>03</span><h3>{content.ways?.[2]?.titulo || 'Difusión'}</h3></div>
            </article>
          </div>
        </section>

        <section className="sumate-intro-template">
          <div className="sumate-intro-copy">
            <span className="template-kicker">{content.introKicker || 'Tu ayuda importa'}</span>
            <h2>{content.introTitle || 'Hay muchas maneras de crear oportunidades.'}</h2>
            <p>{content.content || 'Tu ayuda es fundamental para seguir transformando Tucumán.'}</p>
            {content.contactInfo && <p>{content.contactInfo}</p>}
          </div>
          <div className="sumate-media-row">
            <figure className="sumate-campaign-image">
              <img src={campaignImage} alt={content.campaignImageAlt || "Comunidad de Fundación Creando Sonrisas"} />
            </figure>
            <div className="sumate-campaign-column">
              <aside className="sumate-contact-actions" aria-label="Campaña de apadrinamiento">
                <span>{content.campaignKicker || 'Apadriná un deseo'}</span>
                <h3>{content.campaignTitle || 'Elegí una cartita, convertite en padrino y hacé realidad su deseo.'}</h3>
                <p>{content.campaignDeadline || 'Tenés tiempo hasta el 29 de agosto.'}</p>
                <a className="sumate-sponsor-button" href={content.campaignUrl || 'https://www.fundaros.com/appadrinar/creandosonrisas/campanas/dia-del-nino-creando-sonrisas-2026'} target="_blank" rel="noreferrer">
                  <img src={iconoApadrinar} alt="" aria-hidden="true" />
                  <span>{content.campaignButton || 'Apadrinar'}</span>
                </a>
              </aside>
              <aside className="sumate-contact-actions sumate-volunteer-card" aria-label="Voluntariado">
                <span>{content.volunteerKicker || 'Sumate al equipo'}</span>
                <h3>{content.volunteerTitle || 'Quiero ser voluntario'}</h3>
                <p>{content.volunteerText || 'Compartí tu tiempo y tus ganas de transformar realidades.'}</p>
                {content.volunteerFormUrl ? (
                  <a className="sumate-volunteer-button" href={content.volunteerFormUrl} target="_blank" rel="noreferrer">Completar formulario</a>
                ) : (
                  <span className="sumate-volunteer-button is-disabled">Formulario próximamente</span>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="sumate-contact-band">
          <div>
            <span>{content.donationKicker || 'Donaciones'}</span>
            <h2>Alias: {content.donationAlias || 'CREANDOSONRISASTUC'}</h2>
            <p>{content.donationText || 'Cada aporte, sin importar el monto, ayuda a sostener nuestro trabajo cotidiano.'}</p>
          </div>
          <div className="sumate-contact-band-actions">
            <a href={content.instagramUrl || 'https://www.instagram.com/creandosonrisas.tuc/'} target="_blank" rel="noreferrer">
              Contactar por Instagram
            </a>
            <a className="sumate-contact-band-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Sumate;
