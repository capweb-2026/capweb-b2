# DeepSeek Harness (dsh) : votre agent de code, branché sur la passerelle

Notice du CP2. dsh **0.1.5-rc.2**, version épinglée et vérifiée le 14 septembre 2026 sous Windows 11. Sous macOS, les étapes suivent la documentation de dsh et de npm, sans essai sur Mac pour l'instant.

Durée : 6 minutes d'installation, puis 15 minutes de réglages.

- **Le matin**, dès que votre poste est libre : étapes 1 et 2.
- **À 13 h 38**, avec la fiche de clés envoyée par le formateur : étapes 3 à 8.

## Ce que vous mettez en place

- dsh, installé à la version exacte testée par le formateur ;
- un dossier réservé à dsh, `dsh-capweb`, hors de votre dépôt : il contient ses réglages, la clé « agent » de votre binôme et l'historique de vos sessions ;
- la passerelle de la formation comme seul fournisseur d'IA, avec le modèle `capweb-ia` ;
- le mode **Read Only** : l'agent lit librement, mais chaque écriture passe par votre accord ;
- l'interface de dsh dans le navigateur, ouverte sur le dossier de votre dépôt.

## Qui fait quoi

Chaque membre du binôme peut faire toutes les étapes sur son propre ordinateur. La clé « agent » est celle du binôme : elle sert sur vos deux postes, et nulle part ailleurs.

## Trois règles

1. L'agent propose et écrit. Vous lisez, vous lancez les tests, vous commitez. L'agent ne touche jamais à git.
2. La clé « agent » ne va jamais dans votre dépôt, dans le chat de l'agent, dans une issue ni sur une capture d'écran.
3. Ni donnée personnelle ni secret dans ce que l'agent peut lire : tout part chez un fournisseur d'IA externe (section 11).

Tapez les commandes dans un terminal ordinaire (PowerShell sous Windows, Terminal sous macOS), **pas dans l'agent**.

## 1. Installer dsh 0.1.5-rc.2

Sous Windows comme sous macOS :

```sh
npm install --global @deepseek-ai/dsh@0.1.5-rc.2 --before=2026-09-14T18:00:00Z
dsh --version
```

Pourquoi `--before` : dsh sort une nouvelle version tous les deux ou trois jours, et ses modules internes suivent automatiquement les dernières publications. Sans cette option, deux postes installeraient deux dsh différents. Avec elle, npm installe exactement ce qui existait au moment de l'essai du formateur. Comptez environ 6 minutes et 230 Mo (mesuré sous Windows).

- Windows : si PowerShell répond « l'exécution de scripts est désactivée sur ce système », tapez `dsh.cmd` à la place de `dsh`, ici et dans toute la suite.
- macOS : si l'installation échoue avec `EACCES`, n'utilisez pas `sudo`. Suivez la procédure de npm ([Resolving EACCES permissions errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)) : `npm config set prefix ~/.local`, ajoutez la ligne `PATH=~/.local/bin:$PATH` à `~/.profile` et `source ~/.profile` à `~/.zprofile`, lancez `source ~/.profile`, puis relancez l'installation.

Vérifier : `dsh --version` affiche `0.1.5-rc.2`.

## 2. Donner à dsh son propre dossier et couper sa télémétrie

dsh range tout dans le dossier indiqué par la variable `DSH_HOME` (sinon dans `~/.dsh`). Un dossier à part garde les réglages de la formation séparés de tout le reste, et se supprime d'un coup à la fin.

La variable `DSH_TELEMETRY_MODE=DISABLED` coupe la télémétrie de dsh : sans elle, un simple clic sur un bouton d'avis dans l'interface envoie toute la session (messages, fichiers lus, sorties de commandes, chemin du dossier) au service de télémétrie de DeepSeek.

Windows (PowerShell) :

```powershell
New-Item -ItemType Directory -Force "$HOME\dsh-capweb"
[Environment]::SetEnvironmentVariable("DSH_HOME", "$HOME\dsh-capweb", "User")
[Environment]::SetEnvironmentVariable("DSH_TELEMETRY_MODE", "DISABLED", "User")
```

