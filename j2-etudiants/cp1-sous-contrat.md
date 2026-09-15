# CP1 — Le chatbot de J1 sous contrat

**Moment** : matin.

**Objectif** : votre chatbot de J1 entre dans le dépôt GitHub de votre binôme et respecte le contrat du formateur. Il arrive dans `main` par une PR dont le contrôle `verifier` est vert. La carte des défenses montre sa première preuve.

**Votre dépôt** : `https://github.com/<organisation>/capweb-<id>`, créé par le formateur. Il contient déjà le socle : serveur local, tests de contrat, contrôles, chaîne CI/CD, carte des défenses. Il n'y manque que votre dossier `public/`.

## Ce que vous demandez à l'agent (ou faites vous-mêmes)

- **Vous-mêmes, tout le CP1** : accepter l'invitation, cloner, copier votre chatbot, lancer les commandes, lire les échecs, corriger, commiter, ouvrir la PR, fusionner, approuver.
- **L'agent, pas encore** : ce matin, vous l'installez seulement (étapes 1 et 2 de [outils/dsh.md](outils/dsh.md)). Ses réglages viendront en début d'après-midi, avec la fiche de clés. Les corrections du CP1 se font donc à la main : c'est le moment de bien comprendre ce code, que des agents modifieront cet après-midi.
- **Le contrat ne se négocie pas** : on corrige le code, jamais `tests/contrat/` ni `browser/contrat.spec.js`.

## Étapes

1. **Accepter l'invitation.** Elle arrive par e-mail, ou dans les notifications de github.com. Chacun des deux l'accepte.
2. **Cloner le dépôt**, dans un dossier à côté de votre projet de J1, pas dedans. Puis créer votre branche :

   ```sh
   git clone https://github.com/<organisation>/capweb-<id>.git
   cd capweb-<id>
   git switch -c cp1-contrat
   ```

3. **Copier votre chatbot.** Dans votre dépôt de J1 (ou votre ZIP), le projet est dans `atelier/`. Copiez le dossier `atelier/public` à la racine de `capweb-<id>` : il devient `public/`. Si `atelier/tests/brain.test.js` existe, copiez-le dans `tests/brain.test.js`. Rien d'autre : le serveur, les tests et les configurations viennent du socle.
4. **Installer**, une seule fois :

   ```sh
   npm ci
   npx playwright install chromium
   ```

5. **Installer l'agent en arrière-plan**, dès que l'étape 4 est finie : étapes 1 et 2 de [outils/dsh.md](outils/dsh.md), dans un autre terminal. Comptez environ 6 minutes et 230 Mo. Continuez pendant ce temps.
6. **Passer le lint** : `npm run lint`. Corrigez chaque erreur signalée. La chaîne lance le lint avant les tests, et s'arrête au premier rouge.
7. **Lire le contrat.** Lancez `npm test`, puis `npm run test:browser`. Pour chaque test rouge, notez son nom et ce qu'il attend (indice « La carte des tests du contrat »). Ne corrigez rien pour l'instant.
8. **Pousser tel quel**, pour que la chaîne juge votre code de J1 :

   ```sh
   git add public
   git add tests/brain.test.js
   git status
   git commit -m "feat: le chatbot de J1 entre dans le dépôt"
   git push -u origin cp1-contrat
   ```

   Sans `tests/brain.test.js`, sautez la deuxième ligne. `git status` ne doit montrer que vos fichiers. Ouvrez le lien affiché par `git push`, créez la PR et remplissez sa description avec le modèle proposé.
9. **Regarder la chaîne.** Onglet *Checks* de la PR : le run tourne. S'il est rouge à l'étape `npm test` ou `npm run test:browser`, copiez l'adresse de sa page : c'est une preuve (voir plus bas). Le job `preview` affiche la notice « Pas de preview » : normal avant le CP2.
10. **Corriger, un test à la fois.** Relancez le test concerné après chaque correction. Un fichier JavaScript de plus dans `public/js/` ? Ajoutez-le à la liste blanche de `server/app.js`, dans `FICHIERS` et dans `TYPES`, comme au TP08. Relisez votre diff avec la [grille de revue](outils/grille-revue.md), puis faites un commit par correction, en nommant les fichiers :

    ```sh
    git add public/js/brain.js
    git commit -m "fix: validateMessage refuse ce qui n'est pas du texte"
    git push
    ```

11. **Tout vérifier** : `npm run verify` doit être vert du début à la fin. Poussez vos derniers commits.
12. **Noter la preuve dans la carte.** Dans `CARTE-DEFENSES.md`, ligne « Régression », colonne « Preuve (lien) » : collez l'adresse du run rouge, suivie de quelques mots sur ce qu'il montre. Puis :

    ```sh
    git add CARTE-DEFENSES.md
    git commit -m "docs: première preuve de la carte des défenses"
    git push
    ```

