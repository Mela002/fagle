'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, UserRound } from 'lucide-react';
import DemoBadge from '@/components/ui/DemoBadge';
import Logo from '@/components/ui/Logo';

const ROLES = [
  { role: 'farmer', label: 'Agriculteur (Koffi)' },
  { role: 'scientist', label: 'Scientifique (Dr Fassassi)' },
  { role: 'admin', label: 'Administrateur' },
];

const TITLE_MAP = [
  ['/dashboard', 'Tableau de bord'],
  ['/farms', 'Mes exploitations'],
  ['/plots', 'Détail de la parcelle'],
  ['/decision', 'Analyse FáGlè'],
  ['/photos', 'Photos de la culture'],
  ['/observations', 'Observation de terrain'],
  ['/data', 'Mes données FáGlè'],
  ['/reports', 'Rapports mensuels'],
  ['/scientist', 'Espace scientifique'],
  ['/admin', "Console d'administration"],
];

function titleFromPath(pathname) {
  const match = TITLE_MAP.find(([prefix]) => pathname?.startsWith(prefix));
  return match ? match[1] : 'FáGlè';
}

export default function Topbar({ title, user }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const resolvedTitle = title || titleFromPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-900/10 bg-emerald-50/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <Logo size={24} showText={false} className="md:hidden" />
        <h1 className="text-base font-semibold text-emerald-950 md:text-lg">{resolvedTitle}</h1>
        <DemoBadge />
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1.5 text-sm font-medium text-emerald-950 shadow-soft ring-1 ring-emerald-900/5"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <UserRound size={14} aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">{user?.full_name || 'Utilisateur démo'}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {open && (
          <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-emerald-900/10">
            <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-emerald-900/40">Changer de compte démo</p>
            {ROLES.map((r) => (
              <a
                key={r.role}
                href={`/api/auth/demo-login?role=${r.role}`}
                className="block rounded-lg px-2 py-2 text-sm text-emerald-950 hover:bg-emerald-50"
              >
                {r.label}
              </a>
            ))}
            <a href="/api/auth/logout" className="mt-1 block rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50">
              Se déconnecter
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
