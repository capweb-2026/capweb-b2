# CP2-2 — TDD à deux agents

**Moment** : après-midi, deuxième temps du CP2. `SPEC.md` et `AGENTS.md` sont sur la branche `identite` (CP2-1).

**Objectif** : un premier agent écrit les tests de votre identité. Vous les voyez rouges, pour la bonne raison, et vous les commitez. Un second agent, dans une nouvelle conversation, écrit le code qui les fait passer, sans toucher aux tests. Vous lisez son diff et vous le commitez. Puis vous cassez exprès une ligne, pour voir un test rougir.

**Pourquoi deux agents** : celui qui écrit le code ne doit pas pouvoir arranger les tests à sa convenance. Et un test ne compte que si on l'a vu échouer.

## Ce que vous demandez à l'agent (ou faites vous-mêmes)

L'agent tourne dans l'interface de dsh, lancée par `dsh web` à la racine du dépôt, en mode Read Only (étapes 6 à 8 de [outils/dsh.md](outils/dsh.md)). Copiez les consignes mot pour mot. Adaptez seulement les numéros de critères, ou les noms des fichiers de tests s'ils diffèrent chez vous.

**Session 1, agent testeur :**

```text
Lis AGENTS.md et SPEC.md. À partir des critères 1 à 5, écris uniquement des tests dans tests/ et browser/. Ne modifie aucun autre fichier. Propose d'abord la liste des tests, attends mon accord.
```

**Session 2, nouvelle conversation, agent codeur :**

```text
Lis AGENTS.md et SPEC.md. Fais passer les tests de tests/identite.test.js et browser/identite.spec.js sans modifier aucun test ni aucun fichier interdit par AGENTS.md. Propose un plan court, attends mon accord, puis avance par petites étapes et demande-moi de lancer les tests après chaque étape.
```

**Ce que vous faites vous-mêmes, toujours :**

- **Autoriser ou refuser.** Chaque écriture de l'agent déclenche une demande d'autorisation, valable une seule fois. Autorisez seulement ce que vous savez expliquer. Refusez git, les installations, `.env`, les tests de contrat, `.github/`, `scripts/`, `package.json` et `package-lock.json`. Refusez toujours `danger-full-access`.
- **Lancer les tests**, dans votre terminal : `npm test`, `npm run test:browser`, `npm run verify`. Sous Windows, l'agent ne peut pas les lancer dans son bac à sable (`spawn EPERM`). Le rouge et le vert qui comptent sont ceux que vous voyez. Collez la sortie à l'agent s'il en a besoin.
- **Commiter.** L'agent ne commit jamais.

## Étapes

### Session 1 : les tests d'abord

1. **Ouvrir une session** dans l'interface de dsh, et envoyer la consigne du testeur.
2. **Relire la liste proposée, avant tout fichier.** Chaque test cite son critère. Les limites sont testées des deux côtés : un nom de 1 et de 21 caractères refusé, de 2 et de 20 accepté. Il y a des tests Node dans `tests/` et des tests navigateur dans `browser/`. Rien n'est testé qui ne soit pas dans la spec. Demandez que les fichiers s'appellent `tests/identite.test.js` et `browser/identite.spec.js` : la consigne du codeur les cite. Puis donnez votre accord.
3. **Autoriser les écritures une par une** : seulement ces fichiers nouveaux de `tests/` et `browser/`. Puis `git status` : il ne montre rien d'autre. Un autre fichier touché : refusez, et annulez (indices).
4. **Voir rouge, vous-mêmes** : `npm run lint`, puis `npm test`, puis `npm run test:browser`.
   - Le lint est propre.
   - `npm test` : les anciens tests restent verts ; seuls les nouveaux échouent, parce que le code n'existe pas encore, par exemple `Cannot find module '…/public/js/persona.js'`.
   - `npm run test:browser` s'arrête sur le même module introuvable.
   - Une faute de frappe, une erreur de syntaxe ou un lint rouge ne sont pas la bonne raison : demandez la correction au testeur, dans la même session, et relancez.
