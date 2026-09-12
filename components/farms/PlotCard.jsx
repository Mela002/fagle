import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import CropStageBadge from '@/components/ui/CropStageBadge';
import { soilStateLabel, irrigationLabel } from '@/lib/labels';

export default function PlotCard({ plot, cropName }) {
  return (
    <Link
      href={`/plots/${plot.id}`}
      className="flex flex-col rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-emerald-950">{plot.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-900/50">
            <MapPin size={11} aria-hidden="true" /> {plot.lat?.toFixed?.(2)}, {plot.lng?.toFixed?.(2)}
          </p>
        </div>
        <ArrowRight size={16} className="text-emerald-400" aria-hidden="true" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-900/5 px-2.5 py-1 text-xs font-medium text-emerald-800">{cropName}</span>
        <CropStageBadge stage={plot.growth_stage} />
      </div>
      <p className="mt-3 text-xs text-emerald-900/50">
        Sol : <span className="font-medium text-emerald-900/70">{soilStateLabel(plot.soil_state)}</span> &middot; Irrigation :{' '}
        <span className="font-medium text-emerald-900/70">{irrigationLabel(plot.irrigation)}</span>
      </p>
    </Link>
  );
}
