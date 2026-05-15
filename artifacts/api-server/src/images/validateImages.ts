import { shouldGenerateImage } from "./imageModes";
import { buildImagePrompt } from "./imagePrompt";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function validateImageModes() {
  assert(
    !shouldGenerateImage({ enabled: false, imageMode: "milestones", maxTurns: 8, isIntro: true }),
    "Disabled image generation should never generate images",
  );
  assert(
    !shouldGenerateImage({ enabled: true, imageMode: "off", maxTurns: 8, isIntro: true }),
    "off mode should never generate images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "cover", maxTurns: 8, isIntro: true }),
    "cover mode should generate intro images",
  );
  assert(
    !shouldGenerateImage({ enabled: true, imageMode: "cover", maxTurns: 8, turn: 4 }),
    "cover mode should not generate turn images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "cover_outro", maxTurns: 8, isIntro: true }),
    "cover_outro mode should generate intro images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "cover_outro", maxTurns: 8, isEnding: true }),
    "cover_outro mode should generate ending images",
  );
  assert(
    !shouldGenerateImage({ enabled: true, imageMode: "cover_outro", maxTurns: 8, turn: 4 }),
    "cover_outro mode should not generate turn images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "milestones", maxTurns: 8, isIntro: true }),
    "milestones mode should generate intro images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "milestones", maxTurns: 5, turn: 2 }),
    "milestones mode should generate every second turn, including quick quests",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "milestones", maxTurns: 8, turn: 4 }),
    "milestones mode should generate every second turn",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "milestones", maxTurns: 8, isEnding: true }),
    "milestones mode should generate ending images",
  );
  assert(
    !shouldGenerateImage({ enabled: true, imageMode: "milestones", maxTurns: 8, turn: 3 }),
    "milestones mode should not generate odd-numbered turn images",
  );
  assert(
    shouldGenerateImage({ enabled: true, imageMode: "every_scene", maxTurns: 8, turn: 3 }),
    "every_scene mode should generate turn images",
  );
}

function validatePromptSafety() {
  const prompt = buildImagePrompt({
    kind: "intro",
    hero: {
      name: "Mira",
      pronouns: "she/her",
      ancestry: "Elf",
      className: "Wizard",
    },
    adventureSeed: "Crystal Caverns",
    difficulty: "Medium",
    sceneTitle: "The First Door",
    storyText: "Mira finds a glowing doorway with friendly puzzle runes.",
    storySummary: "A safe quest begins with puzzle magic.",
  });

  assert(prompt.includes("cartoon fantasy storybook"), "Prompt should use generic cartoon fantasy storybook style");
  assert(/ABSOLUTELY NO readable text, letters, words, numbers/i.test(prompt), "Prompt should strongly ban generated text and numbers");
  assert(/Decorative unreadable magical glyphs/i.test(prompt), "Prompt should allow only unreadable decorative glyphs");
  assert(/No gore/i.test(prompt), "Prompt should include classroom safety exclusions");
  assert(!/Disney|Pixar|Studio Ghibli|Harry Potter|anime/i.test(prompt), "Prompt should not reference brands, studios, franchises, or anime style");
  assert(!/[<>]/.test(prompt), "Prompt should strip angle brackets from controlled context");

  const popBandPrompt = buildImagePrompt({
    kind: "scene",
    hero: {
      name: "Mira",
      pronouns: "she/her",
      ancestry: "Koala",
      className: "Stargazer",
    },
    adventureSeed: "Pop Band Quest: a glittering rehearsal studio",
    difficulty: "Medium",
    sceneTitle: "The Chorus Cue",
    storyText: "The crew practices under safe stage lights while a rhythm robot points to the missing cue.",
    storySummary: "A fictional performance crew solves a stage clue before showtime.",
  });

  assert(/fictional performance crew/i.test(popBandPrompt), "Pop Band Quest prompt should stay fictional");
  assert(/no real celebrities, real music groups/i.test(popBandPrompt), "Pop Band Quest prompt should ban real celebrity/group likenesses");
}

validateImageModes();
validatePromptSafety();

console.log("Image generation validation passed.");
