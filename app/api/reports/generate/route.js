import { generateMonthlyReport } from '@/lib/reportGenerator';
import { created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['farmId', 'month']);
  if (missing) return fail(missing);
  try {
    const report = await generateMonthlyReport(body.farmId, body.month);
    return created(report);
  } catch (err) {
    return fail(err.message, 500);
  }
}
