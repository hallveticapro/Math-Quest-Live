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

export interface EpisodePlan {
  episodeTitle: string;
  centralProblem: string;
  heroGoal: string;
  stakes: string;
  keyStoryElements: string[];
  intendedResolution: string;
  pacingBeats: string[];
  readingGuidance: string;
}

export interface TurnData extends StartGameData {
  turn: number;
  storySummary: string;
  storyHistory?: string;
  chosenAction: string;
  mathResult: string;
  episodePlan?: EpisodePlan;
  lastMathSkill?: {
    skillLabel: string;
    problemType: string;
    difficulty: string;
    gradeBand: number;
    storyFlavor: string;
  };
}

export interface EndingData extends StartGameData {
  turn: number;
  storySummary: string;
  storyHistory?: string;
  mathSolved: number;
  episodePlan?: EpisodePlan;
}

export const ALLOWED_HERO_NAMES = ["Astra", "Kael", "Nova", "Mira", "Jax", "Luna", "Orion", "Sage", "Zara", "Theo", "Elara", "Milo"] as const;
export const ALLOWED_PRONOUNS = ["she/her", "he/him", "they/them"] as const;
export const ALLOWED_ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn", "Gnome", "Sprite", "Stonekin", "Cloudling", "Foxfolk"] as const;
export const ALLOWED_CLASSES = ["Wizard", "Warrior", "Explorer", "Rogue", "Inventor", "Healer", "Beast Tamer", "Elementalist", "Guardian", "Cartographer", "Stargazer", "Alchemist", "Puzzle Mage"] as const;
export const ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"] as const;
export const ALLOWED_MAX_TURNS = [8, 12, 16] as const;

const QUEST_LENGTH_LABELS: Record<number, string> = {
  8: "Quick Quest",
  12: "Standard Quest",
  16: "Full Quest",
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
    guidance: "Aim for Grade 3 readability: short sentences, concrete action, familiar vocabulary, and clear cause-and-effect. Use 80-120 words.",
    sceneWords: "80-120 words",
    endingWords: "110-140 words",
  },
  medium: {
    gradeBand: 4,
    guidance: "Aim for Grade 4 readability: moderate sentences, vivid but clear vocabulary, and one strong story development per scene. Use 100-150 words.",
    sceneWords: "100-150 words",
    endingWords: "120-160 words",
  },
  hard: {
    gradeBand: 5,
    guidance: "Aim for Grade 5 readability: richer description, varied sentence structure, and clear emotional stakes without becoming dense. Use 130-190 words.",
    sceneWords: "130-190 words",
    endingWords: "140-190 words",
  },
  extreme: {
    gradeBand: 5,
    guidance: "Aim for upper Grade 5 readability: layered clues and slightly more advanced vocabulary, but keep the tone elementary, concrete, and kid-friendly. Use 140-200 words.",
    sceneWords: "140-200 words",
    endingWords: "150-200 words",
  },
};

export function getReadingGuidance(difficulty: string) {
  return DIFFICULTY_READING_GUIDANCE[difficulty.trim().toLowerCase()] ?? DIFFICULTY_READING_GUIDANCE.medium;
}

export function resolveSeed(adventureSeed: string) {
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

function buildPacingBeats(maxTurns: number) {
  if (maxTurns <= 8) {
    return [
      "Chapters 1-2: introduce the place, the central problem, and a helpful clue.",
      "Chapters 3-5: reveal a complication and make the chosen actions visibly matter.",
      "Chapters 6-7: move into the climax and bring back important established details.",
      "Chapter 8: prepare the final resolution without ending early.",
    ];
  }

  if (maxTurns <= 12) {
    return [
      "Chapters 1-3: introduce the place, the central problem, and first clue.",
      "Chapters 4-7: deepen the mystery with discoveries, helpers, and complications.",
      "Chapters 8-10: connect earlier choices to the path forward and raise urgency.",
      "Chapters 11-12: set up the final resolution without resolving before the ending.",
    ];
  }

  return [
    "Chapters 1-4: introduce the world, the central problem, helpers, and early clues.",
    "Chapters 5-9: develop complications and let choices create visible consequences.",
    "Chapters 10-13: connect clues, revisit key story elements, and build toward the climax.",
    "Chapters 14-16: bring the quest to the threshold of its resolution without ending early.",
  ];
}

export function createEpisodePlan(data: StartGameData): EpisodePlan {
  const seed = resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);
  const lengthLabel = getQuestLengthLabel(data.maxTurns);

  return {
    episodeTitle: `${seed.name}: ${hero.name}'s ${lengthLabel}`,
    centralProblem: seed.objective,
    heroGoal: `${hero.name} must help solve the problem in ${seed.setting} by making brave, kind, and clever choices.`,
    stakes: "If the hero does nothing, the magical place will remain tangled or unfinished, but no one should be harmed.",
    keyStoryElements: [
      `Setting: ${seed.setting}`,
      `Objective: ${seed.objective}`,
      `Possible helpers: ${seed.helpers}`,
      `Avoid: ${seed.avoid}`,
      `Hero flavor: ${hero.name} is a ${hero.ancestry} ${hero.className}.`,
    ],
    intendedResolution: `${hero.name} should resolve "${seed.objective}" in a joyful, classroom-safe way during the ending, using clues and choices established earlier.`,
    pacingBeats: buildPacingBeats(data.maxTurns),
    readingGuidance: reading.guidance,
  };
}

