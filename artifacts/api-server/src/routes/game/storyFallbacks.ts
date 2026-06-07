import type { EpisodePlan } from "./storyPrompt.js";

export const FALLBACK_SCENE = {
  sceneTitle: "The Puzzle Path",
  storyText:
    "The path ahead glows with gentle puzzle magic. Your hero studies the symbols and notices three safe ways forward. Ancient runes shimmer on the walls, each one a clue to the mystery ahead. The air hums with quiet energy, and somewhere in the distance, a friendly creature calls out in encouragement. What should the hero try next?",
  choices: [
    { id: "A", label: "Study the symbols carefully" },
    { id: "B", label: "Ask a friendly guide for help" },
    { id: "C", label: "Look for a hidden pattern" },
  ],
  storySummary:
    "The hero is following a safe puzzle path and solving challenges.",
  safetyRating: "kid_safe",
};

export const FALLBACK_ENDING = {
  endingTitle: "The Puzzle Champion",
  endingText:
    "With focus, courage, and careful thinking, your hero solves the final challenge and brings the adventure to a joyful end. The whole world seems to celebrate — friendly creatures cheer, lights shimmer, and a warm glow surrounds the hero. It was a journey filled with math, mystery, and courage. Well done!",
  badge: "Puzzle Champion",
  safetyRating: "kid_safe",
};

const FALLBACK_SCENE_LINES: Record<string, string[]> = {
  Fantasy: [
    "A ribbon of golden ivy curls into an arrow beside the path.",
    "Tiny lantern sparks gather around a clue etched into the stone.",
  ],
  "Space Adventure": [
    "A friendly console blinks in comet-blue patterns beside the next hatch.",
    "A star map rotates gently, highlighting a safe route forward.",
  ],
  Mystery: [
    "A harmless trail of sparkles loops around the newest clue.",
    "The notebook flips open by itself and points to a detail everyone missed.",
  ],
  "Pirate Adventure": [
    "The ship bell rings once as the map shifts toward a sunny clue.",
    "A puzzle crab taps three safe marks into the sand.",
  ],
  "Jungle Adventure": [
    "Vines twist into helpful arrows while bright flowers open nearby.",
    "A cheerful rhythm taps from the rain drum and points down the trail.",
  ],
  "Underwater Adventure": [
    "Bubbles rise in careful rows, revealing a clue near the coral gate.",
    "A shell bell hums as lantern fish gather around the safest path.",
  ],
  "Sky Islands": [
    "Clouds puff into stepping stones beside a ribbon of rainbow light.",
    "Wind bells chime softly, showing which bridge is ready.",
  ],
  "Clockwork / Invention": [
    "Gears click into a friendly rhythm and nudge a blueprint into view.",
    "A safe puff of steam curls into an arrow over the workshop floor.",
  ],
  "Ancient Ruins": [
    "Sunbeams slide across the mural and brighten one careful clue.",
    "A polite statue tilts its head toward the next puzzle tile.",
  ],
  "Spooky Mystery / Friendly Ghosts": [
    "A friendly lantern floats closer and gently lights the next clue.",
    "The shy ghost guide waves from a moonlit doorway with a helpful smile.",
  ],
  "Tiny World": [
    "A dew drop shines like a crystal lens over the next tiny clue.",
    "Petals unfold into a map just wide enough for a brave small hero.",
  ],
  "Magical School": [
    "Chalk lines swirl into arrows while the classroom hums with safe magic.",
    "A bookmark fairy taps the page where the next clue should be.",
  ],
  "Snack Escape": [
    "A napkin flutters like a sail while giant picnic footsteps thump far away.",
    "A blueberry scout points toward a crumb trail that leads away from the lunch line.",
  ],
  "Crystal Caverns": [
    "Prism crystals glow in careful rows, pointing toward the next bright clue.",
    "A friendly echo bounces through the cavern and lands beside a safe path.",
  ],
  "Clockwork City": [
    "A tower clock ticks twice, and a tiny gear-door opens with a cheerful click.",
    "Brass streetlamps blink in a pattern that marks the next puzzle corner.",
  ],
  "Jungle Ruins": [
    "Mossy tiles brighten one by one across the sunny ruin floor.",
    "A parrot-shaped carving points its stone beak toward a hidden clue.",
  ],
  "Undersea Kingdom": [
    "Pearl lanterns shimmer as a royal coral gate hums a helpful tune.",
    "A sea-turtle guide circles a clue in bubbles near the palace steps.",
  ],
  "Moon Base Mystery": [
    "A moon rover projects a friendly arrow across the silver floor.",
    "The observatory dome opens just enough to reveal a glowing clue.",
  ],
  "Enchanted Library": [
    "Books flutter into a staircase while a bookmark points toward the next shelf.",
    "A sleepy atlas wakes and opens to a map with one safe route circled.",
  ],
  "Candy Kingdom": [
    "Peppermint signposts twist into arrows beside a gumdrop garden path.",
    "A licorice bridge wiggles kindly and points toward the next clue.",
  ],
  "Dinosaur Valley": [
    "A gentle dinosaur footprint fills with golden light beside the trail.",
    "Fern leaves part to reveal a fossil clue sparkling in the sun.",
  ],
  "Miniature Backyard Quest": [
    "A ladybug lifts a leaf like a tiny flag beside the next clue.",
    "Pebbles line up into a safe path under the picnic table shadows.",
  ],
  "Rainbow Railway": [
    "The rainbow rails hum softly as a bright ticket flips toward the next stop.",
    "A friendly conductor lantern flashes three colors beside the platform.",
  ],
  "Pop Band Quest": [
    "A rhythm board flashes a cheerful clue while the rehearsal lights glow softly.",
    "The stage manager sprite points toward a missing chorus cue near the costume rack.",
  ],
};

