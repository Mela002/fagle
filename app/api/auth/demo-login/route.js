import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAMES } from '@/lib/auth';

const DEMO_ACCOUNTS = {
  farmer: { userId: 'user-koffi', redirect: '/dashboard' },
  scientist: { userId: 'user-scientist', redirect: '/scientist' },
  admin: { userId: 'user-admin', redirect: '/admin' },
};

/**
 * GET /api/auth/demo-login?role=farmer
 * Plain link-friendly demo sign-in — no password, no JS required. Sets the
 * lightweight session cookies described in lib/auth.js and redirects into
 * the right role's home page.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const role = searchParams.get('role') || 'farmer';
  const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.farmer;

  const response = NextResponse.redirect(new URL(account.redirect, origin));
  response.cookies.set(SESSION_COOKIE_NAMES.user, account.userId, { path: '/', httpOnly: true, sameSite: 'lax' });
  response.cookies.set(SESSION_COOKIE_NAMES.role, role, { path: '/', httpOnly: true, sameSite: 'lax' });
  return response;
}
