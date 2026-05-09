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
];

export const HERO_PRONOUNS = ["she/her", "he/him", "they/them"];

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
];

export const HERO_CLASSES = [
  "Wizard",
  "Warrior",
  "Explorer",
  "Rogue",
  "Inventor",
  "Healer",
  "Beast Tamer",
  "Elementalist",
];

export const ADVENTURE_SEEDS = [
  "Random",
  "The Sky Temple",
  "The Crystal Forest",
  "The Clockwork Volcano",
  "The Moonlit Library",
  "The Lost Reef City",
  "The Floating Market",
  "The Dragon Egg Rescue",
  "The Puzzle Pyramid",
  "The Candy Comet",
  "The Tiny Giant's Garden",
  "The Museum After Midnight",
  "The Friendly Ghost Lighthouse",
];

export const QUICK_START_SEEDS = ADVENTURE_SEEDS.filter(
  (seed) => seed !== "Random",
);
