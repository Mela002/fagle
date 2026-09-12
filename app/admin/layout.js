import { getCurrentUser } from '@/lib/auth';
import SimpleShell from '@/components/layout/SimpleShell';

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <SimpleShell title="Console d'administration" user={user}>
      {children}
    </SimpleShell>
  );
}
