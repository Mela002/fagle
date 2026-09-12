import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { fetchInternalApi } from '@/lib/apiFetch';
import ReportDetail from '@/components/reports/ReportDetail';
import ScientistReviewPanel from '@/components/scientist/ScientistReviewPanel';

export default async function ScientistReportDetailPage({ params }) {
  const { id } = await params;
  let report;
  const user = await getCurrentUser();
  try {
    report = await fetchInternalApi(`/api/reports/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/scientist" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline">
        <ArrowLeft size={15} aria-hidden="true" /> Retour à l&rsquo;espace scientifique
      </Link>
      <ReportDetail report={report} />
      <ScientistReviewPanel reportId={report.id} reviewerId={user.id} reviewerName={user.full_name} />
    </div>
  );
}
