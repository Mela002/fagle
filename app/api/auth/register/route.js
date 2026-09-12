import { NextResponse } from 'next/server';
import { createProfile } from '@/lib/db';
import { SESSION_COOKIE_NAMES } from '@/lib/auth';

/**
 * POST /api/auth/register — plain <form> submission (no client JS required).
 *
 * For the MVP this creates an FáGlè profile directly (Demo Mode) or a
 * `profiles` row (Supabase Mode) and starts a session via cookies. When you
 * are ready to add real credentials, wire Supabase Auth here:
 *
 *   const sb = getSupabaseServerClient();
 *   await sb.auth.signUp({ email, password });
 *
 * and use the returned auth user id as the profile id instead of a
 * generated one.
 */
export async function POST(request) {
  const form = await request.formData();
  const full_name = form.get('full_name');
  const country = form.get('country') || 'Bénin';
  const region = form.get('region');
  const commune = form.get('commune');
  const phone = form.get('phone') || null;
  const preferred_language = form.get('preferred_language') || 'fr';

  const { origin } = new URL(request.url);

  if (!full_name || !region || !commune) {
    return NextResponse.redirect(new URL('/register?error=missing_fields', origin));
  }

  const profile = await createProfile({
    role: 'farmer',
    full_name,
    country,
    region,
    commune,
    phone,
    preferred_language,
    allow_anonymized_research_use: false,
  });

  const response = NextResponse.redirect(new URL('/onboarding', origin));
  response.cookies.set(SESSION_COOKIE_NAMES.user, profile.id, { path: '/', httpOnly: true, sameSite: 'lax' });
  response.cookies.set(SESSION_COOKIE_NAMES.role, 'farmer', { path: '/', httpOnly: true, sameSite: 'lax' });
  return response;
}

export function GET() {
  return NextResponse.json({ success: false, error: 'Utilisez POST avec des données de formulaire' }, { status: 405 });
}
