'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPinned, SplitSquareVertical, Database, FileText, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { href: '/farms', label: 'Mes exploitations', Icon: MapPinned },
  { href: '/decision', label: 'Analyser', Icon: SplitSquareVertical },
  { href: '/data', label: 'Mes données', Icon: Database },
  { href: '/reports', label: 'Rapports', Icon: FileText },
];

export default function AppSidebar() {
  const activePath = usePathname();
  return (
    <aside className="hidden w-60 flex-col border-r border-emerald-900/10 bg-white/70 px-4 py-6 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <Logo size={30} />
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = activePath === href || activePath?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-fagle-card text-white shadow-soft' : 'text-emerald-900/70 hover:bg-emerald-50'
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <a
        href="/api/auth/logout"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-900/50 hover:bg-emerald-50 hover:text-emerald-900"
      >
        <LogOut size={17} aria-hidden="true" />
        Se déconnecter
      </a>
    </aside>
  );
}
