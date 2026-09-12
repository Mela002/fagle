import { FileClock, MapPinned, Database, TriangleAlert } from 'lucide-react';
import { fetchInternalApi } from '@/lib/apiFetch';
import ReportCard from '@/components/reports/ReportCard';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';

export default async function ScientistDashboardPage() {
  const { farms, plots, reports, observations, dataGapPlots } = await fetchInternalApi('/api/scientist/overview');
  const pendingReports = reports.filter((r) => r.status === 'pending_review');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Espace scientifique</p>
        <h2 className="text-xl font-bold text-emerald-950">Données de terrain et validation des rapports</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileClock} label="En attente de validation" value={pendingReports.length} />
        <StatCard icon={MapPinned} label="Exploitations suivies" value={farms.length} />
        <StatCard icon={Database} label="Parcelles avec données" value={plots.length} />
        <StatCard icon={TriangleAlert} label="Données manquantes" value={dataGapPlots.length} hint="Parcelles à moins de 60 % de données disponibles" />
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-emerald-900/60">Rapports en attente de validation</h3>
        {pendingReports.length ? (
          <div className="space-y-3">
            {pendingReports.map((r) => (
              <ReportCard key={r.id} report={r} href={`/scientist/reports/${r.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun rapport en attente de validation" />
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-emerald-900/60">Observations récentes</h3>
        {observations.length ? (
          <ul className="space-y-2">
            {observations.slice(0, 6).map((o) => (
              <li key={o.id} className="rounded-xl bg-white px-4 py-2.5 text-sm text-emerald-900/70 shadow-soft ring-1 ring-emerald-900/5">
                <span className="font-medium text-emerald-950">{new Date(o.date).toLocaleDateString('fr-FR')}</span> &mdash; {o.notes || 'Aucune note'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-900/50">Aucune observation enregistrée pour le moment.</p>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-emerald-900/60">Données manquantes et anomalies</h3>
        {dataGapPlots.length ? (
          <ul className="space-y-2">
            {dataGapPlots.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
                <TriangleAlert size={14} aria-hidden="true" /> {p.name} a des sources de données incomplètes (aucun capteur connecté)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-900/50">Aucune donnée manquante significative détectée.</p>
        )}
      </section>
    </div>
  );
}
