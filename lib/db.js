import { isSupabaseConfigured, getSupabaseServerClient } from '@/lib/supabaseClient';
import { getStore, nextId } from '@/lib/demoStore';
import { getForecast } from '@/services/weatherService';

/**
 * Unified data-access layer.
 *
 * Every function here checks `isSupabaseConfigured()` and either talks to
 * Supabase/Postgres (production) or the in-memory demo store (Demo Mode —
 * see lib/demoStore.js). Callers (API routes, server components) never need
 * to know which backend is active. This is what makes "FáGlè works even
 * without Supabase credentials" possible.
 */

function shouldUseSupabase() {
  return isSupabaseConfigured();
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export async function getProfile(id) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('profiles').select('*').eq('id', id).maybeSingle();
    return data || null;
  }
  const store = getStore();
  return store.profiles.find((p) => p.id === id) || null;
}

export async function getAllProfiles() {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
    return data || [];
  }
  return getStore().profiles;
}

export async function createProfile(input) {
  const record = {
    id: input.id || nextId('user'),
    role: input.role || 'farmer',
    full_name: input.full_name,
    country: input.country,
    region: input.region,
    commune: input.commune,
    phone: input.phone || null,
    preferred_language: input.preferred_language || 'fr',
    allow_anonymized_research_use: Boolean(input.allow_anonymized_research_use),
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('profiles').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const store = getStore();
  store.profiles.push(record);
  return record;
}

// ---------------------------------------------------------------------------
// Crops
// ---------------------------------------------------------------------------

export async function getCrops() {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('crops').select('*').order('name');
    return data || [];
  }
  return getStore().crops;
}

// ---------------------------------------------------------------------------
// Farms
// ---------------------------------------------------------------------------

export async function getFarms(ownerId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    let query = sb.from('farms').select('*').order('created_at', { ascending: false });
    if (ownerId) query = query.eq('owner_id', ownerId);
    const { data } = await query;
    return data || [];
  }
  const store = getStore();
  return store.farms.filter((f) => !ownerId || f.owner_id === ownerId);
}

export async function getFarmById(id) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('farms').select('*').eq('id', id).maybeSingle();
    return data || null;
  }
  return getStore().farms.find((f) => f.id === id) || null;
}

export async function createFarm(input) {
  const record = {
    id: nextId('farm'),
    owner_id: input.owner_id,
    name: input.name,
    country: input.country || 'Bénin',
    region: input.region,
    commune: input.commune,
    size_ha: Number(input.size_ha) || 0,
    irrigation_available: Boolean(input.irrigation_available),
    main_crops: input.main_crops || [],
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('farms').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().farms.push(record);
  return record;
}

// ---------------------------------------------------------------------------
// Plots
// ---------------------------------------------------------------------------

export async function getPlots(farmId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    let query = sb.from('plots').select('*').order('created_at', { ascending: false });
    if (farmId) query = query.eq('farm_id', farmId);
    const { data } = await query;
    return data || [];
  }
  const store = getStore();
  return store.plots.filter((p) => !farmId || p.farm_id === farmId);
}

export async function getPlotById(id) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('plots').select('*').eq('id', id).maybeSingle();
    return data || null;
  }
  return getStore().plots.find((p) => p.id === id) || null;
}

export async function getPlotsForOwner(ownerId) {
  const farms = await getFarms(ownerId);
  const farmIds = new Set(farms.map((f) => f.id));
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('plots').select('*').in('farm_id', [...farmIds]);
    return data || [];
  }
  return getStore().plots.filter((p) => farmIds.has(p.farm_id));
}

