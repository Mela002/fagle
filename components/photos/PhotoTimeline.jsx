import { Sparkles } from 'lucide-react';

export default function PhotoTimeline({ photos = [], compact = false }) {
  if (!photos.length) return null;
  const list = compact ? photos.slice(-4) : photos;

  return (
    <div className={compact ? 'grid grid-cols-4 gap-2' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
      {list.map((photo, i) => (
        <figure
          key={photo.id}
          className={`overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-emerald-900/5 ${compact ? '' : ''}`}
        >
          <div className="relative aspect-square w-full bg-emerald-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`${photo.crop || 'Culture'} le ${photo.date}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {!compact && (
            <figcaption className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Semaine {i + 1}</p>
              <p className="mt-1 text-sm font-medium text-emerald-950">{photo.growth_stage}</p>
              <p className="text-xs text-emerald-900/50">{new Date(photo.date).toLocaleDateString('fr-FR')}</p>
              {photo.note && <p className="mt-1 text-sm text-emerald-900/70">{photo.note}</p>}
              {photo.problem && <p className="mt-1 text-xs font-medium text-amber-700">Problème signalé : {photo.problem}</p>}
            </figcaption>
          )}
        </figure>
      ))}
      {!compact && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/15 bg-white/50 p-4 text-center">
          <Sparkles size={18} className="mb-2 text-emerald-400" aria-hidden="true" />
          <p className="text-xs font-medium text-emerald-900/60">Analyse visuelle par IA</p>
          <p className="mt-1 text-[11px] text-emerald-900/40">Fonctionnalité future &mdash; la détection automatique de maladies ou de l&rsquo;état de santé de la culture n&rsquo;est pas encore implémentée.</p>
        </div>
      )}
    </div>
  );
}