function formatEpisodePlan(plan?: EpisodePlan) {
  if (!plan) return "No episode plan was found. Rebuild a simple safe quest from the seed and keep continuity tight.";
  return [
    `Episode title: ${plan.episodeTitle}`,
    `Central problem: ${plan.centralProblem}`,
    `Hero goal: ${plan.heroGoal}`,
    `Stakes: ${plan.stakes}`,
    `Key story elements:\n- ${plan.keyStoryElements.join("\n- ")}`,
    `Intended resolution: ${plan.intendedResolution}`,
    `Pacing beats:\n- ${plan.pacingBeats.join("\n- ")}`,
    `Reading guidance: ${plan.readingGuidance}`,
  ].join("\n");
}

function formatStoryHistory(storyHistory?: string) {
  const trimmed = storyHistory?.trim();
  return trimmed ? trimmed : "No full story history was provided. Use the summary and chosen action carefully.";
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
- Each choice label must be under 90 characters
- The chosen action from the student must visibly change the next scene. Do not ignore it.
- New choices must be grounded in objects, helpers, clues, places, or problems that were explicitly established in the current scene.
- Do not offer vague choices like "continue forward" unless the scene clearly supports that action.`;

export function buildStartPrompt(data: StartGameData, episodePlan = createEpisodePlan(data)): string {
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
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters. The opening scene is not counted as a math-gated chapter.

EPISODE PLAN:
${formatEpisodePlan(episodePlan)}

This is the OPENING SCENE. Write ${reading.sceneWords}.

Your task: Write a vivid, immersive opening that does THREE things:
1. Introduces ${hero.name} as a character — give them personality, a brief backstory hint, and a reason why they are the right hero for this quest. Use their class and ancestry to flavor their appearance and style (appearance only, never personality or ability).
2. Sets the scene — paint a picture of where the adventure begins, using rich sensory details.
3. Launches the adventure — give them a clear quest goal and end with exactly 3 action choices.

Make the student feel like they are stepping into the pages of a fantasy story. Use vivid, descriptive language. Refer to ${hero.name} by name and use ${hero.pronouns.split("/")[0]} pronouns correctly.
Each choice must clearly connect to a specific thing established in this opening scene, such as a helper, clue, doorway, tool, sound, map, or magical obstacle.

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
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters.
Current story beat: Chapter ${data.turn} of ${data.maxTurns}. This number refers to successful math-gated chapters, not the intro.

EPISODE PLAN:
${formatEpisodePlan(data.episodePlan ?? createEpisodePlan(data))}

FULL STORY HISTORY:
${formatStoryHistory(data.storyHistory)}

SHORT STORY SUMMARY:
${data.storySummary}

The student chose: "${data.chosenAction}"
Math result: ${data.mathResult}
${data.lastMathSkill ? `Math skill flavor: The student just practiced ${data.lastMathSkill.skillLabel} (${data.lastMathSkill.storyFlavor}). You may echo this only as light story flavor, such as maps, gates, patterns, measures, or clever planning. Do not mention benchmark codes. Do not generate, solve, check, or explain math.` : ""}

Continue the adventure from where we left off. ${hero.name} solved the math challenge and can now act. Write ${reading.sceneWords} of exciting story. The first paragraph must show how the student's chosen action changes what happens next. ${turnsLeft <= 2 ? "The adventure is nearing its climax — bring back established clues and build urgently toward the intended resolution." : turnsLeft <= 4 ? "The adventure is past its midpoint — raise the stakes with a complication tied to earlier details." : "Keep the adventure moving forward with a new discovery tied to the episode plan."}

Choice rules:
- End with exactly 3 new safe action choices.
- Each choice must name or imply a specific scene detail from the storyText you just wrote.
- Do not introduce choices that ignore the chosen action or reset the story.
- Keep benchmark codes and math instructions out of the story.

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
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters.
Math challenges solved: ${data.mathSolved} of ${data.maxTurns}

EPISODE PLAN:
${formatEpisodePlan(data.episodePlan ?? createEpisodePlan(data))}

FULL STORY HISTORY:
${formatStoryHistory(data.storyHistory)}

SHORT STORY SUMMARY:
${data.storySummary}

Write a triumphant, emotionally satisfying ending to this adventure! ${hero.name} has completed the quest and solved ${data.mathSolved} math challenges. The ending should:
- Resolve the quest objective fully
- Match the intended resolution and bring back at least two established details from the story history
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
