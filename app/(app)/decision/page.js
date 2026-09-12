import { getCurrentUser } from '@/lib/auth';
import { getFarms, getPlots } from '@/lib/db';
import PlotPicker from '@/components/decision/PlotPicker';
import EmptyState from '@/components/ui/EmptyState';

export default async function DecisionPage() {
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const plots = (await Promise.all(farms.map((f) => getPlots(f.id)))).flat();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Analyse FáGlè</p>
        <h2 className="text-xl font-bold text-emerald-950">Que dois-je faire maintenant ?</h2>
        <p className="mt-1 text-sm text-emerald-900/60">
          Choisissez une parcelle, puis analysez le risque actuel ou comparez côte à côte les scénarios de
          semis ou d&rsquo;irrigation.
        </p>
      </div>
      {plots.length ? (
        <PlotPicker plots={plots} />
      ) : (
        <EmptyState title="Aucune parcelle pour le moment" description="Ajoutez une parcelle pour lancer une analyse." />
      )}
    </div>
  );
}
