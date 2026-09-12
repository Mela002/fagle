import Link from 'next/link';
import DemoBadge from '@/components/ui/DemoBadge';
import Logo from '@/components/ui/Logo';

const ROLE_SWITCHES = [
  { role: 'farmer', label: 'Agriculteur' },
  { role: 'scientist', label: 'Scientifique' },
  { role: 'admin', label: 'Administrateur' },
];

export default function SimpleShell({ title, user, children }) {
  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="hidden text-sm font-medium text-emerald-900/40 sm:inline">/ {title}</span>
            <DemoBadge />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-emerald-900/60 sm:inline">{user?.full_name}</span>
            <div className="flex gap-1">
              {ROLE_SWITCHES.map((r) => (
                <a
                  key={r.role}
                  href={`/api/auth/demo-login?role=${r.role}`}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
