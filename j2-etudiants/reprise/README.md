# Reprise — le chatbot de J1 qui respecte le contrat

Ce dossier contient un `public/` complet : conversation, cerveau à règles, affichage en texte, mémoire et bouton « Effacer ». Il passe tous les tests de contrat CP1.

## Quand l'utiliser

À **11 h**, seulement si votre chat ne s'affiche toujours pas, ou si le contrat reste rouge et que vous ne voyez plus comment avancer. Personne n'est pénalisé : ce qui compte, c'est de comprendre et de pouvoir expliquer ce code à la soutenance.

## Comment faire

1. Dans votre dépôt `capweb-<id>`, créez une branche : `git switch -c reprise`.
2. Renommez votre dossier `public` en `public-avant` (gardez-le pour comparer), puis copiez ce dossier `public` à la racine du dépôt.
3. Gardez votre thème : dans `public/index.html`, remplacez le titre `Cap Web` et la phrase d'introduction par ceux de votre assistant.
4. Lancez `npm test` puis `npm run test:browser`.

Vérifier : tous les tests sont verts ; `http://127.0.0.1:3000` affiche la conversation, refuse un message fait d'espaces, affiche `<b>gras</b>` tel quel et garde la conversation après F5.

5. Supprimez `public-avant`, commitez (`git add public` puis `git commit -m "reprise : chatbot de J1 conforme au contrat"`), poussez et ouvrez la PR.
6. Lisez chaque fichier de `public/js/` et notez ce que vous ne comprenez pas : c'est la première question à poser au formateur.
