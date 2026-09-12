import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * FáGlè is designed to run fully in Demo Mode with zero backend
 * credentials. Supabase is only wired up when both URL + anon key are
 * present. See lib/db.js for the layer that picks between Supabase and the
 * in-memory demo store.
 */
export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

let browserClient = null;
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) browserClient = createClient(url, anonKey);
  return browserClient;
}

let serverClient = null;
/** Server-side client. Uses the service role key when available (API routes),
 * otherwise falls back to the anon key. */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  if (!serverClient) {
    serverClient = createClient(url, serviceKey || anonKey, {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}
