# Grille de revue : lire le diff d'un agent par le risque

**À quoi elle sert** : décider si un changement entre dans `main`. Avant chaque commit, pour le diff de votre agent. Avant chaque fusion, pour une PR, même ouverte par un compte de confiance. On lit d'abord ce qui peut faire le plus de dégâts, pas ce qui est le plus intéressant.

**La règle d'or** : vous ne commitez et ne fusionnez que ce que vous savez expliquer. Ni une chaîne verte, ni un agent sûr de lui, ni un auteur de confiance ne remplacent cette explication.

## Où lire le diff

| Situation | Où regarder |
|---|---|
| Le diff de votre agent, avant le commit | `git status` liste les fichiers modifiés et les fichiers nouveaux. `git diff --stat`, puis `git diff`, montrent les modifications. Un fichier nouveau n'apparaît pas dans `git diff` : ouvrez-le. |
| Une PR sur GitHub | *Conversation* : qui l'a ouverte, ce qu'elle annonce. *Files changed* : le diff. *Checks* : les runs, et l'étape qui a rougi. *Commits* : le détail, commit par commit. |

## Les six questions, dans l'ordre

### 1. Quels fichiers ?

Chaque fichier touché est-il prévu par la spec et par le plan que vous avez accepté ?

Signal d'alarme : un fichier que personne n'a annoncé. Posez la question avant de lire la suite.

### 2. Un test existant est-il touché ?

Regardez `tests/` et `browser/`.

Signaux d'alarme : un test supprimé ; une assertion retirée ou modifiée ; un `.skip` ou un `.only` ; une valeur attendue changée pour coller au code ; un délai d'attente allongé sans raison.

Décision : refus, sauf ligne `TEST-CHANGE:` précise, que vous avez lue et acceptée. Attention : les tests ajoutés dans la PR en cours sont encore « nouveaux » pour `check:tests`, qui ne les voit pas changer. Là, c'est vous qui voyez.

### 3. La chaîne, un script, une dépendance ?

Regardez `.github/`, `scripts/`, `package.json`, `package-lock.json`, `dependances-autorisees.json`, `eslint.config.js`, `playwright.config.js`, `playwright.smoke.config.js`, `vercel.json`, et `AGENTS.md` s'il existe déjà sur `main`.

Signaux d'alarme : tout changement dans ces fichiers ; une dépendance nouvelle, même petite, même connue.

Décision : refus, sauf ligne `HARNAIS-CHANGE:` précise, que vous avez lue et acceptée. Pour une dépendance : quel critère de la spec l'exige ? Peut-on s'en passer ?

### 4. Un secret, `.env`, une adresse externe ?

Cherchez dans tout le diff.

Signaux d'alarme : une clé, un jeton, un mot de passe ; un fichier `.env` ou un fichier de `.vercel/` ; une adresse `https://` que vous ne connaissez pas.

Décision : refus immédiat. Une clé est visible, même un instant : prévenez le formateur.

### 5. `innerHTML`, `eval`, un appel réseau nouveau ?

Regardez surtout `public/` et `server/`.

Signaux d'alarme :

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` ou `new Function` ;
- `document`, `window` ou `localStorage` dans `brain.js` ;
- un `fetch`, un `XMLHttpRequest`, un `WebSocket` ou un `<script src="https://…">` nouveau ;
- `server/app.js` qui sert plus que sa liste blanche : un dossier entier, un chemin construit depuis l'adresse demandée.

Décision : refus pour l'affichage en HTML et pour `eval`. Un appel réseau nouveau : seulement si la spec le demande et qu'un test le couvre.

### 6. Je l'explique en trois phrases ?

À deux, sans l'agent, à voix haute :

1. **Ce que ça change**, pour l'utilisateur ou pour le code.
2. **Pourquoi** : quel critère de `SPEC.md`.
3. **Comment on sait que ça marche** : quel test échouerait sans ce changement.

Pas trois phrases claires : ce n'est pas prêt.

## Décider

| Décision | Quand | Ce que vous faites |
|---|---|---|
| **Accepter** | Les six réponses sont bonnes | Diff de l'agent : `git add` en nommant les fichiers, puis `git commit`. PR : fusion quand `verifier` est vert. |
| **Demander une correction** | Le changement est utile, mais un point cloche | Dites à l'agent le fichier, la ligne, la règle en jeu et ce que vous attendez. Puis repassez la grille sur le nouveau diff. |
| **Refuser** | Un signal d'alarme sans justification acceptable, ou un changement que vous ne savez pas expliquer | Diff de l'agent : `git restore <fichier>` pour chaque fichier modifié, suppression des fichiers nouveaux non demandés, puis la raison à l'agent. PR : un commentaire qui explique le refus, puis *Close pull request*. |

## Commandes utiles

```sh
git status
git diff --stat
git diff -- tests browser
git diff -- .github scripts package.json package-lock.json
git grep -n --untracked -E "innerHTML|outerHTML|insertAdjacentHTML|eval\(|new Function" -- public
```

La dernière commande cherche l'affichage en HTML et `eval` dans `public/`, fichiers nouveaux compris. Si elle n'affiche rien, elle n'a rien trouvé.

---

Utilisée dans : [CP1](../cp1-sous-contrat.md) · [CP2-2](../cp2-2-tdd-deux-agents.md) · [CP2-4](../cp2-4-carte-et-sabotage.md) · Retour : [README](../README.md)
