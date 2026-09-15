# J2 — Superviser des agents : aucune connerie ne passe en prod

Hier, vous avez écrit Cap Web à la main. Aujourd'hui, il devient un vrai projet : un dépôt GitHub par binôme, un contrat, une chaîne de contrôles et une prod. Des agents vont écrire le code. C'est vous qui décidez de ce qui entre.

## Votre nouveau rôle

**Vous supervisez, l'agent exécute. Vous pouvez ne pas écrire une ligne de code, mais vous devez pouvoir tout expliquer.**

Superviser, c'est : écrire la spec, faire écrire les tests et les voir échouer, lire le diff de l'agent, refuser ce que vous ne savez pas expliquer, commiter, approuver la mise en prod.

Pas de rôle imposé dans le binôme. Chacun doit pouvoir expliquer n'importe quelle partie du projet.

## La journée en deux checkpoints

| Moment | Fiche | Ce que vous livrez |
|---|---|---|
| Matin | [CP1 — Le chatbot de J1 sous contrat](cp1-sous-contrat.md) | Votre chatbot de J1 dans votre dépôt `capweb-<id>`, contrat vert, fusionné dans `main` ; la première preuve de la carte des défenses |
| Après-midi | [CP2-1 — La spec et les règles de l'agent](cp2-1-spec-et-agents.md) | `SPEC.md` et `AGENTS.md` pour l'identité de votre assistant : nom, emoji, accueil, trois questions suggérées |
| Après-midi | [CP2-2 — TDD à deux agents](cp2-2-tdd-deux-agents.md) | Des tests vus rouges, puis le code qui les fait passer, commités par vous |
| Après-midi | [CP2-3 — En prod](cp2-3-prod.md) | L'identité en ligne, après preview et approbation |
| Après-midi | [CP2-4 — Carte des défenses et PR piégées](cp2-4-carte-et-sabotage.md) | Aucune PR piégée fusionnée ; la carte des défenses v1 et ses preuves |
| Fin de journée | [Soutenance 1](soutenance-1.md) | 3 minutes, sans slides |

**À 11 h**, si votre chat ne s'affiche toujours pas, ou si le contrat reste rouge sans piste : passez à la [base de reprise](reprise/README.md).

À chaque checkpoint, le formateur montre le même travail sur son propre assistant, Boussole, avec le même harnais. Des mini-cours de 8 minutes ponctuent la journée ; chacun se termine par une règle à copier dans `AGENTS.md` ou dans la carte des défenses.

Sauf mention contraire, les commandes des fiches se tapent dans un terminal ordinaire, à la racine de votre dépôt `capweb-<id>`, pas dans l'agent.

## La chaîne, en une ligne

Spec → tests vus rouges → code écrit par l'agent → commit humain → PR et contrôle `verifier` → preview → fusion → approbation humaine → prod → tag `prod-<numéro>`.

## Les six règles du harnais

1. L'agent ne touche jamais à git : l'humain commit, et le commit est la décision.
2. On ne délègue pas de code sans test vu rouge.
3. Zéro dépendance ajoutée sans justification : la CI refuse tout changement non justifié de `package.json`.
4. Modifier un test existant exige `TEST-CHANGE:` et une raison dans la description de la PR ; modifier la chaîne, les scripts ou les configurations exige `HARNAIS-CHANGE:`.
5. Le comportement de l'IA se vérifie par un jeu d'évaluation, hors CI ; la CI tourne sans clé.
6. `AGENTS.md` guide l'agent mais ne l'empêche de rien : ce qui bloque, ce sont la CI, la protection de `main`, les permissions de l'outil et l'approbation humaine.

La règle 5 servira mercredi, quand votre assistant parlera à une vraie IA. Et un geste pour toute la semaine : `git add` nomme les fichiers. Jamais `git add -A`, jamais `git add .`.

## Les mots du jour

| Mot | Ce que c'est |
|---|---|
| Contrat | Les tests fournis par le formateur : `tests/contrat/` et `browser/contrat.spec.js`. Votre chatbot doit les respecter. On ne les modifie pas. |
| PR | *Pull request* : une proposition de changement vers `main`. `main` est protégée : rien n'y entre autrement. |
| Chaîne | Le workflow GitHub Actions `chaine`, lancé à chaque PR et à chaque fusion dans `main`. |
| Run | Une exécution de la chaîne. Son adresse contient `/actions/runs/`. |
| `verifier` | Le contrôle obligatoire : lint, tests, dépendances, justifications, tests navigateur. Rouge : fusion impossible. |
| Preview | Le déploiement de test d'une PR, vérifié par un smoke test. |
| Prod | L'adresse publique de votre assistant. Elle ne reçoit `main` qu'après une approbation humaine. |
| Tag `prod-<numéro>` | La marque posée sur chaque version mise en prod : un point de retour. |
| Carte des défenses | `CARTE-DEFENSES.md`, dans votre dépôt : chaque connerie, la barrière qui l'arrête, et le lien de sa preuve. |

Une preuve, c'est le lien d'un run rouge ou d'une PR bloquée **dans votre dépôt**. Une barrière sans preuve ne compte pas. Modèle commenté : [modeles/CARTE-DEFENSES.md](modeles/CARTE-DEFENSES.md).

## Vos données et l'IA

- Ce que vous envoyez au modèle part chez un fournisseur d'IA externe, hors de l'école : vos consignes, les réponses, et tout ce que l'agent lit pour travailler (fichiers, sorties de commandes, messages d'erreur).
- Ce fournisseur peut réutiliser ces contenus pour améliorer ses produits. Considérez chaque consigne comme publique.
- Jamais de données personnelles : ni nom, adresse, téléphone ou e-mail réels, ni information sur une autre personne.
- Jamais de secret : ni clé, ni mot de passe, ni jeton, ni contenu d'un fichier `.env`.
- Vos clés sont propres à votre binôme. Le formateur vous les envoie en privé. Elles ne se commitent jamais, et ne se collent ni dans un chat, ni dans une issue, ni dans une capture d'écran.
- Deux clés : « agent », pour l'agent de code, dès cet après-midi ; « app », pour votre assistant en prod, à partir de mercredi.
- Côté formation, seul le volume d'usage de chaque clé est suivi.
- Vos dépôts sont publics : tout ce que vous commitez est visible par tous.
- Clé exposée par erreur : prévenez le formateur tout de suite. Il la coupe et vous en donne une nouvelle.

