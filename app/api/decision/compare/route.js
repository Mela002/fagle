import { buildContextForPlot } from '@/lib/decisionContext';
import { compareScenarios } from '@/lib/decisionEngine';
import { createRecommendation, saveScenarios } from '@/lib/db';
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

    const result = compareScenarios(built.context);
    const recommendedScenario = result.scenarios.find((s) => s.action === result.recommendedAction);

    const saved = await createRecommendation({
      plot_id: body.plotId,
      action: recommendedScenario?.action,
      action_label: recommendedScenario?.label,
      risk_score: recommendedScenario?.score,
      risk_level: recommendedScenario?.level,
      factors: recommendedScenario?.factors || [],
      counterfactuals: recommendedScenario?.counterfactuals || [],
      recommendation_text: `Comparaison des scénarios : option recommandée « ${recommendedScenario?.label} »`,
      engine_version: result.engineVersion,
    });

    await saveScenarios(saved.id, body.plotId, result.scenarios);

    return ok({ ...result, recommendationId: saved.id, weatherMeta: built.weatherMeta });
  } catch (err) {
    return fail(err.message, 500);
  }
}
