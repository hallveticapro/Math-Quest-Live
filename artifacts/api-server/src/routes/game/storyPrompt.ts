interface HeroInfo {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
}

interface StartGameData {
  hero: HeroInfo;
  difficulty: string;
  adventureSeed: string;
  maxTurns: number;
}

interface TurnData extends StartGameData {
  turn: number;
  storySummary: string;
  chosenAction: string;
  mathResult: string;
}

interface EndingData extends StartGameData {
  turn: number;
  storySummary: string;
  mathSolved: number;
}

export const ALLOWED_HERO_NAMES = ["Astra", "Kael", "Nova", "Mira", "Jax", "Luna", "Orion", "Sage", "Zara", "Theo", "Elara", "Milo"] as const;
export const ALLOWED_PRONOUNS = ["she/her", "he/him", "they/them"] as const;
export const ALLOWED_ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn"] as const;
export const ALLOWED_CLASSES = ["Wizard", "Warrior", "Explorer", "Rogue", "Inventor", "Healer", "Beast Tamer", "Elementalist"] as const;
export const ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"] as const;
export const ALLOWED_MAX_TURNS = [5, 8, 10] as const;

const QUEST_LENGTH_LABELS: Record<number, string> = {
  5: "Quick Quest",
  8: "Standard Quest",
  10: "Full Quest",
};

function getQuestLengthLabel(maxTurns: number) {
  return QUEST_LENGTH_LABELS[maxTurns] ?? "Custom Quest";
}

const ADVENTURE_SEEDS: Record<string, { setting: string; objective: string; helpers: string; avoid: string }> = {
  "The Sky Temple": {
    setting: "A floating temple above the clouds",
    objective: "Repair the weather engine before the storm spreads",
    helpers: "storm sprite, cloud turtle, bronze owl",
    avoid: "falling deaths, lightning injuries, sacrifice",
  },
  "The Crystal Forest": {
    setting: "A forest of glowing crystal trees",
    objective: "Restore the missing light to the forest heart",
    helpers: "crystal fox, moss giant, singing beetles",
    avoid: "scary body horror, cursed possession",
  },
  "The Clockwork Volcano": {
    setting: "A volcano filled with ancient gears and steam pipes",
    objective: "Cool the overheating machine before it erupts harmlessly into sparkles and steam",
    helpers: "gear goblin, lava salamander, clockwork bird",
    avoid: "burns, death, destruction of towns",
  },
  "The Moonlit Library": {
    setting: "A magical library that rearranges itself at night",
    objective: "Find the lost chapter before sunrise",
    helpers: "owl librarian, book mouse, floating candle",
    avoid: "horror, ghosts that frighten students",
  },
  "The Lost Reef City": {
    setting: "An underwater city protected by glowing coral",
    objective: "Help repair the coral gate before the current changes",
    helpers: "merfolk guide, puzzle crab, lantern fish",
    avoid: "drowning, scary sea monsters",
  },
  "The Floating Market": {
    setting: "A magical marketplace floating among clouds",
    objective: "Help the merchant recover scattered enchanted goods before the market closes",
    helpers: "friendly vendor, cloud parrot, glowing map",
    avoid: "theft framing, scary magic",
  },
  "The Dragon Egg Rescue": {
    setting: "A warm mountain cave with ancient dragons",
    objective: "Return the lost dragon egg safely to its nest",
    helpers: "young dragon scout, wise elder dragon, ember moth",
    avoid: "violence, egg destruction",
  },
  "The Puzzle Pyramid": {
    setting: "An ancient desert pyramid full of clever traps and riddles",
    objective: "Reach the treasure room by solving the pyramid's puzzles",
    helpers: "sand sphinx, hieroglyph fairy, magic compass",
    avoid: "curses, mummy horror",
  },
  "The Candy Comet": {
    setting: "A comet made entirely of magical candy flying through space",
    objective: "Help the sugar sprites restore the comet's flavor before it fades away",
    helpers: "sugar sprites, comet captain, fizzy jellyfish",
    avoid: "sickness, harmful candy",
  },
  "The Tiny Giant's Garden": {
    setting: "A giant's garden where the hero has been magically shrunk",
    objective: "Find the reverse potion to return to normal size",
    helpers: "friendly ant, ladybug scout, flower fairy",
    avoid: "being eaten, harmful insects",
  },
  "The Museum After Midnight": {
    setting: "A science museum that comes to life at night",
    objective: "Help the exhibits return to their proper places before morning",
    helpers: "friendly dinosaur skeleton, glowing robot, map fairy",
    avoid: "horror, scary exhibits",
  },
  "The Friendly Ghost Lighthouse": {
    setting: "A lighthouse guided by a friendly ghost keeper",
    objective: "Relight the beacon so ships can find the safe harbor",
    helpers: "friendly ghost, seagull scout, moon moth",
    avoid: "horror, death-focused ghost story",
  },
};

