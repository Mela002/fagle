# FáGlè — Machine Learning Roadmap

FáGlè's current decision engine (`lib/decisionEngine.js`) is a **transparent,
rule-based prototype**. It is explicitly not presented as a validated AI/ML
model, and it does not use machine learning today. This document lays out how
the engine can responsibly evolve toward one — without ever pretending to be
further along than it is.

Every phase below keeps the same `DecisionEngine` interface
(`analyze(context)`, `compareScenarios(context)`), so the rest of the app never
needs to change as the implementation behind it matures.

## Phase 1 — Transparent expert / risk rules (current state)

- Hand-authored rules translate soil state, rainfall forecasts, growth stage,
  irrigation access and farmer observations into a 0–100 "Prototype Decision
  Score."
- Every score ships with the specific factors that produced it and the
  counterfactuals that would change it.
- Goal: be useful and honest from day one, with zero training data required.

## Phase 2 — Locally calibrated statistical models

- Once FáGlè has a season or more of `farmer_actions` + `outcomes` data
  (the feedback loop captured in `/api/feedback`), fit simple statistical
  models (e.g. logistic regression, gradient-boosted trees on tabular
  features) per crop/region to calibrate the existing rule weights against
  real outcomes rather than hand-tuned constants.
- Still explainable: feature importances map directly to the same "why"
  factors farmers already see.
- Requires: enough labeled (action → outcome) pairs per crop/region to avoid
  overfitting, and agronomist sign-off on the training methodology.

## Phase 3 — Machine learning trained on historical local data

- Move to models trained on the accumulated local dataset (observations,
  sensor time-series, weather history, outcomes) rather than hand-picked
  features — e.g. gradient boosting over engineered time-series features, or
  small sequence models for multi-day soil-moisture projection.
- `MLDecisionEngine` implements the same interface as
  `RuleBasedDecisionEngine` and can be swapped in behind a feature flag,
  A/B-tested against the rule-based engine before fully replacing it.
- Explainability shifts from "the rule that fired" to model explainability
  techniques (e.g. SHAP-style feature attribution) surfaced through the same
  `factors` / `counterfactuals` shape the UI already renders.

## Phase 4 — Multimodal models (crop images + sensor/time-series data)

- Incorporate the crop photo timeline (`crop_photos`) as a real input, not
  just a farmer-facing record — e.g. a vision model estimating crop health,
  growth stage confirmation, or early disease/pest signals, fused with
  sensor and weather time-series.
- This is also where the "Visual AI analysis — Future module" label in the
  photo timeline UI (`components/photos/PhotoTimeline.jsx`) gets built out
  for real, replacing the current placeholder.
- Requires: a labeled image dataset (ideally with agronomist-confirmed
  diagnoses), which FáGlè's photo + observation pairing is specifically
  designed to help build over time.

## Phase 5 — Personalized models by crop / region / soil profile

- Once enough farms and seasons of data exist across multiple communes and
  crops, move from one general model to a family of models specialized by
  crop type, agro-ecological zone, and soil profile — with graceful
  fallback to the more general model (or the Phase 1 rules) wherever local
  data is still sparse.
- Continuous evaluation against held-out outcomes, with drift monitoring so
  a model doesn't silently degrade as climate patterns shift season to
  season.

## Cross-cutting requirement: human validation

At every phase, **agronomist/scientist validation is required before a
model's output is treated as more than a prototype signal** — this is why
`monthly_reports` and `report_reviews` exist as first-class parts of the
product, not an afterthought. A model is never allowed to mark its own
output as "validated"; only a human reviewer, through
`/scientist/reports/[id]`, can do that. Data quality control (completeness,
consistency, sensor calibration checks) is a prerequisite for every phase
past Phase 1 — garbage in, garbage out applies especially hard in
agriculture, where a bad recommendation has real consequences for a
farmer's season.
