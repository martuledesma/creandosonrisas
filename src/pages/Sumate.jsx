import React, { useEffect, useState } from 'react';
import useHeroImageReady from '../hooks/useHeroImageReady';

const Sumate = () => {
  const content = {};
  const [activeSlide, setActiveSlide] = useState(0);
  const editableCarouselImages = (content.carouselImages || [])
    .filter((image) => image?.url)
    .map((image, index) => ({
      src: image.url,
      alt: image.alt || `Foto ${index + 1} de la fundación`,
    }));
  const visibleCarouselImages = editableCarouselImages;

  const goToPreviousSlide = () => {
    if (!visibleCarouselImages.length) return;
    setActiveSlide((prev) => (prev === 0 ? visibleCarouselImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    if (!visibleCarouselImages.length) return;
    setActiveSlide((prev) => (prev === visibleCarouselImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (activeSlide >= visibleCarouselImages.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, visibleCarouselImages.length]);

  const heroImage = content.heroImage || visibleCarouselImages[0]?.src || '';
  const heroReady = useHeroImageReady(heroImage, false);

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="sumate-page">
      <header
        className="sumate-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.54), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="sumate-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Sumate</span>
            <h1>{content.title || 'Sumate a la Fundación'}</h1>
            <p>
              {content.heroSubtitle || 'Tu tiempo, una donación o la difusión de nuestro trabajo pueden crear nuevas oportunidades.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Participación</span>
            <strong className="sumate-participation-copy">
              <span>Voluntariado, donaciones y difusión</span>
              <span>para llegar más lejos.</span>
            </strong>
          </div>
        </div>
      </header>

      <section className="sumate-content">
        <div className="sumate-text">
          {content.content ? (
            <p className="sumate-highlight-text">{content.content}</p>
          ) : (
            <p className="sumate-highlight-text" aria-label="Tu ayuda es fundamental para seguir transformando Tucumán.">
              <span className="sumate-highlight-line sumate-highlight-blue">
                Tu ayuda es fundamental para seguir transformando Tucumán.
              </span>
            </p>
          )}
          {content.contactInfo && (
            <p>
              {content.contactInfo}
            </p>
          )}
        </div>
      </section>

      <section className="sumate-gallery" aria-label="Fotos de la fundación">
        {visibleCarouselImages.length > 0 && (
          <div className="sumate-carousel">
            <button
              type="button"
              className="carousel-control carousel-control-prev"
              onClick={goToPreviousSlide}
              aria-label="Ver imagen anterior"
            >
              ‹
            </button>
            <img
              src={visibleCarouselImages[activeSlide].src}
              alt={visibleCarouselImages[activeSlide].alt}
              className="sumate-carousel-image"
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              className="carousel-control carousel-control-next"
              onClick={goToNextSlide}
              aria-label="Ver imagen siguiente"
            >
              ›
            </button>
            <div className="carousel-dots" aria-label="Seleccionar imagen">
              {visibleCarouselImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  className={index === activeSlide ? 'carousel-dot active' : 'carousel-dot'}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="sumate-gallery-action">
          <h2 className="display-subtitle display-subtitle-dark">
            <span className="title-line title-line-blue">¿Querés</span>
            <span className="title-line title-line-white">participar?</span>
          </h2>
          <div className="sumate-participation-tags" aria-label="Formas de participar">
            <span>Voluntariado</span>
            <span>Donaciones · Alias: CREANDOSONRISASTUC</span>
            <span>Difusión</span>
          </div>
          <p>Completá tus datos y nos pondremos en contacto para coordinar cómo podés sumarte.</p>
          <a
            className="btn-nav sumate-form-button"
            href="https://www.instagram.com/creandosonrisas.tuc/"
            target="_blank"
            rel="noreferrer"
          >
            Contactar por Instagram
          </a>
        </div>
      </section>

    </div>
  );
};

export default Sumate;
