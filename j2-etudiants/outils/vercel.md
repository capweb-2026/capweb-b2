# Vercel : votre chatbot en ligne, par la chaîne

Notice du CP2. CLI Vercel **59.16.0**, version épinglée et vérifiée le 14 septembre 2026. Durée : 30 à 40 minutes.

## Ce que vous mettez en place

La chaîne de votre dépôt déploie sur **votre** compte Vercel, sans que personne ne tape de commande de déploiement :

- chaque PR : une **preview** (adresse privée), puis un **smoke test** Playwright ;
- chaque fusion dans `main` : une **approbation** humaine, la **prod** (adresse publique), un smoke test, puis un tag `prod-<numéro>` ;
- en cas d'incident : le workflow **retour-arriere** remet un tag en prod.

## Qui fait quoi

- **A** crée le compte Vercel du binôme (un seul compte par binôme) et fait les étapes 1 à 6 sur son ordinateur.
- **B** relit chaque étape avec A. Les étapes 7 à 12 se font à deux : vous êtes tous les deux administrateurs du dépôt et relecteurs de l'environnement `production`.

## Trois règles

1. Le jeton Vercel et le secret de contournement ne passent jamais par l'agent (dsh), le chat, un fichier du dépôt, une issue, une PR ou une capture d'écran.
2. Le dossier `.vercel/` n'est jamais commité.
3. Personne ne déploie à la main (`vercel`, `vercel deploy`, `vercel --prod`) : la prod ne reçoit que ce que la chaîne a prouvé.

Tapez les commandes dans un terminal ordinaire (PowerShell sous Windows, Terminal sous macOS), à la racine de votre dépôt cloné, **pas dans l'agent**.

## 1. Créer le compte Vercel Hobby avec GitHub (A)

1. Ouvrez https://vercel.com/signup.
2. Choisissez **Hobby**, puis **Continue with GitHub**, avec votre propre compte GitHub.
3. N'importez aucun dépôt et ne créez aucun projet sur le site : le projet sera créé à l'étape 4, sans connexion Git.

Vérifier : https://vercel.com/dashboard s'ouvre sur votre équipe, marquée **Hobby**, sans projet.

## 2. Installer la CLI Vercel 59.16.0 (A)

Sous Windows (PowerShell) comme sous macOS (Terminal) :

```sh
npm install --global vercel@59.16.0
vercel --version
```

- Windows : si PowerShell répond « l'exécution de scripts est désactivée sur ce système », tapez `vercel.cmd` à la place de `vercel`, ici et dans toute la suite.
- macOS : si l'installation échoue avec `EACCES`, n'utilisez pas `sudo` ; tapez `npx --yes vercel@59.16.0` à la place de `vercel`, ici et dans toute la suite.

Vérifier : `vercel --version` affiche `59.16.0`. Si une autre version s'affiche, une ancienne CLI passe devant : `where.exe vercel` (Windows) ou `which -a vercel` (macOS) montre laquelle, et vous tapez alors `npx --yes vercel@59.16.0` à la place de `vercel`.

## 3. Se connecter : `vercel login` (A)

```sh
vercel login
```

La CLI affiche un code et l'adresse https://vercel.com/device. Appuyez sur Entrée pour ouvrir le navigateur (ou ouvrez l'adresse vous-même), connectez-vous avec GitHub, vérifiez que le code affiché dans le navigateur est celui du terminal, puis approuvez. Refusez toute demande que vous n'avez pas lancée vous-même à l'instant.

Vérifier : `vercel whoami` affiche votre nom d'utilisateur Vercel.

## 4. Créer le projet avec `vercel link`, sans connecter Git (A)

Dans votre clone, placez-vous sur `main` à jour (`git switch main`, puis `git pull`), à la racine : le dossier qui contient `package.json` et `vercel.json`. Puis :

```sh
vercel link
```

Répondez ainsi (libellés de la CLI 59.16.0) :

| Question | Réponse |
|---|---|
| `Which team?` (seulement si elle apparaît) | votre équipe Hobby |
| `Which project?` | **Create a new project** |
| `Name?` | le nom de votre dépôt, par exemple `capweb-a1` |
| `Connect this Git repository to automatically deploy changes on every push?` | **N**, ou Entrée : non est la réponse par défaut |
| `Code directory?` | Entrée (la racine) |
| `Customize settings?` | **N**, ou Entrée : les réglages affichés viennent de `vercel.json` |

