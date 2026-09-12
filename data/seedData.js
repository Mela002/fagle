/**
 * Jeu de données de démonstration FáGlè — scénario pilote au Bénin.
 *
 * Ceci est la source unique de vérité pour le Mode démonstration. Il est
 * également reproduit dans supabase/seed.sql afin que le même scénario
 * puisse être chargé dans un vrai projet Supabase. Toutes les valeurs sont
 * des données de démonstration fictives.
 */

const now = () => new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString();

export const CROPS = [
  {
    id: 'crop-maize',
    name: 'Maïs',
    stages: ['Préparation du sol', 'Germination', 'Croissance végétative', 'Floraison', 'Remplissage du grain', 'Maturité'],
  },
  {
    id: 'crop-tomato',
    name: 'Tomate',
    stages: ['Pépinière', 'Repiquage', 'Croissance végétative', 'Floraison', 'Fructification', 'Récolte'],
  },
  {
    id: 'crop-rice',
    name: 'Riz',
    stages: ['Préparation du sol', 'Pépinière', 'Repiquage', 'Tallage', 'Floraison', 'Maturité'],
  },
];

export const PROFILES = [
  {
    id: 'user-koffi',
    role: 'farmer',
    full_name: 'Koffi Adjovi',
    country: 'Bénin',
    region: 'Zou',
    commune: 'Bohicon',
    phone: '+229 97 00 11 22',
    preferred_language: 'fr',
    allow_anonymized_research_use: false,
    created_at: daysAgo(120),
  },
  {
    id: 'user-akpe',
    role: 'farmer',
    full_name: 'Akpé Houngbo',
    country: 'Bénin',
    region: 'Atlantique',
    commune: 'Abomey-Calavi',
    phone: '+229 96 22 33 44',
    preferred_language: 'fr',
    allow_anonymized_research_use: true,
    created_at: daysAgo(90),
  },
  {
    id: 'user-scientist',
    role: 'scientist',
    full_name: 'Dr Nadia Fassassi',
    country: 'Bénin',
    region: 'Littoral',
    commune: 'Cotonou',
    phone: '+229 95 55 66 77',
    preferred_language: 'fr',
    created_at: daysAgo(200),
  },
  {
    id: 'user-admin',
    role: 'admin',
    full_name: 'Équipe FáGlè',
    country: 'Bénin',
    region: 'Littoral',
    commune: 'Cotonou',
    preferred_language: 'fr',
    created_at: daysAgo(300),
  },
];

export const FARMS = [
  {
    id: 'farm-demo',
    owner_id: 'user-koffi',
    name: 'Ferme Démo FáGlè',
    country: 'Bénin',
    region: 'Zou',
    commune: 'Bohicon',
    size_ha: 3.5,
    irrigation_available: false,
    main_crops: ['Maïs', 'Tomate'],
    created_at: daysAgo(120),
  },
  {
    id: 'farm-akpe-1',
    owner_id: 'user-akpe',
    name: 'Ferme familiale Houngbo',
    country: 'Bénin',
    region: 'Atlantique',
    commune: 'Abomey-Calavi',
    size_ha: 1.8,
    irrigation_available: true,
    main_crops: ['Riz'],
    created_at: daysAgo(90),
  },
];

export const PLOTS = [
  {
    id: 'plot-001',
    farm_id: 'farm-demo',
    name: 'Parcelle Maïs A',
    lat: 7.1781,
    lng: 2.0667,
    crop_id: 'crop-maize',
    variety: 'Composite local (DMR-ESR-Y)',
    planting_date: daysAgo(6),
    growth_stage: 'Germination',
    soil_state: 'humid',
    irrigation: 'none',
    created_at: daysAgo(6),
  },
  {
    id: 'plot-002',
    farm_id: 'farm-demo',
    name: 'Parcelle Tomate B',
    lat: 7.1795,
    lng: 2.0691,
    crop_id: 'crop-tomato',
    variety: 'Tropimech',
    planting_date: daysAgo(35),
    growth_stage: 'Floraison',
    soil_state: 'normal',
    irrigation: 'limited',
    created_at: daysAgo(35),
  },
  {
    id: 'plot-003',
    farm_id: 'farm-akpe-1',
    name: 'Parcelle Riz 1',
    lat: 6.4489,
    lng: 2.3556,
    crop_id: 'crop-rice',
    variety: 'IR841',
    planting_date: daysAgo(50),
    growth_stage: 'Tallage',
    soil_state: 'very_humid',
    irrigation: 'available',
    created_at: daysAgo(50),
  },
];

