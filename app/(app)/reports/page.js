import { getCurrentUser } from '@/lib/auth';
import { getFarms } from '@/lib/db';
import { fetchInternalApi } from '@/lib/apiFetch';
import ReportCard from '@/components/reports/ReportCard';
import GenerateReportButton from '@/components/reports/GenerateReportButton';
import EmptyState from '@/components/ui/EmptyState';

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const reportsByFarm = await Promise.all(farms.map((f) => fetchInternalApi(`/api/reports?farmId=${f.id}`)));
  const reports = reportsByFarm.flat().sort((a, b) => (a.month < b.month ? 1 : -1));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Rapports mensuels</p>
          <h2 className="text-xl font-bold text-emerald-950">Rapports de l&rsquo;exploitation</h2>
        </div>
        {farms[0] && <GenerateReportButton farmId={farms[0].id} />}
      </div>

      {reports.length ? (
        <div className="space-y-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      ) : (
        <EmptyState title="Aucun rapport pour le moment" description="Générez le rapport du mois pour commencer." />
      )}
    </div>
  );
}
