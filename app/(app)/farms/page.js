import Link from 'next/link';
import { MapPinned, ArrowRight, Sprout, Droplet } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getFarms, getPlots } from '@/lib/db';
import EmptyState from '@/components/ui/EmptyState';

export default async function FarmsPage() {
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const plotCounts = await Promise.all(farms.map((f) => getPlots(f.id)));

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-emerald-950">Mes exploitations</h2>
      </div>
      {farms.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {farms.map((farm, i) => (
            <Link
              key={farm.id}
              href={`/farms/${farm.id}`}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-emerald-900/5 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-emerald-950">{farm.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-900/50">
                    <MapPinned size={12} aria-hidden="true" /> {farm.commune}, {farm.region}
                  </p>
                </div>
                <ArrowRight size={16} className="text-emerald-400" aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-emerald-900/60">
                <span className="flex items-center gap-1">
                  <Sprout size={13} aria-hidden="true" /> {plotCounts[i].length} parcelle{plotCounts[i].length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Droplet size={13} aria-hidden="true" /> {farm.irrigation_available ? 'Irrigation disponible' : 'Pas d’irrigation'}
                </span>
                <span>{farm.size_ha} ha</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(farm.main_crops || []).map((c) => (
                  <span key={c} className="rounded-full bg-emerald-900/5 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    {c}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucune exploitation pour le moment" description="Terminez la configuration pour créer votre première exploitation." />
      )}
    </div>
  );
}
