import { test, expect } from '@playwright/test';
/* global localStorage -- callbacks exécutés dans la page */

// Tests rouges — identité Vélix dans le navigateur, critères SPEC 1 à 5.
// Ils échouent tant que index.html / view.js / app.js n'affichent pas Vélix.

const ACCUEIL_ATTENDU = 'Bonjour, je suis Vélix 🚲, votre conseiller pour la réparation et l\u0027entretien de votre vélo.';
const SUGGESTIONS_ATTENDUES = [
  'Comment réparer une crevaison ?',
  'Comment régler mes freins ?',
  'Comment entretenir ma chaîne ?'
];

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');

test.describe('Persona Vélix — critères 1 et 2', () => {
  test('[C1] le titre principal affiche Vélix', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('h1')).toContainText('Vélix');
  });

  test('[C2] un seul emoji 🚲 à côté du nom', async ({ page }) => {
    await pageNeuve(page);
    const enTete = await page.locator('header').textContent();
    const occurrences = (enTete.match(/🚲/g) ?? []).length;
    expect(occurrences).toBe(1);
  });
});

test.describe('Persona Vélix — critère 3 accueil', () => {
  test('conversation vide : accueil exact hors #messages', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#accueil')).toHaveText(ACCUEIL_ATTENDU);
    await expect(page.locator('#accueil')).toContainText('Vélix');
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toHaveCount(1);
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
  });

  test('l’accueil disparaît dès le premier message envoyé', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toBeHidden();
  });

  test('l’accueil revient lorsque la conversation est effacée', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toBeVisible();
  });
});

test.describe('Persona Vélix — critère 4 suggestions', () => {
  test('exactement trois questions suggérées hors #messages', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    await expect(boutons).toHaveCount(3);
    await expect(boutons.nth(0)).toHaveText(SUGGESTIONS_ATTENDUES[0]);
    await expect(boutons.nth(1)).toHaveText(SUGGESTIONS_ATTENDUES[1]);
    await expect(boutons.nth(2)).toHaveText(SUGGESTIONS_ATTENDUES[2]);
    await expect(page.locator('#suggestions')).toHaveCount(1);
    await expect(page.locator('#messages #suggestions')).toHaveCount(0);
  });

  for (const suggestion of SUGGESTIONS_ATTENDUES) {
    test(`clic sur « ${suggestion} » : remplit #message sans envoyer`, async ({ page }) => {
      await pageNeuve(page);
      await page.locator('#suggestions button', { hasText: suggestion }).click();
      await expect(page.locator('#message')).toHaveValue(suggestion);
      await expect(lignes(page)).toHaveCount(0);
    });
  }
});

test.describe('Persona Vélix — critère 5 réponses signées', () => {
  test('la ligne de l’assistant commence par « Vélix : »', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(1)).toHaveText(/^Vélix : /);
    await expect(lignes(page).nth(1)).not.toContainText('Cap Web');
  });
});
