'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { ACTION_TAKEN_LABELS, OUTCOME_LABELS, actionTakenLabel, outcomeLabel } from '@/lib/labels';

const ACTION_OPTIONS = Object.entries(ACTION_TAKEN_LABELS).map(([value, label]) => ({ value, label }));
const OUTCOME_OPTIONS = Object.entries(OUTCOME_LABELS).map(([value, label]) => ({ value, label }));

export default function FeedbackPanel({ plotId, farmerId, latestRecommendation, actions = [], outcomes = [] }) {
  const router = useRouter();
  const [submittingAction, setSubmittingAction] = useState(false);
  const [outcomeTargetId, setOutcomeTargetId] = useState(null);
  const [submittingOutcome, setSubmittingOutcome] = useState(false);

  async function submitAction(e) {
    e.preventDefault();
    setSubmittingAction(true);
    const form = new FormData(e.target);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'action',
          plot_id: plotId,
          farmer_id: farmerId,
          recommendation_id: latestRecommendation?.id,
          recommended_action: latestRecommendation?.action,
          actual_action: form.get('actual_action'),
          note: form.get('note'),
        }),
      });
      e.target.reset();
      router.refresh();
    } finally {
      setSubmittingAction(false);
    }
  }

  async function submitOutcome(e, actionId) {
    e.preventDefault();
    setSubmittingOutcome(true);
    const form = new FormData(e.target);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'outcome',
          plot_id: plotId,
          action_id: actionId,
          outcome_type: form.get('outcome_type'),
          notes: form.get('notes'),
        }),
      });
      setOutcomeTargetId(null);
      router.refresh();
    } finally {
      setSubmittingOutcome(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submitAction} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
        <h3 className="text-sm font-semibold text-emerald-950">Quelle décision avez-vous finalement prise ?</h3>
        {latestRecommendation && (
          <p className="mt-1 text-xs text-emerald-900/50">
            FáGlè recommandait : <span className="font-medium text-emerald-800">{latestRecommendation.action_label}</span>
          </p>
        )}
        <select name="actual_action" required className="mt-3 w-full rounded-xl border border-emerald-900/15 px-3 py-2 text-sm">
          <option value="">Sélectionnez votre décision&hellip;</option>
          {ACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input name="note" placeholder="Note (optionnelle)" className="mt-2 w-full rounded-xl border border-emerald-900/15 px-3 py-2 text-sm" />
        <button
          type="submit"
          disabled={submittingAction}
          className="mt-3 flex items-center gap-2 rounded-full bg-fagle-card px-4 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {submittingAction && <Loader2 size={14} className="animate-spin" />}
          Enregistrer ma décision
        </button>
      </form>

      {actions.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
          <h3 className="mb-3 text-sm font-semibold text-emerald-950">Décisions et résultats enregistrés</h3>
          <ul className="space-y-3">
            {actions.map((a) => {
              const existingOutcome = outcomes.find((o) => o.action_id === a.id);
              return (
              <li key={a.id} className="rounded-xl bg-emerald-50 px-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-950">{actionTakenLabel(a.actual_action)}</p>
                  <span className="text-[11px] text-emerald-900/40">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                {a.note && <p className="mt-1 text-xs text-emerald-900/60">{a.note}</p>}

                {existingOutcome ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 size={12} /> Résultat : {outcomeLabel(existingOutcome.outcome_type)}
                  </p>
                ) : outcomeTargetId === a.id ? (
                  <form onSubmit={(e) => submitOutcome(e, a.id)} className="mt-2 space-y-2">
                    <select name="outcome_type" required className="w-full rounded-lg border border-emerald-900/15 px-2 py-1.5 text-xs">
                      <option value="">Quel a été le résultat ?</option>
                      {OUTCOME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input name="notes" placeholder="Notes (optionnelles)" className="w-full rounded-lg border border-emerald-900/15 px-2 py-1.5 text-xs" />
                    <button
                      type="submit"
                      disabled={submittingOutcome}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <CheckCircle2 size={12} /> Enregistrer le résultat
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOutcomeTargetId(a.id)}
                    className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    + Indiquer le résultat
                  </button>
                )}
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
