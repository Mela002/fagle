/**
 * Weather service abstraction.
 *
 * FáGlè must not be tightly coupled to a single weather provider. This
 * module exposes one function — `getForecast()` — and picks an
 * implementation based on whether a plot location is known:
 *
 *  - When latitude/longitude are available, it calls the Open-Meteo
 *    Forecast API (free, no API key required) for real weather data.
 *  - If Open-Meteo is unreachable, times out, or returns an error, it
 *    silently falls back to `generateDemoForecast()` — the rest of the app
 *    never breaks, and the response is always tagged so callers (and the
 *    UI) know whether they are looking at real or simulated data. FáGlè
 *    never claims real-time data when the provider did not actually answer.
 *
 * Both code paths return the exact same normalized shape, so
 * lib/decisionEngine.js, lib/reportGenerator.js and every UI component can
 * consume weather data without caring which source produced it.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 6000;

// ---------------------------------------------------------------------------
// Demo / fallback generator
// ---------------------------------------------------------------------------

// Simple deterministic pseudo-random generator so the same plot+day
// produces a stable-but-slowly-changing forecast instead of pure noise.
function seededRandom(seed) {
  let h = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

/** Benin sits in a tropical wet/dry climate. This produces plausible
 * ranges for the demo without claiming meteorological accuracy. */
