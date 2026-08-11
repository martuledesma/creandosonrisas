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

const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatEventDate = (dateString, options) => {
  const date = parseLocalDate(dateString);
  return date ? date.toLocaleDateString('es-AR', options) : '';
};

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

const Proyectos = ({ content = {}, events = [] }) => {
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = parseLocalDate(event.fecha);
      return eventDate && eventDate >= today;
    })
    .sort((a, b) => parseLocalDate(a.fecha) - parseLocalDate(b.fecha))
    .slice(0, 5);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493816384353';
  return (
    <div className="proyectos-page proyectos-page-without-hero">
      <section className="projects-events-section" aria-labelledby="projects-events-title">
        <header className="projects-events-heading">
          <span>Agenda comunitaria</span>
          <h2 id="projects-events-title">Próximos eventos</h2>
        </header>
        {upcomingEvents.length ? (
          <div className="projects-events-horizontal" aria-label="Lista de próximos eventos">
            {upcomingEvents.map((event, index) => (
              <details className="projects-event-item" key={event.id || `${event.fecha}-${event.titulo}`}>
                <summary>
                  <time dateTime={event.fecha}>
                    <strong>{formatEventDate(event.fecha, { day: '2-digit' })}</strong>
                    <span>{formatEventDate(event.fecha, { month: 'short' }).toUpperCase()}</span>
                  </time>
                  <div>
                    <span>{index === 0 ? 'Próximo encuentro' : `Evento ${index + 1}`}</span>
                    <h3>{event.titulo}</h3>
                    {event.lugar && <p>{event.lugar}</p>}
                  </div>
                  <span className="projects-event-expand" aria-hidden="true">+</span>
                </summary>
                <div className="projects-event-details">
                  {event.imagen && <img src={event.imagen} alt={event.titulo} loading="lazy" decoding="async" />}
                  {event.descripcion && <p>{event.descripcion}</p>}
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="projects-events-empty"><span>Agenda en preparación</span><p>Muy pronto publicaremos las próximas actividades.</p></div>
        )}
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
