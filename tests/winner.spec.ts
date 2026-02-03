import { test, expect } from "@playwright/test";

test.describe("WinnerView – fin de partie réelle à 3 joueurs", () => {
  test("affiche l’écran de fin même avec score nul", async ({ browser }) => {

    async function joinPlayer(username: string, colorIndex: number) {
      const context = await browser.newContext({ storageState: undefined });
      const page = await context.newPage();

      await page.goto("http://localhost:3000/miam-miam-frontend/");

      await expect(page.locator(".pseudo-input")).toBeVisible();
      await page.fill(".pseudo-input", username);

      const colors = page.locator(".color-dot");
      await expect(colors.first()).toBeVisible();
      await colors.nth(colorIndex).click();

      await page.click(".join-button");

      await expect(page.locator(".waiting-room")).toBeVisible({ timeout: 15000 });
      await expect(page.locator(".players-list")).toContainText(username);

      return { page, context };
    }

    // 🎮 3 joueurs
    const p1 = await joinPlayer("Joueur 1", 0);
    const p2 = await joinPlayer("Joueur 2", 1);
    const p3 = await joinPlayer("Joueur 3", 2);

    // (le timer existe aussi bien en jeu qu’en fin → stable)
    await expect(p1.page.locator(".timer")).toBeVisible({ timeout: 20000 });
    await expect(p2.page.locator(".timer")).toBeVisible({ timeout: 20000 });
    await expect(p3.page.locator(".timer")).toBeVisible({ timeout: 20000 });


    // 🔌 garder les sockets vivants
    await Promise.all([
      p2.page.waitForSelector(".timer"),
      p3.page.waitForSelector(".timer"),
    ]);

    // 🧪 preuve que le jeu tourne
    const t1 = await p1.page.locator(".timer").innerText();
    await p1.page.waitForTimeout(1500);
    const t2 = await p1.page.locator(".timer").innerText();
    expect(t2).not.toBe(t1);

    // 🏁 fin de partie
    await expect(
      p1.page.locator(".winner-screen")
    ).toBeVisible({ timeout: 60000 });

    // 🏆 titre
    await expect(
      p1.page.locator(".winner-screen h1")
    ).toContainText("Fin du jeu");

    // 🎖️ gagnant / égalité / aucun gagnant
    await expect(
      p1.page.locator(".winner-name, .winner-card, .tie-card")
    ).toHaveCount(1);

    // 📊 classement
    await expect(p1.page.locator(".ranking-list li")).toHaveCount(3);
    await expect(p1.page.locator(".ranking-list .score")).toHaveCount(3);

    // 🔁 rejouer
    await expect(p1.page.locator(".restart-btn")).toBeVisible();
  });
});
