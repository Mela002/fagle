import Link from 'next/link';
import { Tractor, FlaskConical, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import Logo from '@/components/ui/Logo';

const DEMO_ACCOUNTS = [
  { role: 'farmer', label: 'Agriculteur', sub: 'Koffi Adjovi — Bohicon', Icon: Tractor },
  { role: 'scientist', label: 'Scientifique', sub: 'Dr Nadia Fassassi', Icon: FlaskConical },
  { role: 'admin', label: 'Administrateur', sub: 'Équipe FáGlè', Icon: ShieldCheck },
];

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft ring-1 ring-emerald-900/5">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Logo size={36} />
        </Link>

        <h1 className="text-center text-xl font-bold text-emerald-950">Content de vous revoir</h1>
        <p className="mt-1 text-center text-sm text-emerald-900/60">Continuez avec un compte de démonstration pour découvrir FáGlè.</p>

        <div className="mt-6 space-y-2.5">
          {DEMO_ACCOUNTS.map(({ role, label, sub, Icon }) => (
            <a
              key={role}
              href={`/api/auth/demo-login?role=${role}`}
              className="flex items-center gap-3 rounded-xl border border-emerald-900/10 px-4 py-3 hover:bg-emerald-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-emerald-950">Continuer en tant que {label}</span>
                <span className="block text-xs text-emerald-900/50">{sub}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-emerald-900/10" />
          <span className="text-xs uppercase tracking-wide text-emerald-900/40">Ou avec un e-mail</span>
          <span className="h-px flex-1 bg-emerald-900/10" />
        </div>

        {supabaseReady ? (
          <form className="space-y-3">
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail"
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Mot de passe"
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button type="submit" className="w-full rounded-xl bg-fagle-card py-2.5 text-sm font-semibold text-white shadow-soft">
              Se connecter
            </button>
          </form>
        ) : (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs text-emerald-900/60">
            La connexion par e-mail et mot de passe nécessite la configuration de Supabase. Utilisez un compte de
            démonstration ci-dessus pour découvrir FáGlè dès maintenant.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-emerald-900/60">
          Nouveau sur FáGlè ?{' '}
          <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
            Créer un compte agriculteur
          </Link>
        </p>
      </div>
    </main>
  );
}
