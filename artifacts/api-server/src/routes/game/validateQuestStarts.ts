import { countQuestOpeningCombinations } from "./storyPrompt.js";

const minimum = 200;
const count = countQuestOpeningCombinations();

if (count < minimum) {
  console.error(`Quest genre openings support ${count} combinations; expected at least ${minimum}.`);
  process.exit(1);
}

console.log(`Quest genre openings support ${count} safe combinations.`);
