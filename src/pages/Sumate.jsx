import React, { useRef, useState } from 'react';
import fotoComunidad from '../Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';
import iconoApadrinar from '../Assets/icono-apadrinar-transparente.png';

const Sumate = ({ content = {} }) => {
  const campaignVideoRef = useRef(null);
  const [campaignPlaying, setCampaignPlaying] = useState(false);
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

  const toggleCampaignVideo = async () => {
    const video = campaignVideoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

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
        <section id="formas-de-participar" className="sumate-ways-template" aria-labelledby="sumate-ways-title">
          <header className="template-section-title">
            <span className="template-kicker">Elegí cómo participar</span>
            <h2 id="sumate-ways-title">Sumate a la comunidad</h2>
          </header>
          <div className="sumate-ways-grid">
            <article className="sumate-way-card sumate-way-1">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" /></svg>
              </span>
              <div><span>01</span><h3>Voluntariado</h3></div>
            </article>
            <article className="sumate-way-card sumate-way-2">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
              </span>
              <div><span>02</span><h3>Donaciones</h3></div>
            </article>
            <article className="sumate-way-card sumate-way-3">
              <span className="sumate-way-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m3 11 18-5-5 18-4-8-9-5ZM12 16l4-4" /></svg>
              </span>
              <div><span>03</span><h3>Difusión</h3></div>
            </article>
          </div>
        </section>

        <section className="sumate-intro-template">
          <div className="sumate-intro-copy">
            <span className="template-kicker">Tu ayuda importa</span>
            <h2>Hay muchas maneras de crear oportunidades.</h2>
            <p>{content.content || 'Tu ayuda es fundamental para seguir transformando Tucumán.'}</p>
            {content.contactInfo && <p>{content.contactInfo}</p>}
          </div>
          <div className={`sumate-media-row${content.campaignVideoUrl ? '' : ' sumate-media-row-without-video'}`}>
            {content.campaignVideoUrl && (
              <div className="sumate-instagram-reel">
                <video
                  ref={campaignVideoRef}
                  src={content.campaignVideoUrl}
                  autoPlay
                  muted
                  defaultMuted
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  onPlay={() => setCampaignPlaying(true)}
                  onCanPlay={(event) => event.currentTarget.play().catch(() => {})}
                  onPause={() => setCampaignPlaying(false)}
                  onEnded={() => setCampaignPlaying(false)}
                  onClick={toggleCampaignVideo}
                  onContextMenu={(event) => event.preventDefault()}
                  aria-label="Campaña de Fundación Creando Sonrisas"
                />
                <button
                  className="sumate-video-toggle"
                  type="button"
                  onClick={toggleCampaignVideo}
                  aria-label={campaignPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                  {campaignPlaying ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>
                  )}
                </button>
              </div>
            )}
            <div className="sumate-campaign-column">
              <aside className="sumate-contact-actions" aria-label="Campaña de apadrinamiento">
                <span>Apadriná un deseo</span>
                <h3>Elegí una cartita, convertite en padrino y hacé realidad su deseo.</h3>
                <p>Tenés tiempo hasta el 29 de agosto.</p>
                <a className="sumate-sponsor-button" href="https://www.fundaros.com/appadrinar/creandosonrisas/campanas/dia-del-nino-creando-sonrisas-2026" target="_blank" rel="noreferrer">
                  <img src={iconoApadrinar} alt="" aria-hidden="true" />
                  <span>Apadrinar</span>
                </a>
              </aside>
              <aside className="sumate-contact-actions sumate-volunteer-card" aria-label="Voluntariado">
                <span>Sumate al equipo</span>
                <h3>Quiero ser voluntario</h3>
                <p>Compartí tu tiempo y tus ganas de transformar realidades.</p>
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
            <span>Donaciones</span>
            <h2>Alias: {content.donationAlias || 'CREANDOSONRISASTUC'}</h2>
            <p>Cada aporte, sin importar el monto, ayuda a sostener nuestro trabajo cotidiano.</p>
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
