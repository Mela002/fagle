import { getCurrentUser } from '@/lib/auth';
import { getFarms, getPlots } from '@/lib/db';
import ObservationForm from '@/components/observations/ObservationForm';
import EmptyState from '@/components/ui/EmptyState';

export default async function NewObservationPage({ searchParams }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const plots = (await Promise.all(farms.map((f) => getPlots(f.id)))).flat();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Observation de terrain</p>
        <h2 className="text-xl font-bold text-emerald-950">Ajouter une observation</h2>
        <p className="mt-1 text-sm text-emerald-900/60">
          Chaque observation que vous enregistrez enrichit le jeu de données agricoles local de FáGlè pour vos parcelles.
        </p>
        <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-900/60">
          Vos données vous appartiennent et restent privées par défaut. Elles ne sont jamais partagées pour la
          recherche sans votre consentement explicite.
        </p>
      </div>
      {plots.length ? (
        <ObservationForm plots={plots} farmerId={user.id} defaultPlotId={params?.plotId} />
      ) : (
        <EmptyState title="Aucune parcelle pour le moment" description="Ajoutez une parcelle avant d'enregistrer une observation." />
      )}
    </div>
  );
}
