import { getAllProfiles, getFarms, getPlots, getAllSensorDevices, getReports } from '@/lib/db';
import { ok, fail } from '@/lib/apiResponse';

/**
 * GET /api/admin/overview
 * Aggregate for the admin console — see lib/apiFetch.js for why this reads
 * through the API layer instead of lib/db.js directly.
 */
export async function GET() {
  try {
    const [profiles, farms, devices] = await Promise.all([getAllProfiles(), getFarms(), getAllSensorDevices()]);
    const plotsByFarm = await Promise.all(farms.map((f) => getPlots(f.id)));
    const plots = plotsByFarm.flat();
    const reportsByFarm = await Promise.all(farms.map((f) => getReports(f.id)));
    const reports = reportsByFarm.flat();

    return ok({ profiles, farms, plots, devices, reports });
  } catch (err) {
    return fail(err.message, 500);
  }
}
