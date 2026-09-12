import { getPlotById, getWeatherForPlot, getLatestSensorReading, getObservations, getCrops } from '@/lib/db';

/** Assembles the DecisionEngine input context for a plot from everything
 * FáGlè currently knows about it: weather, the latest sensor reading (if
 * any), and the most recent farmer observation (if any). */
export async function buildContextForPlot(plotId) {
  const plot = await getPlotById(plotId);
  if (!plot) return null;

  const [weather, sensorReading, observations, crops] = await Promise.all([
    getWeatherForPlot(plotId),
    getLatestSensorReading(plotId),
    getObservations(plotId),
    getCrops(),
  ]);

  const crop = crops.find((c) => c.id === plot.crop_id);
  const latestObservation = observations[0] || null;

  return {
    plot,
    crop,
    weatherMeta: {
      isSimulated: weather.isSimulated !== false,
      sourceLabel: weather.sourceLabel,
      provider: weather.provider,
    },
    context: {
      crop: crop?.name || 'Culture',
      growthStage: plot.growth_stage,
      plantingDate: plot.planting_date,
      soilState: plot.soil_state,
      irrigation: plot.irrigation,
      weather,
      sensor: sensorReading
        ? {
            soilMoisture: sensorReading.soil_moisture,
            temperature: sensorReading.temperature,
            humidity: sensorReading.humidity,
            rainfall: sensorReading.rainfall,
          }
        : null,
      observations: latestObservation
        ? {
            visibleStress: latestObservation.plant_condition === 'stressed',
            pests: latestObservation.pest_observed,
            yellowLeaves: latestObservation.leaf_discoloration,
            standingWater: latestObservation.standing_water,
            drySoil: latestObservation.dryness,
          }
        : {},
    },
  };
}
