export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-6 py-10 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon size={22} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-emerald-950">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-emerald-900/60">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