N'utilisez jamais `vercel link --yes` : avec `--yes`, la CLI connecte le dépôt Git sans poser la question, et Vercel déploierait chaque push en plus de la chaîne.

Vérifier : la CLI termine par une ligne `Created` suivie de `<équipe>/<projet>` ; le fichier `.vercel/project.json` existe ; sur https://vercel.com/dashboard, le projet → **Settings → Git** propose de connecter un dépôt, donc aucun n'est connecté.

## 5. Relever `orgId` et `projectId`, garder `.vercel/` hors de Git (A)

Windows (PowerShell) :

```powershell
Get-Content .vercel\project.json
```

macOS :

```sh
cat .vercel/project.json
```

Le fichier ressemble à `{"projectId":"prj_…","orgId":"team_…","projectName":"capweb-a1"}`. Gardez ce terminal ouvert : `orgId` et `projectId` servent à l'étape 7.

`vercel link` a peut-être ajouté une ligne `.vercel` à la fin de `.gitignore`. Si `git status` montre `.gitignore` modifié, annulez ce changement avec `git restore .gitignore` : le dépôt ignore déjà ce dossier.

Vérifier : `git status` ne mentionne ni `.vercel` ni `project.json`, et `git check-ignore -v .vercel/project.json` affiche la ligne de `.gitignore` qui ignore ce fichier.

## 6. Créer un jeton pour GitHub Actions (A)

1. Ouvrez https://vercel.com/account/tokens.
2. Nom : `github-actions-capweb-a1`, avec l'identifiant de votre binôme.
3. **Scope** : votre équipe Hobby, puis **All Projects**. Pas un projet précis : avec cette version de la CLI, `vercel pull` doit pouvoir lire l'équipe. Si votre équipe n'apparaît pas dans la liste, choisissez **Full Account**.
4. **Expiration** : la plus courte qui couvre la formation, par exemple 7 jours.
5. **Create**, puis copiez la valeur. Vercel ne la montrera plus jamais : passez directement à l'étape 7, sans la coller ailleurs.

Vérifier : le jeton apparaît dans la liste de https://vercel.com/account/tokens avec sa date d'expiration, et la valeur copiée commence par `vcp_`.

## 7. Ranger les secrets dans les environnements GitHub (A et B)

Dans le dépôt, sur GitHub : **Settings → Environments**. Les environnements `preview` et `production` ont été créés par le formateur. Pour **chacun des deux** : cliquez sur son nom → **Environment secrets** → **Add environment secret**, et créez ces trois secrets :

| Nom | Valeur |
|---|---|
| `VERCEL_TOKEN` | le jeton de l'étape 6 |
| `VERCEL_ORG_ID` | `orgId`, lu à l'étape 5 |
| `VERCEL_PROJECT_ID` | `projectId`, lu à l'étape 5 |

Ne changez rien d'autre : `production` exige l'approbation de l'un de vous deux et n'accepte que `main`. Quand c'est fini, copiez n'importe quel autre texte pour vider le presse-papiers.

Vérifier : `preview` et `production` affichent chacun `VERCEL_TOKEN`, `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID`, écrits exactement ainsi ; `git grep -n "vcp_"` ne trouve rien dans le dépôt.

## 8. Protection des previews : le réglage retenu (A, puis A ou B)

Réglage retenu : **Vercel Authentication activée en Standard Protection**, c'est-à-dire le réglage par défaut, et **un secret de contournement** réservé au smoke test.

- Les previews, et l'adresse unique de chaque déploiement, ne s'ouvrent qu'une fois connecté au compte Vercel de A.
- Le domaine de production reste public.
- Le smoke test ouvre les adresses protégées en envoyant le secret dans l'en-tête `x-vercel-protection-bypass`.

