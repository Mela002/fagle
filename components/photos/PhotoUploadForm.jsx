'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2 } from 'lucide-react';

const GROWTH_STAGES = [
  'Préparation du sol',
  'Pépinière',
  'Germination',
  'Repiquage',
  'Croissance végétative',
  'Tallage',
  'Floraison',
  'Fructification',
  'Remplissage du grain',
  'Maturité',
  'Récolte',
];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploadForm({ plotId, farmerId, cropName, currentStage }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!preview) {
      setError('Choisissez d’abord une photo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.target);
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plot_id: plotId,
          farmer_id: farmerId,
          dataUrl: preview,
          crop: cropName,
          growth_stage: form.get('growth_stage'),
          note: form.get('note'),
          problem: form.get('problem') || null,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <h3 className="mb-3 text-sm font-semibold text-emerald-950">Ajouter une photo</h3>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-900/20 bg-emerald-50 px-4 py-6 text-center">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="mb-2 h-28 w-28 rounded-lg object-cover" />
        ) : (
          <Camera size={24} className="mb-2 text-emerald-500" aria-hidden="true" />
        )}
        <span className="text-xs font-medium text-emerald-700">Touchez pour choisir une photo</span>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
      </label>

      <div className="mt-3 grid gap-2">
        <select name="growth_stage" defaultValue={currentStage} className="rounded-xl border border-emerald-900/15 px-3 py-2 text-sm">
          {GROWTH_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input name="note" placeholder="Note (optionnelle)" className="rounded-xl border border-emerald-900/15 px-3 py-2 text-sm" />
        <input name="problem" placeholder="Problème observé (optionnel)" className="rounded-xl border border-emerald-900/15 px-3 py-2 text-sm" />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-fagle-card py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        Enregistrer la photo
      </button>
    </form>
  );
}
