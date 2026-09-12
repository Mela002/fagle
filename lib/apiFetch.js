import { headers } from 'next/headers';

/**
 * Server Components on Vercel are deployed as separate serverless functions
 * from API routes. FáGlè's Demo Mode data store (lib/demoStore.js) is an
 * in-memory `globalThis` singleton, which is NOT shared across different
 * function instances — only repeated calls to the *same* route share it.
 * Empirically, API routes in this deployment consistently share state with
 * each other, but page Server Components calling lib/db.js directly do not
 * see writes made through API routes.
 *
 * The fix: Server Components that need to reflect data written via API
 * routes (observations, photos, sensor readings, recommendations, reports,
 * reviews...) fetch it through this helper — an internal call to our own
 * API — instead of importing lib/db.js directly. That keeps every read and
 * write inside the same consistently-shared execution context.
 *
 * This has no effect once real Supabase credentials are configured (Postgres
 * is genuinely shared across all functions already).
 */
export async function getBaseUrl() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const protocol = h.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

export async function fetchInternalApi(path, options = {}) {
  const base = await getBaseUrl();
  const h = await headers();
  const cookie = h.get('cookie');

  const res = await fetch(`${base}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...(cookie ? { cookie } : {}),
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error || `Internal API request failed: ${path}`);
  }
  return json.data;
}
