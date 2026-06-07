import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window {
    __MATHQUEST_IMAGE_MAX_POLL_ATTEMPTS__?: number;
    __MATHQUEST_IMAGE_POLL_INTERVAL_MS__?: number;
  }
}

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

async function answerMathGateUntilVisible(page: Page, expectedText: string) {
  const target = page.getByText(expectedText);
  for (let attempt = 0; attempt < 16; attempt += 1) {
    if (await target.isVisible().catch(() => false)) break;
    const answers = page.locator('[data-testid^="button-math-answer-"]');
    const count = await answers.count();
    if (count === 0) {
      await page.waitForTimeout(250);
      continue;
    }
    await answers
      .nth(Math.min(attempt % count, count - 1))
      .click({ force: true, timeout: 1_000 })
      .catch(() => undefined);
    await page.waitForTimeout(300);
  }

  await expect(target).toBeVisible();
}

async function continueSetupQuestion(page: Page) {
  await expect(page.getByTestId("button-setup-next")).toBeVisible();
  await page.getByTestId("button-setup-next").click();
  await expect(page.getByTestId("button-confirmation-continue")).toBeVisible();
  await page.getByTestId("button-confirmation-continue").click();
}

async function selectFirstOptionAndContinue(page: Page, testIdPrefix: string) {
  const option = page.locator(`[data-testid^="${testIdPrefix}"]`).first();
  await expect(option).toBeVisible();
  await option.click();
  await continueSetupQuestion(page);
}

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
  await expect(page.getByText("Math Challenge", { exact: true })).toBeVisible();

  await page.getByTestId("button-quest-settings").click();
  await expect(page.getByText("Quest Settings")).toBeVisible();
  await expect(page.getByText("Color Scheme")).toBeVisible();
  await expect(page.getByText("Challenge Level")).toBeVisible();
  await page.getByTestId("button-settings-difficulty-hard").click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Math Challenge", { exact: true })).toBeVisible();

  await answerMathGateUntilVisible(page, "The Second Page Turns");
});

test("full Chronicler setup keeps setup settings audio-only and starts a story", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("button-begin-quest").click();
  await expect(page.getByText("Open the Chronicle")).toBeVisible();

  await page.getByTestId("button-quest-settings").click();
  await expect(page.getByText("Quest Settings")).toBeVisible();
  await expect(page.getByText("Background Music", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Navigation Sound Effects", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Color Scheme")).toHaveCount(0);
  await expect(page.getByText("Challenge Level")).toHaveCount(0);
  await page.keyboard.press("Escape");

  await page.getByTestId("button-setup-next").click();
  await selectFirstOptionAndContinue(page, "button-name-");
  await selectFirstOptionAndContinue(page, "button-pronouns-");

  await expect(page.getByTestId("button-ancestry-Human")).toBeVisible();
  await expect(page.getByRole("status").getByText("Human")).toBeVisible();
  await continueSetupQuestion(page);

  await expect(page.getByTestId("button-class-Wizard")).toBeVisible();
  await expect(page.getByRole("status").getByText("Wizard")).toBeVisible();
  await continueSetupQuestion(page);

  await selectFirstOptionAndContinue(page, "button-difficulty-");
  await continueSetupQuestion(page);
  await selectFirstOptionAndContinue(page, "button-genre-");
  await continueSetupQuestion(page);

  await expect(page.getByText("The First Page Opens")).toBeVisible();
  await expect(page.getByTestId("button-quest-settings")).toBeVisible();
});

