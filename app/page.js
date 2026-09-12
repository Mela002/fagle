import Link from 'next/link';
import {
  CloudRain,
  SplitSquareVertical,
  Camera,
  Radio,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CircleAlert,
} from 'lucide-react';
import DemoBadge from '@/components/ui/DemoBadge';
import Logo from '@/components/ui/Logo';

const HOW_IT_WORKS = [
  {
    Icon: ClipboardList,
    title: 'Renseignez votre parcelle',
    body: 'Localisation, culture, stade de développement, date de semis, état du sol, accès à l’irrigation — aucun matériel n’est nécessaire pour commencer.',
  },
  {
    Icon: CloudRain,
    title: 'FáGlè analyse les conditions',
    body: 'Prévisions météo, vos observations de terrain, photos de la culture et, si disponibles, mesures des capteurs se combinent en une seule vision de votre parcelle.',
  },
  {
    Icon: SplitSquareVertical,
    title: 'Comparez plusieurs scénarios',
    body: 'Semer aujourd’hui ou attendre ? Irriguer maintenant ou reporter ? FáGlè note chaque option et explique pourquoi l’une présente moins de risque.',
  },
  {
    Icon: Sparkles,
    title: 'Recevez une recommandation expliquée',
    body: 'Chaque score est accompagné des facteurs qui l’expliquent, et de ce qui pourrait le faire changer.',
  },
  {
    Icon: Camera,
    title: 'Suivez l’évolution de votre culture',
    body: 'Vos décisions, leurs résultats et vos photos construisent un historique local qui améliore progressivement les recommandations.',
  },
];

