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
  "Guinea Pig",
  "Wolf",
  "Mango person",
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
  "Guardian",
  "Cartographer",
  "Stargazer",
  "Alchemist",
  "Puzzle Mage",
];

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
