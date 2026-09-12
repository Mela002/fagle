import {
  getPlotById,
  updatePlot,
  getWeatherForPlot,
  getLatestSensorReading,
  getDataConfidence,
} from '@/lib/db';
import { ok, notFound, fail } from '@/lib/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const plot = await getPlotById(id);
    if (!plot) return notFound('Parcelle introuvable');
    const [weather, sensor, confidence] = await Promise.all([
      getWeatherForPlot(id),
      getLatestSensorReading(id),
      getDataConfidence(id),
    ]);
    return ok({ ...plot, weather, sensor, confidence });
  } catch (err) {
    return fail(err.message, 500);
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  try {
    const plot = await updatePlot(id, body);
    if (!plot) return notFound('Parcelle introuvable');
    return ok(plot);
  } catch (err) {
    return fail(err.message, 500);
  }
}
