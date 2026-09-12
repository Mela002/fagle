'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileClock, Loader2 } from 'lucide-react';

export default function GenerateReportButton({ farmId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const month = new Date().toISOString().slice(0, 7);
    try {
      await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmId, month }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-full bg-fagle-card px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <FileClock size={15} />}
      Générer le rapport du mois
    </button>
  );
}
