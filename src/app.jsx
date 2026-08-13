import React, { useEffect } from 'react';
import { Link, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import './redesign.css';
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

const bundledImageFallbacks = {
  'creando-sonrisas-comunidad.jpg': fotoComunidad,
  'creando-sonrisas-festejo.jpg': fotoFestejo,
  'creando-sonrisas-actividades.jpg': fotoActividades,
  'creando-sonrisas-infancias.jpg': fotoInfancias,
};

const resolveSiteImage = (value, fallback = '') => {
  if (!value) return fallback;
  const legacyName = Object.keys(bundledImageFallbacks).find((name) => value.includes(name));
  return legacyName ? bundledImageFallbacks[legacyName] : value;
};

const defaultHomeContent = {
  heroTitle: 'Fundación Creando Sonrisas',
  heroSubtitle: 'Creer en un futuro mejor, crecer en espacios seguros y crear infancias felices. Somos Creando Sonrisas y siempre valdrá la pena.',
  heroImage: fotoComunidad,
  stats: [
    { id: 1, valor: '+150', titulo: 'Niños acompañados', descripcion: 'Educación, contención y espacios para crecer.' },
    { id: 2, valor: '50+', titulo: 'Alimentación diaria', descripcion: 'Meriendas y comidas compartidas con la comunidad.' },
    { id: 3, valor: '30+', titulo: 'Jóvenes voluntarios', descripcion: 'Un equipo comprometido que transforma desde el territorio.' },
  ],
  areasKicker: 'Ayudamos desde el territorio',
  areasTitle: 'Nuestras áreas de trabajo',
  ctaKicker: 'Dejá tu huella',
  ctaTitle: 'Hagamos crecer nuevas sonrisas',
  ctaButton: 'Quiero colaborar',
  newsKicker: 'Historias recientes',
  newsTitle: 'Novedades',
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
    { id: 101, fecha: '2026-08-15', titulo: 'Próxima actividad', lugar: 'Lugar a confirmar', descripcion: '', imagen: '' },
  ],
  impactTitle: 'Siempre elegimos ver esperanza',
  impactText: 'Cada encuentro, cada merienda y cada aprendizaje compartido pueden abrir una nueva posibilidad para niños, niñas y familias.',
  impactImage: fotoComunidad,
  sectionVisibility: {
    quickActions: true,
    projects: true,
    cta: true,
    news: true,
  },
  footerText: '© 2026 Fundación Creando Sonrisas - Tucumán, Argentina',
  developerLinkedin: 'https://www.linkedin.com/in/martina-ledesma/',
};

