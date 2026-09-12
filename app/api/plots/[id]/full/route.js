import {
  getPlotById,
  getFarmById,
  getCrops,
  getWeatherForPlot,
  getLatestSensorReading,
  getSensorDeviceForPlot,
  getSensorHistory,
  getDataConfidence,
  getObservations,
  getPhotos,
  getRecommendations,
} from '@/lib/db';
import { ok, notFound, fail } from '@/lib/apiResponse';

/**
 * GET /api/plots/[id]/full
 * One-shot aggregate used by Server Components (plot detail page, farmer
 * dashboard) so all of a plot's data is read through the API layer — see
 * lib/apiFetch.js for why that matters in Demo Mode on Vercel.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const plot = await getPlotById(id);
    if (!plot) return notFound('Parcelle introuvable');

    const [farm, crops, weather, sensorReading, sensorDevice, sensorHistory, confidence, observations, photos, recommendations] =
      await Promise.all([
        getFarmById(plot.farm_id),
        getCrops(),
        getWeatherForPlot(id),
        getLatestSensorReading(id),
        getSensorDeviceForPlot(id),
        getSensorHistory(id),
        getDataConfidence(id),
        getObservations(id),
        getPhotos(id),
        getRecommendations(id),
      ]);

    const crop = crops.find((c) => c.id === plot.crop_id) || null;

    return ok({
      plot,
      farm,
      crop,
      crops,
      weather,
      sensorReading,
      sensorDevice,
      sensorHistory,
      confidence,
      observations,
      photos,
      recommendations,
    });
  } catch (err) {
    return fail(err.message, 500);
  }
}
