'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, RadioTower, Zap, Loader2 } from 'lucide-react';

export default function SensorCard({ reading, device, plotId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isActive = device?.status === 'active' && reading;
  const isSimulated = device?.device_id?.startsWith('DEMO-SIM-');

  async function simulateConnection() {
    if (!plotId) return;
    setLoading(true);
    try {
      await fetch('/api/sensors/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plotId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-950">Connexion du capteur</h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isActive ? <RadioTower size={11} /> : <Radio size={11} />}
          {isActive ? 'Connecté' : 'Non connecté'}
        </span>
      </div>
      {isActive ? (
        <>
          {isSimulated && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Données simulées pour la démonstration
            </span>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-emerald-900/70">
            <p>
              Humidité du sol : <span className="font-semibold text-emerald-950">{reading.soil_moisture}%</span>
            </p>
            <p>
              Pluie : <span className="font-semibold text-emerald-950">{reading.rainfall}mm</span>
            </p>
            <p>
              Température : <span className="font-semibold text-emerald-950">{reading.temperature}&deg;C</span>
            </p>
            <p>
              Humidité de l&rsquo;air : <span className="font-semibold text-emerald-950">{reading.humidity}%</span>
            </p>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-emerald-900/60">
          Aucun capteur physique connecté pour le moment. FáGlè s&rsquo;appuie sur la météo, le profil de la
          culture et vos observations de terrain. Connectez un capteur local pour améliorer la précision.
        </p>
      )}

      {plotId && (
        <button
          type="button"
          onClick={simulateConnection}
          disabled={loading}
          className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          {isActive ? 'Simuler une nouvelle mesure terrain' : 'Simuler la connexion d’un capteur'}
        </button>
      )}
    </div>
  );
}
