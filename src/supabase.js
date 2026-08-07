import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export const getSiteContent = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'main')
    .maybeSingle();
  if (error) throw error;
  return data?.content || null;
};

export const saveSiteContent = async (content) => {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 'main', content, updated_at: new Date().toISOString() });
  if (error) throw error;
};

export const signIn = async (email, password) => {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => supabase?.auth.signOut();

export const uploadSiteImage = async (file) => {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('site-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl;
};
