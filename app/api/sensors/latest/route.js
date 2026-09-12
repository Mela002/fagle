import { getLatestSensorReading, getSensorDeviceForPlot } from '@/lib/db';
import { ok, fail } from '@/lib/apiResponse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  if (!plotId) return fail('Le paramètre plotId est requis');
  try {
    const [reading, device] = await Promise.all([getLatestSensorReading(plotId), getSensorDeviceForPlot(plotId)]);
    return ok({ reading, device });
  } catch (err) {
    return fail(err.message, 500);
  }
}
