import React, { useEffect, useRef, useState } from 'react';
import useHeroImageReady from '../hooks/useHeroImageReady';

const defaultProjects = [
  {
    id: 1,
    titulo: 'Merendero comunitario',
    descripcion: 'Meriendas y almuerzos compartidos con niños, niñas y familias de la comunidad.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 2,
    titulo: 'Apoyo escolar',
    descripcion: 'Acompañamiento educativo para fortalecer el aprendizaje y las trayectorias escolares.',
    imagen: '',
    estado: 'Activo',
  },
  {
    id: 3,
    titulo: 'Recreación y comunidad',
    descripcion: 'Pintura, juegos, deportes, festejos especiales y acciones solidarias.',
    imagen: '',
    estado: 'Activo',
  },
];

const projectAreas = [
  {
    title: 'Educación',
    text: 'Apoyo escolar y acompañamiento para niños, niñas y adolescentes.',
  },
  {
    title: 'Alimentación',
    text: 'Meriendas y almuerzos que también crean un espacio de encuentro y contención.',
  },
  {
    title: 'Salud y acompañamiento',
    text: 'Acciones que acercan cuidado y acompañamiento a las familias de la comunidad.',
  },
  {
    title: 'Recreación',
    text: 'Pintura, juegos, deportes y festejos de fechas especiales para compartir y aprender.',
  },
];

const getStatusClass = (status = '') => {
  const normalized = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('ultimos cupos')) return 'feature-status status-warning';
  if (normalized.includes('finalizado')) return 'feature-status status-finished';
  return 'feature-status status-active';
};

const getStatusLabel = (status) => (
  status === 'Últimos cupos' ? '⚠ Últimos cupos' : status
);

const projectFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 'salud', label: 'Salud' },
  { id: 'educacion', label: 'Educación' },
  { id: 'recreativos', label: 'Recreativos' },
];

const normalizeText = (value = '') => (
  value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
);

const getProjectCategory = (project = {}) => {
  const explicitCategory = normalizeText(project.categoria || project.category || project.area || '');
  if (explicitCategory.includes('salud')) return 'salud';
  if (explicitCategory.includes('educacion') || explicitCategory.includes('educativo')) return 'educacion';
  if (explicitCategory.includes('recreativo') || explicitCategory.includes('recreacion')) return 'recreativos';

  const searchableText = normalizeText(`${project.titulo || ''} ${project.nombre || ''} ${project.descripcion || ''}`);
  if (searchableText.match(/salud|visual|oftalm|anteojo|medic|vacun|desparasit/)) return 'salud';
  if (searchableText.match(/educacion|educativo|escuela|escolar|oficio|curso|taller|aprendiz/)) return 'educacion';
  if (searchableText.match(/recrea|deporte|juego|cultura|arte|encuentro|bienestar animal|mascota/)) return 'recreativos';
  return 'recreativos';
};

const Proyectos = () => {
  const content = {};
  const [expandedProjects, setExpandedProjects] = useState({});
  const [activeFilter, setActiveFilter] = useState('todos');
  const areasTrackRef = useRef(null);

  const toggleProjectExpand = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollAreas = (direction) => {
    const track = areasTrackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.82, 760),
      behavior: 'smooth',
    });
  };

  const projects = content.items?.length ? content.items : defaultProjects;
  const visibleProjects = activeFilter === 'todos'
    ? projects
    : projects.filter((project) => getProjectCategory(project) === activeFilter);
  const heroImage = content.heroImage || projects.find((project) => project.imagen)?.imagen || '';
  const heroReady = useHeroImageReady(heroImage, false);

  useEffect(() => {
    if (!heroReady) return undefined;

    const track = areasTrackRef.current;
    if (!track) return undefined;

    const interval = window.setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      track.scrollBy({ left: 4, behavior: 'auto' });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [heroReady]);

  if (!heroReady) {
    return (
      <div className="page-loader">
        <span>Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="proyectos-page">
      <header
        className="page-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.54), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="page-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Proyectos</span>
            <h1>Donde hay una necesidad nace un proyecto.</h1>
            <p>
              {content.heroSubtitle || 'Impulsamos respuestas concretas en educación, salud, oficios y cuidado comunitario.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Impacto territorial</span>
            <strong>Acciones sostenidas junto a escuelas, familias, vecinos e instituciones.</strong>
          </div>
        </div>
      </header>

      <section className="page-intro">
        <p>
          {content.introText || 'Transformamos necesidades concretas en oportunidades mediante educación, alimentación, acompañamiento y acciones comunitarias.'}
        </p>
      </section>

      <section className="project-areas-section" aria-labelledby="project-areas-title">
        <div className="project-areas-header">
          <div className="project-section-heading">
            <span>Áreas de trabajo</span>
            <h2 id="project-areas-title" className="display-subtitle">
              <span className="title-line title-line-blue">Proyectos enfocados</span>
              <span className="title-line title-line-white">en necesidades reales</span>
            </h2>
          </div>
          <div className="project-carousel-controls">
            <button type="button" onClick={() => scrollAreas(-1)} aria-label="Ver áreas anteriores">
              ←
            </button>
            <button type="button" onClick={() => scrollAreas(1)} aria-label="Ver áreas siguientes">
              →
            </button>
          </div>
        </div>
        <div className="project-areas-carousel" ref={areasTrackRef}>
          {projectAreas.map((area, index) => (
            <article className="project-area-card" key={area.title}>
              <span className="project-area-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-list-section" aria-labelledby="projects-list-title">
        <div className="project-section-heading">
          <span>En marcha</span>
          <h2 id="projects-list-title" className="display-subtitle">
            <span className="title-line title-line-blue">Proyectos</span>
            <span className="title-line title-line-white">activos</span>
          </h2>
        </div>
        <div className="project-filter-tabs" aria-label="Filtrar proyectos">
          {projectFilters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              className={activeFilter === filter.id ? 'active' : ''}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="feature-grid proyectos-feature-grid">
          {visibleProjects.map((project, index) => (
            <article className="feature-card" key={project.id || project.titulo || index}>
              {project.imagen && (
                <img src={project.imagen} alt={project.titulo} className="feature-card-img" loading="lazy" decoding="async" />
              )}
              <div className="feature-card-content">
                {project.estado && (
                  <span className={getStatusClass(project.estado)}>{getStatusLabel(project.estado)}</span>
                )}
                <h2>{project.titulo}</h2>
                <p className={expandedProjects[index] ? 'feature-description expanded' : 'feature-description'}>
                  {project.descripcion}
                </p>
                {project.descripcion && (
                  <button
                    type="button"
                    className="btn-small feature-toggle"
                    onClick={() => toggleProjectExpand(index)}
                  >
                    {expandedProjects[index] ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        {!visibleProjects.length && (
          <p className="project-empty-state">No hay proyectos cargados en esta categoría por ahora.</p>
        )}
      </section>
    </div>
  );
};

export default Proyectos;
