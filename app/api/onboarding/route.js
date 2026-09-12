import { NextResponse } from 'next/server';
import { createFarm } from '@/lib/db';
import { getSession } from '@/lib/auth';

/** POST /api/onboarding — plain form submission that creates the farmer's
 * first farm and sends them straight to the dashboard. */
export async function POST(request) {
  const session = await getSession();
  const form = await request.formData();
  const { origin } = new URL(request.url);

  const name = form.get('farm_name') || 'My Farm';
  const region = form.get('region');
  const commune = form.get('commune');
  const size_ha = form.get('farm_size');
  const main_crops = (form.get('main_crops') || '').split(',').map((c) => c.trim()).filter(Boolean);
  const irrigation_available = form.get('irrigation_available') === 'yes';

  await createFarm({
    owner_id: session.userId,
    name,
    country: 'Bénin',
    region,
    commune,
    size_ha,
    irrigation_available,
    main_crops,
  });

  return NextResponse.redirect(new URL('/dashboard', origin));
}
