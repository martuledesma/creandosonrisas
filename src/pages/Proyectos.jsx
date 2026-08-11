import React, { useState } from 'react';
import fotoFestejo from '../Assets/creando-sonrisas-festejo.jpg';
import fotoActividades from '../Assets/creando-sonrisas-actividades.jpg';
import fotoInfancias from '../Assets/creando-sonrisas-infancias.jpg';

const defaultProjects = [
  {
    id: 1,
    titulo: 'Merendero comunitario',
    descripcion: 'Meriendas y almuerzos compartidos con niños, niñas y familias de la comunidad.',
    imagen: fotoFestejo,
    estado: 'Activo',
  },
  {
    id: 2,
    titulo: 'Apoyo escolar',
    descripcion: 'Acompañamiento educativo para fortalecer el aprendizaje y las trayectorias escolares.',
    imagen: fotoActividades,
    estado: 'Activo',
  },
  {
    id: 3,
    titulo: 'Recreación y comunidad',
    descripcion: 'Pintura, juegos, deportes, festejos especiales y acciones solidarias.',
    imagen: fotoInfancias,
    estado: 'Activo',
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

const Proyectos = ({ content = {} }) => {
  const [expandedProjects, setExpandedProjects] = useState({});
  const [activeFilter, setActiveFilter] = useState('todos');

  const toggleProjectExpand = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const projects = content.items?.length ? content.items : defaultProjects;
  const visibleProjects = activeFilter === 'todos'
    ? projects
    : projects.filter((project) => getProjectCategory(project) === activeFilter);
  const bannerImage = projects.find((project) => project.imagen)?.imagen || fotoFestejo;
  return (
    <div className="proyectos-page proyectos-page-without-hero">
      <header className="projects-compact-banner" style={{ backgroundImage: `url('${bannerImage}')` }}>
        <div><span>Fundación Creando Sonrisas</span><h1>Proyectos</h1></div>
      </header>
      <section className="page-intro">
        <p>
          {content.introText || 'Transformamos necesidades concretas en oportunidades mediante educación, alimentación, acompañamiento y acciones comunitarias.'}
        </p>
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