export const SENSOR_DEVICES = [
  { id: 'device-bj-001', device_id: 'SENSOR-BJ-001', plot_id: 'plot-001', status: 'unregistered', last_seen_at: null },
  { id: 'device-bj-002', device_id: 'SENSOR-BJ-002', plot_id: 'plot-003', status: 'active', last_seen_at: daysAgo(0) },
];

export const SENSOR_READINGS = [
  { id: 'sr-1', device_id: 'SENSOR-BJ-002', plot_id: 'plot-003', timestamp: daysAgo(1), soil_moisture: 62.4, temperature: 29.1, humidity: 78, rainfall: 4.2 },
  { id: 'sr-2', device_id: 'SENSOR-BJ-002', plot_id: 'plot-003', timestamp: daysAgo(0.5), soil_moisture: 65.1, temperature: 28.4, humidity: 81, rainfall: 1.1 },
];

export const WEATHER_SNAPSHOTS = [
  {
    id: 'ws-1',
    plot_id: 'plot-001',
    date: now(),
    temperature: 27.5,
    humidity: 84,
    rainfall_24h: 12,
    rainfall_48h: 38,
    rainfall_7d: 61,
    source: 'générateur de démo',
  },
  {
    id: 'ws-2',
    plot_id: 'plot-002',
    date: now(),
    temperature: 30.2,
    humidity: 58,
    rainfall_24h: 0,
    rainfall_48h: 2,
    rainfall_7d: 9,
    source: 'générateur de démo',
  },
  {
    id: 'ws-3',
    plot_id: 'plot-003',
    date: now(),
    temperature: 28.8,
    humidity: 76,
    rainfall_24h: 6,
    rainfall_48h: 14,
    rainfall_7d: 44,
    source: 'générateur de démo',
  },
];

export const FARMER_OBSERVATIONS = [
  {
    id: 'obs-1',
    plot_id: 'plot-001',
    farmer_id: 'user-koffi',
    date: daysAgo(4),
    crop_stage: 'Germination',
    soil_condition: 'humid',
    plant_condition: 'normal',
    pest_observed: false,
    standing_water: false,
    dryness: false,
    leaf_discoloration: false,
    notes: 'Les jeunes plants lèvent de façon homogène sur toute la parcelle après la pluie de la semaine dernière.',
    created_at: daysAgo(4),
  },
  {
    id: 'obs-2',
    plot_id: 'plot-001',
    farmer_id: 'user-koffi',
    date: daysAgo(1),
    crop_stage: 'Germination',
    soil_condition: 'very_humid',
    plant_condition: 'stressed',
    pest_observed: false,
    standing_water: true,
    dryness: false,
    leaf_discoloration: false,
    notes: "De l'eau stagne dans le coin bas de la parcelle après l'orage d'hier.",
    created_at: daysAgo(1),
  },
];

export const CROP_PHOTOS = [
  {
    id: 'photo-1',
    plot_id: 'plot-001',
    farmer_id: 'user-koffi',
    url: '/demo/photos/maize-week1.svg',
    date: daysAgo(6),
    crop: 'Maïs',
    growth_stage: 'Préparation du sol',
    note: 'Champ préparé et billonné, prêt pour le semis.',
    problem: null,
    created_at: daysAgo(6),
  },
  {
    id: 'photo-2',
    plot_id: 'plot-001',
    farmer_id: 'user-koffi',
    url: '/demo/photos/maize-week2.svg',
    date: daysAgo(2),
    crop: 'Maïs',
    growth_stage: 'Germination',
    note: 'Premières pousses visibles, levée régulière et homogène.',
    problem: null,
    created_at: daysAgo(2),
  },
];

export const RECOMMENDATIONS = [];
export const DECISION_SCENARIOS = [];
export const FARMER_ACTIONS = [];
export const OUTCOMES = [];