Puis fermez **tous** vos terminaux, et VS Code s'il est ouvert, et rouvrez-en un : ces variables ne sont lues qu'à l'ouverture.

macOS (Terminal) :

```sh
mkdir -p "$HOME/dsh-capweb"
echo 'export DSH_HOME="$HOME/dsh-capweb"' >> ~/.zshrc
echo 'export DSH_TELEMETRY_MODE=DISABLED' >> ~/.zshrc
source ~/.zshrc
```

Ne mettez pas ces deux variables dans un fichier `.env` : dsh refuse d'y lire les variables qui commencent par `DSH_`.

Vérifier : dans un **nouveau** terminal, `echo $env:DSH_HOME` puis `echo $env:DSH_TELEMETRY_MODE` (Windows), ou `echo "$DSH_HOME"` puis `echo "$DSH_TELEMETRY_MODE"` (macOS), affichent le chemin du dossier `dsh-capweb`, puis `DISABLED`.

## 3. Déclarer la passerelle : `settings.yaml`

Ouvrez le dossier `dsh-capweb` dans votre éditeur (VS Code : **Fichier → Ouvrir le dossier**). Créez le fichier `settings.yaml` et collez exactement ce contenu, puis remplacez l'adresse de la ligne `baseURL` par la valeur `CAPWEB_IA_URL` de votre fiche. Elle commence par `https://` et finit par `/v1`.

```yaml
llm-pi-ai:
  providers:
    capweb:
      displayName: Passerelle Cap Web
      api: openai-completions
      baseURL: https://ADRESSE-DE-LA-PASSERELLE/v1
      apiKeyEnv: CAPWEB_IA_CLE
      models:
        - id: capweb-ia
agent-default-model:
  provider: capweb
  model: capweb-ia
permission:
  defaultPreset: read-only
```

Ce que disent ces lignes :

- `llm-pi-ai` déclare un fournisseur `capweb` compatible OpenAI, à l'adresse de la passerelle, avec un seul modèle : `capweb-ia` ;
- `apiKeyEnv: CAPWEB_IA_CLE` donne le **nom** sous lequel dsh cherchera la clé (étape 4), jamais la clé elle-même ;
- `agent-default-model` fait de `capweb-ia` le modèle de chaque nouvelle session ;
- `permission` démarre chaque nouvelle session en **Read Only**.

Indentation : uniquement des espaces, comme dans le bloc ci-dessus. Une tabulation empêche dsh de démarrer.

Vérifier : `Get-ChildItem $env:DSH_HOME` (Windows) ou `ls -a "$DSH_HOME"` (macOS) montre `settings.yaml`, et pas `settings.yaml.txt` ; la ligne `baseURL` contient votre adresse et finit par `/v1` ; `capweb-ia` est écrit en minuscules aux deux endroits.

## 4. Ranger la clé « agent » : `.credentials.yaml`

Dans le même dossier `dsh-capweb`, créez le fichier `.credentials.yaml` (son nom commence par un point) :

```yaml
version: 1
refs:
  CAPWEB_IA_CLE: COLLEZ-ICI-LA-CLE-AGENT
```

Remplacez `COLLEZ-ICI-LA-CLE-AGENT` par la clé **« agent »** de votre fiche, pas par la clé « app ». Enregistrez, puis copiez n'importe quel autre texte pour vider le presse-papiers.

macOS uniquement : protégez le fichier, sinon dsh refuse de le lire.

```sh
chmod 600 "$DSH_HOME/.credentials.yaml"
```

Pourquoi ce fichier plutôt qu'une variable d'environnement ou un `.env` : dsh y lit la clé sans la placer dans l'environnement des commandes que lance l'agent. Une variable `CAPWEB_IA_CLE` exportée dans le terminal, elle, est lisible par ces commandes (vérifié). Et un fichier `.env` dans votre dépôt serait chargé par dsh et lisible par l'agent.

