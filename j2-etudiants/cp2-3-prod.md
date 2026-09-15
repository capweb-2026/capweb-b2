# CP2-3 — En prod

**Moment** : après-midi, troisième temps du CP2. La PR `identite` contient la spec, les tests et le code (CP2-2).

**Objectif** : l'identité de votre assistant est en ligne. Chaque PR produit une preview vérifiée par un smoke test. La prod ne reçoit `main` qu'après une approbation humaine, et `/version.json` dit exactement quel commit elle sert.

## Ce que vous demandez à l'agent (ou faites vous-mêmes)

- **L'agent : rien.** La mise en prod ne se délègue pas.
- **Vous-mêmes** : le compte Vercel, le jeton, les secrets GitHub, la fusion et l'approbation. Le jeton Vercel et le secret de contournement ne passent jamais par l'agent, ni par un fichier du dépôt.

## Étapes

1. **Brancher Vercel** : étapes 1 à 8 de [outils/vercel.md](outils/vercel.md), en suivant la répartition entre A et B que propose la notice.
2. **Mettre `main` en prod une première fois** : étape 9 de la notice. **Ne poussez rien sur la PR `identite` avant la fin de cette étape** : chez Vercel, le tout premier déploiement devient la prod, et ce doit être `main`, approuvée.
3. **Obtenir la preview de la PR `identite`** : étape 10 de la notice. Il faut un nouveau push sur la PR. Si vous n'avez rien à pousser, depuis la branche `identite` :

   ```sh
   git commit --allow-empty -m "chore: relancer la chaîne, Vercel branché"
   git push
   ```

   Relancer un ancien run ne suffit pas toujours : un run déclenché par une modification de la description de la PR ne déploie pas de preview.
4. **Vérifier la preview.** `verifier`, `preview` et `smoke-preview` sont verts. Sur la preview, contrôlez chaque critère de votre `SPEC.md`.
5. **Fusionner.** Passez la PR en prête (*Ready for review*). Quand `verifier` est vert et que vous savez expliquer tous les deux le diff entier, cliquez sur *Merge pull request*, en gardant *Create a merge commit*.
6. **Approuver la prod, en connaissance de cause** : étape 11 de la notice. Approuver, c'est décider : faites-le seulement si la preview était bonne.
7. **Suivre la fin de la chaîne** : `production` déploie, `smoke-production` teste la prod, `tag-production` pose le tag `prod-<numéro>`.
8. **Tester la prod à la main**, dans une fenêtre de navigation privée, sur `https://<nom>.vercel.app` : l'identité, l'envoi, le refus d'un message vide, `<b>gras</b>` affiché comme du texte, la mémoire après F5.
9. **Comparer la version.** Ouvrez `https://<nom>.vercel.app/version.json`. Son champ `commit` doit être le dernier commit de `main` :

   ```sh
   git switch main
   git pull
   git log -1 --format=%H
   ```

10. **Noter l'adresse de prod** en tête du `README.md` de votre dépôt, par une petite PR. Vous pouvez la regrouper avec la carte des défenses du CP2-4.

## Vérifier

- Onglet *Actions* : le run `chaine` lancé à la main sur `main` (étape 9) est vert, avec `production`, `smoke-production` et `tag-production`.
- Sur la PR `identite` : `verifier`, `preview` et `smoke-preview` sont verts, et la preview montre votre identité.
- Après la fusion, le run de `main` montre l'approbation de `production` par l'un de vous deux ; `smoke-production` et `tag-production` sont verts.
- La page *Tags* du dépôt montre un nouveau tag `prod-<numéro>`.
- Dans une fenêtre privée, la prod montre l'identité, répond, refuse le vide, affiche `<b>gras</b>` comme du texte et garde la conversation après F5.
- `/version.json` en prod donne comme `commit` le dernier commit de `main`.
- L'adresse de prod est en tête du `README.md`, sur `main`.

## Preuve pour la carte des défenses

Aucune ligne de la carte ne change. Gardez deux liens pour la soutenance : le run de `main` qui montre l'approbation, et le tag `prod-<numéro>`. Ils prouvent que la prod n'a reçu que ce que la chaîne avait vérifié, après une décision humaine. Le tag est aussi votre point de retour, si la prod casse.

## Indices

<details>
<summary>Vous avez poussé sur une PR avant la première mise en prod</summary>

Faites quand même l'étape 9 de la notice, puis vérifiez que `/version.json` de la prod donne le dernier commit de `main`. Sinon, prévenez le formateur.

</details>

<details>
<summary>Le job preview affiche encore « Pas de preview »</summary>

Les secrets manquent dans l'environnement `preview`, ou leurs noms diffèrent : étape 7 de [outils/vercel.md](outils/vercel.md). Pour les autres erreurs de `preview`, `smoke-preview` ou `smoke-production` : tableau « Si ça bloque » de la notice.

</details>

<details>
<summary>La preview demande de se connecter à Vercel</summary>

C'est la protection des previews qui fonctionne (étape 8 de la notice) : elles ne s'ouvrent que dans le navigateur connecté au compte Vercel du binôme. La prod, elle, reste publique.

</details>

<details>
<summary>Merge pull request est grisé</summary>

Trois causes possibles : la PR est encore en brouillon (*Ready for review*) ; `verifier` n'est pas vert ; la branche est en retard sur `main` (*Update branch*, puis attendre `verifier`).

</details>

<details>
<summary>Review deployments n'apparaît pas</summary>

Attendez la fin de `verifier` sur `main` : l'approbation n'est demandée qu'après. Si `production` a tourné sans rien demander, vous n'êtes pas relecteurs de cet environnement : prévenez le formateur.

</details>

<details>
<summary>La prod montre l'ancienne version</summary>

Rechargez sans cache : Ctrl+F5 sous Windows, Cmd+Maj+R sous macOS. Puis comparez `/version.json` au dernier commit de `main`, et vérifiez que le run de `main` est terminé.

</details>

<details>
<summary>La conversation de la prod est vide, alors que celle du local était pleine</summary>

Normal : `localStorage` appartient à chaque adresse. `http://127.0.0.1:3000` et `https://<nom>.vercel.app` ont chacune leur mémoire (question du TP10).

</details>

## Question pour la soutenance

Qu'est-ce qui prouve que la prod sert exactement le commit que vous avez approuvé ? Et qui l'a approuvé, après avoir vérifié quoi ?

---

Précédent : [CP2-2](cp2-2-tdd-deux-agents.md) · Suivant : [CP2-4 — Carte des défenses et PR piégées](cp2-4-carte-et-sabotage.md) · Retour : [README](README.md)
