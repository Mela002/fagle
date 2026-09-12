'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, MapPinned, SplitSquareVertical, Camera, Menu, X, Database, FileText, LogOut } from 'lucide-react';

const ITEMS = [
  { href: '/dashboard', label: 'Accueil', Icon: Home },
  { href: '/farms', label: 'Parcelles', Icon: MapPinned },
  { href: '/decision', label: 'Analyser', Icon: SplitSquareVertical, highlight: true },
  { href: '/photos', label: 'Photos', Icon: Camera },
];

export default function MobileNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute bottom-16 left-3 right-3 rounded-2xl bg-white p-2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/data" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-50">
              <Database size={17} /> Mes données
            </Link>
            <Link href="/reports" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-emerald-950 hover:bg-emerald-50">
              <FileText size={17} /> Rapports
            </Link>
            <a href="/api/auth/logout" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut size={17} /> Se déconnecter
            </a>
          </div>
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-emerald-900/10 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
        {ITEMS.map(({ href, label, Icon, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium ${
              highlight ? 'text-white' : 'text-emerald-900/60'
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${highlight ? 'bg-fagle-card shadow-soft' : ''}`}
            >
              <Icon size={highlight ? 19 : 20} aria-hidden="true" className={highlight ? 'text-white' : ''} />
            </span>
            <span className={highlight ? 'text-emerald-800' : ''}>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium text-emerald-900/60"
          aria-label="Plus"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full">
            {moreOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
          Plus
        </button>
      </nav>
    </>
  );
}
