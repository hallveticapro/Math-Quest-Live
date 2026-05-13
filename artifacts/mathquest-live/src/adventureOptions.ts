export const HERO_NAMES = [
  "Astra",
  "Kael",
  "Nova",
  "Mira",
  "Jax",
  "Luna",
  "Orion",
  "Sage",
  "Zara",
  "Theo",
  "Elara",
  "Milo",
  "Lunamandia",
  "Solara",
  "Bramble",
];

export const HERO_PRONOUNS = ["she/her", "he/him"];

export const HERO_ANCESTRIES = [
  "Human",
  "Elf",
  "Dwarf",
  "Dragonborn",
  "Fae",
  "Robot",
  "Merfolk",
  "Beastfolk",
  "Starborn",
  "Gnome",
  "Sprite",
  "Stonekin",
  "Cloudling",
  "Foxfolk",
  "Hamster",
  "Koala",
  "Guinea Pig",
  "Wolf",
  "Mango",
  "Starling",
  "Pebblekin",
];

export const HERO_ANCESTRY_DESCRIPTIONS: Record<string, string> = {
  Human: "A familiar hero with a brave heart and a practical eye for clues.",
  Elf: "A graceful forest friend who notices quiet details in the world.",
  Dwarf: "A sturdy cave-wise hero who keeps going when paths get tricky.",
  Dragonborn: "A bold scaled adventurer with a spark of storybook dragon flair.",
  Fae: "A mysterious forest-born hero who solves problems with cleverness and wonder.",
  Robot: "A clockwork companion who thinks in patterns, gears, and bright ideas.",
  Merfolk: "A wave-wise hero who feels at home near rivers, reefs, and moonlit pools.",
  Beastfolk: "A quick-eared adventurer with animal-like features and a curious spirit.",
  Starborn: "A sky-touched hero who follows clues like constellations.",
  Gnome: "A small, clever tinkerer who can spot possibilities in tiny places.",
  Sprite: "A tiny, quick adventurer who notices details others miss.",
  Stonekin: "A steady hero with pebble-bright patience and mountain courage.",
  Cloudling: "A light-footed sky friend who drifts toward hopeful ideas.",
  Foxfolk: "A clever, bright-eyed hero who enjoys puzzles and playful paths.",
  Hamster: "A small, determined hero who can turn cozy corners into big adventures.",
  Koala: "A calm tree-loving hero who studies clues from a cozy perch.",
  "Guinea Pig": "A gentle little hero with a brave squeak and a careful nose for clues.",
  Wolf: "A watchful hero with keen senses and a loyal storybook spirit.",
  Mango: "A cheerful fruit-shaped hero with sunny colors and cartoon-safe charm.",
  Starling: "A bright, curious hero who follows clues like constellations.",
  Pebblekin: "A sturdy little hero who stays steady when the path gets tricky.",
};

export const HERO_CLASSES = [
  "Wizard",
  "Warrior",
  "Explorer",
  "Rogue",
  "Inventor",
  "Healer",
  "Beast Tamer",
  "Elementalist",
  "Guardian",
  "Cartographer",
  "Stargazer",
  "Alchemist",
  "Puzzle Mage",
];

export const HERO_CLASS_DESCRIPTIONS: Record<string, string> = {
  Wizard: "A spell-smart hero who studies clues and careful words.",
  Warrior: "A brave protector who helps the team stay calm when trouble appears.",
  Explorer: "A pathfinder who loves maps, hidden doors, and new discoveries.",
  Rogue: "A sneaky puzzle-solver who slips through tricky places without causing harm.",
  Inventor: "A creative builder who solves problems with gadgets and bright plans.",
  Healer: "A kind helper who protects friends and mends what has gone wrong.",
  "Beast Tamer": "A patient friend to magical creatures who listens before acting.",
  Elementalist: "A nature-wise hero who works with wind, water, flame, and stone.",
  Guardian: "A steady defender who keeps hope glowing when the path gets hard.",
  Cartographer: "A mapmaker who turns confusing paths into clear routes.",
  Stargazer: "A sky-watcher who reads patterns in stars and moonlight.",
  Alchemist: "A careful experimenter who mixes safe ideas into clever solutions.",
  "Puzzle Mage": "A riddle-loving hero who can make mysteries click into place.",
};

export const SURPRISE_GENRE = "Surprise Me!";

export const QUEST_GENRES = [
  SURPRISE_GENRE,
  "Fantasy",
  "Space Adventure",
  "Mystery",
  "Pirate Adventure",
  "Jungle Adventure",
  "Underwater Adventure",
  "Sky Islands",
  "Clockwork / Invention",
  "Ancient Ruins",
  "Spooky Mystery / Friendly Ghosts",
  "Tiny World",
  "Magical School",
  "Snack Escape",
  "Crystal Caverns",
  "Clockwork City",
  "Jungle Ruins",
  "Undersea Kingdom",
  "Moon Base Mystery",
  "Enchanted Library",
  "Candy Kingdom",
  "Dinosaur Valley",
  "Miniature Backyard Quest",
  "Rainbow Railway",
];

export const CONCRETE_QUEST_GENRES = QUEST_GENRES.filter(
  (genre) => genre !== SURPRISE_GENRE,
);

export function pickConcreteGenre(selectedGenre: string) {
  if (selectedGenre !== SURPRISE_GENRE && CONCRETE_QUEST_GENRES.includes(selectedGenre)) {
    return selectedGenre;
  }
  return CONCRETE_QUEST_GENRES[Math.floor(Math.random() * CONCRETE_QUEST_GENRES.length)];
}
