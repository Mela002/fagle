import { FlaskConical } from 'lucide-react';

export default function DemoBadge() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-3 py-1 text-[11px] font-medium text-emerald-50 shadow-sm">
      <FlaskConical size={12} aria-hidden="true" />
      Mode démonstration
    </span>
  );
}
