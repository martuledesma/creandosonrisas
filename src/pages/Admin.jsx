import { useEffect, useState } from 'react';
import { isSupabaseConfigured, signIn, signOut, supabase, supabaseConfigStatus, uploadSiteImage } from '../supabase';

const tabs = [
  ['home', 'Inicio'],
  ['nosotros', 'Nosotros'],
  ['proyectos', 'Proyectos'],
  ['sumate', 'Sumate'],
];

const TextField = ({ label, value = '', onChange, multiline = false, type = 'text' }) => (
  <label className="admin-field">
    <span>{label}</span>
    {multiline ? (
      <textarea rows="4" value={value} onChange={(event) => onChange(event.target.value)} />
    ) : (
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    )}
  </label>
);

const VisibilityField = ({ label, checked, onChange }) => (
  <label className="admin-visibility-field">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span><strong>{label}</strong><small>{checked ? 'Visible en el sitio' : 'Oculta en el sitio'}</small></span>
  </label>
);

const AdminSection = ({ title, onAdd, children }) => (
  <details className="admin-block admin-collapsible">
    <summary className="admin-collapsible-summary">
      <h2>{title}</h2>
      <span className="admin-collapsible-icon" aria-hidden="true">+</span>
    </summary>
    <div className="admin-collapsible-body">
      {onAdd && (
        <div className="admin-collapsible-actions">
          <button type="button" onClick={onAdd}>Agregar</button>
        </div>
      )}
      {children}
    </div>
  </details>
);

const ImageField = ({ label, value = '', onChange }) => {
  const [uploading, setUploading] = useState(false);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadSiteImage(file));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="admin-image-field">
      <TextField label={label} value={value} onChange={onChange} type="url" />
      <label className="admin-upload-button">
        {uploading ? 'Subiendo…' : 'Subir imagen'}
        <input type="file" accept="image/*" onChange={upload} disabled={uploading} />
      </label>
      {value && <img src={value} alt="Vista previa" />}
    </div>
  );
};

