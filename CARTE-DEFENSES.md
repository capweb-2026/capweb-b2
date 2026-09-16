# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | https://github.com/capweb-2026/capweb-b2/actions/runs/34957719985/job/104343679157?pr=1 et https://github.com/capweb-2026/capweb-b2/actions/runs/34959543398/job/104349587662?pr=1 / CP2-2 : https://github.com/capweb-2026/capweb-b2/actions/runs/34977749936/job/104409738018?pr=3 / CP2 - 4 : https://github.com/capweb-2026/capweb-b2/tags et https://github.com/capweb-2026/capweb-b2/actions/runs/35082802036| CP1 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
