import AppSidebar from '@/components/layout/AppSidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNavigation from '@/components/layout/MobileNavigation';

export default function AppShell({ user, children }) {
  return (
    <div className="flex min-h-screen bg-emerald-50">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8">{children}</main>
      </div>
      <MobileNavigation />
    </div>
  );
}
