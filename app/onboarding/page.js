import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Logo from '@/components/ui/Logo';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-soft ring-1 ring-emerald-900/5">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Logo size={36} />
        </Link>
        <h1 className="text-center text-xl font-bold text-emerald-950">
          Bienvenue, {user?.full_name?.split(' ')[0] || 'agriculteur'}
        </h1>
        <p className="mt-1 text-center text-sm text-emerald-900/60">
          Parlez-nous de votre exploitation pour que FáGlè puisse commencer à vous accompagner.
        </p>

        <form action="/api/onboarding" method="post" className="mt-6 space-y-3">
          <input
            name="farm_name"
            required
            placeholder="Nom de l'exploitation"
            defaultValue="Mon exploitation"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="region"
              required
              placeholder="Région"
              defaultValue={user?.region}
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <input
              name="commune"
              required
              placeholder="Commune / ville"
              defaultValue={user?.commune}
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <input
            name="farm_size"
            type="number"
            step="0.1"
            min="0"
            placeholder="Superficie de l'exploitation (hectares)"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            name="main_crops"
            placeholder="Cultures principales (séparées par des virgules, ex. Maïs, Tomate)"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-emerald-950">Irrigation disponible ?</span>
            <div className="flex gap-4 text-sm text-emerald-900/70">
              <label className="flex items-center gap-1.5">
                <input type="radio" name="irrigation_available" value="yes" /> Oui
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name="irrigation_available" value="no" defaultChecked /> Non
              </label>
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-fagle-card py-2.5 text-sm font-semibold text-white shadow-soft">
            Terminer la configuration
          </button>
        </form>
      </div>
    </main>
  );
}
