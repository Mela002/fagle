const LEVEL_COLORS = {
  low: '#2E521C',
  moderate: '#A57718',
  high: '#B3261E',
};

export default function RiskGauge({ score = 0, level = 'moderate', size = 140 }) {
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.moderate;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {Math.round(score)}%
        </span>
        <span className="text-[11px] uppercase tracking-wide text-emerald-900/60 font-medium">Score prototype</span>
      </div>
    </div>
  );
}
