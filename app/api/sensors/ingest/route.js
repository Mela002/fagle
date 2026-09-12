import { ingestSensorReading } from '@/lib/db';
import { ok, created, fail, unauthorized } from '@/lib/apiResponse';
import { requireFields, isNumber } from '@/lib/validation';

/**
 * POST /api/sensors/ingest
 * Protected by SENSOR_INGEST_API_KEY. Physical or simulated sensor devices
 * (see scripts/simulateSensor.js) call this endpoint directly.
 *
 * Expected header: x-api-key: <SENSOR_INGEST_API_KEY>
 * Expected body:
 * {
 *   "deviceId": "SENSOR-BJ-001",
 *   "plotId": "plot-001",
 *   "timestamp": "2026-09-11T12:00:00Z",
 *   "soilMoisture": 41.2,
 *   "temperature": 31.4,
 *   "humidity": 67.5,
 *   "rainfall": 0
 * }
 */
export async function POST(request) {
  const expectedKey = process.env.SENSOR_INGEST_API_KEY;
  const providedKey = request.headers.get('x-api-key');

  if (!expectedKey) {
    return fail('Configuration serveur incorrecte : SENSOR_INGEST_API_KEY n\'est pas défini. Copiez .env.example vers .env.local et renseignez-le.', 500);
  }
  if (providedKey !== expectedKey) {
    return unauthorized('En-tête x-api-key invalide ou manquant');
  }

  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');

  const missing = requireFields(body, ['deviceId', 'plotId']);
  if (missing) return fail(missing);

  const numericFields = ['soilMoisture', 'temperature', 'humidity', 'rainfall'];
  for (const field of numericFields) {
    if (body[field] !== undefined && body[field] !== null && !isNumber(Number(body[field]))) {
      return fail(`Le champ "${field}" doit être numérique`);
    }
  }

  try {
    const reading = await ingestSensorReading({
      deviceId: body.deviceId,
      plotId: body.plotId,
      timestamp: body.timestamp,
      soilMoisture: body.soilMoisture !== undefined ? Number(body.soilMoisture) : null,
      temperature: body.temperature !== undefined ? Number(body.temperature) : null,
      humidity: body.humidity !== undefined ? Number(body.humidity) : null,
      rainfall: body.rainfall !== undefined ? Number(body.rainfall) : null,
    });
    return created(reading);
  } catch (err) {
    return fail(err.message, 500);
  }
}
