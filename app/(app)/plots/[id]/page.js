import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Sparkles, ClipboardPlus, Camera, SplitSquareVertical, CalendarDays } from 'lucide-react';
import { fetchInternalApi } from '@/lib/apiFetch';
import { soilStateLabel, irrigationLabel } from '@/lib/labels';
import CropStageBadge from '@/components/ui/CropStageBadge';
import WeatherCard from '@/components/dashboard/WeatherCard';
import SensorCard from '@/components/dashboard/SensorCard';
import DataConfidenceCard from '@/components/dashboard/DataConfidenceCard';
import ObservationCard from '@/components/observations/ObservationCard';
import PhotoTimeline from '@/components/photos/PhotoTimeline';
import RecommendationCard from '@/components/decision/RecommendationCard';
import RiskHistoryChart from '@/components/charts/RiskHistoryChart';
import SensorHistoryChart from '@/components/charts/SensorHistoryChart';
import EmptyState from '@/components/ui/EmptyState';

export default async function PlotDetailPage({ params }) {
  const { id } = await params;
  let data;
  try {
    data = await fetchInternalApi(`/api/plots/${id}/full`);
  } catch {
    notFound();
  }
  const { plot, farm, crop, weather, sensorReading, sensorDevice, sensorHistory, confidence, observations, photos, recommendations } =
    data;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-emerald-900/5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-emerald-900/50">{farm?.name}</p>
            <h2 className="text-xl font-bold text-emerald-950">{plot.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-emerald-900/50">
              <MapPin size={13} aria-hidden="true" /> {plot.lat?.toFixed?.(4)}, {plot.lng?.toFixed?.(4)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-emerald-800">{crop?.name}</span>
            <CropStageBadge stage={plot.growth_stage} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-emerald-900/40">Variété</p>
            <p className="font-medium text-emerald-950">{plot.variety || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-900/40 flex items-center gap-1"><CalendarDays size={11} /> Semé le</p>
            <p className="font-medium text-emerald-950">{plot.planting_date ? new Date(plot.planting_date).toLocaleDateString('fr-FR') : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-900/40">État du sol</p>
            <p className="font-medium text-emerald-950">{soilStateLabel(plot.soil_state)}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-900/40">Irrigation</p>
            <p className="font-medium text-emerald-950">{irrigationLabel(plot.irrigation)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={`/plots/${plot.id}/decision`}
            className="flex items-center gap-2 rounded-full bg-fagle-card px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
          >
            <Sparkles size={15} aria-hidden="true" /> Analyser la parcelle
          </Link>
          <Link
            href={`/observations/new?plotId=${plot.id}`}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-soft ring-1 ring-emerald-900/10"
          >
            <ClipboardPlus size={15} aria-hidden="true" /> Ajouter une observation
          </Link>
          <Link
            href={`/plots/${plot.id}/photos`}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-soft ring-1 ring-emerald-900/10"
          >
            <Camera size={15} aria-hidden="true" /> Ajouter une photo
          </Link>
          <Link
            href={`/plots/${plot.id}/decision`}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-soft ring-1 ring-emerald-900/10"
          >
            <SplitSquareVertical size={15} aria-hidden="true" /> Comparer les scénarios
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <WeatherCard weather={weather} />
        <SensorCard reading={sensorReading} device={sensorDevice} plotId={plot.id} />
        <DataConfidenceCard confidence={confidence} />
      </section>

      {sensorHistory.length > 0 && <SensorHistoryChart readings={sensorHistory} />}
      {recommendations.length > 0 && <RiskHistoryChart recommendations={recommendations} />}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-emerald-900/60">Recommandations FáGlè</h3>
        </div>
        {recommendations.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.slice(0, 4).map((r) => (
              <RecommendationCard key={r.id} recommendation={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune recommandation pour le moment"
            description="Analysez cette parcelle pour générer la première recommandation prototype de FáGlè."
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-emerald-900/60">Observations de l&rsquo;agriculteur</h3>
          <Link href={`/observations/new?plotId=${plot.id}`} className="text-xs font-semibold text-emerald-700 hover:underline">
            Ajouter une observation
          </Link>
        </div>
        {observations.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {observations.map((o) => (
              <ObservationCard key={o.id} observation={o} />
            ))}
          </div>
        ) : (
          <EmptyState title="Aucune observation pour le moment" />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-emerald-900/60">Suivi visuel de la culture</h3>
          <Link href={`/plots/${plot.id}/photos`} className="text-xs font-semibold text-emerald-700 hover:underline">
            Tout voir
          </Link>
        </div>
        {photos.length ? <PhotoTimeline photos={photos} compact /> : <EmptyState title="Aucune photo pour le moment" />}
      </section>
    </div>
  );
}