const FALLBACK_ENDING_LINES: Record<string, string[]> = {
  Fantasy: [
    "Lantern light returns to the garden, and the Chronicle stamps the final page in gold.",
    "The crystal forest glows gently as every helper cheers the solved puzzle.",
  ],
  "Space Adventure": [
    "The beacon shines across the stars, guiding friendly travelers home.",
    "The constellation projector wakes, filling the deck with bright safe colors.",
  ],
  Mystery: [
    "The final clue clicks into place, and every harmless mystery smiles open.",
    "The missing label returns to its frame as the notebook closes with a satisfied flutter.",
  ],
  "Pirate Adventure": [
    "The compass points to a shared treasure, and the sunny harbor rings with cheers.",
    "The sail lifts in a happy breeze as the map folds itself into a ribbon.",
  ],
  "Jungle Adventure": [
    "The festival clearing glows as flowers open in a bright circle.",
    "The canopy path is restored, and friendly drums tap a celebration rhythm.",
  ],
  "Underwater Adventure": [
    "The reef bells ring softly, and bubbles carry the good news through the city.",
    "The coral gate glows again while lantern fish swirl in a cheerful parade.",
  ],
  "Sky Islands": [
    "The cloud bridge settles into place, shining under a calm rainbow.",
    "The floating market cheers as windmills turn in a steady, friendly rhythm.",
  ],
  "Clockwork / Invention": [
    "The kindness-powered engine ticks to life with a bright little chime.",
    "The workshop gears spin smoothly, ringing tiny bells across the final page.",
  ],
  "Ancient Ruins": [
    "The mural tiles glow in order, and the sunlit gate opens with a warm hum.",
    "The compass statue shines as ancient bells celebrate the completed path.",
  ],
  "Spooky Mystery / Friendly Ghosts": [
    "The lighthouse beacon glows warmly, and every friendly ghost waves good night.",
    "The silly shadows bow politely as the final clue settles into place.",
  ],
  "Tiny World": [
    "The acorn elevator dings at the top, and the garden village cheers below.",
    "Button wheels spin, petals unfold, and the tiny world celebrates in bright color.",
  ],
  "Magical School": [
    "The class mural remembers its colors, and stars sparkle over every desk.",
    "The runaway lesson cards settle neatly as the bell chimes a joyful finale.",
  ],
  "Snack Escape": [
    "The hero reaches the safe snack clubhouse, where every tiny treat cheers under a banner of napkins.",
    "The picnic basket door swings open, and the whole snack-sized crew celebrates far from the lunch line.",
  ],
  "Crystal Caverns": [
    "The crystal lights return to every tunnel, and the cavern sings with gentle echoes.",
    "The final prism glows, filling the cave with safe rainbow sparkle.",
  ],
  "Clockwork City": [
    "The city clocks chime together, and every gear turns in a friendly rhythm.",
    "The grand clock face lights up as the city celebrates the solved puzzle.",
  ],
  "Jungle Ruins": [
    "The ruin garden blooms again, and sunlight dances over every carved tile.",
    "The ancient mural shines with fresh color as the jungle path opens wide.",
  ],
  "Undersea Kingdom": [
    "The pearl palace glows, and the reef parade twirls through the kingdom.",
    "The coral crown sparkles as every lantern fish cheers the final page.",
  ],
  "Moon Base Mystery": [
    "The moon base beacon shines across the stars, and the mystery board clears.",
    "The observatory lights up, showing a sky full of solved clues.",
  ],
  "Enchanted Library": [
    "The library shelves settle into order, and every book gives a tiny applause.",
    "The final chapter floats into place while bookmarks dance in the air.",
  ],
  "Candy Kingdom": [
    "The gumdrop bells ring, and the candy paths sparkle with happy color.",
    "The peppermint gates open as the kingdom celebrates a clever ending.",
  ],
  "Dinosaur Valley": [
    "The valley drums echo gently, and friendly dinosaurs stomp a happy rhythm.",
    "The fossil gate glows as the whole valley cheers under bright ferns.",
  ],
  "Miniature Backyard Quest": [
    "The tiny backyard village cheers from acorn balconies and flower-petal roofs.",
    "The final pebble clicks into place, and the miniature path shines home.",
  ],
  "Rainbow Railway": [
    "The Rainbow Railway arrives right on time, glowing from wheel to whistle.",
    "The final station lights up as every color on the railway sparkles.",
  ],
  "Pop Band Quest": [
    "The crew finishes the final number together, and the stage lights shimmer like safe confetti.",
    "The harmony badges return to the wall as the whole performance crew cheers backstage.",
  ],
};

