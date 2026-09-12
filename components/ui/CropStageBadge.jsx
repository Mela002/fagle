export default function CropStageBadge({ stage }) {
  if (!stage) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-900/5 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-900/10">
      {stage}
    </span>
  );
}
