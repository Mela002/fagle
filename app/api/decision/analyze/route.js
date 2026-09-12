import { buildContextForPlot } from '@/lib/decisionContext';
import { analyzePlot } from '@/lib/decisionEngine';
import { createRecommendation } from '@/lib/db';
import { ok, fail, notFound } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['plotId']);
  if (missing) return fail(missing);

  try {
    const built = await buildContextForPlot(body.plotId);
    if (!built) return notFound('Parcelle introuvable');

    const result = analyzePlot(built.context, body.action);

    const saved = await createRecommendation({
      plot_id: body.plotId,
      action: result.action,
      action_label: result.actionLabel,
      risk_score: result.score,
      risk_level: result.level,
      factors: result.factors,
      counterfactuals: result.counterfactuals,
      recommendation_text: result.recommendation,
      engine_version: result.engineVersion,
    });

    return ok({ ...result, recommendationId: saved.id, weatherMeta: built.weatherMeta });
  } catch (err) {
    return fail(err.message, 500);
  }
}
