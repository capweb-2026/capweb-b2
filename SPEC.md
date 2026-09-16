# SPEC.md — Identité du conseiller réparation de vélo

## Objectif

L'assistant aide l'utilisateur à identifier et résoudre des problèmes courants liés à la réparation et à l'entretien d'un vélo. 
Son identité permet de le reconnaître dès l'ouverture de la page et facilite le démarrage d'une conversation.

## Critères d'acceptation

Rédigez chaque critère sous la forme « Quand …, le système … ». Numérotez-les : les tests et les PR y feront référence.

1. **Nom** — Quand la page s'ouvre, le système affiche le nom « Vélix » dans le titre principal. Le nom contient entre 2 et 20 caractères.

2. **Emoji** — Quand la page s'ouvre, le système affiche un seul emoji 🚲 à côté du nom de l'assistant.

3. **Accueil** — Quand la conversation est vide, le système affiche le message « Bonjour, je suis Vélix 🚲, votre conseiller pour la réparation et l'entretien de votre vélo. ». Ce message contient le nom « Vélix », n'est pas une ligne de `#messages`, disparaît dès le premier message envoyé et revient lorsque la conversation est effacée.

4. **Suggestions** — Quand la page s'ouvre, le système affiche exactement trois questions suggérées : « Comment réparer une crevaison ? », « Comment régler mes freins ? » et « Comment entretenir ma chaîne ? ». Quand l'utilisateur clique sur une suggestion, le système place la question dans `#message` sans l'envoyer et `#messages` ne contient aucune nouvelle ligne.

5. **Réponses signées** — Quand l'assistant répond, sa ligne commence par « Vélix : » au lieu de « Cap Web : »

6. **Contrat** — Quand l'utilisateur utilise les fonctions existantes de la conversation, les tests de contrat CP1 restent verts.


## Hors périmètre

Pas de diagnostic automatique à partir d'une photo du vélo, pas de commande de pièces, pas de réservation auprès d'un réparateur, pas de géolocalisation et pas d'appel à une intelligence artificielle externe.


## Données et fonctions attendues

- `public/js/persona.js` exporte `persona = { nom, emoji, accueil, suggestions }`.
- `public/js/persona.js` exporte `validatePersona(persona)`.
- `validatePersona(persona)` renvoie `{ ok: true }` lorsque l'identité est valide.
- `validatePersona(persona)` renvoie `{ ok: false, erreurs: [texte, ...] }` lorsqu'elle est invalide.
- `validatePersona` refuse un nom de moins de 2 caractères ou de plus de 20 caractères.
- `validatePersona` refuse un emoji qui n'est pas exactement un emoji.
- `validatePersona` refuse un accueil qui ne contient pas le nom.
- `validatePersona` refuse un nombre de suggestions différent de trois.
- `validatePersona` refuse une suggestion vide.
- La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
- `persona.js` est ajouté à la liste blanche du serveur local.

## Questions ouvertes

Aucune