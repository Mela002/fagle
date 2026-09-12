import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Chargement…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-emerald-700">
      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
