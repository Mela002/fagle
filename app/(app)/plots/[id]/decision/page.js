import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPlotById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fetchInternalApi } from '@/lib/apiFetch';
import DecisionWorkbench from '@/components/decision/DecisionWorkbench';
import FeedbackPanel from '@/components/decision/FeedbackPanel';

export default async function PlotDecisionPage({ params }) {
  const { id } = await params;
  const plot = await getPlotById(id);
  if (!plot) notFound();

  const [user, feedback, recData] = await Promise.all([
    getCurrentUser(),
    fetchInternalApi(`/api/feedback?plotId=${id}`),
    fetchInternalApi(`/api/recommendations?plotId=${id}`),
  ]);
  const { actions, outcomes } = feedback;
  const { recommendations } = recData;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/plots/${plot.id}`} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline">
        <ArrowLeft size={15} aria-hidden="true" /> Retour à {plot.name}
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Analyse FáGlè</p>
        <h2 className="text-xl font-bold text-emerald-950">{plot.name}</h2>
        <p className="mt-1 text-sm text-emerald-900/60">
          FáGlè combine la météo, l&rsquo;état du sol, l&rsquo;accès à l&rsquo;irrigation et vos observations de
          terrain en un score de risque prototype transparent &mdash; jamais une prédiction scientifiquement
          validée.
        </p>
      </div>

      <DecisionWorkbench plotId={plot.id} />

      <FeedbackPanel
        plotId={plot.id}
        farmerId={user.id}
        latestRecommendation={recommendations[0]}
        actions={actions}
        outcomes={outcomes}
      />
    </div>
  );
}
