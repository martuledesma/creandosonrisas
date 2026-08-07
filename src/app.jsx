import React, { useEffect, useState } from 'react';
import { Link, Navigate, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar';
import useHeroImageReady from './hooks/useHeroImageReady';

// Importación de Páginas
import Nosotros from './pages/Nosotros';
import Sumate from './pages/Sumate';
import Proyectos from './pages/Proyectos';

const defaultContent = {
  heroTitle: 'Fundación Creando Sonrisas',
  heroSubtitle: 'Jóvenes tucumanos transformando realidades con educación, contención y trabajo solidario.',
  cards: [
    {
      id: 1,
      titulo: 'Apoyo escolar',
      desc: 'Acompañamiento educativo para niños y niñas de nuestra comunidad.',
    },
    {
      id: 2,
      titulo: 'Merendero comunitario',
      desc: 'Meriendas, almuerzos y un espacio de encuentro para las familias.',
    },
    {
      id: 3,
      titulo: 'Actividades recreativas',
      desc: 'Pintura, juegos, deportes y festejos de fechas especiales.',
    },
  ],
  events: [
    { id: 101, fecha: '2026-08-15', titulo: 'Próxima actividad', lugar: 'Lugar a confirmar' },
  ],
  contactAddress: 'San Miguel de Tucumán, Tucumán',
  footerText: '© 2026 Fundación Creando Sonrisas - Tucumán, Argentina',
};

const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatEventDay = (dateString) => {
  const date = parseLocalDate(dateString);
  return date ? date.getDate() : '';
};

const formatEventMonth = (dateString) => {
  const date = parseLocalDate(dateString);
  return date ? date.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase() : '';
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M16.04 4C9.42 4 4.05 9.31 4.05 15.86c0 2.24.64 4.35 1.75 6.12L4 28l6.22-1.62A12.1 12.1 0 0 0 16.04 28C22.66 28 28 22.69 28 16.14 28 9.59 22.66 4 16.04 4Zm0 21.86c-1.82 0-3.58-.49-5.11-1.42l-.36-.21-3.69.96.98-3.56-.23-.37a9.68 9.68 0 0 1-1.48-5.12c0-5.38 4.42-9.76 9.89-9.76s9.89 4.38 9.89 9.76-4.42 9.72-9.89 9.72Zm5.42-7.28c-.3-.15-1.75-.85-2.02-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.75-1.65-2.04-.17-.29-.02-.45.13-.6.14-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.51-.08-.15-.67-1.59-.92-2.17-.24-.56-.49-.49-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1-1.04 2.46 0 1.45 1.07 2.85 1.22 3.05.15.2 2.11 3.18 5.1 4.46.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.75-.71 2-1.39.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.57-.34Z" />
  </svg>
);

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493816384353';
const whatsappHref = `https://wa.me/${whatsappNumber}`;

const WhatsAppButton = ({ className = '', label = 'WhatsApp' }) => {
  const accessibleLabel = label === 'WhatsApp' ? 'Abrir WhatsApp' : `${label} por WhatsApp`;

  return (
    <a
      href={whatsappHref}
      className={`whatsapp-button ${className}`.trim()}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      target="_blank"
      rel="noreferrer"
    >
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  );
};

function App() {
  const content = defaultContent;
  const [activeSlide, setActiveSlide] = useState(0);

  const acciones = content.cards || defaultContent.cards;
  const eventosData = content.events || defaultContent.events;
  const novedadesSlides = acciones.map((item, index) => ({
    ...item,
    imagen: item.imagen || '',
  }));
  const heroBackground = content.heroImage || novedadesSlides.find((item) => item.imagen)?.imagen || '';
  const heroReady = useHeroImageReady(heroBackground, false);

  // Mostrar eventos de hoy en adelante
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventosProximos = eventosData.filter((ev) => {
    const fechaEv = parseLocalDate(ev.fecha);
    if (!fechaEv) return false;
    fechaEv.setHours(0, 0, 0, 0);
    return fechaEv >= hoy;
  });
  const visibleEventos = eventosProximos.slice(0, 4);

  useEffect(() => {
    if (novedadesSlides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % novedadesSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [novedadesSlides.length]);

  const moveSlide = (direction) => {
    setActiveSlide((prev) => {
      const total = novedadesSlides.length;
      if (!total) return 0;
      return (prev + direction + total) % total;
    });
  };

  const activeSlideIndex = novedadesSlides.length ? activeSlide % novedadesSlides.length : 0;
  const activeNovedad = novedadesSlides[activeSlideIndex];

  if (!heroReady) {
    return (
      <div className="App">
        <Navbar />
        <div className="page-loader">
          <span>Cargando contenido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />

      <Routes>
        {/* PÁGINA DE INICIO (HOME) */}
        <Route
          path="/"
          element={
            <>
              <header
                className="home-hero"
                style={heroBackground ? {
                  backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.52), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroBackground}')`,
                } : undefined}
              >
                <div className="home-hero-content">
                  <span className="home-eyebrow">San Miguel de Tucumán</span>
                  <h1>{content.heroTitle || defaultContent.heroTitle}</h1>
                  <p>{content.heroSubtitle || defaultContent.heroSubtitle}</p>
                  <div className="home-hero-actions">
                    <Link className="home-primary-link" to="/sumate">Sumate</Link>
                    <Link className="home-secondary-link" to="/proyectos">Ver proyectos</Link>
                  </div>
                </div>
              </header>

              <main className="home-shell">
                <section className="home-action-bar" aria-label="Accesos destacados">
                  <div className="home-action-item">
                    <span>Educación</span>
                    <strong>Apoyo escolar</strong>
                  </div>
                  <div className="home-action-item">
                    <span>Comunidad</span>
                    <strong>Merendero</strong>
                  </div>
                  <div className="home-action-item">
                    <span>Infancias</span>
                    <strong>Juegos y deportes</strong>
                  </div>
                  <WhatsAppButton className="home-action-button" label="Contactar" />
                </section>

                <section className="home-events-panel home-events-feature" aria-labelledby="home-events-title">
                  <div className="home-section-heading">
                    <h2 id="home-events-title" className="display-subtitle">
                      <span className="title-line title-line-blue">Próximos</span>
                      <span className="title-line title-line-orange">eventos</span>
                    </h2>
                    <WhatsAppButton className="home-more-link" label="Consultar" />
                  </div>
                  <div className="home-events-grid">
                    {(visibleEventos.length ? visibleEventos : eventosData.slice(0, 4)).map((ev) => (
                      <article key={ev.id} className="evento-item-mini">
                        <div className="evento-fecha-mini">
                          <span className="ev-dia">{formatEventDay(ev.fecha)}</span>
                          <span className="ev-mes">{formatEventMonth(ev.fecha)}</span>
                        </div>
                        <div className="evento-info">
                          <h4>{ev.titulo}</h4>
                          <p>{ev.lugar}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="novedades" className="home-feature-section">
                  <div className="home-section-heading">
                    <h2 className="display-subtitle">
                      <span className="title-line title-line-blue">Novedades</span>
                    </h2>
                    {novedadesSlides.length > 1 && (
                      <div className="home-heading-controls" aria-label="Controles de novedades">
                        <button type="button" onClick={() => moveSlide(-1)} aria-label="Ver novedad anterior">
                          ‹
                        </button>
                        <button type="button" onClick={() => moveSlide(1)} aria-label="Ver novedad siguiente">
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  {novedadesSlides.length > 0 && (
                    <div className="home-carousel" aria-label="Carrusel de novedades">
                      <div className="home-carousel-frame">
                        {activeNovedad?.imagen && (
                          <img
                            src={activeNovedad.imagen}
                            alt={activeNovedad?.titulo}
                            className="home-carousel-image"
                          />
                        )}
                        <div className="home-carousel-caption">
                          <span>Novedad destacada</span>
                          <h3>{activeNovedad?.titulo}</h3>
                          <p>{activeNovedad?.desc}</p>
                          <Link to="/sumate">Participar</Link>
                        </div>
                      </div>
                      <div className="home-carousel-dots" aria-label="Seleccionar novedad">
                        {novedadesSlides.map((slide, index) => (
                          <button
                            type="button"
                            key={slide.id || index}
                            className={`home-carousel-dot ${activeSlideIndex === index ? 'active' : ''}`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Ver ${slide.titulo}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="home-services-section" aria-labelledby="acciones-title">
                  <div className="home-section-heading">
                    <h2 id="acciones-title" className="display-subtitle">
                      <span className="title-line title-line-blue">Acciones</span>
                      <span className="title-line title-line-orange">comunitarias</span>
                    </h2>
                    <Link className="home-more-link" to="/proyectos">Ver más</Link>
                  </div>
                  <div className="home-services-grid">
                    {novedadesSlides.slice(0, 3).map((item, index) => (
                      <article className="home-service-card" key={item.id || index}>
                        {item.imagen && <img src={item.imagen} alt={item.titulo} loading="lazy" decoding="async" />}
                        <div>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <h3>{item.titulo}</h3>
                          <p>{item.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </main>

              <section id="contacto" className="home-dark-section">
                <div className="home-dark-card">
                  <div className="home-dark-info">
                    <span>Territorio</span>
                    <h2 className="display-subtitle display-subtitle-dark">
                      <span className="title-line title-line-blue">Creamos oportunidades</span>
                      <span className="title-line title-line-white">desde el encuentro cotidiano</span>
                    </h2>
                    <p>
                      Nos encontramos en {content.contactAddress || defaultContent.contactAddress}.
                      Desde allí coordinamos el merendero, el apoyo escolar y las actividades comunitarias.
                    </p>
                    <ul className="home-benefits">
                      <li>Campañas solidarias</li>
                      <li>Apoyo escolar y acompañamiento</li>
                      <li>Agenda comunitaria</li>
                    </ul>
                  </div>
                  <div
                    className="home-dark-map"
                    style={heroBackground ? { backgroundImage: `url('${heroBackground}')` } : undefined}
                  >
                    <iframe
                      title="Mapa de San Miguel de Tucumán"
                      src="https://www.google.com/maps?q=San+Miguel+de+Tucuman,+Argentina&output=embed"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                    <div className="home-map-label">
                      <span>Dirección</span>
                      <strong>{content.contactAddress || defaultContent.contactAddress}</strong>
                    </div>
                  </div>
                </div>

              </section>
            </>
          }
        />

        {/* OTRAS PÁGINAS */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/sumate" element={<Sumate />} />
        <Route path="/contacto" element={<Navigate to="/" replace />} />
      </Routes>

      <WhatsAppButton className="whatsapp-floating-button" />

      <footer className="footer">
        <p>{content.footerText || defaultContent.footerText}</p>
      </footer>
    </div>
  );
}

export default App;
