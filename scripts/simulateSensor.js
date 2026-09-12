#!/usr/bin/env node
/**
 * FáGlè sensor simulator.
 *
 * Sends realistic fake soil/weather readings to POST /api/sensors/ingest so
 * the "sensor connects and data confidence improves" part of the demo can
 * be shown without any physical hardware.
 *
 * Usage:
 *   node scripts/simulateSensor.js
 *   node scripts/simulateSensor.js --plot=plot-001 --device=SENSOR-BJ-001 --once
 *   node scripts/simulateSensor.js --url=http://localhost:3000 --interval=5000
 *
 * Reads SENSOR_INGEST_API_KEY from the environment (matches .env.local).
 */

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value ?? true;
  return acc;
}, {});

const BASE_URL = args.url || process.env.AGROMIND_URL || 'http://localhost:3000';
const PLOT_ID = args.plot || 'plot-001';
const DEVICE_ID = args.device || 'SENSOR-BJ-001';
const INTERVAL_MS = Number(args.interval) || 8000;
const API_KEY = process.env.SENSOR_INGEST_API_KEY || 'change-me-dev-key';
const ONCE = Boolean(args.once);

function randomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

function buildReading() {
  return {
    deviceId: DEVICE_ID,
    plotId: PLOT_ID,
    timestamp: new Date().toISOString(),
    soilMoisture: randomBetween(55, 78), // demo: simulates a humid Bohicon plot after rain
    temperature: randomBetween(26, 31),
    humidity: randomBetween(70, 88),
    rainfall: randomBetween(0, 6),
  };
}

async function sendReading() {
  const reading = buildReading();
  try {
    const res = await fetch(`${BASE_URL}/api/sensors/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(reading),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error(`[simulateSensor] ${res.status} error:`, json.error);
    } else {
      console.log(`[simulateSensor] sent reading for ${reading.plotId}:`, reading);
    }
  } catch (err) {
    console.error('[simulateSensor] request failed:', err.message);
  }
}

async function main() {
  console.log(`FáGlè sensor simulator -> ${BASE_URL}/api/sensors/ingest`);
  console.log(`device=${DEVICE_ID} plot=${PLOT_ID} interval=${INTERVAL_MS}ms once=${ONCE}`);
  await sendReading();
  if (ONCE) return;
  setInterval(sendReading, INTERVAL_MS);
}

main();