Ce fichier reste un fichier de votre ordinateur : l'agent pourrait l'ouvrir s'il le décidait, et dsh ne vous demanderait rien. Si vous le voyez ouvrir ce fichier ou afficher la clé, arrêtez la session et prévenez le formateur, qui coupera la clé.

Vérifier : `Test-Path "$env:DSH_HOME\.credentials.yaml"` affiche `True` (Windows) ; `ls -l "$DSH_HOME/.credentials.yaml"` commence par `-rw-------` (macOS) ; `git status`, lancé dans votre dépôt, ne mentionne aucun de ces fichiers.

## 5. Premier essai, sans interface

Placez-vous à la racine de votre dépôt cloné (le dossier qui contient `package.json`), puis :

```sh
dsh --profile headless "Reponds uniquement OK"
```

dsh envoie cette seule consigne à la passerelle, affiche la réponse, puis rend la main. Le tout premier lancement prend 20 à 30 secondes : dsh prépare son dossier.

Vérifier : une courte réponse s'affiche et le terminal rend la main ; le dossier `dsh-capweb` contient maintenant `profiles` et `sessions`. Si une ligne commence par `dsh:`, voir « Si ça bloque ».

## 6. Lancer l'agent depuis le dossier du dépôt

Toujours à la racine de votre dépôt :

```sh
dsh web
```

1. Le terminal affiche une ligne `dsh web: http://127.0.0.1:3080/?token=…` et le navigateur s'ouvre sur l'interface de dsh. S'il ne s'ouvre pas, copiez cette adresse **complète** dans votre navigateur. Gardez ce terminal ouvert : le fermer arrête l'agent. Ne partagez jamais cette adresse : le jeton qu'elle contient donne accès à votre agent.
2. Au premier lancement, dsh affiche un avertissement sur son statut de logiciel en test : lisez-le et acceptez-le. S'il vous propose ensuite d'entrer une clé DeepSeek, choisissez **Configure later** : n'entrez jamais de clé DeepSeek, et revérifiez les étapes 3 et 4.
3. Cliquez sur **Choose workspace**, ajoutez **la racine de votre dépôt** (le dossier qui contient `package.json` et `.git`), puis sélectionnez-la. Pas un sous-dossier comme `public`, pas un dossier parent.
4. Gardez le mode d'agent proposé par défaut, `标准模式` (le mode standard). Ne choisissez pas `极简模式` : ce mode ne lit pas `AGENTS.md`.
5. Pour arrêter dsh plus tard : `Ctrl+C` dans le terminal (une seconde fois si rien ne se passe au bout de quelques secondes).

Vérifier : la zone de saisie est active ; le modèle affiché est `capweb-ia` ; en tapant `/permission` dans la zone de saisie, le mode actif est **Read Only**.

## 7. Première consigne

Si `AGENTS.md` et `SPEC.md` ne sont pas encore à la racine de votre dépôt, copiez-y les modèles [`AGENTS.md`](../modeles/AGENTS.md) et [`SPEC.md`](../modeles/SPEC.md) : vous les compléterez au CP2-1.

Dans l'interface, démarrez une nouvelle session et envoyez :

> Lis AGENTS.md et SPEC.md, propose un plan court, n'écris rien avant mon accord.

dsh joint automatiquement `AGENTS.md` au début de chaque session. `SPEC.md`, en revanche, l'agent doit l'ouvrir lui-même : c'est pour cela que la consigne le nomme.

Variante : tapez `/plan` suivi de votre demande. L'agent vous présente alors son plan avec les boutons **Approve** et **Keep planning**. Le mode plan ne bloque rien à lui seul : c'est Read Only qui bloque les écritures.

Vérifier : la réponse reprend au moins deux interdits de votre `AGENTS.md` (par exemple git et `.env`) et des critères de `SPEC.md`, propose un plan en quelques étapes, et `git status`, lancé dans votre terminal, ne montre aucun fichier modifié.

