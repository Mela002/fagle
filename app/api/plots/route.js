import { getPlots, createPlot } from '@/lib/db';
import { ok, created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId') || undefined;
  try {
    const plots = await getPlots(farmId);
    return ok(plots);
  } catch (err) {
    return fail(err.message, 500);
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['farm_id', 'name', 'crop_id']);
  if (missing) return fail(missing);
  try {
    const plot = await createPlot(body);
    return created(plot);
  } catch (err) {
    return fail(err.message, 500);
  }
}
