import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getFarms, getPlots } from '@/lib/db';

/** Mobile bottom-nav "Photos" entry point — jumps straight to the
 * farmer's primary plot photo timeline instead of duplicating a gallery. */
export default async function PhotosIndexPage() {
  const user = await getCurrentUser();
  const farms = await getFarms(user.id);
  const plots = (await Promise.all(farms.map((f) => getPlots(f.id)))).flat();

  if (plots[0]) redirect(`/plots/${plots[0].id}/photos`);
  redirect('/farms');
}