## 8. Répondre aux demandes d'autorisation

En Read Only, quand l'agent veut écrire (créer ou modifier un fichier, lancer une commande qui écrit sur le disque), dsh bloque l'opération. L'agent la redemande alors avec une justification, et dsh vous affiche une demande d'autorisation valable **pour cette seule opération**. Elle nomme l'outil (`write`, `edit`, `pwsh`…) et donne un motif de la forme `escalate sandbox to workspace-write: <justification de l'agent>`.

Avant de répondre, lisez : quel fichier ou quelle commande ; est-ce prévu dans le plan que vous avez accepté ; est-ce que cela touche un interdit ; pouvez-vous l'expliquer en une phrase.

- **Autorisez une fois** seulement ce que vous savez expliquer.
- **Refusez** toute opération qui touche git, installe un paquet, lit ou crée `.env`, modifie `tests/contrat/`, `browser/contrat.spec.js`, `.github/`, `scripts/`, `package.json`, `package-lock.json` ou `dependances-autorisees.json`, ou dont vous ne comprenez pas le but. Dites ensuite à l'agent pourquoi, dans le chat.
- **Refusez toujours** une demande `danger-full-access` : elle retirerait tout confinement pour cette opération.
- Ne passez jamais la session en **Full access** avec `/permission`.

Ce que Read Only ne bloque pas : la lecture de n'importe quel fichier de votre ordinateur, les commandes qui ne font que lire, l'accès à Internet. D'où les sections 9 et 11.

Les tests, c'est vous qui les lancez, dans votre terminal : `npm test`, `npm run test:browser`, `npm run verify`. Collez la sortie à l'agent s'il en a besoin. Sous Windows, dans son bac à sable, l'agent ne peut de toute façon pas lancer `npm test` ni les tests navigateur : il obtient `spawn EPERM`, puis peut vous demander `danger-full-access`, que vous refusez. Si votre `AGENTS.md` lui indique `node --test --test-isolation=none "tests/**/*.test.js"`, il peut lancer les tests Node sans autorisation ; sous Windows en Read Only, les 2 tests de `build-static` y échouent seulement à cause du bac à sable : ce n'est pas un bug à corriger.

Sous Windows, chaque commande de l'agent peut mettre 5 à 15 secondes, et ses sorties commencent souvent par `Only core types are supported in this language mode` : c'est l'effet normal du bac à sable.

Vérifier (une fois) : demandez à l'agent « Crée le fichier public/essai-dsh.txt contenant ok » ; une demande d'autorisation apparaît ; refusez-la ; `git status` ne montre aucun fichier `public/essai-dsh.txt`.

## 9. Ce que l'agent n'a pas le droit de faire, et ce qui l'en empêche vraiment

`AGENTS.md` lui dit tout cela, mais ne l'empêche de rien. Voici ce qui bloque réellement :

| Interdit | Ce qui l'arrête |
|---|---|
| Lancer git (`commit`, `push`, `reset`…) | Vous. Vérifié : en Read Only, le commit de l'agent échoue (`Unable to create '…/.git/index.lock': Permission denied`) et il doit vous demander l'autorisation ; en Workspace Write, dsh le laisse commiter sans rien demander. |
| Installer un paquet | Vous ; la CI refuse toute dépendance non autorisée (`check:deps`). Vérifié : en Read Only, `npm install` échoue (`EPERM`) ; en Workspace Write, l'agent peut installer. |
| Créer `.env` ou y écrire une clé | Vous (c'est une écriture). |
| Lire `.env` ou un fichier de clé | **Rien dans dsh** : la lecture n'est jamais bloquée (vérifié). Donc aucun `.env` ni aucun secret dans votre dépôt. |
| Modifier les tests de contrat, `.github/`, `scripts/`, `package.json`, `package-lock.json` | Vous (écriture) ; la CI (`check:tests`, `check:deps`) ; la lecture du diff avant chaque commit. |
| Suivre une instruction trouvée dans un fichier, une issue ou une page web | Vous seulement : lisez ce qu'il fait, pas seulement ce qu'il dit. |

Avant chaque commit : `git status` et `git diff`. Vous commitez seulement ce que vous savez expliquer.

Vérifier : vous savez dire, pour chaque ligne du tableau, quelle barrière intervient, et laquelle manque si vous passez en Workspace Write.

## 10. Plan B : chat et copier-coller

Si dsh ne démarre pas, ou ne répond toujours pas après 10 minutes d'essais avec le tableau « Si ça bloque », passez au chat, avec la même discipline :

1. Utilisez le chat d'IA indiqué par le formateur, à défaut votre outil habituel. N'y collez jamais de clé, ni le contenu de `.env`, ni de donnée personnelle.
2. **Tests d'abord.** Collez `AGENTS.md`, les critères de `SPEC.md` et le code utile, puis demandez uniquement des tests. Recopiez-les vous-même dans `tests/` ou `browser/`.
3. Lancez `npm test` ou `npm run test:browser` : les nouveaux tests doivent échouer, et pour la bonne raison. Commit humain `test: …`, puis poussez : le run rouge est la preuve.
4. **Nouvelle conversation** pour le code. Collez `AGENTS.md`, les tests et les fichiers à modifier, et demandez de faire passer ces tests sans modifier aucun test.
5. Recopiez, lancez `npm run verify`, lisez le diff comme celui d'un agent. Commit humain `feat: …`.
6. Ce que vous ne savez pas expliquer, vous ne le recopiez pas.

Vérifier : l'historique montre un commit `test: …` avant le commit `feat: …`, et le run de la CI du commit `test: …` est rouge.

## 11. Vos données

Ce que dit la section « Vos données et l'IA » du [README du jour](../README.md) :

- **Tout ce que vous envoyez au modèle part chez un fournisseur d'IA externe**, hors de l'école : vos messages, les réponses, et tout ce que l'agent lit pour travailler (fichiers du dépôt, sorties de commandes, messages d'erreur).
- **Ce fournisseur peut réutiliser ces contenus pour améliorer ses produits.** Considérez chaque prompt comme public.
- **Jamais de données personnelles** : ni nom, adresse, téléphone ou e-mail réels, ni information sur une autre personne, ni capture d'écran qui en montre.
- **Jamais de secret** : ni clé, ni mot de passe, ni jeton, ni contenu d'un fichier `.env`.
- La passerelle ne conserve pas le contenu de vos échanges : elle compte seulement le volume d'usage de chaque clé.
- Clé exposée par erreur : prévenez le formateur tout de suite. Il la coupe et vous en donne une nouvelle.

Ce qui s'y ajoute avec dsh :

- L'agent peut lire tout fichier auquel votre compte a accès, pas seulement votre dépôt. Ne lui demandez jamais d'aller chercher un fichier ailleurs.
- Ne cliquez sur aucun bouton d'avis de l'interface (note, pouce, commentaire, `/feedback`). L'étape 2 coupe l'envoi à DeepSeek, mais c'est une barrière de plus, pas une raison de s'en servir.
- dsh garde l'historique complet de vos sessions dans `dsh-capweb/sessions`, sur votre ordinateur.

Vérifier : dans un nouveau terminal, `DSH_TELEMETRY_MODE` affiche toujours `DISABLED` (étape 2), et votre dépôt ne contient ni `.env` ni fichier de clé (`git status --ignored` n'en montre aucun).

## Si ça bloque

| Symptôme | Cause probable | Que faire |
|---|---|---|
| `dsh --version` n'affiche pas `0.1.5-rc.2` | une autre installation de dsh passe devant | refaire l'étape 1 ; `where.exe dsh` (Windows) ou `which -a dsh` (macOS) montre laquelle, puis prévenez le formateur |
| PowerShell : « l'exécution de scripts est désactivée sur ce système » | stratégie d'exécution de Windows | `dsh.cmd` à la place de `dsh` |
| macOS : `EACCES` pendant l'installation | dossier global de npm protégé | pas de `sudo` : procédure npm de l'étape 1 |
| `dsh: AUTH: 401` | clé fausse, clé « app » au lieu de « agent », ou clé coupée | revoir `.credentials.yaml` (étape 4) ; sinon, formateur |
| `dsh: INVALID_REQUEST: 400` avec `Invalid model name` | nom du modèle mal écrit | `capweb-ia`, en minuscules, aux deux endroits de `settings.yaml` |
| `dsh: TRANSPORT: Connection error.` (après une vingtaine de secondes) | adresse fausse, ou passerelle injoignable | `baseURL` = `CAPWEB_IA_URL` exacte, avec `https://` et `/v1` ; sinon, formateur |
| `dsh: MISSING_CREDENTIAL` | `.credentials.yaml` absent ou mal nommé, ou nom différent de `apiKeyEnv` | étape 4 : `CAPWEB_IA_CLE` écrit à l'identique dans les deux fichiers |
| `plugin tree failed to load` et `TAB_AS_INDENT` ou `settings.yaml` | fichier mal indenté ou mal copié | recopier le bloc de l'étape 3, avec des espaces |
| macOS : dsh refuse `.credentials.yaml` | fichier lisible par d'autres utilisateurs | `chmod 600` (étape 4) |
| dsh demande une clé DeepSeek, ou n'affiche pas `capweb-ia` | `DSH_HOME` absent dans ce terminal : dsh lit alors `~/.dsh` | étape 2, puis fermer et rouvrir le terminal (et VS Code) |
| Le navigateur ne s'ouvre pas | ouverture automatique impossible | copier l'adresse complète `dsh web: http://127.0.0.1:3080/?token=…` |
| Port 3080 déjà utilisé | un autre `dsh web` ou un autre programme | arrêter l'autre `dsh web` (`Ctrl+C`), ou lancer `dsh web --port 0` et utiliser l'adresse affichée |
| `spawn EPERM` quand l'agent lance des tests (Windows) | bac à sable de dsh | refuser l'accès complet ; lancer les tests vous-même (section 8) |
| `Only core types are supported in this language mode` (Windows) | PowerShell restreint en Read Only | normal : lisez la suite de la sortie |
| `FS_STALE_VERSION` quand l'agent modifie un fichier | problème signalé sous Windows sur cette version, sans correctif publié | prévenez le formateur |
| `dsh web` ne démarre plus : `corrupt Zstandard session log` | journal de session abîmé (problème signalé) | prévenez le formateur, sans rien supprimer |

