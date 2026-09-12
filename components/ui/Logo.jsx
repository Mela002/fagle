/**
 * Official FáGlè logo mark, always paired with the brand name rendered as
 * real text (never baked into an image) so the visible brand string is
 * always exactly "FáGlè" — see public/brand/fagle-logo.png for the full
 * original artwork (kept unmodified) and public/brand/fagle-emblem.png for
 * the cropped emblem used in compact UI placements.
 */
export default function Logo({ size = 32, showText = true, textClassName = 'text-emerald-950', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/fagle-emblem.png"
        alt="FáGlè"
        width={size}
        height={size}
        className="shrink-0 rounded-full object-contain"
        style={{ width: size, height: size }}
      />
      {showText && <span className={`text-lg font-bold tracking-tight ${textClassName}`}>FáGlè</span>}
    </span>
  );
}