export async function createPlot(input) {
  const record = {
    id: nextId('plot'),
    farm_id: input.farm_id,
    name: input.name,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    crop_id: input.crop_id,
    variety: input.variety || null,
    planting_date: input.planting_date || null,
    growth_stage: input.growth_stage || 'Land Prep',
    soil_state: input.soil_state || 'normal',
    irrigation: input.irrigation || 'none',
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('plots').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().plots.push(record);
  return record;
}

export async function updatePlot(id, patch) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('plots').update(patch).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const store = getStore();
  const plot = store.plots.find((p) => p.id === id);
  if (!plot) return null;
  Object.assign(plot, patch);
  return plot;
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

export async function getWeatherForPlot(plotId) {
  const plot = await getPlotById(plotId);
  const forecast = await getForecast({
    lat: plot?.lat,
    lng: plot?.lng,
    seedKey: plotId,
  });

  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    await sb.from('weather_snapshots').insert({
      plot_id: plotId,
      date: forecast.generated_at,
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      rainfall_24h: forecast.rainfall_24h,
      rainfall_48h: forecast.rainfall_48h,
      rainfall_7d: forecast.rainfall_7d,
      source: forecast.source,
    });
  } else {
    const store = getStore();
    const idx = store.weatherSnapshots.findIndex((w) => w.plot_id === plotId);
    const record = {
      id: idx >= 0 ? store.weatherSnapshots[idx].id : nextId('ws'),
      plot_id: plotId,
      date: forecast.generated_at,
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      rainfall_24h: forecast.rainfall_24h,
      rainfall_48h: forecast.rainfall_48h,
      rainfall_7d: forecast.rainfall_7d,
      source: forecast.source,
    };
    if (idx >= 0) store.weatherSnapshots[idx] = record;
    else store.weatherSnapshots.push(record);
  }
  return forecast;
}

// ---------------------------------------------------------------------------
// Sensors
// ---------------------------------------------------------------------------

export async function ingestSensorReading(input) {
  const record = {
    id: nextId('sr'),
    device_id: input.deviceId,
    plot_id: input.plotId,
    timestamp: input.timestamp || new Date().toISOString(),
    soil_moisture: input.soilMoisture ?? null,
    temperature: input.temperature ?? null,
    humidity: input.humidity ?? null,
    rainfall: input.rainfall ?? null,
  };

  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { error } = await sb.from('sensor_readings').insert(record);
    if (error) throw new Error(error.message);
    await sb
      .from('sensor_devices')
      .upsert({ device_id: input.deviceId, plot_id: input.plotId, status: 'active', last_seen_at: record.timestamp }, { onConflict: 'device_id' });
    return record;
  }

  const store = getStore();
  store.sensorReadings.push(record);
  const device = store.sensorDevices.find((d) => d.device_id === input.deviceId);
  if (device) {
    device.status = 'active';
    device.last_seen_at = record.timestamp;
    device.plot_id = input.plotId || device.plot_id;
  } else {
    store.sensorDevices.push({
      id: nextId('device'),
      device_id: input.deviceId,
      plot_id: input.plotId,
      status: 'active',
      last_seen_at: record.timestamp,
    });
  }
  return record;
}

export async function getLatestSensorReading(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('sensor_readings')
      .select('*')
      .eq('plot_id', plotId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data || null;
  }
  const store = getStore();
  const readings = store.sensorReadings.filter((r) => r.plot_id === plotId);
  if (!readings.length) return null;
  return readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
}

export async function getSensorHistory(plotId, limit = 30) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('sensor_readings')
      .select('*')
      .eq('plot_id', plotId)
      .order('timestamp', { ascending: true })
      .limit(limit);
    return data || [];
  }
  const store = getStore();
  return store.sensorReadings
    .filter((r) => r.plot_id === plotId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-limit);
}

export async function getAllSensorDevices() {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('sensor_devices').select('*').order('created_at', { ascending: false });
    return data || [];
  }
  return getStore().sensorDevices;
}

export async function getSensorDeviceForPlot(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('sensor_devices').select('*').eq('plot_id', plotId).maybeSingle();
    return data || null;
  }
  return getStore().sensorDevices.find((d) => d.plot_id === plotId) || null;
}

// ---------------------------------------------------------------------------
// Farmer observations
// ---------------------------------------------------------------------------