13. **Fusionner.** Quand `verifier` est vert sur la PR, cliquez sur *Merge pull request*, en gardant *Create a merge commit*, puis *Confirm merge*. Tant que Vercel n'est pas configuré (CP2-3), les jobs `preview` et `production` ne déploient rien : ils affichent une notice. Seul `verifier` compte pour fusionner.
14. **Approuver.** La fusion relance la chaîne sur `main`. Le job `production` attend une approbation : c'est normal. Onglet *Actions*, ouvrez ce run, cliquez sur *Review deployments*, cochez `production`, puis *Approve and deploy*. Rien ne part en ligne : le job affiche la notice « Pas de mise en prod ».

> **À 11 h**, si votre chat ne s'affiche toujours pas, ou si le contrat reste rouge et que vous ne voyez plus comment avancer : passez à la [base de reprise](reprise/README.md). Personne n'est pénalisé ; vous devrez expliquer ce code à la soutenance. Une fois la PR de la reprise ouverte, fermez la PR `cp1-contrat` sans la fusionner. Gardez le lien de son run rouge : il reste une preuve valable.

## Vérifier

- `npm run verify` est vert : lint sans erreur ; `npm test` affiche `fail 0` (le contrat de départ compte 43 tests Node, plus ceux de votre `tests/brain.test.js`) ; `npm run test:browser` affiche `8 passed`.
- Avec `npm start`, sur `http://127.0.0.1:3000` : un message et sa réponse s'affichent ; un message fait d'espaces est refusé avec une erreur visible ; `<b>gras</b>` s'affiche tel quel ; F5 garde la conversation ; « Effacer la conversation » demande confirmation.
- Sur GitHub, *Settings* → *Branches* : `main` est protégée, et le contrôle `verifier` y est obligatoire.
- La PR est fusionnée. Sur `main`, le run lancé par la fusion a `verifier` vert et `production` approuvé.
- Sur `main`, la ligne « Régression » de `CARTE-DEFENSES.md` contient le lien d'un run rouge de **votre** dépôt.

## Preuve pour la carte des défenses

**Ligne « Régression »** : le lien du premier run rouge du contrat dans votre dépôt. Par exemple :

```text
https://github.com/<organisation>/capweb-<id>/actions/runs/<numéro> : run rouge de la PR #1, test « la conversation survit au rechargement »
```

- **Le meilleur** : le run rouge de votre PR, rouge à l'étape `npm test` ou `npm run test:browser`. Le contrat y a refusé votre code. Rouge à `npm ci` ou au lint : le contrat n'a pas encore parlé.
- **Toujours disponible** : le tout premier run de votre dépôt, sur `main` (onglet *Actions*). À la création du dépôt, la chaîne a tourné sur le socle seul, et le contrat a refusé un projet sans chatbot.
- Une capture d'écran ou une phrase ne compte pas.

## Indices

<details>
<summary>La carte des tests du contrat : quel test regarde quoi</summary>

| Test rouge | Ce qu'il attend | Où corriger |
|---|---|---|
| refuse ce qui n'est pas du texte, avec un message d'erreur | `validateMessage(42)` renvoie `{ ok: false, error: '…' }` sans planter : tester `typeof raw !== 'string'` avant `trim()` | `brain.js` |
| refuse le vide et les espaces seuls | un texte vide, ou fait d'espaces, de tabulations et de retours à la ligne, est refusé avec un message d'erreur | `brain.js` |
| accepte un message et retire les espaces autour | `validateMessage('  salut  ')` renvoie exactement `{ ok: true, value: 'salut' }` | `brain.js` |
| accepte 280 caractères et refuse 281 ; mesure la longueur après avoir retiré les espaces | `trim()` d'abord, puis la limite de 280 | `brain.js` |
| répond toujours par un texte non vide | même `replyTo('')` renvoie une phrase | `brain.js` |
| ignore la casse et les espaces autour | `replyTo('  SALUT ')` donne la même réponse que `replyTo('salut')` : `trim()` et `toLowerCase()` avant de comparer | `brain.js` |
| donne la même réponse à « bonjour » et à « salut » | « bonjour » reçoit la réponse de « salut » | `brain.js` |
| donne une réponse distincte à salut, aide et test | trois réponses différentes | `brain.js` |
| répond à une phrase inconnue par un repli distinct | le repli diffère des réponses à « salut », « aide » et « test » | `brain.js` |
| brain.js ne touche pas à la page | aucun mot `document`, `window` ou `localStorage` dans `brain.js`, même dans une phrase de réponse | `brain.js` |
| view.js affiche du texte et ne décide pas des réponses | `textContent` uniquement ; ni `replyTo` ni `validateMessage` dans `view.js` | `view.js` |
| app.js ne fabrique pas les lignes de la conversation | aucun `createElement('li')` dans `app.js` : c'est le rôle de `renderMessages` | `app.js`, `view.js` |
| app.js n'injecte jamais de HTML | ni `innerHTML`, ni `outerHTML`, ni `insertAdjacentHTML` dans `app.js`, même pour le statut | `app.js` |
| le serveur sert /js/… en JavaScript | le fichier existe dans `public/js/` | votre copie |
| GET / sert la page d'accueil en HTML | `index.html` contient une balise `<main>` | `index.html` |
| envoyer affiche le message puis la réponse du cerveau | un bouton dont le texte contient « Envoyer » ; après l'envoi, deux `li` dans `#messages`, champ vidé, aucune erreur dans la console | `index.html`, `app.js` |
| un message fait d'espaces est refusé avec une erreur visible | un texte dans `#status`, aucune ligne ajoutée | `app.js` |
| le texte reste du texte, jamais du HTML | `<b>gras</b>` affiché avec ses chevrons | `view.js` |
| la conversation survit au rechargement | l'historique est enregistré à chaque message et relu au démarrage | `app.js` |
| la mémoire est rangée sous la clé capweb.historique | après « salut », cette clé contient un tableau JSON de deux objets : exactement `{ role: 'user', text: 'salut' }`, puis un objet dont `role` vaut `'assistant'` | `app.js` |
| une mémoire abîmée ne casse pas la page | `JSON.parse` dans un `try/catch` | `app.js` |
| Effacer vide la conversation… ; annuler la confirmation garde la conversation | un bouton `#effacer` ; `confirm(…)` ; si oui, historique et `localStorage` vidés | `index.html`, `app.js` |

