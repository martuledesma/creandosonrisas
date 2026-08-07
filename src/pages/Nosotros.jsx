import React, { useRef, useState } from 'react';

const defaultAlliances = [
  {
    name: 'Aliado local',
    type: 'Entidad colaboradora',
  },
  {
    name: 'Profesional voluntario',
    type: 'Persona patrocinadora',
  },
  {
    name: 'Comercio amigo',
    type: 'Apoyo comunitario',
  },
  {
    name: 'Institución educativa',
    type: 'Trabajo articulado',
  },
];

function Nosotros({ content = {} }) {
  const [expandedMembers, setExpandedMembers] = useState({});
  const teamTrackRef = useRef(null);

  const toggleMemberExpand = (index) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollTeam = (direction) => {
    const track = teamTrackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.78, 720),
      behavior: 'smooth',
    });
  };

  const heroImage = content.heroImage || '';
  const alliances = content.alliances?.length ? content.alliances : defaultAlliances;

  return (
    <div className="nosotros-page">
      <header
        className="nosotros-hero page-hero-photo"
        style={heroImage ? {
          backgroundImage: `linear-gradient(90deg, rgba(13, 76, 111, 0.54), rgba(255, 255, 255, 0.08) 46%, rgba(246, 189, 79, 0.16)), url('${heroImage}')`,
        } : undefined}
      >
        <div className="nosotros-hero-content">
          <div className="page-hero-copy">
            <span className="page-eyebrow">Nosotros</span>
            <h1>{content.title || 'Quiénes somos'}</h1>
            <p>
              {content.heroSubtitle || 'Jóvenes tucumanos que transforman realidades con educación y trabajo territorial.'}
            </p>
          </div>
          <div className="page-hero-card">
            <span>Fundación Creando Sonrisas</span>
            <strong>Educación, solidaridad y compromiso comunitario.</strong>
          </div>
        </div>
      </header>

      {/* Sección del equipo */}
      <section className="team-section team-carousel-section">
        <div className="team-carousel-header">
          <div>
            <span>Nosotros</span>
            <h2 className="display-subtitle">
              <span className="title-line title-line-blue">Las personas</span>
              <span className="title-line title-line-orange team-title-mixed">
                <span>detrás de cada </span>
                <span className="team-title-blue-word">proyecto</span>
              </span>
            </h2>
          </div>
          <div className="team-carousel-controls">
            <button type="button" onClick={() => scrollTeam(-1)} aria-label="Ver integrantes anteriores">
              ←
            </button>
            <button type="button" onClick={() => scrollTeam(1)} aria-label="Ver integrantes siguientes">
              →
            </button>
          </div>
        </div>

        <div className="team-carousel-track" ref={teamTrackRef}>
          <article className="team-carousel-intro">
            <span>Sobre nosotros</span>
            <p>
              {content.content || 'Somos una organización civil impulsada por jóvenes tucumanos. A través del merendero, el apoyo escolar, el acompañamiento en salud y distintas acciones solidarias, generamos oportunidades para niños, adolescentes y familias.'}
            </p>
            {content.additionalText && <p>{content.additionalText}</p>}
          </article>

          {(content.teamCards || []).map((member, index) => (
            <article
              className={`team-card team-carousel-card ${expandedMembers[index] ? 'is-expanded' : ''}`}
              key={member.id || index}
              tabIndex="0"
              onClick={() => toggleMemberExpand(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleMemberExpand(index);
                }
              }}
            >
              {member.imagen && (
                <div className="team-image">
                  <img src={member.imagen} alt={member.nombre} loading="lazy" decoding="async" />
                </div>
              )}
              <div className="team-card-overlay">
                <h3>{member.nombre}</h3>
                <p>{member.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="alliances-section" aria-labelledby="alliances-title">
        <div className="alliances-header">
          <span>Red de apoyo</span>
          <h2 id="alliances-title" className="display-subtitle alliances-title">
            <span className="title-line title-line-blue">Nuestras</span>
            <span className="title-line title-line-orange">alianzas</span>
          </h2>
        </div>
        <div className="alliances-grid">
          {alliances.map((alliance, index) => {
            const name = alliance.name || alliance.nombre || `Alianza ${index + 1}`;
            const type = alliance.type || alliance.tipo || 'Persona o entidad patrocinadora';
            const image = alliance.image || alliance.imagen || alliance.logo || '';
            const initials = name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join('')
              .toUpperCase();

            return (
              <article className="alliance-card" key={`${name}-${index}`}>
                <span className="alliance-mark">
                  {image ? <img src={image} alt={name} loading="lazy" decoding="async" /> : initials}
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{type}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Nosotros;
