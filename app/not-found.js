import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-emerald-50 px-4 text-center">
      <Logo size={40} showText={false} />
      <h1 className="text-2xl font-bold text-emerald-950">Page introuvable</h1>
      <p className="text-sm text-emerald-900/60">Cette parcelle n&apos;existe pas encore dans FáGlè.</p>
      <Link href="/dashboard" className="rounded-full bg-fagle-card px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
        Retour au tableau de bord
      </Link>
    </main>
  );
}
