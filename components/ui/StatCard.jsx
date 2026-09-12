export default function StatCard({ icon: Icon, label, value, hint, tone = 'default' }) {
  const toneClasses =
    tone === 'brand'
      ? 'bg-fagle-card text-white'
      : 'bg-white text-emerald-950 ring-1 ring-emerald-900/5';
  return (
    <div className={`rounded-2xl p-4 shadow-soft ${toneClasses}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium uppercase tracking-wide ${tone === 'brand' ? 'text-emerald-50/80' : 'text-emerald-700/70'}`}>
          {label}
        </span>
        {Icon && <Icon size={18} className={tone === 'brand' ? 'text-emerald-100' : 'text-emerald-600'} aria-hidden="true" />}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className={`mt-1 text-xs ${tone === 'brand' ? 'text-emerald-50/70' : 'text-emerald-900/50'}`}>{hint}</div>}
    </div>
  );
}