export async function getObservations(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('farmer_observations')
      .select('*')
      .eq('plot_id', plotId)
      .order('date', { ascending: false });
    return data || [];
  }
  return getStore()
    .observations.filter((o) => o.plot_id === plotId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function createObservation(input) {
  const record = {
    id: nextId('obs'),
    plot_id: input.plot_id,
    farmer_id: input.farmer_id,
    date: input.date || new Date().toISOString(),
    crop_stage: input.crop_stage || null,
    soil_condition: input.soil_condition || 'normal',
    plant_condition: input.plant_condition || 'normal',
    pest_observed: Boolean(input.pest_observed),
    standing_water: Boolean(input.standing_water),
    dryness: Boolean(input.dryness),
    leaf_discoloration: Boolean(input.leaf_discoloration),
    notes: input.notes || '',
    photo_url: input.photo_url || null,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('farmer_observations').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().observations.push(record);
  return record;
}

// ---------------------------------------------------------------------------
// Crop photos
// ---------------------------------------------------------------------------

export async function getPhotos(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('crop_photos').select('*').eq('plot_id', plotId).order('date', { ascending: true });
    return data || [];
  }
  return getStore()
    .photos.filter((p) => p.plot_id === plotId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function createPhoto(input) {
  const record = {
    id: nextId('photo'),
    plot_id: input.plot_id,
    farmer_id: input.farmer_id,
    url: input.url,
    date: input.date || new Date().toISOString(),
    crop: input.crop || null,
    growth_stage: input.growth_stage || null,
    note: input.note || null,
    problem: input.problem || null,
    gps: input.gps || null,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('crop_photos').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().photos.push(record);
  return record;
}

// ---------------------------------------------------------------------------
// Recommendations & scenarios
// ---------------------------------------------------------------------------

export async function createRecommendation(input) {
  const record = {
    id: nextId('rec'),
    plot_id: input.plot_id,
    action: input.action,
    action_label: input.action_label,
    risk_score: input.risk_score,
    risk_level: input.risk_level,
    factors: input.factors || [],
    counterfactuals: input.counterfactuals || [],
    recommendation_text: input.recommendation_text || '',
    engine_version: input.engine_version,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('recommendations').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().recommendations.push(record);
  return record;
}

export async function getRecommendations(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('recommendations')
      .select('*')
      .eq('plot_id', plotId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return getStore()
    .recommendations.filter((r) => r.plot_id === plotId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function saveScenarios(recommendationId, plotId, scenarios) {
  const records = scenarios.map((s) => ({
    id: nextId('scn'),
    recommendation_id: recommendationId,
    plot_id: plotId,
    scenario_action: s.action,
    scenario_label: s.label,
    risk_score: s.score,
    risk_level: s.level,
    recommended: Boolean(s.recommended),
    drivers: s.factors || [],
    created_at: new Date().toISOString(),
  }));
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { error } = await sb.from('decision_scenarios').insert(records);
    if (error) throw new Error(error.message);
    return records;
  }
  getStore().scenarios.push(...records);
  return records;
}

export async function getScenarios(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('decision_scenarios')
      .select('*')
      .eq('plot_id', plotId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return getStore()
    .scenarios.filter((s) => s.plot_id === plotId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ---------------------------------------------------------------------------
// Farmer actions & outcomes (feedback loop)
// ---------------------------------------------------------------------------

export async function createFarmerAction(input) {
  const record = {
    id: nextId('act'),
    plot_id: input.plot_id,
    recommendation_id: input.recommendation_id || null,
    recommended_action: input.recommended_action || null,
    actual_action: input.actual_action,
    farmer_feedback: input.farmer_feedback || null,
    note: input.note || null,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('farmer_actions').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().actions.push(record);
  return record;
}

export async function getFarmerActions(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('farmer_actions')
      .select('*')
      .eq('plot_id', plotId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return getStore()
    .actions.filter((a) => a.plot_id === plotId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function createOutcome(input) {
  const record = {
    id: nextId('out'),
    plot_id: input.plot_id,
    action_id: input.action_id || null,
    outcome_type: input.outcome_type,
    notes: input.notes || null,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('outcomes').insert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  getStore().outcomes.push(record);
  return record;
}

export async function getOutcomes(plotId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('outcomes')
      .select('*')
      .eq('plot_id', plotId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return getStore()
    .outcomes.filter((o) => o.plot_id === plotId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ---------------------------------------------------------------------------
// Monthly reports
// ---------------------------------------------------------------------------

export async function getReports(farmId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    let query = sb.from('monthly_reports').select('*').order('created_at', { ascending: false });
    if (farmId) query = query.eq('farm_id', farmId);
    const { data } = await query;
    return data || [];
  }
  const store = getStore();
  return store.reports
    .filter((r) => !farmId || r.farm_id === farmId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getReportById(id) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('monthly_reports').select('*').eq('id', id).maybeSingle();
    return data || null;
  }
  return getStore().reports.find((r) => r.id === id) || null;
}

export async function createReport(input) {
  const record = {
    id: input.id || nextId('report'),
    farm_id: input.farm_id,
    month: input.month,
    status: input.status || 'draft',
    sections: input.sections,
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('monthly_reports').upsert(record).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const store = getStore();
  const idx = store.reports.findIndex((r) => r.id === record.id);
  if (idx >= 0) store.reports[idx] = record;
  else store.reports.push(record);
  return record;
}

export async function updateReportStatus(id, status) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('monthly_reports').update({ status }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const store = getStore();
  const report = store.reports.find((r) => r.id === id);
  if (!report) return null;
  report.status = status;
  return report;
}

export async function getReviews(reportId) {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb
      .from('report_reviews')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });
    return data || [];
  }
  return getStore()
    .reviews.filter((r) => r.report_id === reportId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function createReview(input) {
  const record = {
    id: nextId('review'),
    report_id: input.report_id,
    reviewer_id: input.reviewer_id,
    reviewer_name: input.reviewer_name,
    status: input.status,
    comments: input.comments || '',
    created_at: new Date().toISOString(),
  };
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data, error } = await sb.from('report_reviews').insert(record).select().single();
    if (error) throw new Error(error.message);
    await updateReportStatus(input.report_id, input.status);
    return data;
  }
  getStore().reviews.push(record);
  await updateReportStatus(input.report_id, input.status);
  return record;
}

// ---------------------------------------------------------------------------
// Data confidence
// ---------------------------------------------------------------------------

/**
 * Application-level data COMPLETENESS indicator — not a validated
 * scientific probability. It simply reflects how many of FáGlè's
 * possible data sources are currently feeding a given plot.
 */
export async function getDataConfidence(plotId) {
  const [observations, latestReading] = await Promise.all([
    getObservations(plotId),
    getLatestSensorReading(plotId),
  ]);

  const sources = [
    { key: 'weather', label: 'Prévisions météo', available: true },
    { key: 'crop_profile', label: 'Profil de la culture', available: true },
    { key: 'observations', label: 'Observations de l’agriculteur', available: observations.length > 0 },
    { key: 'soil_sensor', label: 'Capteur d’humidité du sol', available: Boolean(latestReading && latestReading.soil_moisture != null) },
    { key: 'rain_gauge', label: 'Pluviomètre local', available: Boolean(latestReading && latestReading.rainfall != null) },
  ];

  const availableCount = sources.filter((s) => s.available).length;
  const percent = Math.round((availableCount / sources.length) * 100);
  let label = 'Niveau faible';
  if (percent >= 80) label = 'Niveau élevé';
  else if (percent >= 50) label = 'Niveau standard';

  return { percent, label, sources };
}

// ---------------------------------------------------------------------------
// Cross-cutting helpers
// ---------------------------------------------------------------------------

export async function getAllPlotsWithFarm() {
  if (shouldUseSupabase()) {
    const sb = getSupabaseServerClient();
    const { data } = await sb.from('plots').select('*, farms(*)');
    return data || [];
  }
  const store = getStore();
  return store.plots.map((p) => ({ ...p, farms: store.farms.find((f) => f.id === p.farm_id) }));
}

export async function exportFarmerData(farmerId) {
  const farms = await getFarms(farmerId);
  const plots = (await Promise.all(farms.map((f) => getPlots(f.id)))).flat();
  const plotIds = plots.map((p) => p.id);

  const [observations, photos, recommendations, actions, outcomes, sensorReadings] = await Promise.all([
    Promise.all(plotIds.map((id) => getObservations(id))).then((r) => r.flat()),
    Promise.all(plotIds.map((id) => getPhotos(id))).then((r) => r.flat()),
    Promise.all(plotIds.map((id) => getRecommendations(id))).then((r) => r.flat()),
    Promise.all(plotIds.map((id) => getFarmerActions(id))).then((r) => r.flat()),
    Promise.all(plotIds.map((id) => getOutcomes(id))).then((r) => r.flat()),
    Promise.all(plotIds.map((id) => getSensorHistory(id))).then((r) => r.flat()),
  ]);

  return {
    exported_at: new Date().toISOString(),
    farmer_id: farmerId,
    farms,
    plots,
    observations,
    photos,
    recommendations,
    actions,
    outcomes,
    sensorReadings,
  };
}
