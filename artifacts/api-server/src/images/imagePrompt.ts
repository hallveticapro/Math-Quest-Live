import type { ImageRequestContext } from "./imageTypes";

const MAX_SUMMARY_LENGTH = 420;
const UNSAFE_CHARS = /[<>{}[\]\\]/g;
const WHITESPACE = /\s+/g;

function cleanText(value: string | undefined, fallback: string) {
  const cleaned = (value ?? fallback)
    .replace(UNSAFE_CHARS, " ")
    .replace(WHITESPACE, " ")
    .trim();
  return (cleaned || fallback).slice(0, MAX_SUMMARY_LENGTH);
}

function heroDescription(context: ImageRequestContext) {
  const { hero } = context;
  return `${cleanText(hero.name, "a MathQuest hero")}, a ${cleanText(hero.ancestry, "fantasy")} ${cleanText(hero.className, "adventurer")}`;
}

export function buildImageAlt(context: ImageRequestContext) {
  return `A colorful cartoon fantasy storybook illustration of ${heroDescription(context)} in ${context.adventureSeed}.`;
}

export function buildImagePrompt(context: ImageRequestContext) {
  const sceneSummary = cleanText(
    context.storySummary ?? context.storyText,
    "a bright, magical puzzle adventure scene",
  );
  const action = context.chosenAction ? `Chosen action: ${cleanText(context.chosenAction, "a safe adventure choice")}.` : "";

  return [
    "Create a colorful cartoon fantasy storybook illustration for upper elementary students.",
    "Bright, whimsical, adventurous, classroom-safe, clean shapes, expressive characters, magical lighting.",
    "Not photorealistic. ABSOLUTELY NO readable text, letters, words, numbers, math symbols, labels, logos, captions, signs, or UI should appear anywhere in the image.",
    "Decorative unreadable magical glyphs, abstract runes, and ornamental markings are allowed only if they do not form real letters, words, or numbers.",
    "No gore, injuries, death, horror, romance, frightening realism, or realistic weapons harming people.",
    "No stereotypes tied to ancestry, species, gender, or class. No real people. No student likenesses.",
    `Adventure: ${cleanText(context.adventureSeed, "a magical quest")}.`,
    `Moment: ${context.kind}.`,
    `Scene title: ${cleanText(context.sceneTitle, "A MathQuest adventure scene")}.`,
    `Scene: ${sceneSummary}.`,
    `Hero: ${heroDescription(context)}.`,
    `Challenge level: ${cleanText(context.difficulty, "Medium")}.`,
    action,
  ].filter(Boolean).join(" ");
}