## À ne jamais faire

- Installer dsh sans `@0.1.5-rc.2 --before=2026-09-14T18:00:00Z`, ou le mettre à jour pendant la formation.
- Mettre la clé ailleurs que dans `dsh-capweb/.credentials.yaml` : ni dans le dépôt, ni dans un `.env`, ni dans le chat de l'agent.
- Passer une session en **Full access**, autoriser une demande `danger-full-access`, ou autoriser une opération que vous ne savez pas expliquer.
- Laisser l'agent commiter, pousser ou installer un paquet.
- Partager l'adresse `…?token=…` de l'interface, ou lancer `dsh web` avec `--host` ou `--trusted-host`.
- Cliquer sur un bouton d'avis dans l'interface de dsh.

## Après la formation

```sh
npm uninstall --global @deepseek-ai/dsh
```

Puis supprimez le dossier `dsh-capweb` : il contient votre clé et l'historique de vos prompts. Retirez enfin les deux variables :

- Windows (PowerShell) : `[Environment]::SetEnvironmentVariable("DSH_HOME", $null, "User")` et `[Environment]::SetEnvironmentVariable("DSH_TELEMETRY_MODE", $null, "User")` ;
- macOS : supprimez les deux lignes `export DSH_…` de `~/.zshrc`.

Vérifier : dans un nouveau terminal, `dsh --version` ne répond plus, et le dossier `dsh-capweb` n'existe plus.
