import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/game/start", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        sceneTitle: "The First Page Opens",
        storyText:
          "A safe magical door glows ahead. The hero notices three clues and a friendly guide waves from the path.",
        choices: [
          { id: "A", label: "Study the glowing door" },
          { id: "B", label: "Ask the guide about the clues" },
          { id: "C", label: "Check the map in the margin" },
        ],
        storySummary: "The hero began a safe genre quest at a glowing door.",
        safetyRating: "kid_safe",
        episodeId: "episode_smoke",
      }),
    });
  });

  await page.route("**/api/game/prepare", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ pendingId: "pending_smoke", kind: "turn", turn: 2 }),
    });
  });

  await page.route("**/api/game/resolve", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        kind: "turn",
        turn: 2,
        data: {
          sceneTitle: "The Second Page Turns",
          storyText:
            "The chosen clue unlocks a bright bridge. The path ahead is still safe, playful, and ready for another choice.",
          choices: [
            { id: "A", label: "Cross the bright bridge" },
            { id: "B", label: "Wave to the guide" },
            { id: "C", label: "Follow the sparkling map edge" },
          ],
          storySummary: "The hero solved one math gate and reached the bright bridge.",
          safetyRating: "kid_safe",
        },
      }),
    });
  });
});

test("quick start reaches a story, opens settings during math, and advances after one math gate", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("button-app-info")).toBeVisible();
  await expect(page.getByTestId("button-quest-settings")).toHaveCount(0);

  await page.getByTestId("button-quick-start").click();
  await expect(page.getByTestId("button-randomize-hero-begin")).toBeVisible();
  await page.getByTestId("button-randomize-hero-begin").click();

  await expect(page.getByText("The First Page Opens")).toBeVisible();
  await expect(page.getByTestId("button-quest-settings")).toBeVisible();

  await page.getByTestId("button-choice-A").click();
  await expect(page.getByText("Math Challenge")).toBeVisible();

  await page.getByTestId("button-quest-settings").click();
  await expect(page.getByText("Quest Settings")).toBeVisible();
  await page.getByTestId("button-settings-difficulty-hard").click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Math Challenge")).toBeVisible();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const nextScene = page.getByText("The Second Page Turns");
    if (await nextScene.isVisible().catch(() => false)) break;
    const answers = page.locator('[data-testid^="button-math-answer-"]');
    const count = await answers.count();
    if (count === 0) break;
    await answers.nth(Math.min(attempt % count, count - 1)).click();
  }

  await expect(page.getByText("The Second Page Turns")).toBeVisible();
});
