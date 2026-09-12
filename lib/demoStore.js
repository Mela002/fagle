import { cloneSeed } from '@/data/seedData';

/**
 * In-memory "database" used whenever Supabase is not configured.
 *
 * This module is a singleton kept alive for the lifetime of the Node
 * process. On a persistent server (local `next dev`/`next start`, or a
 * long-lived container) that means writes made during a demo (new
 * observations, photos, sensor readings, feedback...) survive across
 * requests, which is what makes the hackathon demo story work end-to-end.
 *
 * On serverless platforms (e.g. Vercel functions) each invocation may get a
 * fresh process, so demo writes are not guaranteed to persist between
 * requests. Connect real Supabase credentials for durable storage in
 * production — see README.md.
 */

const globalKey = '__AGROMIND_DEMO_STORE__';

function createStore() {
  return cloneSeed();
}

export function getStore() {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = createStore();
  }
  return globalThis[globalKey];
}

export function resetStore() {
  globalThis[globalKey] = createStore();
  return globalThis[globalKey];
}

let counter = 1000;
export function nextId(prefix) {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}
