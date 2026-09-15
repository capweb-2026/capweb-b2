export const persona = {
  nom: 'Vélix',
  emoji: '🚲',
  accueil: 'Bonjour, je suis Vélix 🚲, votre conseiller pour la réparation et l\u0027entretien de votre vélo.',
  suggestions: [
    'Comment réparer une crevaison ?',
    'Comment régler mes freins ?',
    'Comment entretenir ma chaîne ?'
  ]
};

export function validatePersona(candidate) {
  const erreurs = [];
  const cible = candidate ?? {};
  const nom = cible.nom;
  if (typeof nom !== 'string' || nom.length < 2 || nom.length > 20) {
    erreurs.push('Le nom doit contenir entre 2 et 20 caractères.');
  }
  if (cible.emoji !== '🚲') {
    erreurs.push('L\u0027emoji doit être exactement 🚲.');
  }
  if (typeof cible.accueil !== 'string' || (typeof nom === 'string' && nom.length > 0 && !cible.accueil.includes(nom))) {
    erreurs.push('L\u0027accueil doit contenir le nom.');
  }
  if (!Array.isArray(cible.suggestions) || cible.suggestions.length !== 3) {
    erreurs.push('Il doit y avoir exactement trois suggestions.');
  } else {
    for (const suggestion of cible.suggestions) {
      if (typeof suggestion !== 'string' || suggestion.trim().length === 0) {
        erreurs.push('Chaque suggestion doit être un texte non vide.');
        break;
      }
    }
  }
  if (erreurs.length > 0) {
    return { ok: false, erreurs };
  }
  return { ok: true };
}
