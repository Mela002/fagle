import { getForecast } from '@/services/weatherService';
import { ok, fail } from '@/lib/apiResponse';

/**
 * GET /api/weather?lat=...&lon=...
 *
 * Thin wrapper around services/weatherService.js for direct testing and any
 * client-side code that needs a forecast without going through a plot
 * (getWeatherForPlot in lib/db.js is what the rest of the app uses, since it
 * also persists a snapshot). Always returns a forecast — real from
 * Open-Meteo when the coordinates resolve, simulated otherwise — and never
 * throws, so this route can only fail on malformed input.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  if (latParam === null || lonParam === null || latParam === '' || lonParam === '') {
    return fail('Les paramètres lat et lon sont requis');
  }

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return fail('Les paramètres lat et lon doivent être numériques');
  }

  try {
    const forecast = await getForecast({ lat, lng: lon, seedKey: `${lat},${lon}` });
    return ok(forecast);
  } catch (err) {
    return fail(err.message, 500);
  }
}
