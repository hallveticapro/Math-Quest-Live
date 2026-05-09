import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Sparkles } from "lucide-react";
import { Hero } from "../types";
import { DIFFICULTY_OPTIONS } from "../math/floridaBestMath";
import {
  applyColorScheme,
  COLOR_SCHEMES,
  DEFAULT_COLOR_SCHEME_ID,
  type ColorSchemeId,
} from "../colorSchemes";
import {
  DEFAULT_QUEST_LENGTH,
  QUEST_LENGTH_OPTIONS,
} from "../questLengths";

const NAMES = [
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
const PRONOUNS = ["she/her", "he/him", "they/them"];
const ANCESTRIES = [
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
const CLASSES = [
  "Wizard",
  "Warrior",
  "Explorer",
  "Rogue",
  "Inventor",
  "Healer",
  "Beast Tamer",
  "Elementalist",
];
const SEEDS = [
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
type SetupStep =
  | "intro"
  | "name"
  | "pronouns"
  | "ancestry"
  | "class"
  | "difficulty"
  | "length"
  | "seed"
  | "colors";

const DECISION_STEPS: SetupStep[] = [
  "name",
  "pronouns",
  "ancestry",
  "class",
  "difficulty",
  "length",
  "seed",
  "colors",
];
const STEP_ORDER: SetupStep[] = ["intro", ...DECISION_STEPS];
const WRITING_TRANSITION_MS = 1900;

type SetupScreenProps = {
  onStart: (
    hero: Hero,
    difficulty: string,
    seed: string,
    maxTurns: number,
    colorSchemeId: ColorSchemeId,
  ) => void;
  onPrepareStart: (
    hero: Hero,
    difficulty: string,
    seed: string,
    maxTurns: number,
  ) => void;
  onCancel: () => void;
};

function getStepNumber(step: SetupStep) {
  const index = DECISION_STEPS.indexOf(step);
  return index === -1 ? null : index + 1;
}

function optionClass(isSelected: boolean) {
  return [
    "mq-focus relative flex min-h-20 w-full flex-col justify-center border-2 p-4 text-left transition-all duration-150",
    "bg-[var(--mq-surface-strong)] text-[var(--mq-text)] hover:border-[var(--mq-border-strong)] hover:bg-[var(--mq-button-hover)]",
    isSelected
      ? "border-[var(--mq-border-strong)] shadow-[0_0_24px_color-mix(in_srgb,var(--mq-primary)_45%,transparent)]"
      : "border-[var(--mq-border)]",
  ].join(" ");
}

function SelectionMark({ selected }: { selected: boolean }) {
  if (!selected) return null;
  return (
    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm border border-[var(--mq-border-strong)] bg-[var(--mq-background)] px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--mq-heading)]">
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      Selected
    </span>
  );
}

function getPronounObject(pronouns: string) {
  if (pronouns === "she/her") return "her";
  if (pronouns === "he/him") return "him";
  return "them";
}

function getClassConfirmationText({
  name,
  ancestry,
  className,
  pronouns,
}: {
  name: string;
  ancestry: string;
  className: string;
  pronouns: string;
}) {
  const heroName = name || "the hero";
  const origin = ancestry || "mysterious";
  const objectPronoun = getPronounObject(pronouns);
  const heroTitle = `${heroName} the ${origin} ${className}`;

  switch (className) {
    case "Wizard":
      return `Ah yes, ${heroTitle}. Even the oldest spellbooks lean closer to learn from ${objectPronoun}.`;
    case "Warrior":
      return `Ah yes, ${heroTitle}. No challenge stands tall for long when ${objectPronoun} steps forward.`;
    case "Explorer":
      return `Ah yes, ${heroTitle}. Lost paths and secret doors are already waiting for ${objectPronoun}.`;
    case "Rogue":
      return `Ah yes, ${heroTitle}. Locks click, shadows shift, and mysteries make room for ${objectPronoun}.`;
    case "Inventor":
      return `Ah yes, ${heroTitle}. Gears spin brighter whenever a clever plan sparks for ${objectPronoun}.`;
    case "Healer":
      return `Ah yes, ${heroTitle}. Gentle magic gathers around ${objectPronoun}, ready to mend and protect.`;
    case "Beast Tamer":
      return `Ah yes, ${heroTitle}. Even the wildest companions seem ready to trust ${objectPronoun}.`;
    case "Elementalist":
      return `Ah yes, ${heroTitle}. Wind, water, flame, and stone stir as if greeting ${objectPronoun}.`;
    default:
      return `Ah yes, ${heroTitle}. The Chronicle knows a remarkable path awaits ${objectPronoun}.`;
  }
}

export function SetupScreen({
  onStart,
  onPrepareStart,
  onCancel,
}: SetupScreenProps) {
  const [step, setStep] = useState<SetupStep>("intro");
  const [mode, setMode] = useState<"question" | "confirmation">("question");
  const [confirmationText, setConfirmationText] = useState("");
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [ancestry, setAncestry] = useState("");
  const [className, setClassName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTurns, setMaxTurns] = useState(DEFAULT_QUEST_LENGTH.maxTurns);
  const [seed, setSeed] = useState("");
  const [colorSchemeId, setColorSchemeId] = useState<ColorSchemeId>(
    DEFAULT_COLOR_SCHEME_ID,
  );
  const [isWriting, setIsWriting] = useState(false);

  const currentIndex = STEP_ORDER.indexOf(step);
  const stepNumber = getStepNumber(step);

  const goToStep = (target: SetupStep) => {
    setMode("question");
    setConfirmationText("");
    setStep(target);
    if (target === "colors") {
      applyColorScheme(colorSchemeId);
    }
  };

  const goNext = () => {
    const next = STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)];
    goToStep(next);
  };

  const goBack = () => {
    setMode("question");
    setConfirmationText("");
    if (step === "intro") {
      applyColorScheme(DEFAULT_COLOR_SCHEME_ID);
      onCancel();
      return;
    }
    const previous = STEP_ORDER[Math.max(currentIndex - 1, 0)];
    goToStep(previous);
  };

  const handleSchemePreview = (schemeId: ColorSchemeId) => {
    applyColorScheme(schemeId);
  };

  const handleSchemePreviewEnd = () => {
    applyColorScheme(colorSchemeId);
  };

  const handleSchemeSelect = (schemeId: ColorSchemeId) => {
    setColorSchemeId(schemeId);
    applyColorScheme(schemeId);
  };

  const getConfirmationText = () => {
    switch (step) {
      case "name":
        return `So it shall be written: ${name}.`;
      case "pronouns":
        return "The quill nods and writes carefully.";
      case "ancestry":
        return `The page glows as ${name || "the hero"}'s origin takes shape.`;
      case "class":
        return getClassConfirmationText({
          name,
          ancestry,
          className,
          pronouns,
        });
      case "difficulty":
        return "The challenge is set.";
      case "length": {
        const questLength =
          QUEST_LENGTH_OPTIONS.find((option) => option.maxTurns === maxTurns) ??
          DEFAULT_QUEST_LENGTH;
        return `${questLength.label} it is. The Chronicle prepares ${questLength.maxTurns} math challenges.`;
      }
      case "seed":
        return seed === "Random"
          ? "The Chronicle chooses a surprising path."
          : `The Chronicle opens to ${seed}.`;
      case "colors":
        return "The ink shimmers, and the Chronicle takes on its colors.";
      default:
        return "";
    }
  };

  const showConfirmation = () => {
    const text = getConfirmationText();
    if (!text) {
      goNext();
      return;
    }

    setConfirmationText(text);
    setMode("confirmation");
  };

  const continueAfterConfirmation = () => {
    if (step === "seed") {
      onPrepareStart(
        { name, pronouns, ancestry, className },
        difficulty,
        seed,
        maxTurns,
      );
    }

    if (step === "colors") {
      handleBeginStory();
      return;
    }

    const next = STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)];
    setConfirmationText("");
    setMode("question");
    goToStep(next);
  };

  const handleBeginStory = () => {
    setIsWriting(true);
    setTimeout(() => {
      onStart(
        { name, pronouns, ancestry, className },
        difficulty,
        seed,
        maxTurns,
        colorSchemeId,
      );
    }, WRITING_TRANSITION_MS);
  };

  const canContinue =
    step === "intro" ||
    (step === "name" && Boolean(name)) ||
    (step === "pronouns" && Boolean(pronouns)) ||
    (step === "ancestry" && Boolean(ancestry)) ||
    (step === "class" && Boolean(className)) ||
    (step === "difficulty" && Boolean(difficulty)) ||
    (step === "length" && Boolean(maxTurns)) ||
    (step === "seed" && Boolean(seed)) ||
    (step === "colors" && Boolean(colorSchemeId));

  if (isWriting) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
        <div className="rs-panel max-w-2xl p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 border-4 border-[var(--mq-border)] border-t-[var(--mq-heading)] border-b-[var(--mq-secondary)] animate-spin"></div>
          <h2 className="rs-title text-4xl md:text-5xl">The Chronicle Opens</h2>
          <div className="story-text space-y-2 text-xl">
            <p>The Chronicler dips the quill in starlight...</p>
            <p>A new chapter begins...</p>
            <p>Writing your quest...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <header className="text-center space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--mq-secondary)]">
            The Chronicler
          </p>
          <h2 className="rs-title text-4xl md:text-6xl font-bold">
            Open the Chronicle
          </h2>
          <div className="rs-hr max-w-lg mx-auto"></div>
          {stepNumber && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--mq-text-muted)]">
                Step {stepNumber} of {DECISION_STEPS.length}
              </p>
              <div
                className="flex gap-2"
                aria-label={`Step ${stepNumber} of ${DECISION_STEPS.length}`}
              >
                {DECISION_STEPS.map((decisionStep, index) => (
                  <span
                    key={decisionStep}
                    className={[
                      "h-3 w-3 rounded-full border transition-all",
                      index + 1 <= stepNumber
                        ? "border-[var(--mq-heading)] bg-[var(--mq-heading)] shadow-[0_0_12px_var(--mq-heading)]"
                        : "border-[var(--mq-border)] bg-[var(--mq-surface-strong)]",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="rs-panel setup-stage flex-1 p-5 md:p-8">
          {mode === "confirmation" && (
            <ConfirmationView text={confirmationText} />
          )}

          {mode === "question" && step === "intro" && (
            <section className="mx-auto max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="text-6xl" aria-hidden="true">
                ✦
              </div>
              <h3 className="rs-title text-3xl md:text-5xl">
                A candle flickers to life.
              </h3>
              <p className="story-text text-xl md:text-2xl">
                An ancient book opens on its own, and a glowing quill hovers
                above the first blank page.
              </p>
              <img
                src="/images/chronicler-book-quill.png"
                alt="An open magical book with a candle and glowing quill."
                className="mx-auto aspect-square w-full max-w-[420px] rounded-2xl border-2 border-[var(--mq-border-strong)] object-cover shadow-[0_0_34px_color-mix(in_srgb,var(--mq-primary)_40%,transparent),0_18px_40px_rgba(0,0,0,0.45)]"
              />
            </section>
          )}

          {mode === "question" && step === "name" && (
            <Question title="First, brave traveler, what name shall be written in the Chronicle?">
              <ChoiceGrid>
                {NAMES.map((option) => (
                  <button
                    key={option}
                    className={optionClass(name === option)}
                    onClick={() => setName(option)}
                    data-testid={`button-name-${option}`}
                  >
                    <SelectionMark selected={name === option} />
                    <span className="text-2xl font-serif text-[var(--mq-heading)]">
                      {option}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "pronouns" && (
            <Question
              title={`And how shall the Chronicle speak of ${name || "the hero"}?`}
            >
              <ChoiceGrid columns="three">
                {PRONOUNS.map((option) => (
                  <button
                    key={option}
                    className={optionClass(pronouns === option)}
                    onClick={() => setPronouns(option)}
                    data-testid={`button-pronouns-${option}`}
                  >
                    <SelectionMark selected={pronouns === option} />
                    <span className="text-2xl font-serif text-[var(--mq-heading)]">
                      {option}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "ancestry" && (
            <Question
              title={`Every hero carries a spark of origin. What is ${name || "your hero"}'s ancestry?`}
            >
              <ChoiceGrid>
                {ANCESTRIES.map((option) => (
                  <button
                    key={option}
                    className={optionClass(ancestry === option)}
                    onClick={() => setAncestry(option)}
                    data-testid={`button-ancestry-${option}`}
                  >
                    <SelectionMark selected={ancestry === option} />
                    <span className="text-xl font-serif text-[var(--mq-heading)]">
                      {option}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "class" && (
            <Question title={`What path does ${name || "the hero"} walk?`}>
              <ChoiceGrid>
                {CLASSES.map((option) => (
                  <button
                    key={option}
                    className={optionClass(className === option)}
                    onClick={() => setClassName(option)}
                    data-testid={`button-class-${option}`}
                  >
                    <SelectionMark selected={className === option} />
                    <span className="text-xl font-serif text-[var(--mq-heading)]">
                      {option}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "difficulty" && (
            <Question title="How great a challenge shall this quest hold?">
              <ChoiceGrid columns="two">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={optionClass(difficulty === option.value)}
                    onClick={() => setDifficulty(option.value)}
                    data-testid={`button-difficulty-${option.key}`}
                  >
                    <SelectionMark selected={difficulty === option.value} />
                    <span className="text-2xl font-serif text-[var(--mq-heading)]">
                      {option.label}
                    </span>
                    <span className="mt-2 text-base text-[var(--mq-text)]">
                      {option.description}
                    </span>
                    <span className="mt-1 text-sm text-[var(--mq-text-muted)]">
                      {option.studentSummary}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "length" && (
            <Question title="How long shall this quest be?">
              <ChoiceGrid columns="three">
                {QUEST_LENGTH_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={optionClass(maxTurns === option.maxTurns)}
                    onClick={() => setMaxTurns(option.maxTurns)}
                    data-testid={`button-quest-length-${option.id}`}
                  >
                    <SelectionMark selected={maxTurns === option.maxTurns} />
                    <span className="text-2xl font-serif text-[var(--mq-heading)]">
                      {option.label}
                    </span>
                    <span className="mt-2 text-base text-[var(--mq-text)]">
                      {option.description}
                    </span>
                    <span className="mt-1 text-sm text-[var(--mq-text-muted)]">
                      {option.maxTurns} successful math challenges
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "seed" && (
            <Question title="Where shall the Chronicle open?">
              <ChoiceGrid>
                {SEEDS.map((option) => (
                  <button
                    key={option}
                    className={optionClass(seed === option)}
                    onClick={() => setSeed(option)}
                    data-testid={`button-seed-${option.replace(/\W+/g, "-").toLowerCase()}`}
                  >
                    <SelectionMark selected={seed === option} />
                    <span className="text-lg font-serif text-[var(--mq-heading)]">
                      {option}
                    </span>
                  </button>
                ))}
              </ChoiceGrid>
            </Question>
          )}

          {mode === "question" && step === "colors" && (
            <Question title="What colors shall illuminate your Chronicle?">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {COLOR_SCHEMES.map((scheme) => {
                  const selected = colorSchemeId === scheme.id;
                  return (
                    <button
                      key={scheme.id}
                      className={optionClass(selected)}
                      onClick={() => handleSchemeSelect(scheme.id)}
                      onFocus={() => handleSchemePreview(scheme.id)}
                      onBlur={handleSchemePreviewEnd}
                      onMouseEnter={() => handleSchemePreview(scheme.id)}
                      onMouseLeave={handleSchemePreviewEnd}
                      data-testid={`button-color-scheme-${scheme.id}`}
                    >
                      <SelectionMark selected={selected} />
                      <span className="text-2xl font-serif text-[var(--mq-heading)]">
                        {scheme.name}
                      </span>
                      <span className="mt-2 text-base text-[var(--mq-text)]">
                        {scheme.description}
                      </span>
                      <span className="mt-4 flex gap-2" aria-hidden="true">
                        {[
                          scheme.colors.background,
                          scheme.colors.surface,
                          scheme.colors.heading,
                          scheme.colors.primary,
                          scheme.colors.secondary,
                        ].map((color) => (
                          <span
                            key={color}
                            className="h-7 w-7 rounded-full border border-white/40"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </span>
                      <span
                        className="mt-4 flex items-center gap-3 rounded-sm border p-3"
                        style={{
                          borderColor: scheme.colors.border,
                          backgroundColor: scheme.colors.backgroundAlt,
                        }}
                      >
                        <span
                          className="h-9 flex-1 rounded-sm border"
                          style={{
                            borderColor: scheme.colors.border,
                            backgroundColor: scheme.colors.surface,
                          }}
                        />
                        <span
                          className="rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: scheme.colors.button,
                            color: scheme.colors.text,
                            border: `1px solid ${scheme.colors.borderStrong}`,
                          }}
                        >
                          Quest
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Question>
          )}
        </main>

        <footer className="setup-footer flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {mode === "confirmation" ? (
            <>
              <span aria-hidden="true" />
              <button
                className="mq-focus rs-button px-8 py-4 text-xl"
                onClick={continueAfterConfirmation}
                data-testid="button-confirmation-continue"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <button
                className="mq-focus rs-button px-8 py-4 text-lg !bg-[var(--mq-background)]"
                onClick={goBack}
                data-testid="button-setup-back"
              >
                {step === "intro" ? "Return to Title" : "Back"}
              </button>

              <button
                className="mq-focus rs-button px-8 py-4 text-xl disabled:cursor-not-allowed disabled:opacity-50"
                onClick={step === "intro" ? goNext : showConfirmation}
                disabled={!canContinue}
                data-testid="button-setup-next"
              >
                {step === "intro" ? "Step Closer" : "Continue"}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

function Question({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="setup-question-view space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--mq-secondary)]">
          The glowing quill asks
        </p>
        <h3 className="rs-title text-3xl md:text-5xl">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ConfirmationView({ text }: { text: string }) {
  return (
    <section className="setup-confirmation-view mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--mq-border-strong)] bg-[var(--mq-background)] text-[var(--mq-heading)] shadow-[0_0_28px_color-mix(in_srgb,var(--mq-primary)_45%,transparent)]">
        <Sparkles className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--mq-secondary)]">
        The Chronicle records
      </p>
      <h3 className="rs-title text-3xl md:text-5xl">{text}</h3>
    </section>
  );
}

function ChoiceGrid({
  children,
  columns = "auto",
}: {
  children: ReactNode;
  columns?: "auto" | "two" | "three";
}) {
  const columnClass =
    columns === "three"
      ? "md:grid-cols-3"
      : columns === "two"
        ? "md:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${columnClass}`}>{children}</div>
  );
}
