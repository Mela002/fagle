'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleCheck, CircleX, MessageSquarePlus, Loader2 } from 'lucide-react';

export default function ScientistReviewPanel({ reportId, reviewerId, reviewerName }) {
  const router = useRouter();
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(null);

  async function submit(status) {
    setLoading(status);
    try {
      await fetch(`/api/reports/${reportId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_id: reviewerId, reviewer_name: reviewerName, status, comments }),
      });
      setComments('');
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <h3 className="mb-2 text-sm font-semibold text-emerald-950">Validation scientifique</h3>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Ajouter un commentaire scientifique (optionnel)"
        rows={3}
        className="w-full rounded-xl border border-emerald-900/15 px-3 py-2 text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => submit('validated')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === 'validated' ? <Loader2 size={14} className="animate-spin" /> : <CircleCheck size={14} />}
          Valider le rapport
        </button>
        <button
          type="button"
          onClick={() => submit('needs_revision')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === 'needs_revision' ? <Loader2 size={14} className="animate-spin" /> : <CircleX size={14} />}
          Demander une révision
        </button>
        <button
          type="button"
          onClick={() => submit('pending_review')}
          disabled={loading !== null || !comments}
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-60"
        >
          {loading === 'pending_review' ? <Loader2 size={14} className="animate-spin" /> : <MessageSquarePlus size={14} />}
          Ajouter un commentaire seulement
        </button>
      </div>
    </div>
  );
}