function pickFallbackLine(lines: Record<string, string[]>, genre: string, salt: string) {
  const options = lines[genre] ?? [
    "A safe magical clue glows brighter, showing a clever way forward.",
  ];
  const hash = [...`${genre}|${salt}`].reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );
  return options[hash % options.length];
}

export function buildGenreFallbackScene(plan?: EpisodePlan): typeof FALLBACK_SCENE {
  if (!plan?.opening) return FALLBACK_SCENE;
  const opening = plan.opening;
  const genreLine = pickFallbackLine(
    FALLBACK_SCENE_LINES,
    opening.genre,
    `${opening.setting}|${opening.objective}`,
  );
  return {
    sceneTitle: `${opening.genre} Puzzle Path`,
    storyText: `The path through ${opening.setting} glows with gentle puzzle magic. ${genreLine} The clue ahead still points toward the quest goal: ${opening.objective}. A helpful ${opening.helpers} notices ${opening.detail.toLowerCase()} and gestures toward three safe ways forward. The adventure stays bright, calm, and full of clever choices. What should the hero try next?`,
    choices: [
      { id: "A", label: "Study the glowing clue carefully" },
      { id: "B", label: `Ask the ${opening.helpers} for help` },
      { id: "C", label: "Look for a hidden pattern nearby" },
    ],
    storySummary: `The hero continues a ${opening.genre} quest in ${opening.setting}, working toward ${opening.objective}.`,
    safetyRating: "kid_safe",
  };
}

export function buildGenreFallbackEnding(plan?: EpisodePlan): typeof FALLBACK_ENDING {
  if (!plan?.opening) return FALLBACK_ENDING;
  const opening = plan.opening;
  const genreLine = pickFallbackLine(
    FALLBACK_ENDING_LINES,
    opening.genre,
    `${opening.objective}|${opening.helpers}`,
  );
  return {
    endingTitle: `${opening.genre} Victory`,
    endingText: `With careful thinking and brave choices, the hero solves the final puzzle in ${opening.setting}. The goal is complete: ${opening.objective}. ${genreLine} The friendly ${opening.helpers} cheers as lights shimmer across the last page of the Chronicle, and the whole ${opening.genre.toLowerCase()} adventure closes with a bright, joyful celebration.`,
    badge: `${opening.genre.split(" ")[0]} Champion`,
    safetyRating: "kid_safe",
  };
}

export type FallbackScene = typeof FALLBACK_SCENE;
export type FallbackEnding = typeof FALLBACK_ENDING;
