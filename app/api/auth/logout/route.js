import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAMES } from '@/lib/auth';

export async function GET(request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(new URL('/', origin));
  response.cookies.delete(SESSION_COOKIE_NAMES.user);
  response.cookies.delete(SESSION_COOKIE_NAMES.role);
  return response;
}
