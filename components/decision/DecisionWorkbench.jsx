'use client';

import { useState } from 'react';
import { Sparkles, SplitSquareVertical, Loader2, Radio, FlaskConical } from 'lucide-react';
import RiskGauge from '@/components/ui/RiskGauge';
import RiskBadge from '@/components/ui/RiskBadge';
import ExplainabilityCard from '@/components/decision/ExplainabilityCard';
import ScenarioComparison from '@/components/decision/ScenarioComparison';
import ErrorState from '@/components/ui/ErrorState';

function WeatherMetaBadge({ weatherMeta }) {
  if (!weatherMeta) return null;
  const isSimulated = weatherMeta.isSimulated !== false;
  const label = weatherMeta.sourceLabel || (isSimulated ? 'Données météo simulées' : 'Données météo en temps réel');
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isSimulated ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {isSimulated ? <FlaskConical size={10} aria-hidden="true" /> : <Radio size={10} aria-hidden="true" />}
      {label}
    </span>
  );
}

export default function DecisionWorkbench({ plotId }) {
  const [mode, setMode] = useState(null); // 'analyze' | 'compare'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState(null);

  async function runAnalyze() {
    setLoading(true);
    setError(null);
    setMode('analyze');
    try {
      const res = await fetch('/api/decision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plotId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setAnalysis(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runCompare() {
    setLoading(true);
    setError(null);
    setMode('compare');
    try {
      const res = await fetch('/api/decision/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plotId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setComparison(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runAnalyze}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-fagle-card px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {loading && mode === 'analyze' ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Analyser la parcelle
        </button>
        <button
          type="button"
          onClick={runCompare}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-soft ring-1 ring-emerald-900/10 disabled:opacity-60"
        >
          {loading && mode === 'compare' ? <Loader2 size={15} className="animate-spin" /> : <SplitSquareVertical size={15} />}
          Comparer les scénarios
        </button>
      </div>

      {error && <ErrorState message={error} />}

      {mode === 'analyze' && analysis && (
        <div className="grid gap-4 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-soft ring-1 ring-emerald-900/5">
            <RiskGauge score={analysis.score} level={analysis.level} />
            <p className="mt-3 text-sm font-semibold text-emerald-950">{analysis.actionLabel}</p>
            <RiskBadge level={analysis.level} size="sm" />
            <p className="mt-2 text-[11px] uppercase tracking-wide text-emerald-900/40">{analysis.scoreLabel}</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
              <div className="mb-2 flex justify-end">
                <WeatherMetaBadge weatherMeta={analysis.weatherMeta} />
              </div>
              <p className="text-sm text-emerald-900/80">{analysis.recommendation}</p>
            </div>
            <ExplainabilityCard factors={analysis.factors} counterfactuals={analysis.counterfactuals} />
          </div>
        </div>
      )}

      {mode === 'compare' && comparison && (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wide text-emerald-900/40">{comparison.scoreLabel} — un score plus bas est plus sûr</p>
            <WeatherMetaBadge weatherMeta={comparison.weatherMeta} />
          </div>
          <ScenarioComparison scenarios={comparison.scenarios} />
        </div>
      )}

      {!mode && !loading && (
        <p className="rounded-2xl border border-dashed border-emerald-900/15 bg-white/50 px-4 py-6 text-center text-sm text-emerald-900/50">
          Lancez une analyse pour voir le score de risque prototype de FáGlè, ou comparez les scénarios pour
          identifier l&rsquo;option la moins risquée.
        </p>
      )}
    </div>
  );
}
