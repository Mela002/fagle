'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SensorHistoryChart({ readings = [] }) {
  if (!readings.length) return null;
  const data = readings.map((r) => ({
    time: new Date(r.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    soilMoisture: r.soil_moisture,
    temperature: r.temperature,
    rainfall: r.rainfall,
  }));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <h3 className="mb-2 text-sm font-semibold text-emerald-950">Historique des capteurs</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#05966920" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#05966980" />
            <YAxis tick={{ fontSize: 11 }} stroke="#05966980" />
            <Tooltip />
            <Line type="monotone" dataKey="soilMoisture" name="Humidité du sol (%)" stroke="#2E521C" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="temperature" name="Température (°C)" stroke="#A57718" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="rainfall" name="Pluie (mm)" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
