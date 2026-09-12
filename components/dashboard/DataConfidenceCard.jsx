import { Check, X } from 'lucide-react';

export default function DataConfidenceCard({ confidence }) {
  if (!confidence) return null;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-950">Niveau de données disponibles</h3>
        <span className="text-xl font-bold text-emerald-700">{confidence.percent}%</span>
      </div>
      <p className="text-xs font-medium text-emerald-900/60">{confidence.label}</p>
      <ul className="mt-3 space-y-1.5">
        {confidence.sources.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm text-emerald-900/70">
            {s.available ? (
              <Check size={14} className="text-emerald-600" aria-hidden="true" />
            ) : (
              <X size={14} className="text-red-400" aria-hidden="true" />
            )}
            {s.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-900/60">
        Il s&rsquo;agit d&rsquo;un indicateur de complétude des données au niveau de l&rsquo;application, et non
        d&rsquo;une probabilité scientifiquement validée. Connectez des capteurs terrain pour améliorer la
        précision de l&rsquo;analyse.
      </p>
    </div>
  );
}
