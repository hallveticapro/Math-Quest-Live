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
  genre: string;
  centralProblem: string;
  heroGoal: string;
  stakes: string;
  keyStoryElements: string[];
  intendedResolution: string;
  pacingBeats: string[];
  readingGuidance: string;
  opening: QuestOpening;
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
export const ALLOWED_ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn", "Gnome", "Sprite", "Stonekin", "Cloudling", "Foxfolk", "Hamster", "Guinea Pig", "Wolf", "Mango person"] as const;
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

type QuestGenre =
  | "Fantasy"
  | "Space Adventure"
  | "Mystery"
  | "Pirate Adventure"
  | "Jungle Adventure"
  | "Underwater Adventure"
  | "Sky Islands"
  | "Clockwork / Invention"
  | "Ancient Ruins"
  | "Spooky Mystery / Friendly Ghosts"
  | "Tiny World"
  | "Magical School"
  | "Snack Escape";

type GenreProfile = {
  settings: string[];
  objectives: string[];
  helpers: string[];
  details: string[];
  avoid: string;
};

export type QuestOpening = {
  name: string;
  genre: QuestGenre;
  setting: string;
  objective: string;
  helpers: string;
  detail: string;
  avoid: string;
};

const SURPRISE_GENRE = "Surprise Me!";

const GENRE_PROFILES: Record<QuestGenre, GenreProfile> = {
  Fantasy: {
    settings: ["a moonlit castle garden", "a crystal forest", "a floating wizard tower", "a valley of singing stones"],
    objectives: ["restore a missing glow to the guardian lantern", "wake the sleepy bridge before sunset", "return a lost map rune to its page", "help a shy dragon find the courage to ask for help"],
    helpers: ["crystal fox", "owl librarian", "tiny dragon scout", "moss giant"],
    details: ["golden ivy curls around every doorway", "friendly sprites leave clues in acorn cups", "the wind sounds like a harp", "every solved puzzle lights another star"],
    avoid: "dark curses, scary monsters, violence, death",
  },
  "Space Adventure": {
    settings: ["a candy-bright comet station", "a moon garden under glass", "a starship classroom deck", "an asteroid market of floating stalls"],
    objectives: ["repair the beacon that guides friendly travelers", "sort the mixed-up star maps", "help a lost rover find its charging dock", "restart the constellation projector"],
    helpers: ["robot navigator", "moon moth", "comet captain", "star puppy"],
    details: ["planets drift by like glowing marbles", "buttons blink in rainbow patterns", "zero-gravity notebooks float past", "a telescope hums whenever clues line up"],
    avoid: "space disasters, oxygen danger, scary aliens, realistic crashes",
  },
  Mystery: {
    settings: ["a museum after closing", "a moonlit library", "a puzzle hotel with talking doors", "a train car full of harmless clues"],
    objectives: ["find who borrowed the missing exhibit label", "follow the trail of glowing footprints", "solve why the portrait keeps changing hats", "return the lost chapter before the bell rings"],
    helpers: ["book mouse", "friendly detective cat", "map fairy", "talking magnifying glass"],
    details: ["clues appear as harmless sparkles", "every door asks a riddle politely", "the clock ticks in secret patterns", "a notebook flips to the next clue by itself"],
    avoid: "crime realism, fear, threats, horror, death",
  },
  "Pirate Adventure": {
    settings: ["a sunny island cove", "a friendly pirate ship", "a tide-pool treasure map", "a harbor of singing boats"],
    objectives: ["find the missing compass before the tide turns", "share a treasure of kindness fairly", "repair the sail with puzzle patches", "decode a map of safe harbor lights"],
    helpers: ["parrot lookout", "jolly captain", "puzzle crab", "rope-knot sprite"],
    details: ["gold coins are actually chocolate wrappers", "the ship's bell rings when clues are found", "waves clap softly against the dock", "treasure chests giggle when opened"],
    avoid: "weapons, fighting, stealing, danger at sea",
  },
  "Jungle Adventure": {
    settings: ["a bright rainforest trail", "a treehouse observatory", "a vine bridge above a shallow stream", "a hidden garden of giant leaves"],
    objectives: ["help guide friendly animals to the festival clearing", "repair the sun dial flower", "find the path markers before lunch", "return the rain drum to the canopy stage"],
    helpers: ["toucan guide", "gentle jaguar cub", "leaf sprite", "frog drummer"],
    details: ["flowers open when clues are solved", "vines form arrows in the air", "raindrops tap a cheerful rhythm", "butterflies carry tiny map flags"],
    avoid: "predator attacks, injury, scary jungle danger",
  },
  "Underwater Adventure": {
    settings: ["a glowing reef city", "a pearl library", "a kelp maze with friendly signs", "a shell-powered workshop"],
    objectives: ["fix the coral gate before the current changes", "return a missing pearl bookmark", "guide lantern fish back to their school", "tune the shell bells for the reef parade"],
    helpers: ["merfolk guide", "puzzle crab", "lantern fish", "sea turtle elder"],
    details: ["bubbles carry clues upward", "coral windows glow like stained glass", "seaweed writes arrows in the water", "shells hum when the path is right"],
    avoid: "drowning, scary sea monsters, storms, injury",
  },
  "Sky Islands": {
    settings: ["a chain of cloud islands", "a sky orchard above the hills", "a floating market", "a windmill village in the clouds"],
    objectives: ["repair the cloud bridge", "catch runaway kite seeds", "help the windmills turn in rhythm", "deliver a message to the rainbow post office"],
    helpers: ["cloud turtle", "bronze owl", "wind sprite", "sky llama"],
    details: ["clouds puff into stepping stones", "rainbows mark safe paths", "bells ring from floating towers", "feathers drift toward the next clue"],
    avoid: "falling harm, lightning injuries, frightening storms",
  },
  "Clockwork / Invention": {
    settings: ["a clockwork workshop", "a friendly robot lab", "a gear-powered greenhouse", "a steam train of inventions"],
    objectives: ["restart the kindness-powered engine", "sort gears into the right machine", "help a robot remember its parade steps", "cool a volcano machine into harmless steam"],
    helpers: ["gear sprite", "clockwork bird", "robot helper", "goggle-wearing squirrel"],
    details: ["gears click like music", "safe steam puffs into silly shapes", "blueprints fold into arrows", "tiny bells ding after every clever choice"],
    avoid: "explosions, burns, real machine danger, injury",
  },
  "Ancient Ruins": {
    settings: ["a sunlit puzzle pyramid", "a marble maze of friendly statues", "a buried garden temple", "a ruin where murals tell jokes"],
    objectives: ["match the mural tiles before sunset", "open the kindness gate", "restore the compass statue's missing gem", "find the festival path through the ruins"],
    helpers: ["sand sphinx", "hieroglyph fairy", "magic compass", "stone turtle"],
    details: ["tiles glow when patterns make sense", "statues offer polite hints", "sunbeams point at safe clues", "ancient bells hum softly in the walls"],
    avoid: "curses, mummy horror, traps that hurt people, tomb danger",
  },
  "Spooky Mystery / Friendly Ghosts": {
    settings: ["a friendly ghost lighthouse", "a glowing portrait hallway", "a moonlit schoolhouse with silly shadows", "a library where lanterns float politely"],
    objectives: ["help a shy ghost pet find its bell", "relight the welcome beacon", "match silly skeleton keys to their doors", "solve why the portraits keep swapping frames"],
    helpers: ["friendly ghost keeper", "moon moth", "lantern sprite", "smiling skeleton key"],
    details: ["nothing jumps out; clues glow gently", "shadows wave hello", "the ghost says please and thank you", "candles bob like tiny stars"],
    avoid: "horror, terror, gore, death-focused plots, nightmare imagery",
  },
  "Tiny World": {
    settings: ["a garden where the hero is tiny", "a teacup village", "a mushroom workshop", "a bookshelf city behind a loose page"],
    objectives: ["find the safe growing charm", "repair the acorn elevator", "help ants organize a picnic parade", "deliver a button wheel to the toy cart"],
    helpers: ["ladybug scout", "friendly ant", "button mouse", "flower fairy"],
    details: ["dew drops look like crystal balls", "pencils become bridges", "crumbs are boulder-sized snacks", "petals unfold like maps"],
    avoid: "being eaten, scary insects, injury",
  },
  "Magical School": {
    settings: ["a school of floating staircases", "a classroom inside a giant tree", "a safe spell practice hall", "a hall of glowing lockers"],
    objectives: ["help the class mural remember its colors", "organize runaway lesson cards", "find the missing bell chime", "prepare the kindness exam celebration"],
    helpers: ["pencil sprite", "friendly hall monitor owl", "chalkboard dragon", "bookmark fairy"],
    details: ["desks shuffle into helpful patterns", "chalk lines become arrows", "lockers hum cheerful clues", "stars sparkle over correct plans"],
    avoid: "mean teachers, punishment, embarrassment, unsafe magic",
  },
  "Snack Escape": {
    settings: ["a giant picnic blanket", "a storybook kitchen counter", "a cafeteria tray raceway", "a market basket maze"],
    objectives: ["help a snack-sized hero reach the safe fruit parade", "roll a tiny supply cart away from the lunch line", "guide the picnic treats back to their cozy basket", "find the crumb trail to the safe snack clubhouse"],
    helpers: ["blueberry scout", "toast crumb cartographer", "friendly napkin kite", "tiny spoon sled"],
    details: ["giant footsteps thump like drums far away", "a napkin flutters like a sail", "crumbs make boulder-sized stepping stones", "a lunch bell rings in silly cartoon echoes"],
    avoid: "cannibalism, horror, graphic eating, biting, chewing, injury, realistic danger, scary humans",
  },
};

