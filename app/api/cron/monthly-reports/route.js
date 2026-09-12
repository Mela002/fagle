import { getFarms } from '@/lib/db';
import { generateMonthlyReport } from '@/lib/reportGenerator';
import { ok, unauthorized, fail } from '@/lib/apiResponse';

/**
 * GET /api/cron/monthly-reports
 * Intended to be triggered by a Vercel Cron job on the 1st of every month.
 *
 * To activate: add to vercel.json
 * {
 *   "crons": [{ "path": "/api/cron/monthly-reports", "schedule": "0 3 1 * *" }]
 * }
 * and set CRON_SECRET in your Vercel project env vars — Vercel automatically
 * sends it as `Authorization: Bearer <CRON_SECRET>` for cron invocations.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) return unauthorized('Clé cron invalide');
  }

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  try {
    const farms = await getFarms();
    const reports = await Promise.all(farms.map((farm) => generateMonthlyReport(farm.id, month)));
    return ok({ generated: reports.length, month, reports });
  } catch (err) {
    return fail(err.message, 500);
  }
}
