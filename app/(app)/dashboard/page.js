import Link from 'next/link';
import { Sparkles, TriangleAlert } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getFarms, getPlots, getCrops } from '@/lib/db';
import { fetchInternalApi } from '@/lib/apiFetch';
import PlotCard from '@/components/farms/PlotCard';
import WeatherCard from '@/components/dashboard/WeatherCard';
import SensorCard from '@/components/dashboard/SensorCard';
import DataConfidenceCard from '@/components/dashboard/DataConfidenceCard';
import RecommendationCard from '@/components/decision/RecommendationCard';
import EmptyState from '@/components/ui/EmptyState';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const plotsByFarm = await Promise.all(farms.map((f) => getPlots(f.id)));
  const plots = plotsByFarm.flat();
  const crops = await getCrops();
  const primaryPlot = plots[0];

  let weather = null;
  let sensorReading = null;
  let sensorDevice = null;
  let confidence = null;
  let observations = [];
  let recommendations = [];

  if (primaryPlot) {
    const full = await fetchInternalApi(`/api/plots/${primaryPlot.id}/full`);
    weather = full.weather;
    sensorReading = full.sensorReading;
    sensorDevice = full.sensorDevice;
    confidence = full.confidence;
    observations = full.observations;
    recommendations = full.recommendations;
  }

  const cropName = (id) => crops.find((c) => c.id === id)?.name || 'Culture';
  const alerts = [];
  if (weather && weather.rainfall_48h >= 20) {
    alerts.push(`Fortes précipitations prévues dans les 48 heures sur ${primaryPlot.name} (${weather.rainfall_48h}mm).`);
  }
  observations.slice(0, 1).forEach((o) => {
    if (o.standing_water) alerts.push(`Eau stagnante signalée sur ${primaryPlot.name} le ${new Date(o.date).toLocaleDateString('fr-FR')}.`);
  });

  const firstName = user.full_name?.split(' ')[0] || user.full_name;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl bg-fagle-hero p-6 text-white md:p-8">
        <p className="text-sm text-emerald-100/80">Bonjour</p>
        <h2 className="text-2xl font-bold md:text-3xl">{firstName}</h2>
        <p className="mt-1 text-sm text-emerald-50/80">{user.commune}, {user.region} &middot; Bénin</p>
        {primaryPlot && (
          <Link
            href={`/plots/${primaryPlot.id}/decision`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-soft hover:bg-emerald-50"
          >
            <Sparkles size={15} aria-hidden="true" /> Analyser ma parcelle
          </Link>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              <TriangleAlert size={16} className="shrink-0" aria-hidden="true" />
              {a}
            </div>
          ))}
        </div>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-emerald-900/60">Mes parcelles</h3>
          <Link href="/farms" className="text-xs font-semibold text-emerald-700 hover:underline">
            Voir toutes mes exploitations
          </Link>
        </div>
        {plots.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plots.map((p) => (
              <PlotCard key={p.id} plot={p} cropName={cropName(p.crop_id)} />
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune parcelle pour le moment" description="Ajoutez une exploitation et une parcelle pour commencer à utiliser FáGlè." />
        )}
      </section>

      {primaryPlot && (
        <section className="grid gap-4 md:grid-cols-3">
          <WeatherCard weather={weather} />
          <SensorCard reading={sensorReading} device={sensorDevice} plotId={primaryPlot.id} />
          <DataConfidenceCard confidence={confidence} />
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {recommendations[0] ? (
          <RecommendationCard recommendation={recommendations[0]} />
        ) : (
          <EmptyState
            title="Aucune recommandation pour le moment"
            description="Analysez votre parcelle pour obtenir la première recommandation prototype de FáGlè."
          />
        )}

        <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-emerald-900/5">
          <h3 className="mb-2 text-sm font-semibold text-emerald-950">Observations récentes</h3>
          {observations.length ? (
            <ul className="space-y-2">
              {observations.slice(0, 3).map((o) => (
                <li key={o.id} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900/70">
                  <span className="font-medium text-emerald-950">{new Date(o.date).toLocaleDateString('fr-FR')}</span> &mdash; {o.notes || 'Aucune note'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-900/50">Aucune observation enregistrée pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
