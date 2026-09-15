# Soutenance 1 — « Il marche, je le comprends, je l'ai verrouillé »

**Moment** : fin de journée.

**Objectif** : en 3 minutes, sans slides, montrer votre chatbot en prod, puis prouver que vous comprenez ce qui a été livré, même si un agent l'a écrit.

## Le déroulé : 3 minutes maximum

| Durée | Quoi |
|---|---|
| 1 minute | **Démo en prod** : identité, envoi, refus d'un message vide, `<b>gras</b>` affiché comme du texte, mémoire après rechargement |
| 2 minutes | **Explication** : chacun une partie du code, puis un test vu rouge puis vert |

Pas de slides : votre prod, votre dépôt et votre PR suffisent. Chacun doit pouvoir expliquer n'importe quelle partie : le formateur peut demander à l'un d'expliquer la partie de l'autre.

## La démo, en 1 minute

Sur l'adresse de prod, pas en local. Commencez par « Effacer la conversation », pour partir d'une conversation vide.

1. **Identité** : le titre avec l'emoji et le nom, le message d'accueil, les trois questions suggérées.
2. **Envoi** : cliquez sur une suggestion, puis envoyez. Le message et la réponse signée s'affichent ; l'accueil disparaît.
3. **Refus du vide** : envoyez un message fait d'espaces. Une erreur s'affiche, rien n'est ajouté.
4. **Du texte, jamais du HTML** : envoyez `<b>gras</b>`. Il s'affiche avec ses chevrons, pas en gras.
5. **Mémoire** : rechargez la page (F5). La conversation est toujours là.

## L'explication, en 2 minutes

1. **Chacun une partie du code**, environ 45 secondes chacun : le fichier, ce que fait la partie, pourquoi elle est écrite ainsi, et le test qui échouerait sans elle. Exemples de parties :
   - `validateMessage` et `replyTo`, dans `brain.js` ;
   - `renderMessages` et `textContent`, dans `view.js` ;
   - l'écouteur `submit` et `preventDefault`, dans `app.js` ;
   - la mémoire, `localStorage` et son `try/catch`, dans `app.js` ;
   - l'identité et `validatePersona`, dans `persona.js` ;
   - la liste blanche de `server/app.js` ;
   - la chaîne, de `verifier` jusqu'à l'approbation de `production`.
2. **Un test vu rouge puis vert**, environ 30 secondes : le run rouge du commit `test: …` et son message, puis le run vert du commit `feat: …`. Ou votre casse volontaire : la ligne changée, le test qui a rougi, le retour au vert.

## Préparer

1. Ouvrez à l'avance quatre onglets : l'adresse de prod, la PR `identite`, son run rouge, son run vert.
2. Choisissez vos deux parties du code. Puis échangez-les : chacun sait aussi expliquer la partie de l'autre.
3. Répétez à voix haute, avec un chronomètre, jusqu'à tenir en 3 minutes.
4. Juste avant de passer : la prod répond, et `/version.json` donne le dernier commit de `main`.

## Vérifier, avant de passer

- La démo complète tient en 1 minute, sur l'adresse de prod.
- Chacun explique sa partie **et** celle de l'autre, sans lire.
- Le run rouge et le run vert s'ouvrent en un clic.
- Aucun onglet, aucune fenêtre visible ne montre de clé, de jeton ou l'adresse `…?token=…` de dsh : l'écran est projeté.

## Ce que le formateur observe

- La démo marche-t-elle en prod ?
- Chacun explique-t-il juste, avec ses mots ?
- Le binôme montre-t-il un test vu rouge, puis vert ?
- Une question de relance va à celui qui a le moins parlé.

## Indices

<details>
<summary>La prod ne répond pas au moment de passer</summary>

Dites-le, montrez le dernier run de la chaîne sur `main`, puis enchaînez sur l'explication. Expliquer une panne fait partie du métier. Seul le formateur peut décider d'une démo en local, par exemple si Vercel est en panne pour toute la classe.

</details>

<details>
<summary>Pour vous entraîner : questions possibles</summary>

- Si on remplace `textContent` par `innerHTML` ici, qu'est-ce qui rougit ?
- Pourquoi `brain.js` n'a-t-il pas le droit de toucher à la page ?
- Que se passe-t-il si la mémoire du navigateur contient n'importe quoi ?
- Montrez le run rouge de votre PR : pourquoi était-il rouge ?
- Qu'avez-vous refusé à l'agent aujourd'hui ?
- Une PR piégée est arrivée : qu'est-ce qui l'a arrêtée, la chaîne ou vous ?
- Qui a approuvé la mise en prod, et qu'avait-il vérifié avant ?

</details>

<details>
<summary>Nous n'avons pas fini le CP2</summary>

Montrez ce qui est vraiment en prod, et dites ce qui manque. L'explication ne change pas : chacun une partie du code, et un test vu rouge puis vert, par exemple le run rouge du contrat au CP1, puis le run vert de votre PR.

</details>

---

Précédent : [CP2-4](cp2-4-carte-et-sabotage.md) · Retour : [README](README.md)