const defaultSiteContent = {
  home: defaultHomeContent,
  nosotros: {
    title: 'Quiénes somos',
    heroImage: fotoComunidad,
    heroSubtitle: 'Jóvenes tucumanos que transforman realidades con educación y trabajo territorial.',
    content: 'Somos una organización civil impulsada por jóvenes tucumanos. A través del merendero, el apoyo escolar, el acompañamiento en salud y distintas acciones solidarias, generamos oportunidades para niños, adolescentes y familias.',
    additionalText: '',
    introTitle: 'Transformamos realidades creando oportunidades',
    introPhrase: 'Somos una organización impulsada por jóvenes tucumanos que trabaja desde el encuentro, la educación y el compromiso con la comunidad.',
    bannerKicker: 'Fundación Creando Sonrisas',
    bannerTitle: 'Nosotros',
    introKicker: 'Quiénes somos',
    impactValue: '+150',
    impactLabel: 'niños acompañados',
    valuesKicker: 'Lo que nos guía',
    valuesTitle: 'Nuestros valores',
    professionalsKicker: 'Quienes acompañan',
    professionalsTitle: 'Nuestro equipo profesional',
    professionalsIntro: 'Personas comprometidas que aportan su experiencia al trabajo cotidiano de la fundación.',
    galleryKicker: 'Momentos compartidos',
    galleryTitle: 'La comunidad también se cuenta en imágenes.',
    missionTitle: 'Siempre elegimos ver esperanza',
    missionText: 'Cada encuentro, cada merienda y cada aprendizaje compartido pueden abrir una nueva posibilidad para niños, niñas y familias.',
    missionImage: fotoComunidad,
    values: [
      { id: 1, titulo: 'Compromiso', descripcion: 'Sostenemos cada acción con responsabilidad, presencia y trabajo constante.' },
      { id: 2, titulo: 'Solidaridad', descripcion: 'Compartimos tiempo y recursos para acompañar necesidades concretas.' },
      { id: 3, titulo: 'Comunidad', descripcion: 'Construimos oportunidades junto a niños, familias, voluntarios e instituciones.' },
    ],
    professionals: [
      { id: 1, nombre: 'Profesional 1', rol: 'Área profesional', descripcion: '', imagen: '' },
      { id: 2, nombre: 'Profesional 2', rol: 'Área profesional', descripcion: '', imagen: '' },
      { id: 3, nombre: 'Profesional 3', rol: 'Área profesional', descripcion: '', imagen: '' },
      { id: 4, nombre: 'Profesional 4', rol: 'Área profesional', descripcion: '', imagen: '' },
    ],
    gallery: [
      { id: 1, url: fotoFestejo, alt: 'Voluntarios, niños y familias durante un festejo de la fundación' },
      { id: 2, url: fotoActividades, alt: 'Actividad comunitaria organizada por Creando Sonrisas' },
      { id: 3, url: fotoInfancias, alt: 'Niño participando de una jornada de la fundación' },
    ],
    sectionVisibility: {
      mission: true,
      values: true,
      professionals: true,
      gallery: true,
    },
    teamCards: [],
  },
  proyectos: {
    bannerKicker: 'Fundación Creando Sonrisas',
    bannerTitle: 'Proyectos',
    sectionKicker: 'Conocé',
    sectionTitle: 'Nuestro trabajo',
    heroSubtitle: 'Impulsamos respuestas concretas en educación, alimentación, salud y recreación.',
    introText: 'Transformamos necesidades concretas en oportunidades mediante educación, alimentación, acompañamiento y acciones comunitarias.',
    items: [
      { id: 1, titulo: 'Merendero comunitario', descripcion: 'Meriendas y almuerzos compartidos con niños, niñas y familias de la comunidad.', imagen: fotoFestejo, estado: 'Activo', categoria: 'salud' },
      { id: 2, titulo: 'Apoyo escolar', descripcion: 'Acompañamiento educativo para fortalecer el aprendizaje y las trayectorias escolares.', imagen: fotoActividades, estado: 'Activo', categoria: 'educacion' },
      { id: 3, titulo: 'Recreación y comunidad', descripcion: 'Pintura, juegos, deportes, festejos especiales y acciones solidarias.', imagen: fotoInfancias, estado: 'Activo', categoria: 'recreativos' },
    ],
  },
  sumate: {
    title: 'Sumate a la Fundación',
    heroSubtitle: 'Tu tiempo, una donación o la difusión de nuestro trabajo pueden crear nuevas oportunidades.',
    content: 'Tu ayuda es fundamental para seguir transformando Tucumán.',
    bannerKicker: 'Fundación Creando Sonrisas',
    bannerTitle: 'Sumate',
    waysKicker: 'Elegí cómo participar',
    ways: [
      { id: 1, titulo: 'Voluntariado' }, { id: 2, titulo: 'Donaciones' }, { id: 3, titulo: 'Difusión' },
    ],
    introKicker: 'Tu ayuda importa',
    introTitle: 'Hay muchas maneras de crear oportunidades.',
    campaignKicker: 'Apadriná un deseo',
    campaignTitle: 'Elegí una cartita, convertite en padrino y hacé realidad su deseo.',
    campaignDeadline: 'Tenés tiempo hasta el 29 de agosto.',
    campaignButton: 'Apadrinar',
    campaignUrl: 'https://www.fundaros.com/appadrinar/creandosonrisas/campanas/dia-del-nino-creando-sonrisas-2026',
    volunteerKicker: 'Sumate al equipo',
    volunteerTitle: 'Quiero ser voluntario',
    volunteerText: 'Compartí tu tiempo y tus ganas de transformar realidades.',
    donationKicker: 'Donaciones',
    donationText: 'Cada aporte, sin importar el monto, ayuda a sostener nuestro trabajo cotidiano.',
    donationAlias: 'CREANDOSONRISASTUC',
    instagramUrl: 'https://www.instagram.com/creandosonrisas.tuc/',
    campaignImage: fotoComunidad,
    volunteerFormUrl: '',
    carouselImages: [
      { id: 1, url: fotoComunidad, alt: 'Voluntarios, niños y familias de Creando Sonrisas' },
      { id: 2, url: fotoFestejo, alt: 'Festejo comunitario junto a niños y voluntarios' },
      { id: 3, url: fotoActividades, alt: 'Actividades recreativas con niños de la comunidad' },
      { id: 4, url: fotoInfancias, alt: 'Un niño sonriendo durante una actividad de la fundación' },
    ],
  },
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
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, [pathname]);
  const { content: siteContent, save: saveContent } = useSiteContent(defaultSiteContent);
  const content = siteContent.home || defaultHomeContent;

  const acciones = Array.isArray(content.cards) ? content.cards : defaultHomeContent.cards;
  const pilares = Array.isArray(content.pillars) && content.pillars.length ? content.pillars : defaultHomeContent.pillars;
  const novedadesSlides = acciones.map((item, index) => ({
    ...item,
    imagen: resolveSiteImage(item.imagen),
  }));
  const heroBackground = resolveSiteImage(
    content.heroImage || novedadesSlides.find((item) => item.imagen)?.imagen,
    fotoComunidad,
  );
  const previousHeroSubtitles = [
    'Jóvenes tucumanos transformando realidades con educación, contención y trabajo solidario.',
    'Jóvenes tucumanos que transforman realidades con educación y trabajo territorial.',
  ];
  const heroSubtitle = !content.heroSubtitle || previousHeroSubtitles.includes(content.heroSubtitle)
    ? defaultHomeContent.heroSubtitle
    : content.heroSubtitle;
  const stats = Array.isArray(content.stats) && content.stats.length ? content.stats : defaultHomeContent.stats;
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
                className="home-hero home-hero-template"
                style={{
                  backgroundImage: heroBackground === fotoComunidad
                    ? `url('${fotoComunidad}')`
                    : `url('${heroBackground}'), url('${fotoComunidad}')`,
                }}
              >
                <div className="home-hero-content">
                  <h1>{content.heroTitle || defaultHomeContent.heroTitle}</h1>
                  <p>{heroSubtitle}</p>
                  <div className="home-hero-actions">
                    <Link className="home-primary-link" to="/sumate">Sumate</Link>
                    <a
                      className="home-instagram-link"
                      href={siteContent.sumate?.instagramUrl || 'https://www.instagram.com/creandosonrisas.tuc/'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" className="instagram-dot" />
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>
              </header>

              <main className="home-template-shell">
                <section className="home-quick-actions" aria-label="Formas de participar">
                  {stats.slice(0, 3).map((stat, index) => <article className="home-quick-action" key={stat.id || index}>
                    <div><span>{stat.valor}</span><h2>{stat.titulo}</h2><p>{stat.descripcion}</p></div>
                  </article>)}
                </section>

                <section className="home-causes-template" aria-labelledby="pillars-title">
                  <div className="template-section-title">
                    <span className="template-kicker">{content.areasKicker || defaultHomeContent.areasKicker}</span>
                    <h2 id="pillars-title">{content.areasTitle || defaultHomeContent.areasTitle}</h2>
                  </div>
                  <div className="home-pillars-grid">
                    {pilares.slice(0, 3).map((pillar, index) => {
                      const pillarNames = ['Acompañamiento escolar', 'Merendero', 'Recreación'];
                      const displayName = index === 0 && pillar.titulo === 'Educación' ? pillarNames[0] : (pillar.titulo || pillarNames[index]);
                      const pillarImage = resolveSiteImage(pillar.imagen, defaultHomeContent.pillars[index]?.imagen);
                      return (
                      <Link className={`home-pillar-card home-pillar-tone-${index + 1}`} to="/proyectos" key={pillar.id || index}>
                        <div className="home-pillar-image">
                          {pillarImage && <img src={pillarImage} alt={displayName} loading="lazy" decoding="async" />}
                        </div>
                        <div className="home-pillar-content">
                          <h3>{displayName}</h3>
                          <p>{pillar.desc}</p>
                        </div>
                      </Link>
                    )})}
                  </div>
                </section>

                <section className="home-cta-band">
                  <div><span>{content.ctaKicker}</span><h2>{content.ctaTitle}</h2></div>
                  <Link to="/sumate">{content.ctaButton}</Link>
                </section>

                <section id="novedades" className="home-news-template" aria-labelledby="news-title">
                  <div className="template-section-title centered">
                    <span className="template-kicker">{content.newsKicker}</span>
                    <h2 id="news-title">{content.newsTitle}</h2>
                  </div>
                  <div className="home-news-grid">
                    {novedadesSlides.slice(0, 3).map((item, index) => (
                      <article className="home-news-card" key={item.id || index}>
                        <div className="home-news-image">
                          {item.imagen ? <img src={item.imagen} alt={item.titulo} loading="lazy" /> : <span>Imagen pendiente</span>}
                        </div>
                        <div><span>Comunidad</span><h3>{item.titulo}</h3><p>{item.desc}</p></div>
                      </article>
                    ))}
                  </div>
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
        <div className="footer-legal">
          <p>{content.footerText || defaultHomeContent.footerText}</p>
          <span>Todos los derechos reservados.</span>
        </div>
        <div className="footer-developer">
          <span>Desarrollado por Martina Ledesma</span>
          <a
            href={content.developerLinkedin || defaultHomeContent.developerLinkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Martina Ledesma"
            title="LinkedIn de Martina Ledesma"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 10v7M8 7.5v.1M12 17v-4c0-1.7 1.1-3 2.7-3 1.5 0 2.3 1 2.3 3v4M12 10v7" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
