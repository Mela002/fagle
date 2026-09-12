import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPlotById, getCrops } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fetchInternalApi } from '@/lib/apiFetch';
import PhotoUploadForm from '@/components/photos/PhotoUploadForm';
import PhotoTimeline from '@/components/photos/PhotoTimeline';
import EmptyState from '@/components/ui/EmptyState';

export default async function PlotPhotosPage({ params }) {
  const { id } = await params;
  const plot = await getPlotById(id);
  if (!plot) notFound();

  const [user, crops, photos] = await Promise.all([getCurrentUser(), getCrops(), fetchInternalApi(`/api/photos?plotId=${id}`)]);
  const crop = crops.find((c) => c.id === plot.crop_id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href={`/plots/${plot.id}`} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline">
        <ArrowLeft size={15} aria-hidden="true" /> Retour à {plot.name}
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Suivi visuel de la culture</p>
        <h2 className="text-xl font-bold text-emerald-950">Photos de {plot.name}</h2>
      </div>

      <PhotoUploadForm plotId={plot.id} farmerId={user.id} cropName={crop?.name} currentStage={plot.growth_stage} />

      {photos.length ? (
        <PhotoTimeline photos={photos} />
      ) : (
        <EmptyState title="Aucune photo pour le moment" description="Ajoutez votre première photo de la culture ci-dessus." />
      )}
    </div>
  );
}