1. Sur Vercel : le projet → **Settings → Deployment Protection**.
2. Section **Vercel Authentication** : laissez-la activée, en **Standard Protection**. Ne choisissez pas **All Deployments** (votre prod deviendrait privée) et ne la désactivez pas.
3. Section **Protection Bypass for Automation** : créez un secret (note : `smoke test GitHub Actions`) et copiez sa valeur.
4. Sur GitHub : **Settings → Secrets and variables → Actions → Secrets → New repository secret**. Nom : `VERCEL_AUTOMATION_BYPASS_SECRET` ; valeur : le secret copié. C'est un secret **du dépôt**, pas d'un environnement : les smoke tests l'utilisent sans attendre d'approbation.

Vérifier : Vercel affiche Vercel Authentication activée en **Standard Protection** et un secret dans **Protection Bypass for Automation** ; GitHub affiche `VERCEL_AUTOMATION_BYPASS_SECRET` dans **Repository secrets**.

## 9. Première mise en production, avant toute preview (A et B)

Chez Vercel, le tout premier déploiement d'un projet devient toujours la production. Pour que ce soit une version approuvée de `main`, et non la preview d'une PR, lancez-le maintenant. **Ne poussez rien sur une PR ouverte avant la fin de cette étape.**

1. GitHub → **Actions** → workflow **chaine** → **Run workflow** → branche `main` → **Run workflow**.
2. Quand le job `production` attend : **Review deployments** → cochez `production` → **Approve and deploy**.
3. Attendez la fin de `smoke-production`, puis de `tag-production`.
4. Sur Vercel, ouvrez le projet : le bouton **Visit** et la liste **Domains** montrent le domaine de production, de la forme `https://<nom>.vercel.app`. Copiez-le.
5. GitHub → **Settings → Secrets and variables → Actions → Variables → New repository variable**. Nom : `URL_PRODUCTION` ; valeur : `https://<nom>.vercel.app`, sans `/` final.

Vérifier : le run `chaine` est vert, jobs `production`, `smoke-production` et `tag-production` compris ; un tag `prod-<numéro>` apparaît dans **Tags** ; dans une fenêtre de navigation privée, `https://<nom>.vercel.app/version.json` s'ouvre sans connexion et son champ `version` correspond aux 7 premiers caractères du dernier commit de `main`.

## 10. Première PR : preview et smoke test (A ou B)

1. Ouvrez votre PR vers `main` comme d'habitude, ou poussez un commit sur la PR déjà ouverte.
2. Attendez les contrôles `verifier`, puis `preview`, puis `smoke-preview`.
3. Ouvrez la preview : bouton **View deployment** dans la PR, ou adresse `https://….vercel.app` affichée à la ligne `Preview` du journal du job `preview`.

