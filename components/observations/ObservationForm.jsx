'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SOIL_STATE_LABELS, PLANT_CONDITION_LABELS } from '@/lib/labels';

const SOIL_CONDITIONS = Object.keys(SOIL_STATE_LABELS);
const PLANT_CONDITIONS = Object.keys(PLANT_CONDITION_LABELS);

export default function ObservationForm({ plots, farmerId, defaultPlotId }) {
  const router = useRouter();
  const [plotId, setPlotId] = useState(defaultPlotId || plots[0]?.id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.target);
    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plot_id: plotId,
          farmer_id: farmerId,
          crop_stage: form.get('crop_stage'),
          soil_condition: form.get('soil_condition'),
          plant_condition: form.get('plant_condition'),
          pest_observed: form.get('pest_observed') === 'on',
          standing_water: form.get('standing_water') === 'on',
          dryness: form.get('dryness') === 'on',
          leaf_discoloration: form.get('leaf_discoloration') === 'on',
          notes: form.get('notes'),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSuccess(true);
      setTimeout(() => router.push(`/plots/${plotId}`), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-emerald-900/5">
      <div>
        <label className="mb-1 block text-xs font-medium text-emerald-900/60">Parcelle</label>
        <select
          value={plotId}
          onChange={(e) => setPlotId(e.target.value)}
          className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm"
        >
          {plots.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-emerald-900/60">Stade de la culture</label>
          <input name="crop_stage" placeholder="ex. Germination" className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-emerald-900/60">État du sol</label>
          <select name="soil_condition" className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm">
            {SOIL_CONDITIONS.map((s) => (
              <option key={s} value={s}>
                {SOIL_STATE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-emerald-900/60">État de la culture</label>
        <select name="plant_condition" className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm">
          {PLANT_CONDITIONS.map((s) => (
            <option key={s} value={s}>
              {PLANT_CONDITION_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-emerald-900/70">
        <label className="flex items-center gap-2 rounded-xl border border-emerald-900/10 px-3 py-2">
          <input type="checkbox" name="pest_observed" /> Ravageurs observés ?
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-emerald-900/10 px-3 py-2">
          <input type="checkbox" name="standing_water" /> Eau stagnante ?
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-emerald-900/10 px-3 py-2">
          <input type="checkbox" name="dryness" /> Sécheresse ?
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-emerald-900/10 px-3 py-2">
          <input type="checkbox" name="leaf_discoloration" /> Décoloration des feuilles ?
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-emerald-900/60">Notes</label>
        <textarea name="notes" rows={3} className="w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm" />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs font-medium text-emerald-700">Observation enregistrée &mdash; redirection&hellip;</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-fagle-card py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        Enregistrer l&rsquo;observation
      </button>
    </form>
  );
}