</details>

<details>
<summary>Copier le dossier en ligne de commande</summary>

Depuis la racine de `capweb-<id>`, en remplaçant `cap-web` par le dossier de votre projet de J1 :

- Windows (PowerShell) : `Copy-Item -Recurse ..\cap-web\atelier\public .\public`
- macOS : `cp -R ../cap-web/atelier/public ./public`

Vérifier : `public/index.html` et `public/js/app.js` existent, et il n'y a pas de dossier `public/public/`.

</details>

<details>
<summary>Cannot find module …/public/js/brain.js</summary>

Le fichier n'est pas où le contrat l'attend. Il faut `public/js/brain.js` à la racine du dépôt : pas `atelier/public/…`, pas `public/public/…`. Les noms comptent aussi : `brain.js`, `view.js`, `app.js`, en minuscules.

</details>

<details>
<summary>Le lint est rouge</summary>

Chaque ligne donne le fichier, la ligne et la règle. `prefer-const` : remplacez `let` par `const`. `eqeqeq` : remplacez `==` par `===`. `no-unused-vars` : supprimez la variable ou l'import inutilisé. `no-undef` : un nom mal écrit, ou jamais déclaré.

</details>

<details>
<summary>Tous les tests navigateur sont rouges</summary>

La page ne marche pas du tout. Lancez `npm start`, ouvrez `http://127.0.0.1:3000` et la console (F12) : lisez la première erreur. Un 404 sur un fichier JavaScript : il manque dans la liste blanche de `server/app.js`. « does not provide an export named » : le nom importé ne correspond pas au nom exporté.

</details>

<details>
<summary>http://127.0.0.1:4173 is already used</summary>

Un serveur de tests précédent tourne encore. Fermez les terminaux où des tests tournaient, puis relancez. Si l'erreur reste, demandez au formateur plutôt que d'arrêter un processus inconnu.

</details>

<details>
<summary>Votre test de J1 contredit le contrat</summary>

Le contrat gagne. Corrigez votre test dans `tests/brain.test.js`, et dites-le dans la description de la PR.

</details>

<details>
<summary>Un run rouge existe déjà sur main, avant votre PR</summary>

Normal : à la création du dépôt, la chaîne a tourné sur le socle seul. Sans `public/`, le contrat ne trouve pas `public/js/brain.js`. Votre PR fusionnée ramènera `main` au vert. Ce run rouge peut servir de preuve (voir plus haut).

</details>

<details>
<summary>git push est refusé, ou le dépôt est introuvable</summary>

L'invitation n'est pas encore acceptée, ou vous êtes connecté avec un autre compte GitHub. Ouvrez `https://github.com/<organisation>/capweb-<id>/invitations`. Si GitHub refuse le mot de passe : utilisez la fenêtre de connexion qui s'ouvre, comme au TP12.

</details>

<details>
<summary>Merge pull request reste grisé alors que verifier est vert</summary>

La branche est en retard sur `main` : GitHub affiche *This branch is out-of-date with the base branch*. Cliquez sur *Update branch*, puis attendez que `verifier` repasse au vert.

</details>

<details>
<summary>Review deployments n'apparaît pas</summary>

Attendez la fin de `verifier` sur `main` : l'approbation n'est demandée qu'après. Si le job `production` a tourné sans rien demander, vous n'êtes pas encore relecteurs de l'environnement `production` : prévenez le formateur.

</details>

<details>
<summary>Deux postes, une seule branche</summary>

Avant de travailler : `git pull`. Un seul poste pousse à la fois. En cas de conflit, arrêtez-vous et lisez à deux les fichiers concernés.

</details>

<details>
<summary>npm ci ou Chromium ne s'installent pas</summary>

Installez sur un seul poste du binôme. Sur l'autre, poussez vos commits et lisez le job `verifier` de la PR : il lance exactement le même contrat.

</details>

## Question pour la soutenance

Quel test du contrat était rouge chez vous en premier ? Qu'attendait-il, et quelle modification l'a fait passer au vert ?

---

Suivant : [CP2-1 — La spec et les règles de l'agent](cp2-1-spec-et-agents.md) · Retour : [README](README.md)