function generateDemoForecast({ lat = 7.2, lng = 2.1, seedKey = 'default' } = {}) {
  const dayBucket = Math.floor(Date.now() / (1000 * 60 * 30)); // refresh every 30 min
  const rand = seededRandom(`${seedKey}-${dayBucket}-${lat}-${lng}`);

  const baseTemp = 26 + rand() * 6; // 26-32 C
  const humidity = 55 + rand() * 35; // 55-90 %

  // Skew rainfall higher for the demo "Bohicon heavy rain" story plot while
  // keeping other plots more moderate — driven by seedKey, not hardcoded.
  const rainBias = seedKey.includes('plot-001') ? 1.6 : 1;
  const rain24 = Math.max(0, (rand() - 0.35) * 30 * rainBias);
  const rain48 = rain24 + Math.max(0, (rand() - 0.3) * 35 * rainBias);

  const dailyForecast = Array.from({ length: 7 }).map((_, i) => {
    const dayRand = seededRandom(`${seedKey}-${dayBucket}-day${i}-${lat}-${lng}`);
    const dayTemp = 26 + dayRand() * 6;
    const dayRain = Math.max(0, (dayRand() - 0.4) * 25 * rainBias);
    const date = new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
    return {
      date,
      tempMin: Math.round((dayTemp - 3 - dayRand() * 2) * 10) / 10,
      tempMax: Math.round((dayTemp + 2 + dayRand() * 2) * 10) / 10,
      precipitationSum: Math.round(dayRain * 10) / 10,
      precipitationProbability: Math.round(Math.min(100, dayRain * 6 + dayRand() * 20)),
    };
  });
  const rain7d = Math.round(dailyForecast.reduce((sum, d) => sum + d.precipitationSum, 0) * 10) / 10;

  const currentTemperature = Math.round(baseTemp * 10) / 10;
  const currentHumidity = Math.round(humidity);
  const rainfall24h = Math.round(rain24 * 10) / 10;
  const rainfall48h = Math.round(rain48 * 10) / 10;

  return {
    // Normalized shape used across FáGlè (see mapOpenMeteoResponse for the
    // real-data equivalent).
    currentTemperature,
    currentHumidity,
    currentRainfall: 0,
    rainfall24h,
    rainfall48h,
    rainfall7d: rain7d,
    tempMin: dailyForecast[0].tempMin,
    tempMax: dailyForecast[0].tempMax,
    precipitationProbability: dailyForecast[0].precipitationProbability,
    dailyForecast,

    // Legacy snake_case aliases — lib/db.js, lib/decisionEngine.js and
    // existing UI components read these; kept so nothing else has to change.
    temperature: currentTemperature,
    humidity: currentHumidity,
    rainfall_24h: rainfall24h,
    rainfall_48h: rainfall48h,
    rainfall_7d: rain7d,

    provider: 'générateur de démo',
    isSimulated: true,
    sourceLabel: 'Données météo simulées',
    source: 'générateur de démo',
    generated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Open-Meteo (real provider)
// ---------------------------------------------------------------------------

async function fetchWithTimeout(url, ms = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function mapOpenMeteoResponse(json) {
  const current = json.current || {};
  const hourly = json.hourly || {};
  const daily = json.daily || {};

  const hourlyTimes = hourly.time || [];
  const hourlyPrecip = hourly.precipitation || [];
  const hourlyProb = hourly.precipitation_probability || [];

  let nowIndex = hourlyTimes.indexOf(current.time);
  if (nowIndex < 0) nowIndex = 0;

  const sumPrecip = (from, count) => hourlyPrecip.slice(from, from + count).reduce((a, b) => a + (b || 0), 0);

  const rainfall24h = Math.round(sumPrecip(nowIndex, 24) * 10) / 10;
  const rainfall48h = Math.round(sumPrecip(nowIndex, 48) * 10) / 10;

  const dailyTimes = daily.time || [];
  const dailyForecast = dailyTimes.map((date, i) => ({
    date,
    tempMin: daily.temperature_2m_min?.[i] ?? null,
    tempMax: daily.temperature_2m_max?.[i] ?? null,
    precipitationSum: daily.precipitation_sum?.[i] ?? null,
    precipitationProbability: daily.precipitation_probability_max?.[i] ?? null,
  }));

  const rainfall7d = Math.round((daily.precipitation_sum || []).reduce((a, b) => a + (b || 0), 0) * 10) / 10;

  const currentTemperature = current.temperature_2m ?? null;
  const currentHumidity = current.relative_humidity_2m ?? null;

  return {
    currentTemperature,
    currentHumidity,
    currentRainfall: current.precipitation ?? 0,
    rainfall24h,
    rainfall48h,
    rainfall7d,
    tempMin: daily.temperature_2m_min?.[0] ?? null,
    tempMax: daily.temperature_2m_max?.[0] ?? null,
    precipitationProbability: hourlyProb[nowIndex] ?? daily.precipitation_probability_max?.[0] ?? null,
    dailyForecast,

    // Legacy snake_case aliases (see generateDemoForecast comment above).
    temperature: currentTemperature,
    humidity: currentHumidity,
    rainfall_24h: rainfall24h,
    rainfall_48h: rainfall48h,
    rainfall_7d: rainfall7d,

    provider: 'Open-Meteo',
    isSimulated: false,
    sourceLabel: 'Données météo en temps réel',
    source: 'Open-Meteo',
    generated_at: new Date().toISOString(),
  };
}

async function fetchFromOpenMeteo({ lat, lng }) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: 'temperature_2m,relative_humidity_2m,precipitation',
    hourly: 'precipitation,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetchWithTimeout(`${OPEN_METEO_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo a répondu avec le statut ${res.status}`);
  }
  const json = await res.json();
  return mapOpenMeteoResponse(json);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @param {{ lat?: number, lng?: number, seedKey?: string }} params
 * @returns Normalized forecast — always includes `isSimulated` and
 *          `sourceLabel` so the UI can honestly display whether the data is
 *          real ("Données météo en temps réel") or simulated ("Données
 *          météo simulées"). Never throws.
 */
export async function getForecast({ lat, lng, seedKey = 'default' } = {}) {
  const hasCoordinates = typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng);

  if (hasCoordinates) {
    try {
      return await fetchFromOpenMeteo({ lat, lng });
    } catch (err) {
      // Open-Meteo unreachable, timed out, or returned an error — never let
      // a weather-provider outage break the app, and never claim real-time
      // data when the provider did not actually answer.
      console.error('[weatherService] Open-Meteo fetch failed:', err.name, err.message);
      return generateDemoForecast({ lat, lng, seedKey });
    }
  }

  // No known location for this plot — nothing to ask a real provider for.
  return generateDemoForecast({ lat, lng, seedKey });
}
