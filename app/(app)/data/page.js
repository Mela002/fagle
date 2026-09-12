import { Download, Radio, CloudRain, ClipboardList, Camera, Sparkles, CircleCheck } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { fetchInternalApi } from '@/lib/apiFetch';
import { actionTakenLabel } from '@/lib/labels';
import EmptyState from '@/components/ui/EmptyState';

function Section({ Icon, title, count, children }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Icon size={15} aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold text-emerald-950">{title}</h3>
        </div>
        <span className="text-xs font-medium text-emerald-900/40">{count} enregistrement(s)</span>
      </div>
      {children}
    </div>
  );
}

export default async function DataHistoryPage() {
  const user = await getCurrentUser();
  const data = await fetchInternalApi('/api/export');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Mes données FáGlè</p>
          <h2 className="text-xl font-bold text-emerald-950">Tout ce que FáGlè a enregistré pour vous</h2>
        </div>
        <a
          href="/api/export"
          className="flex items-center gap-2 rounded-full bg-fagle-card px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
        >
          <Download size={15} aria-hidden="true" /> Exporter mes données
        </a>
      </div>

      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-900/60">
        Vos données sont privées par défaut. Elles ne sont jamais partagées pour la recherche sans votre
        consentement explicite (voir le paramètre de consentement à la recherche de votre profil).
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section Icon={Radio} title="Relevés de capteurs" count={data.sensorReadings.length}>
          {data.sensorReadings.length ? (
            <ul className="space-y-1 text-xs text-emerald-900/60">
              {data.sensorReadings.slice(-3).map((r) => (
                <li key={r.id}>
                  {new Date(r.timestamp).toLocaleString('fr-FR')} &mdash; humidité {r.soil_moisture}%, pluie {r.rainfall}mm
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-900/40">Aucune donnée de capteur pour le moment.</p>
          )}
        </Section>

        <Section Icon={CloudRain} title="Relevés météo" count={data.plots.length}>
          <p className="text-xs text-emerald-900/40">Actualisés automatiquement à chaque consultation d&rsquo;une parcelle.</p>
        </Section>

        <Section Icon={ClipboardList} title="Observations de l'agriculteur" count={data.observations.length}>
          {data.observations.length ? (
            <ul className="space-y-1 text-xs text-emerald-900/60">
              {data.observations.slice(0, 3).map((o) => (
                <li key={o.id}>
                  {new Date(o.date).toLocaleDateString('fr-FR')} &mdash; {o.notes || 'Aucune note'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-900/40">Aucune observation pour le moment.</p>
          )}
        </Section>

        <Section Icon={Sparkles} title="Recommandations" count={data.recommendations.length}>
          {data.recommendations.length ? (
            <ul className="space-y-1 text-xs text-emerald-900/60">
              {data.recommendations.slice(0, 3).map((r) => (
                <li key={r.id}>
                  {r.action_label} &mdash; {r.risk_score}% ({r.risk_level})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-900/40">Aucune recommandation pour le moment.</p>
          )}
        </Section>

        <Section Icon={Camera} title="Photos de la culture" count={data.photos.length}>
          <p className="text-xs text-emerald-900/40">Consultez l&rsquo;historique depuis la page photos de chaque parcelle.</p>
        </Section>

        <Section Icon={CircleCheck} title="Décisions et résultats" count={data.actions.length + data.outcomes.length}>
          {data.actions.length ? (
            <ul className="space-y-1 text-xs text-emerald-900/60">
              {data.actions.slice(0, 3).map((a) => (
                <li key={a.id}>{actionTakenLabel(a.actual_action)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-900/40">Aucune décision enregistrée pour le moment.</p>
          )}
        </Section>
      </div>

      {!data.plots.length && (
        <EmptyState title="Aucune donnée pour le moment" description="Ajoutez une exploitation et une parcelle pour commencer à construire votre historique." />
      )}
    </div>
  );
}