export default function Admin({ content, onSave }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [draft, setDraft] = useState(content);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(content), [content]);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const updatePage = (page, key, value) => {
    setDraft((current) => ({
      ...current,
      [page]: { ...(current[page] || {}), [key]: value },
    }));
  };

  const updateItem = (page, collection, index, key, value) => {
    const items = [...(draft[page]?.[collection] || [])];
    items[index] = { ...items[index], [key]: value };
    updatePage(page, collection, items);
  };

  const updateHomeVisibility = (section, value) => {
    updatePage('home', 'sectionVisibility', {
      quickActions: true,
      projects: true,
      cta: true,
      news: true,
      ...(draft.home?.sectionVisibility || {}),
      [section]: value,
    });
  };

  const updateNosotrosVisibility = (section, value) => {
    updatePage('nosotros', 'sectionVisibility', {
      values: true,
      gallery: true,
      ...(draft.nosotros?.sectionVisibility || {}),
      [section]: value,
    });
  };

  const addItem = (page, collection, item) => {
    updatePage(page, collection, [...(draft[page]?.[collection] || []), { id: Date.now(), ...item }]);
  };

  const removeItem = (page, collection, index) => {
    updatePage(page, collection, (draft[page]?.[collection] || []).filter((_, itemIndex) => itemIndex !== index));
  };

  const login = async (event) => {
    event.preventDefault();
    setStatus('Ingresando…');
    try {
      await signIn(email.trim(), password);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'No se pudo iniciar sesión.');
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus('');
    try {
      await onSave(draft);
      setStatus('Cambios guardados correctamente.');
    } catch (error) {
      setStatus(error.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-page admin-setup">
        <span className="admin-kicker">Configuración pendiente</span>
        <h1>Conectá Supabase para habilitar el panel</h1>
        <p>Este despliegue no recibió todas las variables necesarias durante la compilación.</p>
        <ul className="admin-config-checklist">
          <li className={supabaseConfigStatus.hasUrl ? 'is-ready' : 'is-missing'}>
            <code>VITE_SUPABASE_URL</code>: {supabaseConfigStatus.hasUrl ? 'detectada' : 'falta'}
          </li>
          <li className={supabaseConfigStatus.hasKey ? 'is-ready' : 'is-missing'}>
            <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>: {supabaseConfigStatus.hasKey ? 'detectada' : 'falta'}
          </li>
        </ul>
        <p>Corregí la variable que figure como “falta” en Vercel y volvé a desplegar el último commit.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <span className="admin-kicker">Administración</span>
          <h1>Acceso al panel</h1>
          <p>Ingresá con el usuario administrador creado en Supabase.</p>
          <TextField label="Correo electrónico" value={email} onChange={setEmail} type="email" />
          <TextField label="Contraseña" value={password} onChange={setPassword} type="password" />
          <button className="admin-primary-button" type="submit">Ingresar</button>
          {status && <p className="admin-status">{status}</p>}
        </form>
      </main>
    );
  }

  const home = draft.home || {};
  const nosotros = draft.nosotros || {};
  const proyectos = draft.proyectos || {};
  const sumate = draft.sumate || {};

  return (
    <main className="admin-page">
      <header className="admin-panel-header">
        <div>
          <span className="admin-kicker">Creando Sonrisas</span>
          <h1>Panel de contenidos</h1>
          <p>Editá la información pública del sitio y guardá todos los cambios juntos.</p>
        </div>
        <button className="admin-secondary-button" type="button" onClick={() => signOut()}>Cerrar sesión</button>
      </header>

      <nav className="admin-tabs" aria-label="Secciones editables">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </nav>

      <section className="admin-editor">
        {activeTab === 'home' && (
          <>
            <AdminSection title="Portada y contacto">
              <TextField label="Título principal" value={home.heroTitle} onChange={(value) => updatePage('home', 'heroTitle', value)} />
              <TextField label="Subtítulo" value={home.heroSubtitle} onChange={(value) => updatePage('home', 'heroSubtitle', value)} multiline />
              <ImageField label="Imagen de portada" value={home.heroImage} onChange={(value) => updatePage('home', 'heroImage', value)} />
              <TextField label="Texto del pie" value={home.footerText} onChange={(value) => updatePage('home', 'footerText', value)} />
            </AdminSection>
            <AdminSection title="Mostrar u ocultar secciones">
              <div className="admin-visibility-grid">
                <VisibilityField label="Accesos rápidos" checked={(home.sectionVisibility?.quickActions ?? true)} onChange={(value) => updateHomeVisibility('quickActions', value)} />
                <VisibilityField label="Nuestros proyectos" checked={(home.sectionVisibility?.projects ?? true)} onChange={(value) => updateHomeVisibility('projects', value)} />
                <VisibilityField label="Franja para colaborar" checked={(home.sectionVisibility?.cta ?? true)} onChange={(value) => updateHomeVisibility('cta', value)} />
                <VisibilityField label="Novedades" checked={(home.sectionVisibility?.news ?? true)} onChange={(value) => updateHomeVisibility('news', value)} />
              </div>
            </AdminSection>
            <AdminSection title="Acompañamiento escolar, Merendero y Recreación" onAdd={() => addItem('home', 'pillars', { titulo: '', desc: '', imagen: '' })}>
              <p className="admin-help-text">Estas tarjetas aparecen después de la portada. Podés editarlas, ocultar toda la sección o eliminar una tarjeta.</p>
              {(home.pillars || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label={`Título del eje ${index + 1}`} value={item.titulo} onChange={(value) => updateItem('home', 'pillars', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.desc} onChange={(value) => updateItem('home', 'pillars', index, 'desc', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'pillars', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('home', 'pillars', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
            <AdminSection title="Novedades" onAdd={() => addItem('home', 'cards', { titulo: '', desc: '', imagen: '' })}>
              {(home.cards || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'cards', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.desc} onChange={(value) => updateItem('home', 'cards', index, 'desc', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'cards', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('home', 'cards', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
          </>
        )}

        {activeTab === 'nosotros' && (
          <>
            <AdminSection title="Apertura">
              <TextField label="Título principal" value={nosotros.introTitle} onChange={(value) => updatePage('nosotros', 'introTitle', value)} />
              <TextField label="Frase de presentación" value={nosotros.introPhrase} onChange={(value) => updatePage('nosotros', 'introPhrase', value)} multiline />
            </AdminSection>
            <AdminSection title="Mostrar u ocultar secciones">
              <div className="admin-visibility-grid">
                <VisibilityField label="Nuestros valores" checked={(nosotros.sectionVisibility?.values ?? true)} onChange={(value) => updateNosotrosVisibility('values', value)} />
                <VisibilityField label="Collage fotográfico" checked={(nosotros.sectionVisibility?.gallery ?? true)} onChange={(value) => updateNosotrosVisibility('gallery', value)} />
              </div>
            </AdminSection>
            <AdminSection title="Valores" onAdd={() => addItem('nosotros', 'values', { titulo: '', descripcion: '' })}>
              {(nosotros.values || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label="Valor" value={item.titulo} onChange={(value) => updateItem('nosotros', 'values', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('nosotros', 'values', index, 'descripcion', value)} multiline />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('nosotros', 'values', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
            <AdminSection title="Collage fotográfico" onAdd={() => addItem('nosotros', 'gallery', { url: '', alt: '' })}>
              {(nosotros.gallery || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <ImageField label="Imagen" value={item.url} onChange={(value) => updateItem('nosotros', 'gallery', index, 'url', value)} />
                  <TextField label="Descripción accesible" value={item.alt} onChange={(value) => updateItem('nosotros', 'gallery', index, 'alt', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('nosotros', 'gallery', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
          </>
        )}

        {activeTab === 'proyectos' && (
          <>
            <AdminSection title="Presentación de proyectos">
              <TextField label="Subtítulo" value={proyectos.heroSubtitle} onChange={(value) => updatePage('proyectos', 'heroSubtitle', value)} multiline />
              <TextField label="Introducción" value={proyectos.introText} onChange={(value) => updatePage('proyectos', 'introText', value)} multiline />
            </AdminSection>
            <AdminSection title="Listado de proyectos" onAdd={() => addItem('proyectos', 'items', { titulo: '', descripcion: '', imagen: '', estado: 'Activo' })}>
              {(proyectos.items || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('proyectos', 'items', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('proyectos', 'items', index, 'descripcion', value)} multiline />
                  <TextField label="Estado" value={item.estado} onChange={(value) => updateItem('proyectos', 'items', index, 'estado', value)} />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('proyectos', 'items', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('proyectos', 'items', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
            <AdminSection title="Próximos eventos" onAdd={() => addItem('home', 'events', { fecha: '', titulo: '', lugar: '', descripcion: '', imagen: '' })}>
              <p className="admin-help-text">El próximo evento se muestra destacado en Proyectos. Los siguientes aparecen en una lista lateral.</p>
              {(home.events || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <div className="admin-item-grid">
                    <TextField label="Fecha" value={item.fecha} onChange={(value) => updateItem('home', 'events', index, 'fecha', value)} type="date" />
                    <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'events', index, 'titulo', value)} />
                    <TextField label="Lugar" value={item.lugar} onChange={(value) => updateItem('home', 'events', index, 'lugar', value)} />
                  </div>
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('home', 'events', index, 'descripcion', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'events', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('home', 'events', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
          </>
        )}

        {activeTab === 'sumate' && (
          <>
            <AdminSection title="Participación y donaciones">
              <TextField label="Título" value={sumate.title} onChange={(value) => updatePage('sumate', 'title', value)} />
              <TextField label="Subtítulo" value={sumate.heroSubtitle} onChange={(value) => updatePage('sumate', 'heroSubtitle', value)} multiline />
              <TextField label="Mensaje principal" value={sumate.content} onChange={(value) => updatePage('sumate', 'content', value)} multiline />
              <TextField label="Alias de donación" value={sumate.donationAlias} onChange={(value) => updatePage('sumate', 'donationAlias', value)} />
              <TextField label="Instagram" value={sumate.instagramUrl} onChange={(value) => updatePage('sumate', 'instagramUrl', value)} type="url" />
              <ImageField label="Imagen de portada" value={sumate.heroImage} onChange={(value) => updatePage('sumate', 'heroImage', value)} />
            </AdminSection>
            <AdminSection title="Galería" onAdd={() => addItem('sumate', 'carouselImages', { url: '', alt: '' })}>
              {(sumate.carouselImages || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <ImageField label="Imagen" value={item.url} onChange={(value) => updateItem('sumate', 'carouselImages', index, 'url', value)} />
                  <TextField label="Descripción accesible" value={item.alt} onChange={(value) => updateItem('sumate', 'carouselImages', index, 'alt', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('sumate', 'carouselImages', index)}>Eliminar</button>
                </article>
              ))}
            </AdminSection>
          </>
        )}
      </section>

      <div className="admin-save-bar">
        {status && <p className="admin-status">{status}</p>}
        <button className="admin-primary-button" type="button" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar todos los cambios'}</button>
      </div>
    </main>
  );
}
