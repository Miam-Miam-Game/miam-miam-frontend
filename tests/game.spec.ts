import { test, expect } from '@playwright/test';

test('3 joueurs rejoignent et la partie démarre', async ({ browser }) => {

  async function joinPlayer(username: string, colorIndex: number) {
    const context = await browser.newContext(); // session isolée
    const page = await context.newPage();

    await page.goto('http://localhost:3000/');

    // 🎮 Join
    await expect(page.locator('.pseudo-input')).toBeVisible();
    await page.fill('.pseudo-input', username);

    const colors = page.locator('.color-dot');
    await expect(colors.first()).toBeVisible();
    await colors.nth(colorIndex).click();

    await page.click('.join-button');

    // ✅ attendre la WAITING ROOM (avant countdown)
    await expect(page.locator('.waiting-room')).toBeVisible({
      timeout: 15_000,
    });

    return { page, context };
  }

  // 🎮 3 joueurs MAX (comme le backend)
  const p1 = await joinPlayer('Joueur 1', 0);
  const p2 = await joinPlayer('Joueur 2', 1);
  const p3 = await joinPlayer('Joueur 3', 2);

  // ⏳ attendre le DÉMARRAGE DU JEU
  // (countdown 5s + gameStart)
  await expect(
    p1.page.locator('.board')
  ).toBeVisible({ timeout: 30_000 });

  // 🔍 Vérifications du jeu
  await expect(p1.page.locator('.pawn')).toHaveCount(3);
  await expect(p1.page.locator('.timer')).toBeVisible();

  // 🧪 vérifier que le timer descend
  const t1 = await p1.page.locator('.timer').innerText();
  await p1.page.waitForTimeout(1500);
  const t2 = await p1.page.locator('.timer').innerText();
  expect(t2).not.toBe(t1);

});
