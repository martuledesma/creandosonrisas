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

const SelectField = ({ label, value = '', onChange, options = [] }) => (
  <label className="admin-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} required>
      <option value="" disabled>Seleccioná una categoría</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
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

const AdminItem = ({ title, onDelete, onSave, children }) => (
  <details className="admin-item admin-item-collapsible">
    <summary className="admin-item-summary">
      <strong>{title}</strong><span aria-hidden="true">+</span>
    </summary>
    <div className="admin-item-body">
      {children}
      <div className="admin-item-actions">
        <button className="admin-delete-button" type="button" onClick={onDelete}>Eliminar</button>
        <button className="admin-primary-button" type="button" onClick={onSave}>Guardar</button>
      </div>
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
          <li className={supabaseConfigStatus.hasValidUrl ? 'is-ready' : 'is-missing'}>
            <code>VITE_SUPABASE_URL</code>: {!supabaseConfigStatus.hasUrl ? 'falta' : supabaseConfigStatus.hasValidUrl ? 'válida' : 'inválida'}
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
          <p>Las secciones respetan el mismo orden de cada página. Desplegá solamente lo que quieras editar.</p>
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
            <AdminSection title="1. Portada">
              <TextField label="Título principal" value={home.heroTitle} onChange={(value) => updatePage('home', 'heroTitle', value)} />
              <TextField label="Subtítulo" value={home.heroSubtitle} onChange={(value) => updatePage('home', 'heroSubtitle', value)} multiline />
              <ImageField label="Imagen de portada" value={home.heroImage} onChange={(value) => updatePage('home', 'heroImage', value)} />
            </AdminSection>
            <AdminSection title="2. Datos destacados" onAdd={() => addItem('home', 'stats', { valor: '', titulo: '', descripcion: '' })}>
              {(home.stats || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.titulo || `Dato ${index + 1}`} onDelete={() => removeItem('home', 'stats', index)} onSave={save}>
                  <TextField label="Valor" value={item.valor} onChange={(value) => updateItem('home', 'stats', index, 'valor', value)} />
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'stats', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('home', 'stats', index, 'descripcion', value)} multiline />
                </AdminItem>
              ))}
            </AdminSection>
            <AdminSection title="3. Áreas de trabajo" onAdd={() => addItem('home', 'pillars', { titulo: '', desc: '', imagen: '' })}>
              <TextField label="Antetítulo" value={home.areasKicker} onChange={(value) => updatePage('home', 'areasKicker', value)} />
              <TextField label="Título de la sección" value={home.areasTitle} onChange={(value) => updatePage('home', 'areasTitle', value)} />
              {(home.pillars || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.titulo || `Área ${index + 1}`} onDelete={() => removeItem('home', 'pillars', index)} onSave={save}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'pillars', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.desc} onChange={(value) => updateItem('home', 'pillars', index, 'desc', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'pillars', index, 'imagen', value)} />
                </AdminItem>
              ))}
            </AdminSection>
            <AdminSection title="4. Llamado a participar">
              <TextField label="Antetítulo" value={home.ctaKicker} onChange={(value) => updatePage('home', 'ctaKicker', value)} />
              <TextField label="Título" value={home.ctaTitle} onChange={(value) => updatePage('home', 'ctaTitle', value)} />
              <TextField label="Texto del botón" value={home.ctaButton} onChange={(value) => updatePage('home', 'ctaButton', value)} />
            </AdminSection>
            <AdminSection title="5. Novedades" onAdd={() => addItem('home', 'cards', { titulo: '', desc: '', imagen: '' })}>
              <TextField label="Antetítulo" value={home.newsKicker} onChange={(value) => updatePage('home', 'newsKicker', value)} />
              <TextField label="Título de la sección" value={home.newsTitle} onChange={(value) => updatePage('home', 'newsTitle', value)} />
              {(home.cards || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.titulo || `Novedad ${index + 1}`} onDelete={() => removeItem('home', 'cards', index)} onSave={save}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('home', 'cards', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.desc} onChange={(value) => updateItem('home', 'cards', index, 'desc', value)} multiline />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('home', 'cards', index, 'imagen', value)} />
                </AdminItem>
              ))}
            </AdminSection>
            <AdminSection title="6. Pie de página">
              <TextField label="Texto legal" value={home.footerText} onChange={(value) => updatePage('home', 'footerText', value)} />
              <TextField label="LinkedIn de Martina Ledesma" value={home.developerLinkedin} onChange={(value) => updatePage('home', 'developerLinkedin', value)} type="url" />
            </AdminSection>
          </>
        )}

        {activeTab === 'nosotros' && (
          <>
            <AdminSection title="1. Mini portada">
              <TextField label="Antetítulo" value={nosotros.bannerKicker} onChange={(value) => updatePage('nosotros', 'bannerKicker', value)} />
              <TextField label="Título" value={nosotros.bannerTitle} onChange={(value) => updatePage('nosotros', 'bannerTitle', value)} />
              <ImageField label="Imagen" value={nosotros.missionImage} onChange={(value) => updatePage('nosotros', 'missionImage', value)} />
            </AdminSection>
            <AdminSection title="2. Quiénes somos">
              <TextField label="Antetítulo" value={nosotros.introKicker} onChange={(value) => updatePage('nosotros', 'introKicker', value)} />
              <TextField label="Título principal" value={nosotros.introTitle} onChange={(value) => updatePage('nosotros', 'introTitle', value)} />
              <TextField label="Frase de presentación" value={nosotros.introPhrase} onChange={(value) => updatePage('nosotros', 'introPhrase', value)} multiline />
              <TextField label="Dato destacado" value={nosotros.impactValue} onChange={(value) => updatePage('nosotros', 'impactValue', value)} />
              <TextField label="Descripción del dato" value={nosotros.impactLabel} onChange={(value) => updatePage('nosotros', 'impactLabel', value)} />
            </AdminSection>
            <AdminSection title="3. Valores" onAdd={() => addItem('nosotros', 'values', { titulo: '', descripcion: '' })}>
              <TextField label="Antetítulo" value={nosotros.valuesKicker} onChange={(value) => updatePage('nosotros', 'valuesKicker', value)} />
              <TextField label="Título de la sección" value={nosotros.valuesTitle} onChange={(value) => updatePage('nosotros', 'valuesTitle', value)} />
              {(nosotros.values || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.titulo || `Valor ${index + 1}`} onDelete={() => removeItem('nosotros', 'values', index)} onSave={save}>
                  <TextField label="Valor" value={item.titulo} onChange={(value) => updateItem('nosotros', 'values', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('nosotros', 'values', index, 'descripcion', value)} multiline />
                </AdminItem>
              ))}
            </AdminSection>
            <AdminSection title="4. Equipo profesional" onAdd={() => addItem('nosotros', 'professionals', { nombre: '', rol: '', descripcion: '', imagen: '' })}>
              <TextField label="Antetítulo" value={nosotros.professionalsKicker} onChange={(value) => updatePage('nosotros', 'professionalsKicker', value)} />
              <TextField label="Título" value={nosotros.professionalsTitle} onChange={(value) => updatePage('nosotros', 'professionalsTitle', value)} />
              <TextField label="Introducción" value={nosotros.professionalsIntro} onChange={(value) => updatePage('nosotros', 'professionalsIntro', value)} multiline />
              {(nosotros.professionals || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.nombre || `Profesional ${index + 1}`} onDelete={() => removeItem('nosotros', 'professionals', index)} onSave={save}>
                  <TextField label="Nombre" value={item.nombre} onChange={(value) => updateItem('nosotros', 'professionals', index, 'nombre', value)} />
                  <TextField label="Profesión o función" value={item.rol} onChange={(value) => updateItem('nosotros', 'professionals', index, 'rol', value)} />
                  <TextField label="Descripción breve" value={item.descripcion} onChange={(value) => updateItem('nosotros', 'professionals', index, 'descripcion', value)} multiline />
                  <ImageField label="Fotografía" value={item.imagen} onChange={(value) => updateItem('nosotros', 'professionals', index, 'imagen', value)} />
                </AdminItem>
              ))}
            </AdminSection>
            <AdminSection title="5. Collage fotográfico" onAdd={() => addItem('nosotros', 'gallery', { url: '', alt: '' })}>
              <TextField label="Antetítulo" value={nosotros.galleryKicker} onChange={(value) => updatePage('nosotros', 'galleryKicker', value)} />
              <TextField label="Título" value={nosotros.galleryTitle} onChange={(value) => updatePage('nosotros', 'galleryTitle', value)} />
              {(nosotros.gallery || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.alt || `Fotografía ${index + 1}`} onDelete={() => removeItem('nosotros', 'gallery', index)} onSave={save}>
                  <ImageField label="Imagen" value={item.url} onChange={(value) => updateItem('nosotros', 'gallery', index, 'url', value)} />
                  <TextField label="Descripción accesible" value={item.alt} onChange={(value) => updateItem('nosotros', 'gallery', index, 'alt', value)} />
                </AdminItem>
              ))}
            </AdminSection>
          </>
        )}

        {activeTab === 'proyectos' && (
          <>
            <AdminSection title="1. Mini portada">
              <TextField label="Antetítulo" value={proyectos.bannerKicker} onChange={(value) => updatePage('proyectos', 'bannerKicker', value)} />
              <TextField label="Título" value={proyectos.bannerTitle} onChange={(value) => updatePage('proyectos', 'bannerTitle', value)} />
              <TextField label="Subtítulo" value={proyectos.heroSubtitle} onChange={(value) => updatePage('proyectos', 'heroSubtitle', value)} multiline />
            </AdminSection>
            <AdminSection title="2. Frase de presentación">
              <TextField label="Introducción" value={proyectos.introText} onChange={(value) => updatePage('proyectos', 'introText', value)} multiline />
            </AdminSection>
            <AdminSection title="3. Nuestro trabajo" onAdd={() => addItem('proyectos', 'items', { titulo: '', descripcion: '', imagen: '', estado: 'Activo', categoria: 'educacion' })}>
              <TextField label="Antetítulo" value={proyectos.sectionKicker} onChange={(value) => updatePage('proyectos', 'sectionKicker', value)} />
              <TextField label="Título de la sección" value={proyectos.sectionTitle} onChange={(value) => updatePage('proyectos', 'sectionTitle', value)} />
              {(proyectos.items || []).map((item, index) => (
                <AdminItem key={item.id || index} title={item.titulo || `Proyecto ${index + 1}`} onDelete={() => removeItem('proyectos', 'items', index)} onSave={save}>
                  <TextField label="Título" value={item.titulo} onChange={(value) => updateItem('proyectos', 'items', index, 'titulo', value)} />
                  <TextField label="Descripción" value={item.descripcion} onChange={(value) => updateItem('proyectos', 'items', index, 'descripcion', value)} multiline />
                  <SelectField
                    label="Categoría del proyecto"
                    value={item.categoria || ''}
                    onChange={(value) => updateItem('proyectos', 'items', index, 'categoria', value)}
                    options={[
                      { value: 'salud', label: 'Salud' },
                      { value: 'educacion', label: 'Educación' },
                      { value: 'recreativos', label: 'Recreativos' },
                    ]}
                  />
                  <TextField label="Estado" value={item.estado} onChange={(value) => updateItem('proyectos', 'items', index, 'estado', value)} />
                  <ImageField label="Imagen" value={item.imagen} onChange={(value) => updateItem('proyectos', 'items', index, 'imagen', value)} />
                </AdminItem>
              ))}
            </AdminSection>
          </>
        )}

        {activeTab === 'sumate' && (
          <>
            <AdminSection title="1. Mini portada">
              <TextField label="Antetítulo" value={sumate.bannerKicker} onChange={(value) => updatePage('sumate', 'bannerKicker', value)} />
              <TextField label="Título" value={sumate.bannerTitle} onChange={(value) => updatePage('sumate', 'bannerTitle', value)} />
              <ImageField label="Imagen de portada" value={sumate.heroImage} onChange={(value) => updatePage('sumate', 'heroImage', value)} />
            </AdminSection>
            <AdminSection title="2. Formas de participar" onAdd={() => addItem('sumate', 'ways', { titulo: '' })}>
              <TextField label="Antetítulo" value={sumate.waysKicker} onChange={(value) => updatePage('sumate', 'waysKicker', value)} />
              {(sumate.ways || []).map((item, index) => <AdminItem key={item.id || index} title={item.titulo || `Opción ${index + 1}`} onDelete={() => removeItem('sumate', 'ways', index)} onSave={save}>
                <TextField label="Nombre" value={item.titulo} onChange={(value) => updateItem('sumate', 'ways', index, 'titulo', value)} />
              </AdminItem>)}
            </AdminSection>
            <AdminSection title="3. Campaña y voluntariado">
              <TextField label="Antetítulo principal" value={sumate.introKicker} onChange={(value) => updatePage('sumate', 'introKicker', value)} />
              <TextField label="Título principal" value={sumate.introTitle} onChange={(value) => updatePage('sumate', 'introTitle', value)} />
              <TextField label="Mensaje principal" value={sumate.content} onChange={(value) => updatePage('sumate', 'content', value)} multiline />
              <ImageField label="Imagen de la campaña de apadrinamiento" value={sumate.campaignImage} onChange={(value) => updatePage('sumate', 'campaignImage', value)} />
              <TextField label="Descripción accesible de la imagen" value={sumate.campaignImageAlt} onChange={(value) => updatePage('sumate', 'campaignImageAlt', value)} />
              <TextField label="Antetítulo de apadrinamiento" value={sumate.campaignKicker} onChange={(value) => updatePage('sumate', 'campaignKicker', value)} />
              <TextField label="Título de apadrinamiento" value={sumate.campaignTitle} onChange={(value) => updatePage('sumate', 'campaignTitle', value)} multiline />
              <TextField label="Fecha límite" value={sumate.campaignDeadline} onChange={(value) => updatePage('sumate', 'campaignDeadline', value)} />
              <TextField label="Texto del botón" value={sumate.campaignButton} onChange={(value) => updatePage('sumate', 'campaignButton', value)} />
              <TextField label="Enlace para apadrinar" value={sumate.campaignUrl} onChange={(value) => updatePage('sumate', 'campaignUrl', value)} type="url" />
              <TextField label="Antetítulo de voluntariado" value={sumate.volunteerKicker} onChange={(value) => updatePage('sumate', 'volunteerKicker', value)} />
              <TextField label="Título de voluntariado" value={sumate.volunteerTitle} onChange={(value) => updatePage('sumate', 'volunteerTitle', value)} />
              <TextField label="Descripción de voluntariado" value={sumate.volunteerText} onChange={(value) => updatePage('sumate', 'volunteerText', value)} multiline />
              <TextField label="Formulario de voluntariado" value={sumate.volunteerFormUrl} onChange={(value) => updatePage('sumate', 'volunteerFormUrl', value)} type="url" />
            </AdminSection>
            <AdminSection title="4. Donaciones y contacto">
              <TextField label="Antetítulo" value={sumate.donationKicker} onChange={(value) => updatePage('sumate', 'donationKicker', value)} />
              <TextField label="Alias de donación" value={sumate.donationAlias} onChange={(value) => updatePage('sumate', 'donationAlias', value)} />
              <TextField label="Descripción" value={sumate.donationText} onChange={(value) => updatePage('sumate', 'donationText', value)} multiline />
              <TextField label="Instagram" value={sumate.instagramUrl} onChange={(value) => updatePage('sumate', 'instagramUrl', value)} type="url" />
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
