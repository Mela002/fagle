/**
 * Moteur de décision FáGlè
 * ------------------------
 *
 * IMPORTANT — à lire avant de modifier ce fichier :
 * Ceci est un moteur de score de risque PROTOTYPE, transparent et fondé sur
 * des règles. Ce n'est PAS un modèle agronomique scientifiquement validé et
 * il n'utilise pas d'apprentissage automatique. Chaque score qu'il retourne
 * doit être présenté dans l'interface comme un « Score de risque du
 * prototype », jamais comme une prédiction validée.
 *
 * Le moteur est volontairement modulaire afin que les règles puissent plus
 * tard être remplacées par un modèle statistique calibré localement ou par
 * un modèle entraîné, sans changer les appelants. Voir docs/ML_ROADMAP.md.
 *
 *   DecisionEngine (interface)
 *     analyze(context)            -> évaluation du risque pour une action
 *     compareScenarios(context)   -> comparaison de plusieurs scénarios
 *
 *   RuleBasedDecisionEngine        <- implémentation actuelle (ce fichier)
 *   MLDecisionEngine (future)      <- même interface, modèle entraîné à l'intérieur
 */

export const ENGINE_VERSION = 'rule-based-v1';

const SOIL_BASELINE = {
  dry: 18,
  normal: 40,
  humid: 65,
  very_humid: 85,
};

const DECAY_POINTS = [
  [0, 1],
  [1, 0.75],
  [2, 0.4],
  [3, 0.25],
  [4, 0.15],
  [7, 0.08],
];

function rainfallDecay(days) {
  if (days <= DECAY_POINTS[0][0]) return DECAY_POINTS[0][1];
  for (let i = 0; i < DECAY_POINTS.length - 1; i += 1) {
    const [d0, v0] = DECAY_POINTS[i];
    const [d1, v1] = DECAY_POINTS[i + 1];
    if (days >= d0 && days <= d1) {
      const t = (days - d0) / (d1 - d0);
      return v0 + t * (v1 - v0);
    }
  }
  return DECAY_POINTS[DECAY_POINTS.length - 1][1];
}

const DRAINAGE_PER_DAY = 10;

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function projectMoisture({ soilState, rainfall48 }, days) {
  const baseline = SOIL_BASELINE[soilState] ?? SOIL_BASELINE.normal;
  const contribution = (rainfall48 || 0) * rainfallDecay(days) * 0.6;
  const drainage = days * DRAINAGE_PER_DAY;
  return clamp(baseline + contribution - drainage);
}

