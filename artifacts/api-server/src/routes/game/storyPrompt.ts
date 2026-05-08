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

const SYSTEM_PROMPT = `You are the story engine for MathQuest Live, a classroom-safe math adventure game for 4th grade students ages 9-11. Write short, exciting, kid-safe scenes.

IMPORTANT RULES:
- This is for a 4th grade classroom. All content must be safe and appropriate.
- No gore, graphic violence, death, romance, profanity, horror, realistic weapons harming people
- No bullying, stereotypes, real-world politics, religion, drugs, alcohol, smoking, sexual content
- No self-harm, no asking for personal information
- Allowed: cartoon adventure danger, puzzles, magical obstacles, friendly creatures, storms, locked doors, mysteries
- Problems resolved through: math, observation, kindness, creativity, teamwork, courage
- Ancestry/species only affects appearance and fantasy flavor — never implies intelligence or ability
- Pronouns only affect pronoun use in the story
- Write in fun, adventurous middle-grade tone
- Keep each scene short: 100-180 words maximum
- The student can ONLY choose from buttons — no freeform input
- Do NOT generate math problems — the app handles all math separately
- Return ONLY valid JSON matching the required format
- safetyRating must always be "kid_safe"
- Provide EXACTLY 3 choices with ids "A", "B", "C"
- Each choice label must be under 90 characters`;

export function buildStartPrompt(data: StartGameData): string {
  const seed = ADVENTURE_SEEDS[data.adventureSeed] || {
    setting: "A magical world full of puzzles and wonder",
    objective: "Complete the adventure by solving challenges",
    helpers: "friendly guide, magical creature, wise elder",
    avoid: "anything unsafe or inappropriate",
  };

  const hero = data.hero;

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${data.adventureSeed}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
This is Turn 1 of ${data.maxTurns}.

Write the opening scene of the adventure. Introduce ${hero.name} and the adventure setting. End with exactly 3 clear, safe action choices for the student.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "100-180 words of exciting, safe story text",
  "choices": [
    { "id": "A", "label": "clear action under 90 chars" },
    { "id": "B", "label": "clear action under 90 chars" },
    { "id": "C", "label": "clear action under 90 chars" }
  ],
  "storySummary": "1-2 sentence summary of what happened",
  "safetyRating": "kid_safe"
}`;
}

export function buildTurnPrompt(data: TurnData): string {
  const seed = ADVENTURE_SEEDS[data.adventureSeed] || {
    setting: "A magical world full of puzzles and wonder",
    objective: "Complete the adventure by solving challenges",
    helpers: "friendly guide, magical creature, wise elder",
    avoid: "anything unsafe or inappropriate",
  };

  const hero = data.hero;
  const turnsLeft = data.maxTurns - data.turn;

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${data.adventureSeed}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
This is Turn ${data.turn} of ${data.maxTurns} (${turnsLeft} turns remaining).

STORY SO FAR: ${data.storySummary}

The student chose: "${data.chosenAction}"
Math result: ${data.mathResult}

Continue the adventure from where we left off. The student solved the math challenge successfully and can now act on their choice. ${turnsLeft <= 2 ? "The adventure is nearing its climax — build toward an exciting resolution!" : "Keep the adventure moving forward with new discoveries."} End with exactly 3 new safe action choices.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "100-180 words of exciting, safe story text",
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

  return `${SYSTEM_PROMPT}

ADVENTURE SEED: ${data.adventureSeed}
HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Math challenges solved: ${data.mathSolved} of ${data.maxTurns}

STORY SO FAR: ${data.storySummary}

Write a triumphant, joyful ending to this adventure! The hero has completed all ${data.maxTurns} turns and solved ${data.mathSolved} math challenges. Make it feel earned and exciting. Give the hero a creative badge name that reflects their adventure.

Respond ONLY with valid JSON in this exact format:
{
  "endingTitle": "dramatic ending title",
  "endingText": "100-200 words of triumphant, safe ending story",
  "badge": "Creative Badge Name",
  "safetyRating": "kid_safe"
}`;
}