5. **Commiter vous-mêmes les tests, seuls** :

   ```sh
   git add tests/identite.test.js browser/identite.spec.js
   git status
   git commit -m "test: identité de l'assistant (critères 1 à 5)"
   git push
   ```

6. **Constater le rouge en ligne.** Sur la PR, `verifier` échoue à l'étape `npm test`, avec le même message. Copiez l'adresse de ce run : c'est la preuve que vos tests savaient échouer.

### Session 2 : le code

7. **Ouvrir une nouvelle conversation** : une nouvelle session dans l'interface de dsh, pas la suite de celle du testeur. Envoyez la consigne du codeur.
8. **Relire son plan.** Il nomme les fichiers qu'il va toucher, sans doute `public/js/persona.js` (nouveau), `view.js`, `app.js`, `index.html`, `styles.css`, et la liste blanche de `server/app.js`. Refusez tout plan qui touche `tests/`, `browser/`, `package.json`, `.github/` ou `scripts/`, ou qui installe un paquet. Puis donnez votre accord.
9. **Suivre ses petites étapes.** Pour chaque demande d'autorisation, lisez le fichier visé et la justification : est-ce l'étape du plan ? Quand l'agent vous le demande, lancez `npm test`, et `npm run test:browser` si la page a changé, puis collez-lui la sortie.
10. **Vérifier vous-mêmes, à la fin** : `npm run verify` est vert. Puis `npm start`, `http://127.0.0.1:3000`, et chaque critère de la spec, à la main.
11. **Lire le diff avec la [grille de revue](outils/grille-revue.md)** : `git status`, `git diff`, et chaque fichier nouveau. Aucun fichier de `tests/` ni de `browser/` ne doit apparaître. Un point cloche : demandez une correction précise, ou refusez.
12. **Commiter vous-mêmes le code**, en nommant les fichiers réellement touchés, par exemple :

    ```sh
    git add public/js/persona.js public/js/view.js public/js/app.js public/index.html public/styles.css server/app.js
    git status
    git commit -m "feat: identité de <nom de votre assistant>"
    git push
    ```

13. **Casser exprès.** Changez une ligne qui porte un critère : par exemple, dans `persona.js`, la limite de 20 caractères du nom passée à 30. Lancez `npm test` : un test doit rougir. Notez la ligne et le nom du test. Annulez avec `git restore public/js/persona.js`, relancez : vert.
14. **Remplir la description de la PR** avec le modèle : critères couverts, consignes données aux deux sessions, lien du run rouge, casse volontaire, ce que vous avez refusé à l'agent. Rien dans « Justifications » : aucun test existant ni fichier du harnais n'a changé.

## Vérifier

- `git log --oneline` : le commit `test: …` est sous le commit `feat: …`, donc plus ancien.
- Sur la PR, le run du commit `test: …` est rouge à l'étape `npm test`, pour la bonne raison. Le run du commit `feat: …` a `verifier` vert.
- Sur GitHub, le commit `feat: …` ne touche aucun fichier de `tests/` ni de `browser/` (onglet *Commits* de la PR, puis clic sur le commit).
- `npm run verify` est vert dans votre terminal.
- La casse volontaire est notée dans la PR : la ligne changée, et le test qui a rougi.
- La description de la PR est remplie, et les trois cases de « Comment je l'ai vérifié » sont cochées.
- Chacun des deux sait dire ce que vérifie chaque nouveau test, et ce que vous avez refusé à l'agent.

## Preuve pour la carte des défenses

Le lien du run rouge du commit `test: …` :

- dans la description de la PR, à la case « J'ai vu les nouveaux tests échouer avant le code » ;
- au CP2-4, dans `CARTE-DEFENSES.md`, à la suite de la ligne « Régression » : vos tests d'identité arrêteront désormais toute régression de l'identité.

