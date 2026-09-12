import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const showError = params?.error === 'missing_fields';

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft ring-1 ring-emerald-900/5">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Logo size={36} />
        </Link>
        <h1 className="text-center text-xl font-bold text-emerald-950">Créez votre compte agriculteur</h1>
        <p className="mt-1 text-center text-sm text-emerald-900/60">Moins d’une minute. Aucun capteur requis.</p>

        {showError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-center text-sm text-red-700">
            Merci de renseigner votre nom, votre région et votre commune.
          </p>
        )}

        <form action="/api/auth/register" method="post" className="mt-6 space-y-3">
          <input
            name="full_name"
            required
            placeholder="Nom complet"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="region"
              required
              placeholder="Région (ex. Zou)"
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <input
              name="commune"
              required
              placeholder="Commune (ex. Bohicon)"
              className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <input
            name="phone"
            placeholder="Téléphone (optionnel)"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <select
            name="preferred_language"
            defaultValue="fr"
            className="w-full rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
          <button type="submit" className="w-full rounded-xl bg-fagle-card py-2.5 text-sm font-semibold text-white shadow-soft">
            Créer mon compte et continuer
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-emerald-900/60">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