const RANDOM_SEEDS = Object.keys(ADVENTURE_SEEDS);
export const ALLOWED_ADVENTURE_SEEDS = ["Random", ...RANDOM_SEEDS] as const;

const DIFFICULTY_READING_GUIDANCE: Record<string, { gradeBand: 3 | 4 | 5; guidance: string; sceneWords: string; endingWords: string }> = {
  easy: {
    gradeBand: 3,
    guidance: "Use shorter scenes, simpler vocabulary, concrete action, and 60-100 words.",
    sceneWords: "60-100 words",
    endingWords: "90-120 words",
  },
  medium: {
    gradeBand: 4,
    guidance: "Use moderate scenes, clear middle-grade vocabulary, and 90-140 words.",
    sceneWords: "90-140 words",
    endingWords: "110-150 words",
  },
  hard: {
    gradeBand: 5,
    guidance: "Use richer scenes, Grade 5-friendly vocabulary, and 120-180 words.",
    sceneWords: "120-180 words",
    endingWords: "130-180 words",
  },
  extreme: {
    gradeBand: 5,
    guidance: "Use 120-180 words, still kid-friendly, with slightly more complex vocabulary. Do not go beyond elementary classroom tone.",
    sceneWords: "120-180 words",
    endingWords: "130-180 words",
  },
};

function getReadingGuidance(difficulty: string) {
  return DIFFICULTY_READING_GUIDANCE[difficulty.trim().toLowerCase()] ?? DIFFICULTY_READING_GUIDANCE.medium;
}

function resolveSeed(adventureSeed: string) {
  if (adventureSeed === "Random") {
    const picked = RANDOM_SEEDS[Math.floor(Math.random() * RANDOM_SEEDS.length)];
    return { name: picked, ...ADVENTURE_SEEDS[picked] };
  }
  const found = ADVENTURE_SEEDS[adventureSeed];
  if (found) return { name: adventureSeed, ...found };
  return {
    name: adventureSeed,
    setting: "A magical world full of puzzles and wonder",
    objective: "Complete the adventure by solving challenges",
    helpers: "friendly guide, magical creature, wise elder",
    avoid: "anything unsafe or inappropriate",
  };
}

const SYSTEM_PROMPT = `You are the story engine for MathQuest Live, a classroom-safe math adventure game for 3rd to 5th grade students ages 8-11. Write short, exciting, kid-safe scenes.

IMPORTANT RULES:
- This is for a 3rd to 5th grade classroom. All content must be safe and appropriate.
- No gore, graphic violence, death, romance, profanity, horror, or realistic weapons harming people
- No bullying or stereotypes
- No real-world politics or religion
- No drugs, alcohol, smoking, or vaping
- No sexual content
- No self-harm
- No asking for names, addresses, phone numbers, emails, school names, locations, or any personal information
- Allowed: cartoon adventure danger, puzzles, magical obstacles, friendly creatures, storms, locked doors, mysteries
- Problems resolved through: math, observation, kindness, creativity, teamwork, courage
- Ancestry/species only affects appearance and fantasy flavor — never implies intelligence or ability
- Pronouns only affect pronoun use in the story
- Write in fun, adventurous middle-grade tone like a fantasy novel
- The student can ONLY choose from buttons — no freeform input
- Do NOT generate math problems — the app handles all math separately
- Do NOT include HTML tags, XML tags, Markdown, or formatting tags of any kind
- For storyText and endingText, write plain text with short paragraphs separated by newline characters
- Break longer scenes into 2-4 short paragraphs so students do not see one large run-on block
- Do not use literal "<br>", "<p>", "<div>", or any other tag text
- Return ONLY valid JSON matching the required format
- safetyRating must always be "kid_safe"
- Provide EXACTLY 3 choices with ids "A", "B", "C"
- Each choice label must be under 90 characters`;

