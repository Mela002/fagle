import { getFarms, createFarm } from '@/lib/db';
import { ok, created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId') || undefined;
  try {
    const farms = await getFarms(ownerId);
    return ok(farms);
  } catch (err) {
    return fail(err.message, 500);
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['owner_id', 'name', 'region', 'commune']);
  if (missing) return fail(missing);
  try {
    const farm = await createFarm(body);
    return created(farm);
  } catch (err) {
    return fail(err.message, 500);
  }
}
