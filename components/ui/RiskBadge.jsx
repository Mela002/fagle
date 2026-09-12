import { TriangleAlert, CircleCheck, CircleMinus } from 'lucide-react';

const LEVEL_CONFIG = {
  low: { label: 'FAIBLE', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200', Icon: CircleCheck },
  moderate: { label: 'MODÉRÉ', className: 'bg-amber-50 text-amber-700 ring-amber-200', Icon: CircleMinus },
  high: { label: 'ÉLEVÉ', className: 'bg-red-50 text-red-700 ring-red-200', Icon: TriangleAlert },
};

export default function RiskBadge({ level = 'moderate', size = 'md' }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.moderate;
  const { Icon } = config;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-3 py-1 gap-1.5';
  return (
    <span
      className={`inline-flex items-center rounded-full ring-1 font-semibold ${config.className} ${sizeClasses}`}
      role="status"
      aria-label={`Niveau de risque : ${config.label}`}
    >
      <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />
      {config.label}
    </span>
  );
}
