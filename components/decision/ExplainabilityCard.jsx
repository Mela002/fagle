'use client';

import { useState } from 'react';
import { ChevronDown, TriangleAlert, CircleCheck, Circle } from 'lucide-react';

const ICONS = { risk: TriangleAlert, positive: CircleCheck, neutral: Circle };
const COLORS = { risk: 'text-red-600', positive: 'text-emerald-600', neutral: 'text-emerald-900/40' };

export default function ExplainabilityCard({ factors = [], counterfactuals = [], defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl bg-white shadow-soft ring-1 ring-emerald-900/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-semibold text-emerald-950">Pourquoi cette recommandation ?</span>
        <ChevronDown size={16} className={`text-emerald-900/40 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="border-t border-emerald-900/5 px-4 py-3">
          <ul className="space-y-2">
            {factors.map((f, i) => {
              const Icon = ICONS[f.type] || Circle;
              return (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-900/80">
                  <Icon size={15} className={`mt-0.5 shrink-0 ${COLORS[f.type] || COLORS.neutral}`} aria-hidden="true" />
                  {f.label}
                </li>
              );
            })}
          </ul>

          {counterfactuals.length > 0 && (
            <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Qu&rsquo;est-ce qui pourrait modifier cette recommandation ?
              </p>
              <ul className="mt-2 space-y-1">
                {counterfactuals.map((c, i) => (
                  <li key={i} className="text-sm text-emerald-900/70">
                    &bull; {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
