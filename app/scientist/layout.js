import { getCurrentUser } from '@/lib/auth';
import SimpleShell from '@/components/layout/SimpleShell';

export default async function ScientistLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <SimpleShell title="Espace scientifique" user={user}>
      {children}
    </SimpleShell>
  );
}