## Indices

<details>
<summary>Rouge, mais pas pour la bonne raison</summary>

Exemples : une erreur de syntaxe dans le test ; un chemin d'import faux vers un fichier qui existe ; une fonction que la spec ne prévoit pas. Au lint, `'localStorage' is not defined` dans `browser/` : le code passé à `page.evaluate` s'exécute dans la page. Le contrat du formateur le signale au lint par le commentaire `/* global localStorage */`, en tête de fichier ; le testeur peut faire de même. Dans tous les cas : le testeur corrige, dans la même session, avant le commit.

</details>

<details>
<summary>Un nouveau test est déjà vert avant le code</summary>

Il ne vérifie rien de nouveau : il ne peut pas prouver que le code marche. Demandez au testeur de le réécrire pour qu'il échoue sans le code, ou de le retirer.

</details>

<details>
<summary>L'agent veut lancer npm test, ou demande danger-full-access</summary>

Refusez. Sous Windows, son bac à sable fait échouer `npm test` et Playwright (`spawn EPERM`). Lancez les tests dans votre terminal et collez-lui la sortie (section 8 de [outils/dsh.md](outils/dsh.md)).

</details>

<details>
<summary>L'agent annonce deux échecs dans build-static</summary>

Sous Windows, s'il lance lui-même les tests Node, les deux tests de `build-static` échouent dans son bac à sable : ce n'est pas un bug à corriger. Refusez toute modification de `scripts/`, et fiez-vous à `npm test` lancé dans votre terminal.

</details>

<details>
<summary>L'agent codeur dit qu'un test est faux</summary>

Arrêtez-le. Relisez ensemble le test et le critère. Si la spec est ambiguë, corrigez `SPEC.md` (commit `docs: …`), puis refaites écrire ce test par une session de testeur. Le codeur ne modifie jamais un test.

</details>

<details>
<summary>La chaîne n'a rien dit alors que nos nouveaux tests ont changé</summary>

Normal. Dans cette PR, vos fichiers de tests sont encore des fichiers ajoutés : `check:tests` ne réclame `TEST-CHANGE:` que pour les tests déjà présents sur `main`. Ici, la barrière, c'est vous : `git status` et `git diff` avant chaque commit.

</details>

<details>
<summary>L'agent a modifié un fichier interdit, ou lancé une commande git</summary>

Refusez la suite. Annulez la modification d'un fichier suivi par `git restore <fichier>` ; supprimez un fichier nouveau que vous n'avez pas demandé. Puis dites à l'agent pourquoi, dans le chat. Si un commit ou un push a eu lieu (`git log --oneline`), prévenez le formateur tout de suite.

</details>

<details>
<summary>Tous les tests navigateur rougissent après le code</summary>

La page ne charge plus son nouveau module. `persona.js` manque sans doute dans la liste blanche de `server/app.js` (F12, onglet Réseau : un 404), ou le nom importé ne correspond pas au nom exporté.

</details>

<details>
<summary>La casse volontaire ne fait rougir aucun test</summary>

Le test est trop faible. Gardez la casse, faites écrire le test manquant par une session de testeur, et voyez-le rouge. Annulez alors la casse : il passe au vert. Commit `test: …`, puis poussez.

</details>

<details>
<summary>dsh ne démarre pas, ou ne répond pas</summary>

Plan B de la section 10 de [outils/dsh.md](outils/dsh.md) : chat et copier-coller, avec la même discipline. Tests d'abord, nouvelle conversation pour le code, commit humain.

</details>

## Question pour la soutenance

Montrez le run rouge de vos tests, puis le vert : pourquoi ce rouge était-il le bon ? Et qu'avez-vous refusé à l'agent ?

---

Précédent : [CP2-1](cp2-1-spec-et-agents.md) · Suivant : [CP2-3 — En prod](cp2-3-prod.md) · Retour : [README](README.md)