Ce qui s'ajoute avec l'agent : section 11 de [outils/dsh.md](outils/dsh.md).

## Soutenance 1, en fin de journée

3 minutes par binôme, sans slides : 1 minute de démo en prod, puis 2 minutes d'explication. Chacun doit pouvoir expliquer n'importe quelle partie. Tout est dans [soutenance-1.md](soutenance-1.md).

## Évaluation et bonus

- Les livrables sont obligatoires. Le poids principal va aux deux soutenances : ce soir et jeudi soir.
- Tout ce qui compte est traçable : historique GitHub, déploiements, approbations, PR piégées refusées, soutenances. Rien ne repose sur la bonne foi.
- Pas de détecteur d'IA de J2 à J4. Ce qui a été annoncé pour J1 reste valable pour J1.
- **Bonus, uniquement traçables** :
  - une barrière, un hook ou un scénario d'attaque proposé au dépôt `harnais-commun` de l'organisation (`https://github.com/<organisation>/harnais-commun`, voir son `CONTRIBUER.md`), et fusionné par le formateur ;
  - une avancée récente présentée en 2 minutes, avec sa source.
- Rien pour la vitesse, rien pour le cosmétique.

## Outils et modèles

| Fichier | À quoi il sert |
|---|---|
| [outils/dsh.md](outils/dsh.md) | L'agent de code : installation le matin, réglages en début d'après-midi, plan B sans agent |
| [outils/vercel.md](outils/vercel.md) | Brancher la prod Vercel sur la chaîne (CP2-3) |
| [outils/grille-revue.md](outils/grille-revue.md) | Lire le diff d'un agent ou une PR par le risque, puis décider |
| [modeles/SPEC.md](modeles/SPEC.md) | Le modèle de spec, avec l'exemple complet de Boussole |
| [modeles/AGENTS.md](modeles/AGENTS.md) | Le modèle des consignes pour l'agent |
| [modeles/CARTE-DEFENSES.md](modeles/CARTE-DEFENSES.md) | La carte des défenses, et ce qui compte comme preuve |
| [reprise/README.md](reprise/README.md) | La base de reprise de 11 h : un chatbot de J1 conforme au contrat |

## En cas de blocage

1. Les indices de la fiche en cours, puis le tableau « Si ça bloque » de la notice concernée.
2. `npm run verify` : lisez la sortie jusqu'à la première erreur, et copiez-la exactement.
3. Le formateur, avec la commande lancée et cette sortie.
