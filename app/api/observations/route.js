import { getObservations, createObservation } from '@/lib/db';
import { ok, created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  if (!plotId) return fail('Le paramètre plotId est requis');
  try {
    const observations = await getObservations(plotId);
    return ok(observations);
  } catch (err) {
    return fail(err.message, 500);
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['plot_id', 'farmer_id']);
  if (missing) return fail(missing);
  try {
    const observation = await createObservation(body);
    return created(observation);
  } catch (err) {
    return fail(err.message, 500);
  }
}
