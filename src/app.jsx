import React, { useEffect, useState } from 'react';
import { Link, Navigate, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/navbar';
import Admin from './pages/Admin';
import useSiteContent from './hooks/useSiteContent';

// Importación de Páginas
import Nosotros from './pages/Nosotros';
import Sumate from './pages/Sumate';
import Proyectos from './pages/Proyectos';
import fotoComunidad from './Assets/creando-sonrisas-comunidad.jpg';
import fotoFestejo from './Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from './Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from './Assets/creando-sonrisas-infancias.jpg';

const defaultHomeContent = {
  heroTitle: 'Fundación Creando Sonrisas',
  heroSubtitle: 'Jóvenes tucumanos transformando realidades con educación, contención y trabajo solidario.',
  heroImage: fotoComunidad,
  cards: [
    {
      id: 1,
      titulo: 'Apoyo escolar',
      desc: 'Acompañamiento educativo para niños y niñas de nuestra comunidad.',
      imagen: fotoActividades,
    },
    {
      id: 2,
      titulo: 'Merendero comunitario',
      desc: 'Meriendas, almuerzos y un espacio de encuentro para las familias.',
      imagen: fotoFestejo,
    },
    {
      id: 3,
      titulo: 'Actividades recreativas',
      desc: 'Pintura, juegos, deportes y festejos de fechas especiales.',
      imagen: fotoInfancias,
    },
    {
      id: 4,
      titulo: 'Comunidad y voluntariado',
      desc: 'Jóvenes, familias e instituciones trabajando juntos para crear oportunidades.',
      imagen: fotoComunidad,
    },
  ],
  pillars: [
    {
      id: 11,
      titulo: 'Educación',
      desc: 'Acompañamos las trayectorias escolares con apoyo, escucha y herramientas para aprender.',
      imagen: fotoActividades,
    },
    {
      id: 12,
      titulo: 'Merendero',
      desc: 'Compartimos meriendas, almuerzos y un espacio cotidiano de encuentro con las familias.',
      imagen: fotoFestejo,
    },
    {
      id: 13,
      titulo: 'Recreación',
      desc: 'Creamos momentos de juego, deporte, arte y celebración para niños y niñas.',
      imagen: fotoInfancias,
    },
  ],
  events: [
    { id: 101, fecha: '2026-08-15', titulo: 'Próxima actividad', lugar: 'Lugar a confirmar' },
  ],
  impactTitle: 'Siempre elegimos ver esperanza',
  impactText: 'Cada encuentro, cada merienda y cada aprendizaje compartido pueden abrir una nueva posibilidad para niños, niñas y familias.',
  impactImage: fotoComunidad,
  footerText: '© 2026 Fundación Creando Sonrisas - Tucumán, Argentina',
};

const defaultSiteContent = {
  home: defaultHomeContent,
  nosotros: {
    title: 'Quiénes somos',
    heroSubtitle: 'Jóvenes tucumanos que transforman realidades con educación y trabajo territorial.',
    content: 'Somos una organización civil impulsada por jóvenes tucumanos. A través del merendero, el apoyo escolar, el acompañamiento en salud y distintas acciones solidarias, generamos oportunidades para niños, adolescentes y familias.',
    additionalText: '',
    teamCards: [],
  },
  proyectos: {
    heroSubtitle: 'Impulsamos respuestas concretas en educación, alimentación, salud y recreación.',
    introText: 'Transformamos necesidades concretas en oportunidades mediante educación, alimentación, acompañamiento y acciones comunitarias.',
    items: [
      { id: 1, titulo: 'Merendero comunitario', descripcion: 'Meriendas y almuerzos compartidos con niños, niñas y familias de la comunidad.', imagen: fotoFestejo, estado: 'Activo' },
      { id: 2, titulo: 'Apoyo escolar', descripcion: 'Acompañamiento educativo para fortalecer el aprendizaje y las trayectorias escolares.', imagen: fotoActividades, estado: 'Activo' },
      { id: 3, titulo: 'Recreación y comunidad', descripcion: 'Pintura, juegos, deportes, festejos especiales y acciones solidarias.', imagen: fotoInfancias, estado: 'Activo' },
    ],
  },
  sumate: {
    title: 'Sumate a la Fundación',
    heroSubtitle: 'Tu tiempo, una donación o la difusión de nuestro trabajo pueden crear nuevas oportunidades.',
    content: 'Tu ayuda es fundamental para seguir transformando Tucumán.',
    donationAlias: 'CREANDOSONRISASTUC',
    instagramUrl: 'https://www.instagram.com/creandosonrisas.tuc/',
    carouselImages: [
      { id: 1, url: fotoComunidad, alt: 'Voluntarios, niños y familias de Creando Sonrisas' },
      { id: 2, url: fotoFestejo, alt: 'Festejo comunitario junto a niños y voluntarios' },
      { id: 3, url: fotoActividades, alt: 'Actividades recreativas con niños de la comunidad' },
      { id: 4, url: fotoInfancias, alt: 'Un niño sonriendo durante una actividad de la fundación' },
    ],
  },
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
  const { content: siteContent, save: saveContent } = useSiteContent(defaultSiteContent);
  const content = siteContent.home || defaultHomeContent;
  const [activeSlide, setActiveSlide] = useState(0);

  const acciones = content.cards || defaultHomeContent.cards;
  const pilares = content.pillars?.length ? content.pillars : defaultHomeContent.pillars;
  const eventosData = content.events || defaultHomeContent.events;
  const novedadesSlides = acciones.map((item, index) => ({
    ...item,
    imagen: item.imagen || '',
  }));
  const heroBackground = content.heroImage || novedadesSlides.find((item) => item.imagen)?.imagen || '';

  // Mostrar eventos de hoy en adelante
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventosProximos = eventosData.filter((ev) => {
    const fechaEv = parseLocalDate(ev.fecha);
    if (!fechaEv) return false;
    fechaEv.setHours(0, 0, 0, 0);
    return fechaEv >= hoy;
  }).sort((a, b) => parseLocalDate(a.fecha) - parseLocalDate(b.fecha));
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
                  backgroundImage: `url('${heroBackground}')`,
                } : undefined}
              >
                <div className="home-hero-content">
                  <span className="home-eyebrow">San Miguel de Tucumán</span>
                  <h1>{content.heroTitle || defaultHomeContent.heroTitle}</h1>
                  <p>{content.heroSubtitle || defaultHomeContent.heroSubtitle}</p>
                  <div className="home-hero-actions">
                    <Link className="home-primary-link" to="/sumate">Sumate</Link>
                    <Link className="home-secondary-link" to="/proyectos">Ver proyectos</Link>
                  </div>
                </div>
              </header>

              <main className="home-shell">
                <section className="home-events-panel home-events-feature" aria-labelledby="home-events-title">
                  <div className="home-section-heading">
                    <h2 id="home-events-title" className="display-subtitle">
                      <span className="title-line title-line-blue">Próximos</span>
                      <span className="title-line title-line-orange">eventos</span>
                    </h2>
                    <WhatsAppButton className="home-more-link" label="Consultar" />
                  </div>
                  {visibleEventos.length ? (
                    <div className="home-events-grid">
                    {visibleEventos.map((ev) => (
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
                  ) : (
                    <div className="home-events-empty">
                      <span>Agenda en preparación</span>
                      <p>Muy pronto publicaremos las próximas actividades. Consultanos por WhatsApp para participar.</p>
                    </div>
                  )}
                </section>

                <section className="home-pillars-section" aria-labelledby="pillars-title">
                  <div className="home-section-heading home-pillars-heading">
                    <div>
                      <span className="home-section-kicker">Nuestro trabajo cotidiano</span>
                      <h2 id="pillars-title" className="display-subtitle">
                        <span className="title-line title-line-blue">Tres maneras de</span>
                        <span className="title-line title-line-orange">crear oportunidades</span>
                      </h2>
                    </div>
                    <Link className="home-more-link" to="/proyectos">Ver proyectos</Link>
                  </div>
                  <div className="home-pillars-grid">
                    {pilares.slice(0, 3).map((pillar, index) => (
                      <Link className="home-pillar-card" to="/proyectos" key={pillar.id || index}>
                        {pillar.imagen && <img src={pillar.imagen} alt={pillar.titulo} loading="lazy" decoding="async" />}
                        <div>
                          <span>0{index + 1}</span>
                          <h3>{pillar.titulo}</h3>
                          <p>{pillar.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section id="impacto" className="home-impact-section" aria-labelledby="impact-title">
                  <div
                    className="home-impact-photo"
                    role="img"
                    aria-label="La comunidad de Creando Sonrisas compartiendo una actividad"
                    style={{ backgroundImage: `url('${content.impactImage || defaultHomeContent.impactImage}')` }}
                  />
                  <div className="home-impact-copy">
                    <span>Nuestro motor</span>
                    <h2 id="impact-title">{content.impactTitle || defaultHomeContent.impactTitle}</h2>
                    <blockquote>
                      <span aria-hidden="true">“</span>
                      <p>{content.impactText || defaultHomeContent.impactText}</p>
                      <span aria-hidden="true">”</span>
                    </blockquote>
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
                  {novedadesSlides.length > 0 ? (
                    <div className="home-carousel" aria-label="Carrusel de novedades">
                      <div className={`home-carousel-frame ${activeNovedad?.imagen ? '' : 'without-image'}`}>
                        <div className="home-carousel-media">
                          {activeNovedad?.imagen ? (
                          <img
                            src={activeNovedad.imagen}
                            alt={activeNovedad?.titulo}
                            className="home-carousel-image"
                          />
                          ) : <span>Imagen pendiente</span>}
                        </div>
                        <div className="home-carousel-caption">
                          <span>Novedad destacada</span>
                          <h3>{activeNovedad?.titulo}</h3>
                          <p>{activeNovedad?.desc}</p>
                          <Link to="/proyectos">Conocer proyectos</Link>
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
                  ) : (
                    <div className="home-news-empty">
                      <span>Próximamente</span>
                      <p>Estamos preparando nuevas historias para compartir.</p>
                    </div>
                  )}
                </section>

              </main>

            </>
          }
        />

        {/* OTRAS PÁGINAS */}
        <Route path="/nosotros" element={<Nosotros content={siteContent.nosotros} />} />
        <Route path="/proyectos" element={<Proyectos content={siteContent.proyectos} />} />
        <Route path="/sumate" element={<Sumate content={siteContent.sumate} />} />
        <Route path="/contacto" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Admin content={siteContent} onSave={saveContent} />} />
      </Routes>

      <WhatsAppButton className="whatsapp-floating-button" />

      <footer className="footer">
        <p>{content.footerText || defaultHomeContent.footerText}</p>
      </footer>
    </div>
  );
}

export default App;
