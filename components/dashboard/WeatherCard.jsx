import { CloudRain, Thermometer, Droplets, Radio, FlaskConical } from 'lucide-react';

export default function WeatherCard({ weather }) {
  if (!weather) return null;
  const isSimulated = weather.isSimulated !== false; // default to simulated if unknown
  const sourceLabel = weather.sourceLabel || (isSimulated ? 'Données météo simulées' : 'Données météo en temps réel');

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-950">Conditions météo du jour</h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isSimulated ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {isSimulated ? <FlaskConical size={10} aria-hidden="true" /> : <Radio size={10} aria-hidden="true" />}
          {sourceLabel}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div>
          <Thermometer size={16} className="mx-auto text-emerald-600" aria-hidden="true" />
          <p className="mt-1 text-lg font-bold text-emerald-950">{weather.temperature}°C</p>
          <p className="text-[11px] text-emerald-900/50">Température</p>
        </div>
        <div>
          <Droplets size={16} className="mx-auto text-emerald-600" aria-hidden="true" />
          <p className="mt-1 text-lg font-bold text-emerald-950">{weather.humidity}%</p>
          <p className="text-[11px] text-emerald-900/50">Humidité</p>
        </div>
        <div>
          <CloudRain size={16} className="mx-auto text-emerald-600" aria-hidden="true" />
          <p className="mt-1 text-lg font-bold text-emerald-950">{weather.rainfall_48h}mm</p>
          <p className="text-[11px] text-emerald-900/50">Pluie (48h)</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-emerald-900/40">Fournisseur : {weather.provider || weather.source}</p>
    </div>
  );
}
