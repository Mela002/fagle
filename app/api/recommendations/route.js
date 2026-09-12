import { getRecommendations, getScenarios } from '@/lib/db';
import { ok, fail } from '@/lib/apiResponse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  if (!plotId) return fail('Le paramètre plotId est requis');
  try {
    const [recommendations, scenarios] = await Promise.all([getRecommendations(plotId), getScenarios(plotId)]);
    return ok({ recommendations, scenarios });
  } catch (err) {
    return fail(err.message, 500);
  }
}
