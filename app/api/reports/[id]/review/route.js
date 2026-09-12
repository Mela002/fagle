import { createReview, getReportById } from '@/lib/db';
import { created, notFound, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

const VALID_STATUSES = ['pending_review', 'validated', 'needs_revision'];

/**
 * POST /api/reports/[id]/review
 * Body: { reviewer_id, reviewer_name, status, comments }
 * A monthly report becomes "validated" ONLY through this human review step —
 * FáGlè never marks an auto-generated report as scientifically validated
 * on its own.
 */
export async function POST(request, { params }) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['reviewer_id', 'reviewer_name', 'status']);
  if (missing) return fail(missing);
  if (!VALID_STATUSES.includes(body.status)) return fail(`le statut doit être l'un des suivants : ${VALID_STATUSES.join(', ')}`);

  try {
    const { id } = await params;
    const report = await getReportById(id);
    if (!report) return notFound('Rapport introuvable');
    const review = await createReview({ ...body, report_id: id });
    return created(review);
  } catch (err) {
    return fail(err.message, 500);
  }
}
