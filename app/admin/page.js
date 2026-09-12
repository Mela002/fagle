import { Users, MapPinned, Sprout, Radio, FileText, CircleCheck } from 'lucide-react';
import { fetchInternalApi } from '@/lib/apiFetch';
import { STATUS_LABELS } from '@/components/reports/ReportCard';
import StatCard from '@/components/ui/StatCard';

const DEVICE_STATUS_LABELS = {
  active: 'Actif',
  unregistered: 'Non enregistré',
  offline: 'Hors ligne',
};

export default async function AdminPage() {
  const { profiles, farms, plots, devices, reports } = await fetchInternalApi('/api/admin/overview');

  const farmers = profiles.filter((p) => p.role === 'farmer');
  const activeDevices = devices.filter((d) => d.status === 'active');
  const reportStatusCounts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Console d&rsquo;administration</p>
        <h2 className="text-xl font-bold text-emerald-950">Vue d&rsquo;ensemble de la plateforme</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Agriculteurs" value={farmers.length} tone="brand" />
        <StatCard icon={MapPinned} label="Exploitations" value={farms.length} />
        <StatCard icon={Sprout} label="Parcelles" value={plots.length} />
        <StatCard icon={Radio} label="Capteurs actifs" value={`${activeDevices.length}/${devices.length}`} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-950">
            <Users size={15} aria-hidden="true" /> Gestion des agriculteurs
          </h3>
          <ul className="space-y-2">
            {farmers.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-950">{f.full_name}</span>
                <span className="text-xs text-emerald-900/50">{f.commune}, {f.region}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-950">
            <Radio size={15} aria-hidden="true" /> État des capteurs et de l&rsquo;ingestion de données
          </h3>
          <ul className="space-y-2">
            {devices.map((d) => (
              <li key={d.id || d.device_id} className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-950">{d.device_id}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    d.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {DEVICE_STATUS_LABELS[d.status] || d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-950">
          <FileText size={15} aria-hidden="true" /> Vue d&rsquo;ensemble de la validation des rapports
        </h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {['draft', 'pending_review', 'validated', 'needs_revision'].map((status) => (
            <span key={status} className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
              <CircleCheck size={13} className="text-emerald-600" aria-hidden="true" />
              {STATUS_LABELS[status]} : <strong>{reportStatusCounts[status] || 0}</strong>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
