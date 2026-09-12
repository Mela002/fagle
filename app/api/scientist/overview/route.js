import { getFarms, getPlots, getReports, getObservations, getDataConfidence } from '@/lib/db';
import { ok, fail } from '@/lib/apiResponse';

/**
 * GET /api/scientist/overview
 * Aggregate for the scientist dashboard — see lib/apiFetch.js for why the
 * scientist page reads through the API layer instead of lib/db.js directly.
 */
export async function GET() {
  try {
    const farms = await getFarms();
    const plotsByFarm = await Promise.all(farms.map((f) => getPlots(f.id)));
    const plots = plotsByFarm.flat();
    const reportsByFarm = await Promise.all(farms.map((f) => getReports(f.id)));
    const reports = reportsByFarm.flat();

    const observations = (await Promise.all(plots.map((p) => getObservations(p.id))))
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const confidences = await Promise.all(plots.map((p) => getDataConfidence(p.id)));
    const dataGapPlots = plots.filter((_, i) => confidences[i].percent < 60);

    return ok({ farms, plots, reports, observations, dataGapPlots });
  } catch (err) {
    return fail(err.message, 500);
  }
}
