import { STATUS_LABELS, STATUS_STYLES } from '@/components/reports/ReportCard';
import Logo from '@/components/ui/Logo';

function Block({ title, children }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
      <h3 className="mb-2 text-sm font-semibold text-emerald-950">{title}</h3>
      {children}
    </div>
  );
}

function List({ items }) {
  if (!items?.length) return <p className="text-sm text-emerald-900/40">Aucun élément enregistré.</p>;
  return (
    <ul className="space-y-1 text-sm text-emerald-900/70">
      {items.map((item, i) => (
        <li key={i}>&bull; {item}</li>
      ))}
    </ul>
  );
}

export default function ReportDetail({ report }) {
  const s = report.sections || {};
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
        <div className="flex items-center gap-3">
          <Logo size={32} showText={false} />
          <div>
            <p className="text-xs text-emerald-900/50">{s.farm_summary?.name}</p>
            <h2 className="text-xl font-bold text-emerald-950">Rapport de {report.month}</h2>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[report.status]}`}>
          {STATUS_LABELS[report.status]}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Block title="Résumé de l'exploitation">
          <p className="text-sm text-emerald-900/70">
            {s.farm_summary?.commune}, {s.farm_summary?.region} &middot; {s.farm_summary?.plots} parcelle(s)
          </p>
        </Block>
        <Block title="Cultures suivies">
          <List items={s.crops_monitored} />
        </Block>
        <Block title="Synthèse météorologique">
          <p className="text-sm text-emerald-900/70">
            {s.weather_summary?.avg_rainfall_mm != null
              ? `Pluie moyenne ${s.weather_summary.avg_rainfall_mm}mm · Température moyenne ${s.weather_summary.avg_temp_c}°C`
              : s.weather_summary?.note || 'Aucune synthèse disponible.'}
          </p>
          {s.weather_summary?.source && (
            <p className="mt-1 text-[11px] font-medium text-emerald-900/40">{s.weather_summary.source}</p>
          )}
        </Block>
        <Block title="Données des capteurs">
          <p className="text-sm text-emerald-900/70">
            {s.sensor_summary?.devices_reporting ?? s.sensor_summary?.devices_active ?? 0} capteur(s) actif(s) &middot;{' '}
            {s.sensor_summary?.readings_count ?? 0} relevé(s)
          </p>
        </Block>
        <Block title="Observations de l'agriculteur">
          <p className="text-sm text-emerald-900/70">{s.observations_summary?.count ?? 0} observation(s) enregistrée(s)</p>
        </Block>
        <Block title="Recommandations FáGlè">
          <p className="text-sm text-emerald-900/70">{s.recommendations_count ?? 0} recommandation(s) générée(s)</p>
        </Block>
        <Block title="Principaux risques identifiés">
          <List items={s.main_risks} />
        </Block>
        <Block title="Décisions prises">
          <p className="text-sm text-emerald-900/70">
            A suivi la recommandation : {s.farmer_decisions?.followed_recommendation ?? 0} &middot; A choisi une autre
            option : {s.farmer_decisions?.chose_other ?? 0} &middot; Aucune action :{' '}
            {s.farmer_decisions?.no_action ?? 0}
          </p>
        </Block>
        <Block title="Résultats observés">
          <p className="text-sm text-emerald-900/70">
            Amélioration : {s.outcomes_summary?.improved ?? 0} &middot; Aucun changement : {s.outcomes_summary?.no_change ?? 0}{' '}
            &middot; Dégradation : {s.outcomes_summary?.worsened ?? 0}
          </p>
        </Block>
        <Block title="Suivi photographique">
          <p className="text-sm text-emerald-900/70">{s.photos_summary?.count ?? 0} photo(s) ajoutée(s) durant cette période</p>
        </Block>
        <Block title="Qualité et complétude des données">
          <p className="text-sm text-emerald-900/70">
            Niveau moyen de données disponibles : {Math.round((s.data_quality?.confidence_avg ?? 0) * 100)}%
          </p>
        </Block>
        <Block title="Principaux enseignements">
          <List items={s.key_insights} />
        </Block>
        <Block title="Limites">
          <List items={s.limitations} />
        </Block>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-emerald-900">Avis de l&rsquo;expert</h3>
        {report.reviews?.length ? (
          <ul className="space-y-3">
            {report.reviews.map((r) => (
              <li key={r.id} className="rounded-xl bg-white p-3 text-sm shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-950">{r.reviewer_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
                {r.comments && <p className="mt-1 text-emerald-900/70">{r.comments}</p>}
                <p className="mt-1 text-[11px] text-emerald-900/40">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-900/60">
            Pas encore examiné par un agronome. Ce rapport est généré automatiquement et ne doit pas être
            considéré comme scientifiquement validé tant qu&rsquo;il n&rsquo;a pas été examiné.
          </p>
        )}
      </div>
    </div>
  );
}
