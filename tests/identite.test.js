import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { persona, validatePersona } from '../public/js/persona.js';

// Tests rouges — identité Vélix, critères SPEC 1 à 5 + règles validatePersona.
// Ils échouent tant que public/js/persona.js n'existe pas.

const NOM_ATTENDU = 'Vélix';
const EMOJI_ATTENDU = '🚲';
const ACCUEIL_ATTENDU = 'Bonjour, je suis Vélix 🚲, votre conseiller pour la réparation et l\u0027entretien de votre vélo.';
const SUGGESTIONS_ATTENDUES = [
  'Comment réparer une crevaison ?',
  'Comment régler mes freins ?',
  'Comment entretenir ma chaîne ?'
];

const sansCommentaires = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const lire = async (fichier) => sansCommentaires(await readFile(new URL(`../public/js/${fichier}`, import.meta.url), 'utf8'));

function assertInvalide(resultat) {
  assert.equal(resultat.ok, false);
  assert.ok(Array.isArray(resultat.erreurs), 'erreurs doit être un tableau');
  assert.ok(resultat.erreurs.length > 0, 'erreurs ne doit pas être vide');
  for (const erreur of resultat.erreurs) {
    assert.equal(typeof erreur, 'string');
    assert.ok(erreur.trim().length > 0, 'chaque erreur est un texte non vide');
  }
}

describe('Persona Vélix — exports', () => {
  it('expose persona avec exactement nom, emoji, accueil, suggestions', () => {
    assert.equal(typeof persona, 'object');
    assert.deepEqual(Object.keys(persona).sort(), ['accueil', 'emoji', 'nom', 'suggestions']);
  });

  it('expose validatePersona comme fonction', () => {
    assert.equal(typeof validatePersona, 'function');
  });
});

describe('Persona Vélix — critères 1 à 4', () => {
  it('[C1] le nom est Vélix entre 2 et 20 caractères', () => {
    assert.equal(persona.nom, NOM_ATTENDU);
    assert.ok(persona.nom.length >= 2 && persona.nom.length <= 20);
  });

  it('[C2] l’emoji est exactement 🚲', () => {
    assert.equal(persona.emoji, EMOJI_ATTENDU);
  });

  it('[C3] l’accueil est le message exact et contient le nom', () => {
    assert.equal(persona.accueil, ACCUEIL_ATTENDU);
    assert.ok(persona.accueil.includes(NOM_ATTENDU));
  });

  it('[C4] les suggestions sont exactement les trois questions du SPEC', () => {
    assert.deepEqual(persona.suggestions, SUGGESTIONS_ATTENDUES);
  });
});

describe('validatePersona — valide et refus', () => {
  it('accepte l’identité valide avec { ok: true }', () => {
    assert.deepEqual(validatePersona(persona), { ok: true });
  });

  it('refuse un nom de moins de 2 caractères', () => {
    assertInvalide(validatePersona({ ...persona, nom: 'V', accueil: 'Bonjour, je suis V 🚲.' }));
  });

  it('refuse un nom de plus de 20 caractères', () => {
    assertInvalide(validatePersona({ ...persona, nom: 'V'.repeat(21), accueil: 'Bonjour, je suis VVVVVVVVVVVVVVVVVVVVV 🚲.' }));
  });

  it('refuse un emoji qui n’est pas exactement 🚲', () => {
    for (const emoji of ['', 'velo', '🚲🚲', '🔧']) {
      assertInvalide(validatePersona({ ...persona, emoji }));
    }
  });

  it('refuse un accueil qui ne contient pas le nom', () => {
    assertInvalide(validatePersona({ ...persona, accueil: 'Bonjour, votre conseiller vélo.' }));
  });

  it('refuse un nombre de suggestions différent de trois', () => {
    assertInvalide(validatePersona({ ...persona, suggestions: SUGGESTIONS_ATTENDUES.slice(0, 2) }));
    assertInvalide(validatePersona({ ...persona, suggestions: [...SUGGESTIONS_ATTENDUES, 'Et les pneus ?'] }));
  });

  it('refuse une suggestion vide ou faite d’espaces', () => {
    assertInvalide(validatePersona({ ...persona, suggestions: [SUGGESTIONS_ATTENDUES[0], '', SUGGESTIONS_ATTENDUES[2]] }));
    assertInvalide(validatePersona({ ...persona, suggestions: [SUGGESTIONS_ATTENDUES[0], '   ', SUGGESTIONS_ATTENDUES[2]] }));
  });
});

describe('persona.js garde son rôle', () => {
  it('ne touche pas à la page', async () => {
    assert.doesNotMatch(await lire('persona.js'), /\bdocument\b|\bwindow\b|localStorage/, 'persona.js reste pur : aucun accès à la page');
  });

  it('n’injecte jamais de HTML et ne décide pas des réponses', async () => {
    const code = await lire('persona.js');
    assert.doesNotMatch(code, /innerHTML|outerHTML|insertAdjacentHTML|\beval\b/, 'aucune injection de HTML');
    assert.doesNotMatch(code, /replyTo|validateMessage/, 'persona.js ne décide pas des réponses');
  });
});
