# CP2-1 — La spec et les règles de l'agent

**Moment** : après-midi, premier temps du CP2. L'agent est réglé (étapes 3 à 8 de [outils/dsh.md](outils/dsh.md)).

**Objectif** : avant que l'agent écrive une ligne, deux fichiers à la racine de votre dépôt disent quoi construire et comment se conduire. `SPEC.md` décrit l'identité de votre assistant par des critères vérifiables. `AGENTS.md` fixe les règles de l'agent.

**L'identité**, selon les règles de lundi : un nom de 2 à 20 caractères, un seul emoji, un message d'accueil qui contient le nom, trois questions suggérées. Le tout dans votre thème.

## Ce que vous demandez à l'agent (ou faites vous-mêmes)

- **Vous-mêmes** : toute la spec et toutes les règles. Ce sont vos décisions ; l'agent les exécutera.
- **L'agent**, facultatif, une fois vos deux fichiers écrits : repérer les critères flous, sans rien écrire.

```text
Lis SPEC.md. Pour chaque critère, propose un test qui échouerait si le critère n'était pas respecté, et signale les critères ambigus. Ne modifie aucun fichier.
```

## Étapes

1. **Partir de `main` à jour** :

   ```sh
   git switch main
   git pull
   git switch -c identite
   ```

2. **Décider l'identité, à deux** : le nom, l'emoji, le message d'accueil et les trois questions. Écrivez les vraies valeurs : sinon, l'agent les inventera. Aucune donnée personnelle. Thème proche de la santé, du droit ou de l'argent : l'accueil dit que l'assistant ne remplace pas un professionnel.
3. **Copier les modèles** [modeles/SPEC.md](modeles/SPEC.md) et [modeles/AGENTS.md](modeles/AGENTS.md) à la racine de votre dépôt, si ce n'est pas déjà fait pour le premier essai de l'agent.
4. **Écrire `SPEC.md`.** Remplissez chaque section : objectif, critères d'acceptation, hors périmètre, données et fonctions attendues, questions ouvertes. Inspirez-vous de l'exemple de Boussole, en fin de fichier.
5. **Rédiger les critères** sous la forme « Quand …, le système … », numérotés. Gardez l'ordre de l'exemple : 1 nom, 2 emoji, 3 accueil, 4 suggestions, 5 réponses signées, 6 contrat CP1 toujours vert. Les consignes du CP2-2 citent « les critères 1 à 5 ».
6. **Écrire les données attendues** : noms des fichiers, des fonctions, de leurs paramètres et de leurs valeurs de retour. C'est ce qui permet d'écrire les tests avant le code.
7. **Nettoyer `SPEC.md`** : supprimez le bandeau « Modèle à copier » et tout l'exemple de Boussole. L'agent lit le fichier entier : il construirait Boussole.
8. **Écrire `AGENTS.md`.** Remplacez chaque passage en italique et supprimez le bandeau. Si votre spec prévoit `public/js/persona.js`, ajoutez-le à la liste des fichiers principaux. Ajoutez vos interdits propres, par exemple « Ne jamais modifier `SPEC.md` ni `AGENTS.md`. », et les règles données en fin de mini-cours qui n'y sont pas déjà.
9. **Relire les deux fichiers avec la grille** ci-dessous, à deux, ligne par ligne.
10. **Commiter et ouvrir la PR** :

    ```sh
    git add SPEC.md AGENTS.md
    git status
    git commit -m "docs: spec de l'identité et règles de l'agent"
    git push -u origin identite
    ```

    Ouvrez la PR `identite` vers `main` **en brouillon** (*Create draft pull request*) : les tests et le code arriveront dans cette même PR.

## La grille : un critère = un test possible

Pour chaque critère de `SPEC.md`, les quatre réponses doivent être « oui ». Sinon, réécrivez-le.

| Question | Flou | Vérifiable |
|---|---|---|
| La situation est-elle précise ? | « L'accueil est sympa. » | « Quand la conversation est vide, le système affiche un message d'accueil qui contient le nom. » |
| Le comportement se voit-il, ou se mesure-t-il ? | « Le nom est bien choisi. » | « Le nom fait de 2 à 20 caractères. » |
| Les limites sont-elles chiffrées ? | « Quelques questions pour démarrer. » | « Exactement trois questions suggérées. » |
| Savez-vous nommer le test qui échouerait ? | « Les suggestions sont pratiques. » | « Après un clic sur une suggestion, `#message` contient la question et `#messages` n'a aucune ligne. » |

Pour `AGENTS.md` :

- chaque ligne est un ordre que l'agent peut suivre, et que vous pouvez vérifier dans un diff ;
- chaque commande citée existe dans `package.json` ;
- il ne reste aucun passage en italique, ni rien d'un autre projet.

## Vérifier

- `SPEC.md` et `AGENTS.md` sont à la racine du dépôt, sur la branche `identite`, sans bandeau de modèle, sans passage en italique, sans l'exemple de Boussole.
- `SPEC.md` contient les vraies valeurs de votre identité et au moins six critères numérotés « Quand …, le système … ».
- Pour chaque critère, vous savez dire à voix haute quel test pourrait échouer.
- La section « Données et fonctions attendues » nomme les fichiers, les fonctions et leurs valeurs de retour.
- La PR `identite` est ouverte en brouillon, et `verifier` y est vert : aucun code n'a changé.
- Chacun des deux explique chaque critère sans relire.

## Preuve pour la carte des défenses

Aucune ligne ne change à cette étape. `AGENTS.md` guide l'agent mais ne l'empêche de rien (règle 6) : ce n'est pas une barrière, donc pas une preuve. Notez le numéro de la PR `identite` : le run rouge du CP2-2 y apparaîtra.

## Indices

<details>
<summary>Un critère dit comment coder</summary>

« Utiliser un tableau », « créer une fonction » : c'est du comment. Déplacez-le dans « Données et fonctions attendues », ou supprimez-le. Un critère dit ce que voit l'utilisateur, ou ce que renvoie une fonction.

</details>

<details>
<summary>« Un seul emoji » : comment le tester ?</summary>

Par des exemples : deux emojis refusés, du texte refusé, un emoji accepté. Attention, en JavaScript, `'🧭'.length` vaut 2 et `'🛡️'.length` vaut 3, alors qu'on ne voit qu'un seul caractère. Écrivez dans la spec qu'un emoji comme 🛡️ compte pour un : sinon, le testeur l'oubliera.

</details>

<details>
<summary>Le nom a des espaces autour, ou des accents</summary>

Décidez, et écrivez-le : par exemple « le nom, sans les espaces autour, fait de 2 à 20 caractères ». Une question que vous ne tranchez pas va dans « Questions ouvertes » : l'agent doit la poser au lieu de choisir à votre place.

</details>

<details>
<summary>Vous n'êtes pas d'accord sur l'identité</summary>

Choisissez vite. Aujourd'hui, la méthode compte plus que le nom.

</details>

<details>
<summary>Modifier AGENTS.md plus tard</summary>

Une fois fusionné, `AGENTS.md` fait partie du harnais : le modifier exigera une ligne `HARNAIS-CHANGE:` et une raison dans la description de la PR. Relisez-le bien maintenant.

</details>

## Question pour la soutenance

Lisez un critère de votre `SPEC.md` : quel test échouerait s'il n'était pas respecté ? Et pourquoi `AGENTS.md`, à lui seul, n'empêche-t-il pas l'agent de le contourner ?

---

Précédent : [CP1](cp1-sous-contrat.md) · Suivant : [CP2-2 — TDD à deux agents](cp2-2-tdd-deux-agents.md) · Retour : [README](README.md)
