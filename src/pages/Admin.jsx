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
            <div className="admin-block">
              <h2>Portada y contacto</h2>
              <TextField label="Título principal" value={home.heroTitle} onChange={(value) => updatePage('home', 'heroTitle', value)} />
              <TextField label="Subtítulo" value={home.heroSubtitle} onChange={(value) => updatePage('home', 'heroSubtitle', value)} multiline />
              <ImageField label="Imagen de portada" value={home.heroImage} onChange={(value) => updatePage('home', 'heroImage', value)} />
              <TextField label="Dirección" value={home.contactAddress} onChange={(value) => updatePage('home', 'contactAddress', value)} />
              <TextField label="Texto del pie" value={home.footerText} onChange={(value) => updatePage('home', 'footerText', value)} />
            </div>
            <div className="admin-block">
              <div className="admin-block-title"><h2>Novedades</h2><button type="button" onClick={() => addItem('home', 'cards', { titulo: '', desc: '', imagen: '' })}>Agregar</button></div>
              {(home.cards || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'cards', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.desc} onChange={(value) => updateItem('home', 'cards', index, 'desc', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'cards', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('home', 'cards', index)}>Eliminar</button>
                </article>
              ))}
            </div>
            <div className="admin-block">
              <div className="admin-block-title"><h2>Próximos eventos</h2><button type="button" onClick={() => addItem('home', 'events', { fecha: '', titulo: '', lugar: '' })}>Agregar</button></div>
              {(home.events || []).map((item, index) => (
                <article className="admin-item admin-item-grid" key={item.id || index}>
                  <TextField label="Fecha" value={item.fecha} onChange={(value) => updateItem('home', 'events', index, 'fecha', value)} type="date" />
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'events', index, 'titulo', value)} />
                  <TextField label="Lugar" value={item.lugar} onChange={(value) => updateItem('home', 'events', index, 'lugar', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('home', 'events', index)}>Eliminar</button>
                </article>
              ))}
            </div>
          </>
        )}

        {activeTab === 'nosotros' && (
          <div className="admin-block">
            <h2>Información institucional</h2>
            <TextField label="Título" value={nosotros.title} onChange={(value) => updatePage('nosotros', 'title', value)} />
            <TextField label="Subtítulo" value={nosotros.heroSubtitle} onChange={(value) => updatePage('nosotros', 'heroSubtitle', value)} multiline />
            <TextField label="Presentación" value={nosotros.content} onChange={(value) => updatePage('nosotros', 'content', value)} multiline />
            <TextField label="Texto adicional" value={nosotros.additionalText} onChange={(value) => updatePage('nosotros', 'additionalText', value)} multiline />
            <ImageField label="Imagen de portada" value={nosotros.heroImage} onChange={(value) => updatePage('nosotros', 'heroImage', value)} />
          </div>
        )}

        {activeTab === 'proyectos' && (
          <>
            <div className="admin-block">
              <h2>Presentación de proyectos</h2>
              <TextField label="Subtítulo" value={proyectos.heroSubtitle} onChange={(value) => updatePage('proyectos', 'heroSubtitle', value)} multiline />
              <TextField label="Introducción" value={proyectos.introText} onChange={(value) => updatePage('proyectos', 'introText', value)} multiline />
              <ImageField label="Imagen de portada" value={proyectos.heroImage} onChange={(value) => updatePage('proyectos', 'heroImage', value)} />
            </div>
            <div className="admin-block">
              <div className="admin-block-title"><h2>Listado de proyectos</h2><button type="button" onClick={() => addItem('proyectos', 'items', { titulo: '', descripcion: '', imagen: '', estado: 'Activo' })}>Agregar</button></div>
              {(proyectos.items || []).map((item, index) => (
                <article className="admin-item" key={item.id || index}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('proyectos', 'items', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('proyectos', 'items', index, 'descripcion', value)} multiline />
                  <TextField label="Estado" value={item.estado} onChange={(value) => updateItem('proyectos', 'items', index, 'estado', value)} />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('proyectos', 'items', index, 'imagen', value)} />
                  <button className="admin-delete-button" type="button" onClick={() => removeItem('proyectos', 'items', index)}>Eliminar</button>
                </article>
              ))}
            </div>
          </>
        )}

        {activeTab === 'sumate' && (
          <div className="admin-block">
            <h2>Participación y donaciones</h2>
            <TextField label="Título" value={sumate.title} onChange={(value) => updatePage('sumate', 'title', value)} />
            <TextField label="Subtítulo" value={sumate.heroSubtitle} onChange={(value) => updatePage('sumate', 'heroSubtitle', value)} multiline />
            <TextField label="Mensaje principal" value={sumate.content} onChange={(value) => updatePage('sumate', 'content', value)} multiline />
            <TextField label="Alias de donación" value={sumate.donationAlias} onChange={(value) => updatePage('sumate', 'donationAlias', value)} />
            <TextField label="Instagram" value={sumate.instagramUrl} onChange={(value) => updatePage('sumate', 'instagramUrl', value)} type="url" />
            <ImageField label="Imagen de portada" value={sumate.heroImage} onChange={(value) => updatePage('sumate', 'heroImage', value)} />
            <div className="admin-block-title"><h2>Galería</h2><button type="button" onClick={() => addItem('sumate', 'carouselImages', { url: '', alt: '' })}>Agregar</button></div>
            {(sumate.carouselImages || []).map((item, index) => (
              <article className="admin-item" key={item.id || index}>
                <ImageField label="Imagen" value={item.url} onChange={(value) => updateItem('sumate', 'carouselImages', index, 'url', value)} />
                <TextField label="Descripción accesible" value={item.alt} onChange={(value) => updateItem('sumate', 'carouselImages', index, 'alt', value)} />
                <button className="admin-delete-button" type="button" onClick={() => removeItem('sumate', 'carouselImages', index)}>Eliminar</button>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="admin-save-bar">
        {status && <p className="admin-status">{status}</p>}
        <button className="admin-primary-button" type="button" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar todos los cambios'}</button>
      </div>
    </main>
  );
}
