import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchInternalApi } from '@/lib/apiFetch';
import ReportDetail from '@/components/reports/ReportDetail';

export default async function ReportDetailPage({ params }) {
  const { id } = await params;
  let report;
  try {
    report = await fetchInternalApi(`/api/reports/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/reports" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline">
        <ArrowLeft size={15} aria-hidden="true" /> Retour aux rapports
      </Link>
      <ReportDetail report={report} />
    </div>
  );
}
