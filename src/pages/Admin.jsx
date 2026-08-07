import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUploadField from '../components/ImageUploadField';
import {
  ADMIN_EMAIL,
  logout as firebaseLogout,
  signIn as firebaseSignIn,
  subscribeSiteContent,
  saveSiteContent,
  subscribeNosotrosContent,
  saveNosotrosContent,
  subscribeSumateContent,
  saveSumateContent,
  subscribeProyectosContent,
  saveProyectosContent,
} from '../firebase';

const statusOptions = ['Activo', 'Últimos cupos', 'Finalizado'];

const Admin = ({ user, content, loading, onSave }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState(content || {});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('homepage');
  const [openItems, setOpenItems] = useState({});
  const [savingItems, setSavingItems] = useState({});

  const [nosotrosContent, setNosotrosContent] = useState({});
  const [sumateContent, setSumateContent] = useState({});
  const [proyectosContent, setProyectosContent] = useState({});

  useEffect(() => {
    if (content) {
      setFormState(content);
    }
  }, [content]);

  useEffect(() => {
    const unsubscribeNosotros = subscribeNosotrosContent(
      (snapshot) => {
        setNosotrosContent(snapshot.exists() ? snapshot.data() : { teamCards: [] });
      },
      (error) => console.error('Nosotros content error:', error)
    );

    const unsubscribeSumate = subscribeSumateContent(
      (snapshot) => {
        setSumateContent(snapshot.exists() ? snapshot.data() : { carouselImages: [] });
      },
      (error) => console.error('Sumate content error:', error)
    );

    const unsubscribeProyectos = subscribeProyectosContent(
      (snapshot) => {
        setProyectosContent(snapshot.exists() ? snapshot.data() : { items: [] });
      },
      (error) => console.error('Proyectos content error:', error)
    );

    return () => {
      unsubscribeNosotros();
      unsubscribeSumate();
      unsubscribeProyectos();
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    try {
      await firebaseSignIn(emailTrimmed, passwordTrimmed);
    } catch (err) {
      console.error('Login error:', err);
      const code = err?.code || 'auth/unknown';
      const message = err?.message || 'Error al iniciar sesión. Revisa tu email y contraseña.';
      setError(`Error al iniciar sesión (${code}): ${message}`);
    }
  };

  const handleLogout = async () => {
    await firebaseLogout();
  };

  const updateField = (field, value, page = activeTab) => {
    if (page === 'homepage') {
      setFormState((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'nosotros') {
      setNosotrosContent((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'sumate') {
      setSumateContent((prev) => ({ ...prev, [field]: value }));
    } else if (page === 'proyectos') {
      setProyectosContent((prev) => ({ ...prev, [field]: value }));
    }
  };

  const updateCard = (index, field, value) => {
    setFormState((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const updateEvent = (index, field, value) => {
    setFormState((prev) => ({
      ...prev,
      events: prev.events.map((event, idx) =>
        idx === index ? { ...event, [field]: value } : event
      ),
    }));
  };

  const updateNosotrosCard = (index, field, value) => {
    setNosotrosContent((prev) => ({
      ...prev,
      teamCards: (prev.teamCards || []).map((card, idx) =>
        idx === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const updateNosotrosClosingValue = (index, value) => {
    setNosotrosContent((prev) => {
      const closingValues = [...(prev.closingValues || ['Servicio', 'Trabajo', 'Impacto'])];
      closingValues[index] = value;
      return { ...prev, closingValues };
    });
  };

  const updateSumateCarouselImage = (index, field, value) => {
    setSumateContent((prev) => ({
      ...prev,
      carouselImages: (prev.carouselImages || []).map((image, idx) =>
        idx === index ? { ...image, [field]: value } : image
      ),
    }));
  };

  const updateProyecto = (index, field, value) => {
    setProyectosContent((prev) => ({
      ...prev,
      items: (prev.items || []).map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const getItemKey = (section, item, index) => `${section}-${item?.id || index}`;

  const openItem = (section, item, index = 0) => {
    const key = getItemKey(section, item, index);
    setOpenItems((prev) => ({ ...prev, [key]: true }));
  };

  const toggleItem = (section, item, index) => {
    const key = getItemKey(section, item, index);
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemOpen = (section, item, index) => Boolean(openItems[getItemKey(section, item, index)]);

  const saveItemChanges = async (section, item, index, saveChanges, successMessage = 'Se ha guardado correctamente.') => {
    const key = getItemKey(section, item, index);
    setError('');
    setSuccessMessage('');
    setSavingItems((prev) => ({ ...prev, [key]: true }));

    try {
      await saveChanges();
      setSuccessMessage(successMessage);
    } catch (err) {
      console.error('Item save error:', err);
      setError(`No se pudo guardar. ${err?.message || 'Revisa la conexión o configuración de Firebase.'}`);
    } finally {
      setSavingItems((prev) => ({ ...prev, [key]: false }));
    }
  };

  const renderEditableItem = ({
    section,
    item,
    index,
    title,
    summary,
    onSave,
    onDelete,
    children,
    className = 'editor-card',
  }) => {
    const open = isItemOpen(section, item, index);
    const saving = Boolean(savingItems[getItemKey(section, item, index)]);

    return (
      <div className={`${className} ${open ? 'is-open' : ''}`} key={item?.id || index}>
        <div className="editor-item-header">
          <div className="editor-item-title">
            <h4>{title}</h4>
            {summary && <p>{summary}</p>}
          </div>
          <div className="editor-item-actions">
            <button
              type="button"
              className="btn-edit"
              onClick={() => toggleItem(section, item, index)}
              aria-label={open ? `Cerrar edición de ${title}` : `Editar ${title}`}
              title={open ? 'Cerrar' : 'Editar'}
            >
              {open ? '▴' : '✎'}
            </button>
            {onSave && (
              <button
                type="button"
                className="btn-item-action"
                onClick={() => saveItemChanges(section, item, index, onSave)}
                disabled={saving}
                aria-label={`Guardar ${title}`}
                title="Guardar"
              >
                {saving ? '…' : '✓'}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn-item-action"
                onClick={() => saveItemChanges(section, item, index, onDelete, 'Se ha eliminado correctamente.')}
                disabled={saving}
                aria-label={`Eliminar ${title}`}
                title="Eliminar"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {open && <div className="editor-item-body">{children}</div>}
      </div>
    );
  };

  const renderHeroImageField = (pageContent, page) => (
    <ImageUploadField
      label="URL de la imagen de portada"
      value={pageContent?.heroImage || ''}
      onChange={(value) => updateField('heroImage', value, page)}
      previewAlt="Preview portada"
      previewWidth="400px"
    />
  );



  const addNewCard = () => {
    const newCard = { id: Date.now(), titulo: '', desc: '', imagen: '' };
    setFormState((prev) => ({
      ...prev,
      cards: [newCard, ...(prev.cards || [])],
    }));
    openItem('home-cards', newCard);
  };

  const addNewNosotrosCard = () => {
    const newMember = { id: Date.now(), nombre: '', descripcion: '', imagen: '' };
    setNosotrosContent((prev) => ({
      ...prev,
      teamCards: [newMember, ...(prev.teamCards || [])],
    }));
    openItem('nosotros-team', newMember);
  };

  const addNewSumateCarouselImage = () => {
    const newImage = { id: Date.now(), url: '', alt: '' };
    setSumateContent((prev) => ({
      ...prev,
      carouselImages: [newImage, ...(prev.carouselImages || [])],
    }));
    openItem('sumate-carousel', newImage);
  };

  const addNewProyecto = () => {
    const newProject = { id: Date.now(), titulo: '', descripcion: '', imagen: '', estado: 'Activo' };
    setProyectosContent((prev) => ({
      ...prev,
      items: [
        newProject,
        ...(prev.items || []),
      ],
    }));
    openItem('proyectos-items', newProject);
  };

  const deleteCard = async (index) => {
    const cards = (formState.cards || []).filter((_, idx) => idx !== index);
    await saveSiteContent({ cards });
    setFormState((prev) => ({ ...prev, cards }));
  };

  const deleteEvent = async (index) => {
    const events = (formState.events || []).filter((_, idx) => idx !== index);
    await saveSiteContent({ events });
    setFormState((prev) => ({ ...prev, events }));
  };

  const deleteNosotrosCard = async (index) => {
    const teamCards = (nosotrosContent.teamCards || []).filter((_, idx) => idx !== index);
    await saveNosotrosContent({ teamCards });
    setNosotrosContent((prev) => ({ ...prev, teamCards }));
  };

  const deleteSumateCarouselImage = async (index) => {
    const carouselImages = (sumateContent.carouselImages || []).filter((_, idx) => idx !== index);
    await saveSumateContent({ carouselImages });
    setSumateContent((prev) => ({ ...prev, carouselImages }));
  };

  const deleteProyecto = async (index) => {
    const items = (proyectosContent.items || []).filter((_, idx) => idx !== index);
    await saveProyectosContent({ items });
    setProyectosContent((prev) => ({ ...prev, items }));
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    try {
      if (activeTab === 'homepage') {
        await saveSiteContent(formState);
      } else if (activeTab === 'nosotros') {
        await saveNosotrosContent(nosotrosContent);
      } else if (activeTab === 'sumate') {
        await saveSumateContent(sumateContent);
      } else if (activeTab === 'proyectos') {
        await saveProyectosContent(proyectosContent);
      }
      setSuccessMessage('Se ha guardado correctamente.');
    } catch (err) {
      console.error('Save error:', err);
      setError(`No se pudo guardar. ${err?.message || 'Revisa la conexión o configuración de Firebase.'}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Administrador</h2>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <h2>Inicio de sesión de administrador</h2>
        <form className="admin-form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn-nav">
            Iniciar sesión
          </button>

          {error && <p className="form-error">{error}</p>}
        </form>

        <p className="admin-note">
          Solo el administrador podrá modificar novedades, eventos y textos.
        </p>
        <p className="admin-note">
          Asegúrate de habilitar Email/Password en Firebase Auth y de que el usuario exista con el email {ADMIN_EMAIL}.
        </p>

        <Link to="/">Volver a la página principal</Link>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="admin-page">
        <h2>Acceso restringido</h2>
        <p>Solo el administrador puede editar el contenido.</p>
        <button className="btn-nav" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'homepage':
        return (
          <>
            <div className="editor-block">
              <h3>Imagen de Portada</h3>
              <ImageUploadField
                label="URL de la imagen del hero"
                value={formState?.heroImage || ''}
                onChange={(value) => updateField('heroImage', value)}
                previewAlt="Preview portada"
                previewWidth="400px"
              />
            </div>

            <div className="editor-block">
              <h3>Texto principal</h3>
              <label>
                Título de portada
                <input
                  type="text"
                  value={formState?.heroTitle || ''}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                />
              </label>
              <label>
                Subtítulo
                <input
                  type="text"
                  value={formState?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Carrusel de novedades</h3>
              <p className="admin-note">Cada novedad se muestra como una diapositiva del carrusel de inicio.</p>
              <button className="btn-nav" onClick={addNewCard}>
                Agregar
              </button>
              {formState?.cards?.map((card, index) => renderEditableItem({
                section: 'home-cards',
                item: card,
                index,
                title: card.titulo || `Novedad ${index + 1}`,
                summary: card.desc || 'Sin descripción cargada',
                onSave: () => saveSiteContent({ cards: formState.cards || [] }),
                onDelete: () => deleteCard(index),
                children: (
                  <>
                  <label>
                    Título
                    <input
                      type="text"
                      value={card.titulo}
                      onChange={(e) => updateCard(index, 'titulo', e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      value={card.desc}
                      onChange={(e) => updateCard(index, 'desc', e.target.value)}
                    />
                  </label>
                  <ImageUploadField
                    value={card.imagen}
                    onChange={(value) => updateCard(index, 'imagen', value)}
                    previewWidth="200px"
                  />
                  </>
                ),
              }))}
            </div>

            <div className="editor-block">
              <h3>Eventos del calendario</h3>
              {formState?.events?.map((event, index) => renderEditableItem({
                section: 'home-events',
                item: event,
                index,
                title: event.titulo || `Evento ${index + 1}`,
                summary: [event.fecha, event.lugar].filter(Boolean).join(' · ') || 'Sin fecha ni lugar cargados',
                onSave: () => saveSiteContent({ events: formState.events || [] }),
                onDelete: () => deleteEvent(index),
                className: 'editor-event',
                children: (
                  <>
                  <label>
                    Fecha
                    <input
                      type="date"
                      value={event.fecha}
                      onChange={(e) => updateEvent(index, 'fecha', e.target.value)}
                    />
                  </label>
                  <label>
                    Título
                    <input
                      type="text"
                      value={event.titulo}
                      onChange={(e) => updateEvent(index, 'titulo', e.target.value)}
                    />
                  </label>
                  <label>
                    Lugar
                    <input
                      type="text"
                      value={event.lugar}
                      onChange={(e) => updateEvent(index, 'lugar', e.target.value)}
                    />
                  </label>
                  </>
                ),
              }))}
            </div>

            <div className="editor-block">
              <h3>Textos adicionales</h3>
              <label>
                Dirección de contacto
                <input
                  type="text"
                  value={formState?.contactAddress || ''}
                  onChange={(e) => updateField('contactAddress', e.target.value)}
                />
              </label>
              <label>
                Texto de pie de página
                <input
                  type="text"
                  value={formState?.footerText || ''}
                  onChange={(e) => updateField('footerText', e.target.value)}
                />
              </label>
            </div>
          </>
        );

      case 'nosotros':
        return (
          <>
            <div className="editor-block">
              <h3>Contenido de la página "Nosotros"</h3>
              <label>
                Título principal
                <input
                  type="text"
                  value={nosotrosContent?.title || ''}
                  onChange={(e) => updateField('title', e.target.value, 'nosotros')}
                />
              </label>
              {renderHeroImageField(nosotrosContent, 'nosotros')}
              <label>
                Subtítulo del bloque azul
                <input
                  type="text"
                  value={nosotrosContent?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value, 'nosotros')}
                />
              </label>
              <label>
                Contenido principal
                <textarea
                  rows="10"
                  value={nosotrosContent?.content || ''}
                  onChange={(e) => updateField('content', e.target.value, 'nosotros')}
                />
              </label>
              <label>
                Texto adicional
                <textarea
                  rows="5"
                  value={nosotrosContent?.additionalText || ''}
                  onChange={(e) => updateField('additionalText', e.target.value, 'nosotros')}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Equipo - Miembros</h3>
              <button className="btn-nav" onClick={addNewNosotrosCard}>
                Agregar
              </button>
              {nosotrosContent?.teamCards?.map((card, index) => renderEditableItem({
                section: 'nosotros-team',
                item: card,
                index,
                title: card.nombre || `Miembro ${index + 1}`,
                summary: card.descripcion || 'Sin descripción cargada',
                onSave: () => saveNosotrosContent({ teamCards: nosotrosContent.teamCards || [] }),
                onDelete: () => deleteNosotrosCard(index),
                children: (
                  <>
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={card.nombre}
                      onChange={(e) => updateNosotrosCard(index, 'nombre', e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      value={card.descripcion}
                      onChange={(e) => updateNosotrosCard(index, 'descripcion', e.target.value)}
                    />
                  </label>
                  <ImageUploadField
                    value={card.imagen}
                    onChange={(value) => updateNosotrosCard(index, 'imagen', value)}
                    previewWidth="200px"
                  />
                  </>
                ),
              }))}
            </div>

            <div className="editor-block">
              <h3>Cierre institucional</h3>
              <label>
                Título
                <input
                  type="text"
                  value={nosotrosContent?.closingTitle || ''}
                  onChange={(e) => updateField('closingTitle', e.target.value, 'nosotros')}
                  placeholder="Construimos comunidad con acciones concretas"
                />
              </label>
              <label>
                Texto
                <textarea
                  rows="4"
                  value={nosotrosContent?.closingText || ''}
                  onChange={(e) => updateField('closingText', e.target.value, 'nosotros')}
                  placeholder="Conocé nuestros proyectos o sumate para acompañar el trabajo de la fundación."
                />
              </label>
              {(nosotrosContent?.closingValues || ['Servicio', 'Trabajo', 'Impacto']).map((value, index) => (
                <label key={`closing-value-${index}`}>
                  Valor {index + 1}
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateNosotrosClosingValue(index, e.target.value)}
                  />
                </label>
              ))}
              <label>
                Texto del botón Proyectos
                <input
                  type="text"
                  value={nosotrosContent?.closingProjectsLabel || ''}
                  onChange={(e) => updateField('closingProjectsLabel', e.target.value, 'nosotros')}
                  placeholder="Conocé nuestros proyectos"
                />
              </label>
              <label>
                Texto del botón Sumate
                <input
                  type="text"
                  value={nosotrosContent?.closingJoinLabel || ''}
                  onChange={(e) => updateField('closingJoinLabel', e.target.value, 'nosotros')}
                  placeholder="Sumate"
                />
              </label>
            </div>
          </>
        );

      case 'sumate':
        return (
          <>
            <div className="editor-block">
              <h3>Contenido de la página "Sumate"</h3>
              <label>
                Título principal
                <input
                  type="text"
                  value={sumateContent?.title || ''}
                  onChange={(e) => updateField('title', e.target.value, 'sumate')}
                />
              </label>
              {renderHeroImageField(sumateContent, 'sumate')}
              <label>
                Subtítulo del bloque azul
                <input
                  type="text"
                  value={sumateContent?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value, 'sumate')}
                />
              </label>
              <label>
                Contenido principal
                <textarea
                  rows="10"
                  value={sumateContent?.content || ''}
                  onChange={(e) => updateField('content', e.target.value, 'sumate')}
                />
              </label>
              <label>
                Información de contacto
                <textarea
                  rows="5"
                  value={sumateContent?.contactInfo || ''}
                  onChange={(e) => updateField('contactInfo', e.target.value, 'sumate')}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Fotos del carrusel</h3>
              <button className="btn-nav" onClick={addNewSumateCarouselImage}>
                Agregar
              </button>
              {sumateContent?.carouselImages?.map((image, index) => renderEditableItem({
                section: 'sumate-carousel',
                item: image,
                index,
                title: image.alt || `Foto ${index + 1}`,
                summary: image.url || 'Sin URL cargada',
                onSave: () => saveSumateContent({ carouselImages: sumateContent.carouselImages || [] }),
                onDelete: () => deleteSumateCarouselImage(index),
                children: (
                  <>
                  <ImageUploadField
                    value={image.url || ''}
                    onChange={(value) => updateSumateCarouselImage(index, 'url', value)}
                    previewAlt="Preview carrusel"
                  />
                  <label>
                    Texto alternativo
                    <input
                      type="text"
                      placeholder="Descripción breve de la imagen"
                      value={image.alt || ''}
                      onChange={(e) => updateSumateCarouselImage(index, 'alt', e.target.value)}
                    />
                  </label>
                  </>
                ),
              }))}
            </div>
          </>
        );

      case 'proyectos':
        return (
          <>
            <div className="editor-block">
              <h3>Contenido de la página "Proyectos"</h3>
              <label>
                Título principal
                <input
                  type="text"
                  value={proyectosContent?.title || ''}
                  onChange={(e) => updateField('title', e.target.value, 'proyectos')}
                />
              </label>
              {renderHeroImageField(proyectosContent, 'proyectos')}
              <label>
                Subtítulo del bloque azul
                <input
                  type="text"
                  value={proyectosContent?.heroSubtitle || ''}
                  onChange={(e) => updateField('heroSubtitle', e.target.value, 'proyectos')}
                />
              </label>
              <label>
                Texto introductorio
                <textarea
                  rows="4"
                  value={proyectosContent?.introText || ''}
                  onChange={(e) => updateField('introText', e.target.value, 'proyectos')}
                />
              </label>
            </div>

            <div className="editor-block">
              <h3>Listado de proyectos</h3>
              <button className="btn-nav" onClick={addNewProyecto}>
                Agregar
              </button>
              {proyectosContent?.items?.map((item, index) => renderEditableItem({
                section: 'proyectos-items',
                item,
                index,
                title: item.titulo || `Proyecto ${index + 1}`,
                summary: [item.estado, item.descripcion].filter(Boolean).join(' · ') || 'Sin descripción cargada',
                onSave: () => saveProyectosContent({ items: proyectosContent.items || [] }),
                onDelete: () => deleteProyecto(index),
                children: (
                  <>
                  <label>
                    Título
                    <input
                      type="text"
                      value={item.titulo || ''}
                      onChange={(e) => updateProyecto(index, 'titulo', e.target.value)}
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      value={item.descripcion || ''}
                      onChange={(e) => updateProyecto(index, 'descripcion', e.target.value)}
                    />
                  </label>
                  <label>
                    Estado
                    <select
                      value={item.estado || ''}
                      onChange={(e) => updateProyecto(index, 'estado', e.target.value)}
                    >
                      <option value="">Seleccionar estado</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ImageUploadField
                    value={item.imagen || ''}
                    onChange={(value) => updateProyecto(index, 'imagen', value)}
                    previewAlt="Preview proyecto"
                  />
                  </>
                ),
              }))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>Panel de administración</h2>
          <p>Modifica la información que se muestra en las páginas.</p>
        </div>
        <button className="btn-nav" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'homepage' ? 'active' : ''}`}
          onClick={() => setActiveTab('homepage')}
        >
          Inicio
        </button>
        <button
          className={`tab-button ${activeTab === 'nosotros' ? 'active' : ''}`}
          onClick={() => setActiveTab('nosotros')}
        >
          Nosotros
        </button>
        <button
          className={`tab-button ${activeTab === 'sumate' ? 'active' : ''}`}
          onClick={() => setActiveTab('sumate')}
        >
          Sumate
        </button>
        <button
          className={`tab-button ${activeTab === 'proyectos' ? 'active' : ''}`}
          onClick={() => setActiveTab('proyectos')}
        >
          Proyectos
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {renderTabContent()}

      <button className="btn-nav" onClick={handleSave}>
        Guardar cambios
      </button>

      {successMessage && (
        <div className="save-modal" role="dialog" aria-modal="true" aria-labelledby="save-modal-title">
          <button
            type="button"
            className="save-modal-backdrop"
            onClick={() => setSuccessMessage('')}
            aria-label="Cerrar aviso"
          />
          <div className="save-modal-content">
            <button
              type="button"
              className="save-modal-close"
              onClick={() => setSuccessMessage('')}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
            <div className="save-modal-icon" aria-hidden="true">✓</div>
            <h3 id="save-modal-title">{successMessage}</h3>
            <p>Los cambios ya están actualizados en el sitio.</p>
            <button type="button" className="btn-nav" onClick={() => setSuccessMessage('')}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
