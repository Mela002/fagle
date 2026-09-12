# FáGlè

**Des données du terrain à la meilleure décision.**

FáGlè est une plateforme d'intelligence décisionnelle agricole conçue pour les agriculteurs du Bénin et d'ailleurs. Elle combine météo, contexte de la culture, observations de terrain et données locales pour comparer plusieurs décisions possibles avant qu'elles ne soient prises.

> FáGlè fonctionne même avant l'installation des capteurs. Les capteurs améliorent la précision, mais ne sont jamais indispensables.

## Démo en ligne

👉 **https://fagle.vercel.app**

## Fonctionnalités

- Tableau de bord agriculteur (parcelles, météo, niveau de données disponibles)
- Analyse FáGlè : score de risque prototype pour une action (semer, irriguer...)
- Comparaison de scénarios (semer aujourd'hui / attendre 2 jours / attendre 4 jours / irriguer / reporter)
- Explicabilité : "Pourquoi cette recommandation ?" et "Qu'est-ce qui pourrait la changer ?"
- Observations de terrain et suivi photographique de la culture
- Intégration météo réelle (Open-Meteo) avec repli automatique en mode simulé
- Simulation de capteur pour démontrer l'évolution de la précision
- Boucle de retour agriculteur (décision prise → résultat observé)
- Rapports mensuels + validation scientifique (espace scientifique / agronome)
- Console d'administration
- Mode démonstration complet sans configuration requise

## Stack technique

- **Next.js** (App Router) + **React** — JavaScript uniquement
- **Tailwind CSS**
- **Supabase / PostgreSQL** (optionnel — mode démo en mémoire par défaut)
- **Open-Meteo** pour les données météo réelles
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes
- Déployé sur **Vercel**

## Lancer le projet en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) — l'application fonctionne immédiatement en mode démo, sans aucune configuration.

## Équipe TerraCauri

- Aquilas ASSOGBA
- Samuel TOGNON
- Christopher AVODAHO
- HOUNSOGBE Kouessi
