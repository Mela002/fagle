'use client';

import { useState } from 'react';
import DecisionWorkbench from '@/components/decision/DecisionWorkbench';

export default function PlotPicker({ plots }) {
  const [plotId, setPlotId] = useState(plots[0]?.id);

  return (
    <div className="space-y-4">
      <select
        value={plotId}
        onChange={(e) => setPlotId(e.target.value)}
        className="w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 text-sm font-medium text-emerald-950"
      >
        {plots.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} &mdash; {p.growth_stage}
          </option>
        ))}
      </select>
      {plotId && <DecisionWorkbench key={plotId} plotId={plotId} />}
    </div>
  );
}