const QUEST_GENRES = Object.keys(GENRE_PROFILES) as QuestGenre[];
export const ALLOWED_ADVENTURE_SEEDS = [SURPRISE_GENRE, ...QUEST_GENRES] as const;

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

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function countQuestOpeningCombinations() {
  return QUEST_GENRES.reduce((total, genre) => {
    const profile = GENRE_PROFILES[genre];
    return (
      total +
      profile.settings.length *
        profile.objectives.length *
        profile.helpers.length *
        profile.details.length
    );
  }, 0);
}

export function resolveSeed(adventureSeed: string) {
  const requested =
    adventureSeed === SURPRISE_GENRE || !(adventureSeed in GENRE_PROFILES)
      ? pickOne(QUEST_GENRES)
      : (adventureSeed as QuestGenre);
  const profile = GENRE_PROFILES[requested];

  return {
    name: requested,
    genre: requested,
    setting: pickOne(profile.settings),
    objective: pickOne(profile.objectives),
    helpers: pickOne(profile.helpers),
    detail: pickOne(profile.details),
    avoid: profile.avoid,
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
    genre: seed.genre,
    centralProblem: seed.objective,
    heroGoal: `${hero.name} must help solve the problem in ${seed.setting} by making brave, kind, and clever choices.`,
    stakes: "If the hero does nothing, the magical place will remain tangled or unfinished, but no one should be harmed.",
    keyStoryElements: [
      `Genre: ${seed.genre}`,
      `Setting: ${seed.setting}`,
      `Objective: ${seed.objective}`,
      `Possible helpers: ${seed.helpers}`,
      `Opening detail: ${seed.detail}`,
      `Avoid: ${seed.avoid}`,
      `Hero flavor: ${hero.name} is a ${hero.ancestry} ${hero.className}.`,
    ],
    intendedResolution: `${hero.name} should resolve "${seed.objective}" in a joyful, classroom-safe way during the ending, using clues and choices established earlier.`,
    pacingBeats: buildPacingBeats(data.maxTurns),
    readingGuidance: reading.guidance,
    opening: seed,
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
- If the hero is a Mango person, describe them as a cheerful whimsical fruit-person adventurer with cartoon-safe charm; never use gross, creepy, body-horror, or realistic eating imagery.
- If the genre is Snack Escape, frame it as silly cartoon picnic or cafeteria chaos with distant hungry giants/humans; never use cannibalism, horror, biting, chewing, injury, gore, or realistic predator danger.
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
- Each playable storyText should end with one brief in-world question inviting the next decision, such as asking what the hero should try next. Vary the wording and keep it forward-looking.
- The story-ending question must not mention math, benchmarks, standards, buttons, apps, or which choice is correct.
- Do not offer vague choices like "continue forward" unless the scene clearly supports that action.`;

export function buildStartPrompt(data: StartGameData, episodePlan = createEpisodePlan(data)): string {
  const seed = episodePlan.opening;
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
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
3. Launches the adventure — give them a clear quest goal.
4. End storyText with a short, natural question that invites the next choice, then provide exactly 3 action choices.

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
  const seed = data.episodePlan?.opening ?? resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const turnsLeft = data.maxTurns - data.turn;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
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
- End storyText with a short, natural in-world question that invites the next choice.
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
  const seed = data.episodePlan?.opening ?? resolveSeed(data.adventureSeed);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
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
