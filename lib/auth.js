import { cookies } from 'next/headers';
import { getProfile } from '@/lib/db';

const COOKIE_USER = 'agromind_user';
const COOKIE_ROLE = 'agromind_role';
const DEFAULT_USER_ID = 'user-koffi';
const DEFAULT_ROLE = 'farmer';

/**
 * Lightweight demo-friendly session helper.
 *
 * FáGlè's MVP intentionally avoids heavyweight authentication (see
 * README "Future work") — this cookie-based session is enough to
 * demonstrate the three roles (farmer / scientist / admin) end-to-end and
 * is structured so it can be swapped for Supabase Auth sessions later
 * without touching callers: everywhere in the app reads `getSession()`,
 * never the cookies directly.
 */
export async function getSession() {
  const jar = await cookies();
  const userId = jar.get(COOKIE_USER)?.value || DEFAULT_USER_ID;
  const role = jar.get(COOKIE_ROLE)?.value || DEFAULT_ROLE;
  return { userId, role };
}

export async function getCurrentUser() {
  const session = await getSession();
  const profile = await getProfile(session.userId);
  return profile || { id: session.userId, role: session.role, full_name: 'Demo Farmer' };
}

export const SESSION_COOKIE_NAMES = { user: COOKIE_USER, role: COOKIE_ROLE };