export const MONTHLY_REPORTS = [
  {
    id: 'report-2026-08-farm-demo',
    farm_id: 'farm-demo',
    month: '2026-08',
    status: 'validated',
    sections: {
      farm_summary: { name: 'Ferme Démo FáGlè', commune: 'Bohicon', plots: 2 },
      crops_monitored: ['Maïs', 'Tomate'],
      weather_summary: { avg_rainfall_mm: 118, avg_temp_c: 27.8 },
      sensor_summary: { devices_active: 0, readings_count: 0 },
      observations_summary: { count: 5 },
      recommendations_count: 8,
      main_risks: [
        'Risque d’excès d’eau pendant la germination',
        'Pression parasitaire modérée au stade de floraison de la tomate',
      ],
      farmer_decisions: { followed_recommendation: 6, chose_other: 1, no_action: 1 },
      outcomes_summary: { improved: 5, no_change: 2, worsened: 1 },
      photos_summary: { count: 4 },
      data_quality: { confidence_avg: 0.61 },
      key_insights: ["Retarder le semis après de fortes prévisions de pluie a réduit le stress lié à l'excès d'eau observé."],
      limitations: [
        'Aucune donnée de capteur local disponible pour la majeure partie du mois.',
        "Échantillon réduit (une seule exploitation)."
      ],
    },
    created_at: daysAgo(10),
  },
  {
    id: 'report-2026-09-farm-demo',
    farm_id: 'farm-demo',
    month: '2026-09',
    status: 'pending_review',
    sections: {
      farm_summary: { name: 'Ferme Démo FáGlè', commune: 'Bohicon', plots: 2 },
      crops_monitored: ['Maïs', 'Tomate'],
      weather_summary: { avg_rainfall_mm: 94, avg_temp_c: 28.4 },
      sensor_summary: { devices_active: 0, readings_count: 0 },
      observations_summary: { count: 2 },
      recommendations_count: 2,
      main_risks: ['Fortes précipitations prévues au stade de germination'],
      farmer_decisions: { followed_recommendation: 1, chose_other: 0, no_action: 1 },
      outcomes_summary: { improved: 0, no_change: 1, worsened: 0 },
      photos_summary: { count: 2 },
      data_quality: { confidence_avg: 0.55 },
      key_insights: ['La collecte de données a débuté en ce début de saison ; davantage d’observations sont nécessaires pour des enseignements plus solides.'],
      limitations: ['La période du rapport est encore en cours.', "Pas encore d'avis d'agronome."],
    },
    created_at: daysAgo(0),
  },
];

export const REPORT_REVIEWS = [
  {
    id: 'review-1',
    report_id: 'report-2026-08-farm-demo',
    reviewer_id: 'user-scientist',
    reviewer_name: 'Dr Nadia Fassassi',
    status: 'validated',
    comments:
      "Cohérent avec les régimes de précipitations régionaux du mois d'août. Il est recommandé de collecter des données d'humidité du sol la saison prochaine pour confirmer l'hypothèse d'excès d'eau.",
    created_at: daysAgo(8),
  },
];

export function cloneSeed() {
  return {
    profiles: PROFILES.map((p) => ({ ...p })),
    farms: FARMS.map((f) => ({ ...f })),
    plots: PLOTS.map((p) => ({ ...p })),
    crops: CROPS.map((c) => ({ ...c })),
    sensorDevices: SENSOR_DEVICES.map((d) => ({ ...d })),
    sensorReadings: SENSOR_READINGS.map((r) => ({ ...r })),
    weatherSnapshots: WEATHER_SNAPSHOTS.map((w) => ({ ...w })),
    observations: FARMER_OBSERVATIONS.map((o) => ({ ...o })),
    photos: CROP_PHOTOS.map((p) => ({ ...p })),
    recommendations: RECOMMENDATIONS.map((r) => ({ ...r })),
    scenarios: DECISION_SCENARIOS.map((s) => ({ ...s })),
    actions: FARMER_ACTIONS.map((a) => ({ ...a })),
    outcomes: OUTCOMES.map((o) => ({ ...o })),
    reports: MONTHLY_REPORTS.map((r) => ({ ...r })),
    reviews: REPORT_REVIEWS.map((r) => ({ ...r })),
  };
}

export { now, daysAgo, daysFromNow };
