import RiskBadge from '@/components/ui/RiskBadge';

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-950">Dernière recommandation</h3>
        <RiskBadge level={recommendation.risk_level} size="sm" />
      </div>
      <p className="mt-2 text-base font-semibold text-emerald-950">{recommendation.action_label}</p>
      <p className="mt-1 text-sm text-emerald-900/60">{recommendation.recommendation_text}</p>
      <p className="mt-3 text-[11px] text-emerald-900/40">
        {new Date(recommendation.created_at).toLocaleString('fr-FR')} &middot; Score de risque du prototype : {recommendation.risk_score}%
      </p>
    </div>
  );
}
