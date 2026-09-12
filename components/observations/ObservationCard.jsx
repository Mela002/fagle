import { Bug, Droplets, Sun, Leaf } from 'lucide-react';
import { soilStateLabel, plantConditionLabel } from '@/lib/labels';

const FLAGS = [
  { key: 'pest_observed', label: 'Ravageurs', Icon: Bug },
  { key: 'standing_water', label: 'Eau stagnante', Icon: Droplets },
  { key: 'dryness', label: 'Sol sec', Icon: Sun },
  { key: 'leaf_discoloration', label: 'Décoloration des feuilles', Icon: Leaf },
];

export default function ObservationCard({ observation }) {
  const activeFlags = FLAGS.filter((f) => observation[f.key]);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-emerald-950">{new Date(observation.date).toLocaleDateString('fr-FR')}</p>
        <span className="text-xs text-emerald-900/50">{observation.crop_stage}</span>
      </div>
      <p className="mt-1 text-xs text-emerald-900/50">
        Sol : {soilStateLabel(observation.soil_condition)} &middot; État de la culture : {plantConditionLabel(observation.plant_condition)}
      </p>
      {observation.notes && <p className="mt-2 text-sm text-emerald-900/70">{observation.notes}</p>}
      {activeFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFlags.map(({ key, label, Icon }) => (
            <span key={key} className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
              <Icon size={11} aria-hidden="true" /> {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
