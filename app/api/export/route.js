import { exportFarmerData } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ok, fail } from '@/lib/apiResponse';

/**
 * GET /api/export — "Export My Data".
 * Returns everything FáGlè has stored for the currently signed-in farmer.
 * Scoped to the session user only; never exposes other farmers' data.
 */
export async function GET(request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId') || session.userId;
    if (farmerId !== session.userId) return fail('Vous ne pouvez exporter que vos propres données', 403);
    const data = await exportFarmerData(farmerId);
    return ok(data);
  } catch (err) {
    return fail(err.message, 500);
  }
}