export function buildStartPrompt(data: StartGameData): string {
  const seed = resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${seed.name}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} successful math challenges. The opening scene is not a math turn.

This is the OPENING SCENE. Write ${reading.sceneWords}.

Your task: Write a vivid, immersive opening that does THREE things:
1. Introduces ${hero.name} as a character — give them personality, a brief backstory hint, and a reason why they are the right hero for this quest. Use their class and ancestry to flavor their appearance and style (appearance only, never personality or ability).
2. Sets the scene — paint a picture of where the adventure begins, using rich sensory details.
3. Launches the adventure — give them a clear quest goal and end with exactly 3 action choices.

Make the student feel like they are stepping into the pages of a fantasy story. Use vivid, descriptive language. Refer to ${hero.name} by name and use ${hero.pronouns.split("/")[0]} pronouns correctly.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "${reading.sceneWords} of vivid, exciting opening story text",
  "choices": [
    { "id": "A", "label": "clear action under 90 chars" },
    { "id": "B", "label": "clear action under 90 chars" },
    { "id": "C", "label": "clear action under 90 chars" }
  ],
  "storySummary": "1-2 sentence summary of who the hero is and what happened",
  "safetyRating": "kid_safe"
}`;
}

export function buildTurnPrompt(data: TurnData): string {
  const seed = resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const turnsLeft = data.maxTurns - data.turn;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${seed.name}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} successful math challenges.
Current story beat: ${data.turn} of ${data.maxTurns}. This number refers to successful math-gated turns, not the intro.

STORY SO FAR: ${data.storySummary}

The student chose: "${data.chosenAction}"
Math result: ${data.mathResult}

Continue the adventure from where we left off. ${hero.name} solved the math challenge and can now act. Write ${reading.sceneWords} of exciting story. ${turnsLeft <= 2 ? "The adventure is nearing its climax — build urgently toward a satisfying resolution!" : turnsLeft <= 4 ? "The adventure is at its midpoint — raise the stakes and introduce a new complication." : "Keep the adventure moving forward with new discoveries."} End with exactly 3 new safe action choices.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "${reading.sceneWords} of exciting, safe story text",
  "choices": [
    { "id": "A", "label": "clear action under 90 chars" },
    { "id": "B", "label": "clear action under 90 chars" },
    { "id": "C", "label": "clear action under 90 chars" }
  ],
  "storySummary": "updated 1-2 sentence summary of the whole adventure so far",
  "safetyRating": "kid_safe"
}`;
}

export function buildEndingPrompt(data: EndingData): string {
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${data.adventureSeed}
HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} successful math challenges.
Math challenges solved: ${data.mathSolved} of ${data.maxTurns}

STORY SO FAR: ${data.storySummary}

Write a triumphant, emotionally satisfying ending to this adventure! ${hero.name} has completed the quest and solved ${data.mathSolved} math challenges. The ending should:
- Resolve the quest objective fully
- Celebrate the hero's cleverness and courage
- Feel like the final page of a great fantasy story
- Give the hero a unique, creative badge name that reflects their specific adventure

Write ${reading.endingWords} of triumphant, joyful ending.

Respond ONLY with valid JSON in this exact format:
{
  "endingTitle": "dramatic ending title",
  "endingText": "${reading.endingWords} of triumphant, safe ending story",
  "badge": "Creative Badge Name (2-4 words)",
  "safetyRating": "kid_safe"
}`;
}