const DIFFERENTIATORS = [
  {
    title: 'Une intelligence décisionnelle, pas seulement une météo',
    body: 'FáGlè ne s’arrête pas à « pluie prévue demain ». La plateforme compare des actions concrètes entre elles et indique celle qui présente le moins de risque à l’instant présent.',
  },
  {
    title: 'Fonctionne avant l’arrivée des capteurs',
    body: 'Les capteurs améliorent la précision. Ils ne sont jamais nécessaires pour obtenir une recommandation. Un agriculteur muni d’un téléphone et de sa connaissance du terrain peut commencer dès aujourd’hui.',
  },
  {
    title: 'Explicable par conception',
    body: 'Chaque score est accompagné des facteurs qui l’expliquent, et de ce qui devrait changer pour que la recommandation évolue. Aucune boîte noire.',
  },
  {
    title: 'Conçu pour des données locales et durables',
    body: 'Chaque observation, photo, décision et résultat est enregistré — constituant le jeu de données dont les futurs modèles calibrés localement auront besoin.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-emerald-50">
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-emerald-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <Logo size={32} textClassName="text-white" />
            <DemoBadge />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-emerald-100/80 hover:text-white">
              Se connecter
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-soft hover:bg-emerald-50"
            >
              Découvrir FáGlè
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-fagle-hero px-4 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100">
            Conçu pour les agriculteurs du Bénin et d’ailleurs
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Des données du terrain à la <span className="text-emerald-200">meilleure décision</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-50/90">
            Comprendre le risque. Choisir la meilleure action. FáGlè combine les données météorologiques,
            le contexte de la culture, les observations de l’agriculteur et les données du terrain afin
            de comparer plusieurs décisions possibles avant qu’elles ne soient prises.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-soft hover:bg-emerald-50"
            >
              Analyser ma parcelle <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="#comment-ca-marche"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Découvrir FáGlè
            </Link>
          </div>
          <p className="mt-6 text-sm text-emerald-100/70">
            FáGlè fonctionne même avant l’installation des capteurs — ils améliorent sa précision, mais
            ne sont pas indispensables à son fonctionnement.
          </p>
        </div>
      </section>

      {/* DECISION INTELLIGENCE DEMO CARD */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-soft ring-1 ring-emerald-900/5 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Analyse FáGlè</span>
              <h2 className="mt-2 text-2xl font-bold text-emerald-950 md:text-3xl">
                Pas seulement « pluie demain ». <br /> Une vraie comparaison de vos options.
              </h2>
              <p className="mt-3 text-emerald-900/70">
                FáGlè répond à la question que se pose réellement un agriculteur : que faire maintenant, et
                pourquoi ? Chaque recommandation compare des alternatives concrètes et met en avant l’option
                présentant le moins de risque.
              </p>
              <p className="mt-3 text-sm text-emerald-900/50">
                Exemple de scénario — Parcelle Maïs A, Bohicon : fortes précipitations prévues dans les
                48 heures, sol déjà humide.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Semer aujourd’hui', score: 81, level: 'high' },
                { label: 'Attendre 2 jours', score: 44, level: 'moderate' },
                { label: 'Attendre 4 jours', score: 19, level: 'low', recommended: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 ring-1 ${
                    s.recommended ? 'bg-emerald-900 text-white ring-emerald-900' : 'bg-emerald-50 ring-emerald-900/10'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${s.recommended ? 'text-white' : 'text-emerald-950'}`}>{s.label}</p>
                    {s.recommended && <p className="text-xs text-emerald-200">Recommandé — risque prototype le plus faible</p>}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      s.level === 'high'
                        ? 'bg-red-100 text-red-700'
                        : s.level === 'moderate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LE PROBLÈME */}
      <section className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <CircleAlert size={18} aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-emerald-950 md:text-3xl">Le problème</h2>
          <p className="mt-3 text-emerald-900/70">
            Les décisions agricoles sont souvent prises avec des informations incomplètes ou insuffisamment
            localisées. Une prévision météo générale ne dit pas ce qu’il faut faire sur une parcelle précise,
            avec son propre sol, sa propre culture et son propre stade de développement. Ce manque de contexte
            local pèse directement sur les rendements et les revenus des agriculteurs.
          </p>
        </div>
      </section>

      {/* NOTRE APPROCHE */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Notre approche</span>
          <h2 className="mt-2 text-2xl font-bold text-emerald-950 md:text-3xl">
            Comparer les décisions, pas seulement afficher la météo
          </h2>
          <p className="mt-3 text-emerald-900/70">
            FáGlè ne se contente pas d’afficher la météo. La plateforme compare plusieurs décisions possibles
            et aide l’agriculteur à identifier l’option présentant le moins de risque.
          </p>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Comment ça fonctionne</span>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950">Cinq étapes, dès aujourd’hui</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map(({ Icon, title, body }, i) => (
              <div key={title} className="rounded-2xl bg-emerald-50/60 p-5 ring-1 ring-emerald-900/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fagle-card text-white">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">Étape {i + 1}</p>
                <h3 className="mt-1 text-sm font-semibold text-emerald-950">{title}</h3>
                <p className="mt-2 text-sm text-emerald-900/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Ce qui distingue FáGlè</span>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="rounded-2xl border border-emerald-900/10 bg-white p-6">
                <h3 className="text-base font-semibold text-emerald-950">{d.title}</h3>
                <p className="mt-2 text-sm text-emerald-900/60">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SANS / AVEC CAPTEURS */}
      <section className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Deux façons d’utiliser FáGlè</span>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950">FáGlè Essentiel et FáGlè Connecté</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-emerald-50 p-8 ring-1 ring-emerald-900/10">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">FáGlè Essentiel — sans capteurs</span>
              <h3 className="mt-2 text-xl font-bold text-emerald-950">Aucun capteur requis</h3>
              <ul className="mt-4 space-y-2 text-sm text-emerald-900/70">
                <li>✓ Localisation, culture et stade de développement</li>
                <li>✓ Prévisions météo et état du sol déclaré</li>
                <li>✓ Observations de terrain et photos de la culture</li>
                <li>✓ Analyse FáGlè complète et comparaison de scénarios</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-fagle-card p-8 text-white ring-1 ring-emerald-900/10">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-100">FáGlè Connecté — avec capteurs</span>
              <h3 className="mt-2 text-xl font-bold">Une précision locale renforcée</h3>
              <ul className="mt-4 space-y-2 text-sm text-emerald-50/90">
                <li>✓ Tout ce qui est inclus dans FáGlè Essentiel</li>
                <li>✓ Mesures en direct d’humidité du sol, de température et de pluie</li>
                <li>✓ Un niveau de données disponibles plus élevé</li>
                <li>✓ Des recommandations de plus en plus précises</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DONNÉES LOCALES */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Une boucle vertueuse</span>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950">Des données locales pour de meilleures décisions</h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-emerald-800">
            {['Observations', 'Décisions', 'Photos', 'Résultats', 'Données locales', 'Modèles améliorés'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-4 py-2">{step}</span>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-emerald-400" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Radio size={18} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-emerald-950">Pour les agriculteurs</h3>
            <p className="mt-2 text-sm text-emerald-900/60">
              Moins d’incertitude avant de semer ou d’irriguer. Un « pourquoi » clair derrière chaque
              recommandation, ainsi qu’un historique photo et d’observations qui s’enrichit au fil du temps.
            </p>
          </div>
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-emerald-950">Pour la recherche agricole</h3>
            <p className="mt-2 text-sm text-emerald-900/60">
              Avec le consentement de l’agriculteur, des données de terrain anonymisées peuvent alimenter une
              recherche agricole pertinente localement — encadrée, examinée, et jamais partagée silencieusement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fagle-hero px-4 py-20 text-center text-white md:px-8">
        <Camera size={28} className="mx-auto mb-4 text-emerald-200" aria-hidden="true" />
        <h2 className="text-3xl font-bold md:text-4xl">Prêt à découvrir votre meilleure décision ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-emerald-50/80">
          Essayez FáGlè avec un compte agriculteur de démonstration — sans inscription, sans capteur, sans attente.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-emerald-900 shadow-soft hover:bg-emerald-50"
        >
          Analyser ma parcelle <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <footer className="bg-emerald-950 px-4 py-10 text-center text-emerald-100/60 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3">
          <Logo size={28} textClassName="text-white" />
          <p className="text-xs">
            FáGlè — démonstration de hackathon. Toutes les données de démonstration sont fictives.
          </p>
        </div>
      </footer>
    </main>
  );
}
