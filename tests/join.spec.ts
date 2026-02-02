import { test, expect } from '@playwright/test';

test('la partie démarre automatiquement quand 3 joueurs rejoignent', async ({ browser }) => {

  async function joinPlayer(username: string, colorIndex: number) {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:3000/');

    // Attendre l’input pseudo
    await expect(page.locator('.pseudo-input')).toBeVisible();

    // Remplir pseudo
    await page.fill('.pseudo-input', username);

    // Attendre les couleurs
    const colors = page.locator('.color-dot');
    await expect(colors.first()).toBeVisible();

    // Choisir une couleur
    await colors.nth(colorIndex).click();

    // Rejoindre
    await page.click('.join-button');

    // Attendre la salle d’attente
    await expect(page.locator('.waiting-room')).toBeVisible({ timeout: 15_000 });

    // Vérifier que le joueur apparaît dans la liste
    await expect(page.locator('.players-list')).toContainText(username);

    return { page, context };
  }

  // 🎮 Les 3 joueurs rejoignent
  const p1 = await joinPlayer('Joueur 1', 0);
  const p2 = await joinPlayer('Joueur 2', 1);
  const p3 = await joinPlayer('Joueur 3', 2);

  // 🎯 Vérifier que la partie démarre pour les 3 joueurs
  await Promise.all([
    expect(p1.page.locator('.game-wrapper')).toBeVisible({ timeout: 20_000 }),
    expect(p2.page.locator('.game-wrapper')).toBeVisible({ timeout: 20_000 }),
    expect(p3.page.locator('.game-wrapper')).toBeVisible({ timeout: 20_000 }),
  ]);


});
