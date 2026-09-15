# CP2-4 — Carte des défenses et PR piégées

**Moment** : après-midi, dernier temps du CP2.

**Objectif** : aucune PR piégée n'atteint `main`. Chaque refus est expliqué par écrit sur la PR. La carte des défenses v1 pointe, pour la régression, le test affaibli et la dépendance ajoutée, vers la preuve que la barrière a déjà arrêté une connerie dans votre dépôt.

**Annonce** : dans l'après-midi, sans prévenir, des PR d'apparence utile vont arriver dans votre dépôt, ouvertes par le compte du formateur. Titre raisonnable, description plausible : c'est voulu. Un audit relèvera ensuite tout ce qui a atteint `main` ou la prod, même recopié à la main.

## Ce que vous demandez à l'agent (ou faites vous-mêmes)

- **L'agent : rien.** Relire une PR et décider ne se délègue pas.
- **Vous-mêmes** : examiner chaque PR avec la grille, décider à deux, écrire le refus, compléter la carte. Une PR que vous n'avez pas ouverte est une entrée non fiable, pour vous comme pour un agent.

## Étapes

1. **Surveiller l'onglet *Pull requests*.** Une PR que ni vous ni votre binôme n'avez ouverte arrive : ne la fusionnez pas.
2. **L'examiner avec la [grille de revue](outils/grille-revue.md)**, à deux. Qui l'a ouverte ? Onglet *Files changed* : quels fichiers ; un test existant touché ; la chaîne, un script ou une dépendance. Onglet *Checks* : `verifier` est-il rouge ? À quelle étape, avec quel message ?
3. **Comparer le titre et le diff.** La description annonce-t-elle ce que fait vraiment le diff ? Le changement sert-il un critère de votre `SPEC.md` ?
4. **Décider.** Vous ne fusionnez jamais une PR que vous ne savez pas expliquer en trois phrases. Ni parce qu'elle vient d'un compte de confiance, ni parce que sa chaîne est verte.
5. **Ne jamais la « réparer ».** N'ajoutez pas `TEST-CHANGE:` ou `HARNAIS-CHANGE:` à sa description : une justification vient de l'auteur, et elle se discute. Ne recopiez pas son changement dans votre branche.
6. **Refuser par écrit.** Commentez la PR avec le modèle ci-dessous, puis cliquez sur *Close pull request*. Ne supprimez rien : la PR fermée et ses runs sont vos preuves.
7. **Compléter la carte**, sur une branche à jour :

   ```sh
   git switch main
   git pull
   git switch -c carte-cp2
   ```

   Dans `CARTE-DEFENSES.md`, remplissez la colonne « Preuve (lien) » des lignes « Régression », « Test affaibli ou supprimé » et « Dépendance ajoutée » (tableau ci-dessous). Chaque lien est suivi de quelques mots sur ce qu'il montre, comme dans l'exemple de [modeles/CARTE-DEFENSES.md](modeles/CARTE-DEFENSES.md). Si ce n'est pas encore fait, ajoutez l'adresse de prod en tête du `README.md` (CP2-3).
8. **Commiter, puis faire passer la carte par la chaîne** :

   ```sh
   git add CARTE-DEFENSES.md README.md
   git status
   git commit -m "docs: carte des défenses v1"
   git push -u origin carte-cp2
   ```

   Ouvrez la PR, attendez `verifier` vert, fusionnez, puis approuvez le déploiement `production`.

### Modèle de commentaire de refus

```text
Refusée.
- Ce que fait cette PR : …
- Ce qu'elle aurait cassé : …
- La barrière qui l'a arrêtée : … (lien du run)
- Pourquoi nous ne la fusionnerons pas, même avec une justification : …
```

## Vérifier

- Onglet *Pull requests*, filtre *Closed* : chaque PR piégée est fermée, **non fusionnée**, avec votre commentaire de refus.
- Sur `main`, le dernier run de la chaîne est vert, et `/version.json` en prod donne toujours le dernier commit de `main`.
- Sur `main`, dans `CARTE-DEFENSES.md`, les lignes « Régression », « Test affaibli ou supprimé » et « Dépendance ajoutée » ont chacune au moins un lien vers un run ou une PR de **votre** dépôt.
- Pour chaque PR refusée, chacun des deux sait dire ce qu'elle faisait, ce qu'elle aurait cassé et quelle barrière l'a arrêtée.

## Preuve pour la carte des défenses

| Ligne | Preuves attendues |
|---|---|
| Régression | Le run rouge du CP1 ; le run rouge du commit `test: …` du CP2-2 ; le lien d'une PR piégée refusée qui cassait le contrat, si vous en avez reçu une |
| Test affaibli ou supprimé | Le lien de la PR piégée refusée, ou de son run rouge qui montre la barrière |
| Dépendance ajoutée | Le lien de la PR piégée refusée, ou de son run rouge qui montre la barrière |

Ce qui ne compte pas : une capture, une phrase « on a testé », le lien du fichier de test, un lien vers le dépôt d'un autre binôme.

## Indices

<details>
<summary>Une PR piégée a une chaîne verte</summary>

La chaîne n'est pas la dernière barrière : vous l'êtes. Passez-la à la grille. Si vous ne savez pas l'expliquer en trois phrases, ou si elle ne sert aucun critère de votre spec : refus.

</details>

<details>
<summary>Nous avons fusionné une PR piégée par erreur</summary>

Prévenez le formateur tout de suite. Si le job `production` attend encore : *Review deployments*, puis *Reject*. Ensuite, sur la PR fusionnée, le bouton *Revert* prépare une PR qui annule la fusion : faites-la passer par la chaîne, fusionnez, approuvez. Notez l'incident : il servira au post-mortem.

</details>

<details>
<summary>Aucune PR piégée n'est arrivée pour une ligne de la carte</summary>

Prévenez le formateur. Ne fabriquez pas vous-mêmes une fausse dépendance : `package-lock.json` doit rester cohérent, sinon la chaîne rougit pour une autre raison.

</details>

<details>
<summary>Où trouver le lien d'une PR, ou d'un run</summary>

Une PR : l'adresse de sa page, qui contient `/pull/<numéro>`. Un run : onglet *Checks* de la PR, puis le nom du run ; l'adresse contient `/actions/runs/`.

</details>

<details>
<summary>La PR piégée est en conflit, ou très en retard sur main</summary>

Aucune importance : examinez-la, refusez-la par écrit et fermez-la, comme les autres.

</details>

## Question pour la soutenance

Pour une PR refusée : qu'aurait-elle cassé, quelle barrière l'a arrêtée, et quel geste humain l'aurait laissée passer quand même ?

---

Précédent : [CP2-3](cp2-3-prod.md) · Suivant : [Soutenance 1](soutenance-1.md) · Retour : [README](README.md)
