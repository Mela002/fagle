import {
  getFarmById,
  getPlots,
  getCrops,
  getObservations,
  getPhotos,
  getRecommendations,
  getFarmerActions,
  getOutcomes,
  getSensorHistory,
  getDataConfidence,
  getWeatherForPlot,
  createReport,
} from '@/lib/db';

function isInMonth(dateStr, month) {
  if (!dateStr) return false;
  return dateStr.slice(0, 7) === month;
}

/**
 * Aggregates everything FáGlè knows about a farm during a given month
 * (format "YYYY-MM") into a structured report. The report is stored as
 * `draft`/`pending_review` — never auto-marked as scientifically validated.
 * A human agronomist must validate it via /scientist/reports/[id].
 */
export async function generateMonthlyReport(farmId, month) {
  const farm = await getFarmById(farmId);
  if (!farm) throw new Error(`Farm not found: ${farmId}`);

  const plots = await getPlots(farmId);
  const plotIds = plots.map((p) => p.id);
  const crops = await getCrops();
  const cropName = (id) => crops.find((c) => c.id === id)?.name || id;

  const [observationsByPlot, photosByPlot, recommendationsByPlot, actionsByPlot, outcomesByPlot, sensorByPlot, confidenceByPlot, weatherByPlot] =
    await Promise.all([
      Promise.all(plotIds.map((id) => getObservations(id))),
      Promise.all(plotIds.map((id) => getPhotos(id))),
      Promise.all(plotIds.map((id) => getRecommendations(id))),
      Promise.all(plotIds.map((id) => getFarmerActions(id))),
      Promise.all(plotIds.map((id) => getOutcomes(id))),
      Promise.all(plotIds.map((id) => getSensorHistory(id))),
      Promise.all(plotIds.map((id) => getDataConfidence(id))),
      Promise.all(plotIds.map((id) => getWeatherForPlot(id))),
    ]);

  const observations = observationsByPlot.flat().filter((o) => isInMonth(o.date, month));
  const photos = photosByPlot.flat().filter((p) => isInMonth(p.date, month));
  const recommendations = recommendationsByPlot.flat().filter((r) => isInMonth(r.created_at, month));
  const actions = actionsByPlot.flat().filter((a) => isInMonth(a.created_at, month));
  const outcomes = outcomesByPlot.flat().filter((o) => isInMonth(o.created_at, month));
  const sensorReadings = sensorByPlot.flat().filter((s) => isInMonth(s.timestamp, month));

  const risks = new Set();
  observations.forEach((o) => {
    if (o.standing_water) risks.add('Excès d’eau observé sur une ou plusieurs parcelles');
    if (o.pest_observed) risks.add('Présence de ravageurs signalée par l’agriculteur');
    if (o.dryness) risks.add('Sol sec signalé par l’agriculteur');
    if (o.leaf_discoloration) risks.add('Décoloration des feuilles signalée');
  });
  recommendations.forEach((r) => {
    if (r.risk_level === 'high') risks.add(`Risque prototype élevé signalé pour l’action « ${r.action_label} »`);
  });

  const decisionsSummary = { followed_recommendation: 0, chose_other: 0, no_action: 0 };
  actions.forEach((a) => {
    if (a.actual_action === 'no_action') decisionsSummary.no_action += 1;
    else if (a.recommended_action && a.actual_action === a.recommended_action) decisionsSummary.followed_recommendation += 1;
    else decisionsSummary.chose_other += 1;
  });

  const outcomesSummary = { improved: 0, no_change: 0, worsened: 0 };
  outcomes.forEach((o) => {
    if (['crop_condition_improved', 'successful_planting', 'irrigation_successful'].includes(o.outcome_type)) outcomesSummary.improved += 1;
    else if (['crop_condition_worsened', 'planting_failed'].includes(o.outcome_type)) outcomesSummary.worsened += 1;
    else outcomesSummary.no_change += 1;
  });

  const avgConfidence = confidenceByPlot.length
    ? Math.round(confidenceByPlot.reduce((sum, c) => sum + c.percent, 0) / confidenceByPlot.length) / 100
    : 0;

  const avgRainfallMm = weatherByPlot.length
    ? Math.round((weatherByPlot.reduce((sum, w) => sum + (w.rainfall_7d || 0), 0) / weatherByPlot.length) * 10) / 10
    : null;
  const avgTempC = weatherByPlot.length
    ? Math.round((weatherByPlot.reduce((sum, w) => sum + (w.temperature || 0), 0) / weatherByPlot.length) * 10) / 10
    : null;
  const anyWeatherSimulated = weatherByPlot.some((w) => w.isSimulated !== false);

  const sections = {
    farm_summary: { name: farm.name, commune: farm.commune, region: farm.region, plots: plots.length },
    crops_monitored: [...new Set(plots.map((p) => cropName(p.crop_id)))],
    weather_summary: {
      avg_rainfall_mm: avgRainfallMm,
      avg_temp_c: avgTempC,
      source: anyWeatherSimulated ? 'Données météo simulées' : 'Données météo en temps réel (Open-Meteo)',
      note: 'Agrégé à partir des relevés météo FáGlè enregistrés pour les parcelles de cette exploitation durant la période.',
    },
    sensor_summary: {
      devices_reporting: new Set(sensorReadings.map((s) => s.device_id)).size,
      readings_count: sensorReadings.length,
    },
    observations_summary: { count: observations.length },
    recommendations_count: recommendations.length,
    main_risks: risks.size ? [...risks] : ['Aucun risque significatif signalé durant cette période.'],
    farmer_decisions: decisionsSummary,
    outcomes_summary: outcomesSummary,
    photos_summary: { count: photos.length },
    data_quality: { confidence_avg: avgConfidence },
    key_insights:
      recommendations.length > 0
        ? ['FáGlè a généré au moins une recommandation de décision durant cette période — voir le détail sur les parcelles concernées.']
        : ["Pas assez d'activité durant cette période pour en tirer un enseignement."],
    limitations: [
      'Généré automatiquement par FáGlè — pas encore examiné par un agronome.',
      "Les scores de risque du prototype sont heuristiques, il ne s'agit pas d'une prédiction scientifiquement validée.",
      confidenceByPlot.some((c) => c.percent < 80) ? "Certaines parcelles ont des sources de données incomplètes (aucun capteur connecté)." : null,
      anyWeatherSimulated
        ? "Le fournisseur météo Open-Meteo n'a pas répondu pour au moins une parcelle : des données météo simulées ont été utilisées à la place."
        : null,
    ].filter(Boolean),
  };

  return createReport({
    id: `report-${month}-${farmId}`,
    farm_id: farmId,
    month,
    status: 'pending_review',
    sections,
  });
}
