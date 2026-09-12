import { getReportById, getReviews } from '@/lib/db';
import { ok, notFound, fail } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const report = await getReportById(id);
    if (!report) return notFound('Rapport introuvable');
    const reviews = await getReviews(id);
    return ok({ ...report, reviews });
  } catch (err) {
    return fail(err.message, 500);
  }
}
