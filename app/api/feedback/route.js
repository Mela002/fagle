import { createFarmerAction, createOutcome, getFarmerActions, getOutcomes } from '@/lib/db';
import { ok, created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

/**
 * The FáGlè feedback loop is captured in two steps, both posted here:
 *  1. { type: "action", plot_id, recommended_action, actual_action, ... }
 *     -> "What did you actually do?"
 *  2. { type: "outcome", plot_id, action_id, outcome_type, notes }
 *     -> "What happened?"
 */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  if (!['action', 'outcome'].includes(body.type)) return fail('le champ type doit être "action" ou "outcome"');

  try {
    if (body.type === 'action') {
      const missing = requireFields(body, ['plot_id', 'actual_action']);
      if (missing) return fail(missing);
      const action = await createFarmerAction(body);
      return created(action);
    }

    const missing = requireFields(body, ['plot_id', 'outcome_type']);
    if (missing) return fail(missing);
    const outcome = await createOutcome(body);
    return created(outcome);
  } catch (err) {
    return fail(err.message, 500);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  if (!plotId) return fail('Le paramètre plotId est requis');
  try {
    const [actions, outcomes] = await Promise.all([getFarmerActions(plotId), getOutcomes(plotId)]);
    return ok({ actions, outcomes });
  } catch (err) {
    return fail(err.message, 500);
  }
}
