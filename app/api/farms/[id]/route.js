import { getFarmById, getPlots } from '@/lib/db';
import { ok, notFound, fail } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const farm = await getFarmById(id);
    if (!farm) return notFound('Exploitation introuvable');
    const plots = await getPlots(id);
    return ok({ ...farm, plots });
  } catch (err) {
    return fail(err.message, 500);
  }
}