function riskLevel(score) {
  if (score >= 60) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

// Stades de développement (valeurs canoniques, également utilisées comme
// données stockées — voir data/seedData.js et supabase/schema.sql).
const PLANTING_STAGES = ['Préparation du sol', 'Germination', 'Pépinière', 'Repiquage'];
const WATER_SENSITIVE_STAGES = ['Floraison', 'Fructification', 'Remplissage du grain', 'Tallage'];

function normalizeContext(raw) {
  const weather = raw.weather || {};
  const sensor = raw.sensor || null;
  const observations = raw.observations || {};

  // Les mesures d'un capteur, quand elles sont disponibles, priment sur la
  // description qualitative du sol donnée par l'agriculteur — mais le
  // moteur conserve tout de même soilState comme base de repli.
  const soilState = raw.soilState || raw.soil_state || 'normal';

  return {
    crop: raw.crop || 'Maïs',
    growthStage: raw.growthStage || raw.growth_stage || 'Germination',
    plantingDate: raw.plantingDate || raw.planting_date || null,
    soilState,
    irrigation: raw.irrigation || 'none',
    weather: {
      temperature: weather.temperature ?? 28,
      humidity: weather.humidity ?? 70,
      rainfall24h: weather.rainfall_24h ?? weather.rainfall24h ?? 0,
      rainfall48h: weather.rainfall_48h ?? weather.rainfall48h ?? 0,
      rainfall7d: weather.rainfall_7d ?? weather.rainfall7d ?? 0,
    },
    sensor: sensor
      ? {
          soilMoisture: sensor.soilMoisture ?? sensor.soil_moisture ?? null,
          temperature: sensor.temperature ?? null,
          humidity: sensor.humidity ?? null,
          rainfall: sensor.rainfall ?? null,
        }
      : null,
    observations: {
      visibleStress: Boolean(observations.visibleStress ?? observations.plant_condition === 'stressed'),
      pests: Boolean(observations.pests ?? observations.pest_observed),
      yellowLeaves: Boolean(observations.yellowLeaves ?? observations.leaf_discoloration),
      standingWater: Boolean(observations.standingWater ?? observations.standing_water),
      drySoil: Boolean(observations.drySoil ?? observations.dryness),
      normalCondition: Boolean(observations.normalCondition),
    },
  };
}

/** L'humidité du sol mesurée par un capteur (échelle 0-100) prime sur la
 * projection issue de la météo pour le jour 0, quand elle est disponible —
 * c'est le moyen concret par lequel un capteur « améliore la précision »
 * une fois installé. */
function effectiveMoistureAtZero(context) {
  if (context.sensor && typeof context.sensor.soilMoisture === 'number') {
    return clamp(context.sensor.soilMoisture);
  }
  return projectMoisture(context, 0);
}

function computeMoistureSeries(context, days) {
  const dayZero = effectiveMoistureAtZero(context);
  if (days === 0) return dayZero;
  // Au-delà du jour 0, on continue de projeter à partir du modèle pluie,
  // ancré sur la valeur du jour 0 (éventuellement corrigée par un capteur).
  const modeled0 = projectMoisture(context, 0);
  const modeledN = projectMoisture(context, days);
  const drift = modeledN - modeled0;
  return clamp(dayZero + drift);
}

function buildPlantingFactors(context, days, moisture) {
  const factors = [];
  const { weather, observations, soilState } = context;

  if (weather.rainfall48h >= 20) {
    factors.push({
      type: 'risk',
      label: `Fortes précipitations prévues dans les prochaines 48 heures (${weather.rainfall48h}mm)`,
    });
  } else if (weather.rainfall48h >= 8) {
    factors.push({ type: 'risk', label: `Précipitations modérées prévues dans les prochaines 48 heures (${weather.rainfall48h}mm)` });
  }

  if (soilState === 'humid' || soilState === 'very_humid') {
    factors.push({ type: 'risk', label: `Sol déjà ${soilState === 'very_humid' ? 'très humide' : 'humide'}` });
  } else if (soilState === 'dry' && moisture < 30) {
    factors.push({ type: 'risk', label: "L'humidité du sol pourrait être insuffisante pour une bonne germination" });
  }

  if (moisture >= 75) {
    factors.push({ type: 'risk', label: "Risque élevé d'excès d'eau pour la graine en germination" });
  }

  if (observations.standingWater && days === 0) {
    factors.push({ type: 'risk', label: 'Eau stagnante observée lors de la dernière visite au champ' });
  }
  if (observations.pests) {
    factors.push({ type: 'risk', label: 'Présence de ravageurs observée sur la parcelle' });
  }
  if (observations.yellowLeaves) {
    factors.push({ type: 'risk', label: 'Décoloration des feuilles signalée' });
  }

  if (days > 0) {
    factors.push({ type: 'positive', label: `Le drainage naturel du sol sur ${days} jour${days > 1 ? 's' : ''} réduit l'excès d'humidité` });
  }
  if (days === 0 && moisture < 70) {
    factors.push({ type: 'positive', label: "Aucun besoin d'irrigation immédiat" });
  }
  if (PLANTING_STAGES.includes(context.growthStage)) {
    factors.push({ type: 'neutral', label: `${context.crop} est actuellement au stade ${context.growthStage.toLowerCase()}` });
  }

  return factors;
}

function scorePlantingAction(context, days) {
  const moisture = computeMoistureSeries(context, days);
  const waterloggingRaw = moisture - 10;
  const standingWaterBonus = context.observations.standingWater ? Math.max(0, 5 - days * 2) : 0;
  const pestBonus = context.observations.pests ? 8 : 0;
  const yellowLeavesBonus = context.observations.yellowLeaves ? 5 : 0;
  const droughtRaw = clamp((30 - moisture) * 1.2, 0);

  const score = clamp(waterloggingRaw + standingWaterBonus + pestBonus + yellowLeavesBonus + droughtRaw * 0.3);
  return { score: Math.round(score), moisture, factors: buildPlantingFactors(context, days, moisture) };
}

function scoreIrrigateToday(context) {
  const moisture = effectiveMoistureAtZero(context);
  const factors = [];
  let score;
  if (moisture >= 65) {
    score = clamp((moisture - 45) * 1.3);
    factors.push({ type: 'risk', label: 'Le sol est déjà humide — irriguer maintenant risque de le noyer' });
  } else {
    score = clamp(22 - (65 - moisture) * 0.1);
    factors.push({ type: 'positive', label: "L'humidité du sol est dans une plage sûre pour l'irrigation" });
  }
  if (context.irrigation === 'none') {
    score = clamp(score + 15);
    factors.push({ type: 'risk', label: "Aucune infrastructure d'irrigation disponible actuellement sur cette parcelle" });
  }
  if (context.observations.drySoil) {
    factors.push({ type: 'positive', label: 'Sol sec signalé par l’agriculteur' });
  }
  return { score: Math.round(score), moisture, factors };
}

function scoreDelayIrrigation(context) {
  const moistureIn2Days = projectMoisture(context, 2);
  const factors = [];
  const droughtRisk = clamp((32 - moistureIn2Days) * 1.4);
  let score = droughtRisk;
  if (context.observations.drySoil) {
    score = clamp(score + 10);
    factors.push({ type: 'risk', label: 'Un sol sec a déjà été signalé — reporter l’irrigation pourrait accentuer le stress hydrique' });
  }
  if (context.weather.rainfall48h >= 8) {
    score = clamp(score - 12);
    factors.push({
      type: 'positive',
      label: `Des précipitations sont prévues dans les prochaines 48 heures (${context.weather.rainfall48h}mm), ce qui pourrait réduire le besoin d'irrigation`,
    });
  }
  if (WATER_SENSITIVE_STAGES.includes(context.growthStage)) {
    score = clamp(score + 8);
    factors.push({ type: 'risk', label: `Le stade ${context.growthStage.toLowerCase()} est sensible au stress hydrique` });
  }
  if (score < 25) factors.push({ type: 'positive', label: "L'humidité du sol prévue reste suffisante pour les 2 prochains jours" });
  return { score: Math.round(score), moisture: moistureIn2Days, factors };
}

function scoreMonitor(context) {
  const moisture = effectiveMoistureAtZero(context);
  const extremity = Math.abs(moisture - 50);
  const pestBonus = context.observations.pests ? 6 : 0;
  const stressBonus = context.observations.visibleStress ? 8 : 0;
  const score = clamp(extremity * 0.7 + pestBonus + stressBonus - 10);
  const factors = [{ type: 'neutral', label: 'Aucune action entreprise — la parcelle continue simplement d’être surveillée' }];
  if (context.observations.pests) factors.push({ type: 'risk', label: 'Présence de ravageurs observée, non encore traitée' });
  if (moisture >= 70 || moisture <= 25) {
    factors.push({ type: 'risk', label: "L'humidité du sol est actuellement en dehors de la plage confortable" });
  } else {
    factors.push({ type: 'positive', label: "L'humidité du sol est actuellement dans une plage confortable" });
  }
  return { score: Math.round(score), moisture, factors };
}

const ACTION_LABELS = {
  plant_today: 'Semer aujourd’hui',
  wait_2_days: 'Attendre 2 jours',
  wait_4_days: 'Attendre 4 jours',
  irrigate_today: 'Irriguer aujourd’hui',
  delay_irrigation: 'Reporter l’irrigation',
  monitor: 'Surveiller sans intervenir',
};

function getAvailableActions(context) {
  const actions = [];
  const isPlantingDecision = PLANTING_STAGES.includes(context.growthStage);
  if (isPlantingDecision) {
    // Une décision de semis a déjà ses propres options d'attente (2 / 4
    // jours) — y ajouter l'action générique « surveiller » entrerait en
    // concurrence sur une échelle de temps différente.
    actions.push('plant_today', 'wait_2_days', 'wait_4_days');
  }
  const irrigationRelevant =
    !isPlantingDecision &&
    (context.irrigation !== 'none' || context.observations.drySoil || WATER_SENSITIVE_STAGES.includes(context.growthStage));
  if (irrigationRelevant) {
    actions.push('irrigate_today', 'delay_irrigation');
  }
  if (!actions.length) actions.push('monitor');
  return [...new Set(actions)];
}

function evaluateAction(context, action) {
  let result;
  switch (action) {
    case 'plant_today':
      result = scorePlantingAction(context, 0);
      break;
    case 'wait_2_days':
      result = scorePlantingAction(context, 2);
      break;
    case 'wait_4_days':
      result = scorePlantingAction(context, 4);
      break;
    case 'irrigate_today':
      result = scoreIrrigateToday(context);
      break;
    case 'delay_irrigation':
      result = scoreDelayIrrigation(context);
      break;
    case 'monitor':
      result = scoreMonitor(context);
      break;
    default:
      result = scoreMonitor(context);
  }
  return {
    action,
    label: ACTION_LABELS[action] || action,
    score: result.score,
    level: riskLevel(result.score),
    projectedMoisture: Math.round(result.moisture),
    factors: result.factors,
  };
}

function buildCounterfactuals(context, topFactors) {
  const suggestions = new Set();
  const labels = topFactors.map((f) => f.label.toLowerCase());
  if (labels.some((l) => l.includes('précipitation') || l.includes('pluie'))) suggestions.add('Des prévisions de pluie revues à la baisse');
  if (labels.some((l) => l.includes('sol') && l.includes('humid'))) suggestions.add("Une mesure d'humidité du sol plus basse");
  if (labels.some((l) => l.includes("excès d'eau"))) suggestions.add("Un drainage confirmé ou une humidité du sol plus basse mesurée par un capteur");
  if (labels.some((l) => l.includes('ravageur'))) suggestions.add('Une nouvelle observation confirmant que les ravageurs ont été traités');
  suggestions.add("Une nouvelle observation de l'agriculteur");
  suggestions.add("Une mesure d'un capteur d'humidité du sol connecté");
  return [...suggestions].slice(0, 4);
}

export class RuleBasedDecisionEngine {
  analyze(rawContext, requestedAction) {
    const context = normalizeContext(rawContext);
    const available = getAvailableActions(context);
    const action = requestedAction && available.includes(requestedAction) ? requestedAction : available[0];
    const evaluated = evaluateAction(context, action);
    const riskFactors = evaluated.factors.filter((f) => f.type === 'risk');

    const allScenarios = available.map((a) => evaluateAction(context, a));
    const recommended = [...allScenarios].sort((a, b) => a.score - b.score)[0];

    return {
      engineVersion: ENGINE_VERSION,
      scoreLabel: 'Score de risque du prototype',
      generatedAt: new Date().toISOString(),
      action: evaluated.action,
      actionLabel: evaluated.label,
      score: evaluated.score,
      level: evaluated.level,
      projectedMoisture: evaluated.projectedMoisture,
      factors: evaluated.factors,
      counterfactuals: buildCounterfactuals(context, riskFactors),
      recommendation:
        recommended.action === evaluated.action
          ? `« ${evaluated.label} » présente actuellement le risque le plus faible parmi les options disponibles.`
          : `Envisagez plutôt « ${recommended.label} » — cette option présente actuellement un risque plus faible (${recommended.score} %) que « ${evaluated.label} » (${evaluated.score} %).`,
      recommendedAction: recommended.action,
    };
  }

  compareScenarios(rawContext) {
    const context = normalizeContext(rawContext);
    const available = getAvailableActions(context);
    const scenarios = available.map((a) => evaluateAction(context, a));
    const sorted = [...scenarios].sort((a, b) => a.score - b.score);
    const recommendedAction = sorted[0]?.action;

    return {
      engineVersion: ENGINE_VERSION,
      scoreLabel: 'Score de risque du prototype',
      generatedAt: new Date().toISOString(),
      scenarios: scenarios.map((s) => ({
        ...s,
        recommended: s.action === recommendedAction,
        counterfactuals: buildCounterfactuals(context, s.factors.filter((f) => f.type === 'risk')),
      })),
      recommendedAction,
    };
  }
}

let engineInstance = null;
export function getDecisionEngine() {
  if (!engineInstance) engineInstance = new RuleBasedDecisionEngine();
  return engineInstance;
}

export function analyzePlot(context, action) {
  return getDecisionEngine().analyze(context, action);
}

export function compareScenarios(context) {
  return getDecisionEngine().compareScenarios(context);
}
