# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | | CP1 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |

## Ce qui compte comme preuve

- **Oui** : le lien d'un run GitHub Actions rouge qui montre la barrière en action ; le lien d'une PR bloquée ou refusée, avec le commentaire qui explique pourquoi.
- **Non** : une capture d'écran, une phrase « on a testé », un lien vers le fichier de test lui-même.

Une preuve montre que la barrière **a déjà arrêté** la connerie, pas seulement qu'elle existe.

## Exemple de ligne remplie

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | `https://github.com/<organisation>/capweb-<id>/actions/runs/<numéro>` : run rouge de la PR #3 qui ajoutait une bibliothèque sans justification, refusée avec un commentaire | CP2 |
