import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  pending_review: 'bg-amber-100 text-amber-700',
  validated: 'bg-emerald-100 text-emerald-700',
  needs_revision: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  draft: 'Brouillon',
  pending_review: 'En attente de validation scientifique',
  validated: 'Validé',
  needs_revision: 'Révision demandée',
};

export default function ReportCard({ report, href }) {
  return (
    <Link
      href={href || `/reports/${report.id}`}
      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div>
        <p className="text-sm font-semibold text-emerald-950">{report.month}</p>
        <p className="mt-1 text-xs text-emerald-900/50">{report.sections?.farm_summary?.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[report.status]}`}>
          {STATUS_LABELS[report.status]}
        </span>
        <ArrowRight size={15} className="text-emerald-400" aria-hidden="true" />
      </div>
    </Link>
  );
}

export { STATUS_LABELS, STATUS_STYLES };
