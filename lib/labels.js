/**
 * Shared French display labels for internal enum values. The enum values
 * themselves stay in English (they are stored in the database / schema
 * constraints and referenced in lib/decisionEngine.js conditionals) — only
 * what is shown to the user goes through these maps.
 */

export const SOIL_STATE_LABELS = {
  dry: 'Sec',
  normal: 'Normal',
  humid: 'Humide',
  very_humid: 'Très humide',
};

export const IRRIGATION_LABELS = {
  none: 'Aucune',
  available: 'Disponible',
  limited: 'Limitée',
};

export function soilStateLabel(value) {
  return SOIL_STATE_LABELS[value] || value;
}

export function irrigationLabel(value) {
  return IRRIGATION_LABELS[value] || value;
}

export const PLANT_CONDITION_LABELS = {
  normal: 'Normale',
  stressed: 'Stressée',
  diseased: 'Malade',
  recovering: 'En rétablissement',
};

export function plantConditionLabel(value) {
  return PLANT_CONDITION_LABELS[value] || value;
}

// Farmer-facing action taken (feedback loop, "Quelle décision avez-vous
// finalement prise ?") — matches lib/decisionEngine.js ACTION_LABELS plus
// "no_action" for the feedback-only case.
export const ACTION_TAKEN_LABELS = {
  plant_today: 'J’ai semé aujourd’hui',
  wait_2_days: 'J’ai attendu 2 jours',
  wait_4_days: 'J’ai attendu 4 jours',
  irrigate_today: 'J’ai irrigué aujourd’hui',
  delay_irrigation: 'J’ai reporté l’irrigation',
  monitor: 'J’ai surveillé sans intervenir',
  no_action: 'Je n’ai effectué aucune action',
};

export const OUTCOME_LABELS = {
  crop_condition_improved: 'La culture s’est améliorée',
  no_noticeable_change: 'Aucun changement notable',
  crop_condition_worsened: 'La situation s’est dégradée',
  successful_planting: 'Semis réussi',
  planting_failed: 'Semis non réussi',
  irrigation_successful: 'Irrigation réussie',
};

export function actionTakenLabel(value) {
  return ACTION_TAKEN_LABELS[value] || value;
}

export function outcomeLabel(value) {
  return OUTCOME_LABELS[value] || value;
}
