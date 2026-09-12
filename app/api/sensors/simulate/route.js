import { ingestSensorReading, getPlotById } from '@/lib/db';
import { ok, fail, notFound } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

function randomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

/**
 * POST /api/sensors/simulate
 * Body: { plotId }
 *
 * A UI-triggered demo action — distinct from POST /api/sensors/ingest
 * (which is the real, x-api-key-protected endpoint physical/simulated
 * hardware calls). This route lets the "Simulate Sensor Connection" button
 * on the plot page show the same "data confidence improves once a sensor
 * connects" story live in the browser, without exposing SENSOR_INGEST_API_KEY
 * to client-side code. Every reading it writes uses a `DEMO-SIM-` device id
 * so it is always clearly identifiable as simulated demo data, never real
 * hardware.
 */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['plotId']);
  if (missing) return fail(missing);

  try {
    const plot = await getPlotById(body.plotId);
    if (!plot) return notFound('Parcelle introuvable');

    const reading = await ingestSensorReading({
      deviceId: `DEMO-SIM-${body.plotId}`,
      plotId: body.plotId,
      soilMoisture: randomBetween(58, 76),
      temperature: randomBetween(26, 31),
      humidity: randomBetween(70, 88),
      rainfall: randomBetween(0, 8),
    });

    return ok({ ...reading, simulated: true });
  } catch (err) {
    return fail(err.message, 500);
  }
}