Ce que fait la chaîne, et que vous devez pouvoir expliquer : elle vérifie le projet, construit `dist/`, retire le dossier `.git` de sa copie de travail (sur le plan Hobby, Vercel refuserait sinon les commits de la personne qui ne possède pas le compte ; rien n'est réécrit), déploie avec le jeton, puis Playwright ouvre la preview avec le secret de contournement, envoie « salut » et compare `/version.json` au commit de la PR.

Vérifier : `verifier`, `preview` et `smoke-preview` sont verts ; la preview s'ouvre dans le navigateur où A est connecté à Vercel ; la même adresse, dans une fenêtre privée, affiche une page de connexion Vercel (la protection fonctionne) ; `/version.json` de la preview donne le dernier commit de la PR.

## 11. Fusion, approbation, prod (A et B)

1. Fusionnez la PR quand `verifier` est vert et que vous savez expliquer tout le diff.
2. **Actions** → le run `chaine` lancé par la fusion → **Review deployments** → `production` → **Approve and deploy**. C'est votre décision de mise en prod : une seule approbation est demandée.
3. Attendez `smoke-production`, qui teste `URL_PRODUCTION`, puis `tag-production`.

Vérifier : dans une fenêtre privée, `https://<nom>.vercel.app/version.json` donne le dernier commit de `main` (le commit de fusion) ; un nouveau tag `prod-<numéro>` existe ; la page publique montre la nouvelle version.

## 12. Lancer un retour arrière (A ou B)

À utiliser quand la prod est cassée : on remet en ligne une version déjà prouvée, sans toucher `main`.

1. Dans **Tags**, repérez le dernier tag sain (par exemple `prod-12`) et notez son commit.
2. Si un run `chaine` attend une approbation, approuvez-le ou annulez-le d'abord : `retour-arriere` attend son tour dans la même file.
3. **Actions** → workflow **retour-arriere** → **Run workflow** → branche `main`, champ `tag` : `prod-12` → **Run workflow**.
4. **Review deployments** → `production` → **Approve and deploy**, puis attendez `smoke-production`.
5. Corrigez ensuite `main` par une PR : la prochaine fusion remettra `main` en prod. Notez l'incident pour le post-mortem.

N'utilisez jamais le bouton **Instant Rollback** de Vercel : après lui, Vercel n'attribue plus le domaine de production aux déploiements suivants, et vos mises en prod resteraient invisibles.

Vérifier : le run `retour-arriere` est vert et `https://<nom>.vercel.app/version.json` donne le commit du tag choisi.

## Si ça bloque

| Symptôme | Cause probable | Que faire |
|---|---|---|
| `vercel --version` n'affiche pas `59.16.0` | une ancienne CLI passe devant | `npx --yes vercel@59.16.0` à la place de `vercel` |
| PowerShell : « l'exécution de scripts est désactivée sur ce système » | stratégie d'exécution de Windows | `vercel.cmd` à la place de `vercel` |
| macOS : `EACCES` pendant l'installation | dossier global protégé | pas de `sudo` : `npx --yes vercel@59.16.0` |
| Vous avez répondu oui à la connexion Git, ou **Settings → Git** montre un dépôt | Vercel déploierait aussi chaque push | **Settings → Git → Disconnect**, puis prévenez le formateur |
| Job `preview` : notice « Pas de preview », aucun déploiement | secrets absents de l'environnement `preview` | refaire l'étape 7 |
| Job `preview` ou `production` : `You specified VERCEL_ORG_ID but you forgot to specify VERCEL_PROJECT_ID` (ou l'inverse) | secret manquant ou mal nommé | refaire l'étape 7 |
| Job `preview` ou `production` : erreur 403, `team_unauthorized`, `not authorized` ou jeton invalide | jeton limité à un projet, expiré ou supprimé | recréer le jeton (étape 6) et remplacer `VERCEL_TOKEN` dans les deux environnements |
| Job `preview` : `Git author … must have access to the team … on Vercel` | la chaîne ne retire pas `.git` avant de déployer | prévenez le formateur ; ne modifiez pas la chaîne sans `HARNAIS-CHANGE` |
| `smoke-preview` rouge : `#chat-form` introuvable, page de connexion Vercel ou erreur 401 dans la trace | secret de contournement absent, faux ou supprimé dans Vercel | refaire l'étape 8 |
| `smoke-production` rouge : le commit de `/version.json` n'est pas celui attendu | `URL_PRODUCTION` fausse, ou **Instant Rollback** cliqué dans Vercel | vérifier la variable ; dans Vercel, **Undo Rollback** ; relancer le job |
| Le job `production` reste « Waiting » | il attend une approbation | **Review deployments** |
| Le job `production` est refusé à cause de la branche | workflow lancé depuis une autre branche que `main` | relancer depuis `main` |
| Vercel refuse de déployer (erreur 429, limite atteinte) | plan Hobby : 100 déploiements par jour | regroupez vos pushs et prévenez le formateur |
| Pas d'environnement `preview` ou `production` dans **Settings → Environments** | dépôt incomplet | prévenez le formateur |

## À ne jamais faire

- Déployer à la main avec `vercel`, `vercel deploy` ou `vercel --prod`.
- Lancer `vercel link --yes`, ou connecter le dépôt Git dans Vercel.
- Commiter `.vercel/` ; coller le jeton ou le secret de contournement dans l'agent, le chat, un fichier, une issue, une PR ou une capture d'écran.
- Passer la protection en **All Deployments**, ou la désactiver sans l'accord du formateur.
- Cliquer **Instant Rollback** dans Vercel : utilisez le workflow `retour-arriere`.

## Après la formation

Supprimez le jeton sur https://vercel.com/account/tokens et le secret dans **Settings → Deployment Protection → Protection Bypass for Automation**.

Vérifier : le jeton n'apparaît plus dans la liste des jetons, et la chaîne ne peut plus déployer (le job `preview` échoue ou affiche « Pas de preview »).
