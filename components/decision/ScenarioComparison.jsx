'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import RiskBadge from '@/components/ui/RiskBadge';

const LEVEL_BAR_COLOR = { low: 'bg-emerald-500', moderate: 'bg-amber-500', high: 'bg-red-500' };

export default function ScenarioComparison({ scenarios = [] }) {
  const [openAction, setOpenAction] = useState(null);
  const sorted = [...scenarios].sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-3">
      {sorted.map((s) => {
        const isOpen = openAction === s.action;
        return (
          <div
            key={s.action}
            className={`rounded-2xl p-4 ring-1 transition ${
              s.recommended ? 'bg-fagle-card text-white ring-emerald-900' : 'bg-white ring-emerald-900/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${s.recommended ? 'text-white' : 'text-emerald-950'}`}>{s.label}</p>
                {s.recommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    <Sparkles size={10} /> Recommandé
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!s.recommended && <RiskBadge level={s.level} size="sm" />}
                <span className={`text-lg font-bold ${s.recommended ? 'text-white' : 'text-emerald-950'}`}>{s.score}%</span>
              </div>
            </div>

            <div className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${s.recommended ? 'bg-white/20' : 'bg-emerald-900/5'}`}>
              <div
                className={`h-full rounded-full ${s.recommended ? 'bg-white' : LEVEL_BAR_COLOR[s.level]}`}
                style={{ width: `${s.score}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenAction(isOpen ? null : s.action)}
              className={`mt-3 flex items-center gap-1 text-xs font-semibold ${s.recommended ? 'text-emerald-100' : 'text-emerald-700'}`}
            >
              Pourquoi ? <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <ul className={`mt-2 space-y-1 text-sm ${s.recommended ? 'text-emerald-50/90' : 'text-emerald-900/70'}`}>
                {s.factors?.map((f, i) => (
                  <li key={i}>&bull; {f.label}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
