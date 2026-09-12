import { getReports } from '@/lib/db';
import { ok, fail } from '@/lib/apiResponse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId') || undefined;
  try {
    const reports = await getReports(farmId);
    return ok(reports);
  } catch (err) {
    return fail(err.message, 500);
  }
}
