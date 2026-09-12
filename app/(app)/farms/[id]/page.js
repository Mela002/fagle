import { notFound } from 'next/navigation';
import { MapPinned, Droplet } from 'lucide-react';
import { getFarmById, getPlots, getCrops } from '@/lib/db';
import { fetchInternalApi } from '@/lib/apiFetch';
import { actionTakenLabel, outcomeLabel } from '@/lib/labels';
import PlotCard from '@/components/farms/PlotCard';
import EmptyState from '@/components/ui/EmptyState';

export default async function FarmDetailPage({ params }) {
  const { id } = await params;
  const farm = await getFarmById(id);
  if (!farm) notFound();

  const [plots, crops] = await Promise.all([getPlots(farm.id), getCrops()]);
  const cropName = (id) => crops.find((c) => c.id === id)?.name || 'Culture';

  const [feedbackByPlot, sensorByPlot] = await Promise.all([
    Promise.all(plots.map((p) => fetchInternalApi(`/api/feedback?plotId=${p.id}`))),
    Promise.all(plots.map((p) => fetchInternalApi(`/api/sensors/latest?plotId=${p.id}`))),
  ]);

  const activity = plots
    .flatMap((p, i) => {
      const { actions, outcomes } = feedbackByPlot[i];
      return [...actions, ...outcomes].map((a) => ({ ...a, plotName: p.name }));
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const connectedCount = sensorByPlot.filter((s) => s.reading).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-emerald-900/5">
        <h2 className="text-xl font-bold text-emerald-950">{farm.name}</h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-emerald-900/50">
          <MapPinned size={14} aria-hidden="true" /> {farm.commune}, {farm.region}, {farm.country}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-900/70">
          <span>{farm.size_ha} ha</span>
          <span className="flex items-center gap-1">
            <Droplet size={14} aria-hidden="true" /> {farm.irrigation_available ? 'Irrigation disponible' : 'Pas d’irrigation'}
          </span>
          <span>
            {connectedCount}/{plots.length} parcelle(s) avec données de capteur
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(farm.main_crops || []).map((c) => (
            <span key={c} className="rounded-full bg-emerald-900/5 px-2.5 py-1 text-xs font-medium text-emerald-800">
              {c}
            </span>
          ))}
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-emerald-900/60">Parcelles</h3>
        {plots.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {plots.map((p) => (
              <PlotCard key={p.id} plot={p} cropName={cropName(p.crop_id)} />
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune parcelle sur cette exploitation pour le moment" />
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-emerald-900/60">Activité récente</h3>
        {activity.length ? (
          <ul className="space-y-2">
            {activity.map((a) => (
              <li key={a.id} className="rounded-xl bg-white px-4 py-2.5 text-sm text-emerald-900/70 shadow-soft ring-1 ring-emerald-900/5">
                <span className="font-medium text-emerald-950">{a.plotName}</span> &mdash;{' '}
                {a.actual_action ? actionTakenLabel(a.actual_action) : outcomeLabel(a.outcome_type)}
                <span className="ml-2 text-xs text-emerald-900/40">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-900/50">Aucune décision ou aucun résultat enregistré pour le moment.</p>
        )}
      </section>
    </div>
  );
}