test("ending flow appears after mocked math gates", async ({ page }) => {
  await page.unroute("**/api/game/prepare");
  await page.unroute("**/api/game/resolve");

  await page.route("**/api/game/prepare", async (route) => {
    const body = route.request().postDataJSON() as {
      kind?: string;
      turn?: number;
    };
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        pendingId: `pending_smoke_${body.kind ?? "turn"}_${body.turn ?? 0}`,
        kind: body.kind ?? "turn",
        turn: body.turn ?? 2,
      }),
    });
  });

  await page.route("**/api/game/resolve", async (route) => {
    const body = route.request().postDataJSON() as { pendingId?: string };
    if (body.pendingId?.includes("_ending_")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          kind: "ending",
          data: {
            endingTitle: "The Smoke Quest Succeeds",
            endingText:
              "The hero finishes the safe quest, thanks the friendly guide, and carries a bright lesson home.",
            badge: "Smoke-Test Star",
            image: null,
          },
        }),
      });
      return;
    }

    const turnMatch = body.pendingId?.match(/_(\d+)$/);
    const turn = turnMatch ? Number(turnMatch[1]) : 2;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        kind: "turn",
        turn,
        data: {
          sceneTitle: `Smoke Chapter ${turn}`,
          storyText:
            "The safe story continues with one clear choice, one friendly clue, and one bright path.",
          choices: [
            { id: "A", label: `Follow chapter ${turn}'s bright clue` },
            { id: "B", label: "Ask the guide for another safe hint" },
            { id: "C", label: "Check the glowing map edge again" },
          ],
          storySummary: `The hero reached smoke chapter ${turn}.`,
          safetyRating: "kid_safe",
          image: null,
        },
      }),
    });
  });

  await page.goto("/");
  await page.getByTestId("button-quick-start").click();
  await page.getByTestId("button-quick-start-length-quick").click();
  await page.getByTestId("button-randomize-hero-begin").click();

  await expect(page.getByText("The First Page Opens")).toBeVisible();

  for (let chapter = 2; chapter <= 8; chapter += 1) {
    await page.getByTestId("button-choice-A").click();
    await expect(page.getByText("Math Challenge", { exact: true })).toBeVisible();
    await answerMathGateUntilVisible(page, `Smoke Chapter ${chapter}`);
  }

  await page.getByTestId("button-choice-A").click();
  await expect(page.getByText("Math Challenge", { exact: true })).toBeVisible();
  await answerMathGateUntilVisible(page, "The Smoke Quest Succeeds");
  await expect(page.getByText("Smoke-Test Star")).toBeVisible();
  await expect(page.getByTestId("button-play-again")).toBeVisible();
});

test("read aloud can start and stop with browser speech mocked", async ({ page }) => {
  await page.addInitScript(() => {
    class MockSpeechSynthesisUtterance {
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;
      pitch = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    }

    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [],
        speak: () => undefined,
        cancel: () => undefined,
      },
    });
  });

  await page.goto("/");
  await page.getByTestId("button-quick-start").click();
  await page.getByTestId("button-randomize-hero-begin").click();

  await expect(page.getByText("The First Page Opens")).toBeVisible();
  await page.getByRole("button", { name: "Read Story" }).click();
  await expect(page.getByRole("button", { name: "Stop Reading" })).toBeVisible();
  await page.getByRole("button", { name: "Stop Reading" }).click();
  await expect(page.getByRole("button", { name: "Read Story" })).toBeVisible();
});

test("pending scene images time out instead of loading forever", async ({ page }) => {
  await page.addInitScript(() => {
    window.__MATHQUEST_IMAGE_MAX_POLL_ATTEMPTS__ = 2;
    window.__MATHQUEST_IMAGE_POLL_INTERVAL_MS__ = 250;
  });

  await page.unroute("**/api/game/start");
  await page.route("**/api/game/start", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        sceneTitle: "The Painted Page Waits",
        storyText:
          "A friendly page begins to shimmer while the hero studies a safe path through the margin.",
        choices: [
          { id: "A", label: "Watch the margin glow" },
          { id: "B", label: "Ask the guide about the page" },
          { id: "C", label: "Step toward the bright path" },
        ],
        storySummary: "The hero waited beside a painted page.",
        safetyRating: "kid_safe",
        episodeId: "episode_smoke_image",
        image: {
          enabled: true,
          status: "pending",
          imageId: "imgjob_smoke_pending",
          statusUrl: "/api/images/status/imgjob_smoke_pending",
          alt: "A safe storybook page waiting for an illustration.",
          provider: "openai",
          model: "smoke",
        },
      }),
    });
  });

  await page.route("**/api/images/status/imgjob_smoke_pending", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        enabled: true,
        status: "pending",
        imageId: "imgjob_smoke_pending",
        statusUrl: "/api/images/status/imgjob_smoke_pending",
        alt: "A safe storybook page waiting for an illustration.",
        provider: "openai",
        model: "smoke",
      }),
    });
  });

  await page.goto("/");
  await page.getByTestId("button-quick-start").click();
  await expect(page.getByTestId("button-randomize-hero-begin")).toBeVisible();
  await page.getByTestId("button-randomize-hero-begin").click();

  await expect(page.getByText("The Painted Page Waits")).toBeVisible();
  await expect(page.getByText("Illustration still loading...")).toBeVisible();
  await expect(page.getByText("Illustration still loading...")).toHaveCount(0, {
    timeout: 2_000,
  });
});
