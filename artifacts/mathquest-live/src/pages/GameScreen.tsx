import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, Square, Volume2 } from "lucide-react";
import { GameState } from "../types";
import { playClick } from "../lib/sounds";
import { SceneImage } from "../components/SceneImage";
import {
  MathAnswerChoice,
  MathInlineText,
  MathRichDisplay,
} from "../components/MathRichDisplay";
import { getQuestLengthByTurns } from "../questLengths";
import { resetScrollForTransition } from "../lib/scroll";
import { getDifficultyBand } from "../math/floridaBestMath";
import type { ReactNode } from "react";

interface GameScreenProps {
  state: GameState;
  onChoiceSelect: (choiceId: string, choiceLabel: string) => void;
  onMathAnswer: (answer: string) => void;
  onExitToTitle: () => void;
  topControls?: ReactNode;
}

const QUEST_TRANSITION_OUT_MS = 180;
const QUEST_TRANSITION_IN_MS = 320;
const LOADING_MESSAGE_INTERVAL_MS = 4500;
const EXIT_CONTROL_CLASS =
  "h-12 min-h-12 box-border w-full items-center justify-center rounded-sm bg-[var(--mq-background)] px-3 font-sans text-xs uppercase tracking-widest sm:w-auto";
const INTRO_LOADING_MESSAGES = [
  "The Chronicler is choosing the perfect opening line...",
  "The Illustrator is sketching the first spark of adventure...",
  "The map is unfolding at the edge of the page...",
  "A bookmark is sliding into place...",
  "The first clue is glowing softly...",
  "The cover lanterns are warming their light...",
  "The quill is testing its brightest ink...",
  "The first chapter is finding its shape...",
  "A safe path is appearing between the lines...",
  "The hero's portrait is gathering storybook color...",
  "The title page is dusting off a little sparkle...",
  "The Chronicle is listening for the first brave step...",
];
const STORY_LOADING_MESSAGES = [
  "Correct! The path opens.",
  "The Chronicler is writing the next page...",
  "Preparing the next story beat and challenge...",
];
const ENDING_LOADING_MESSAGES = [
  "The Chronicler is polishing the final sentence...",
  "The Illustrator is adding a shine to your reward...",
  "The last page is settling into the book...",
  "Your quest badge is getting its final sparkle...",
  "The story is tying its ribbon around the ending...",
  "A final burst of safe magic is lighting the page...",
  "The reward scene is getting its brightest colors...",
  "The Chronicle is saving a place for your victory...",
  "The ending lanterns are glowing one by one...",
  "The final bookmark is sliding into place...",
  "The hero's celebration is taking shape...",
  "The last page is waiting for its perfect picture...",
];

type LoadingKind = "idle" | "intro" | "story" | "ending";

function shuffledMessages(messages: string[], previous?: string) {
  const pool = [...messages];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  if (previous && pool.length > 1 && pool[0] === previous) {
    [pool[0], pool[1]] = [pool[1], pool[0]];
  }

  return pool;
}

export function GameScreen({
  state,
  onChoiceSelect,
  onMathAnswer,
  onExitToTitle,
  topControls,
}: GameScreenProps) {
  const {
    hero,
    difficulty,
    mathSolved,
    maxTurns,
    sceneTitle,
    storyText,
    illustration,
    choices,
    currentMathProblem,
    isLoading,
    wrongAttempts,
    showHint,
  } = state;
  const [confirmExit, setConfirmExit] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingMessageQueue, setLoadingMessageQueue] = useState<string[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isReadingStory, setIsReadingStory] = useState(false);
  const transitionTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const questLength = getQuestLengthByTurns(maxTurns);
  const progressPercent = Math.min(100, Math.round((mathSolved / maxTurns) * 100));
  const challenge = getDifficultyBand(difficulty);
  const isEndingLoading =
    isLoading && mathSolved >= maxTurns && state.turn >= maxTurns;
  const loadingKind: LoadingKind = !isLoading
    ? "idle"
    : isEndingLoading
      ? "ending"
      : mathSolved > 0
        ? "story"
        : "intro";

  const stopStorySpeech = useCallback((updateState = true) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    speechUtteranceRef.current = null;
    if (updateState) {
      setIsReadingStory(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach(clearTimeout);
      stopStorySpeech(false);
    };
  }, [stopStorySpeech]);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window,
    );
  }, []);

  useEffect(() => {
    stopStorySpeech(false);
    setIsReadingStory(false);
  }, [currentMathProblem, isLoading, sceneTitle, storyText, stopStorySpeech]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      setLoadingMessageQueue([]);
      return;
    }

    const messages =
      loadingKind === "ending"
        ? ENDING_LOADING_MESSAGES
        : loadingKind === "story"
          ? STORY_LOADING_MESSAGES
          : INTRO_LOADING_MESSAGES;
    setLoadingMessageQueue(shuffledMessages(messages));
    setLoadingMessageIndex(0);
  }, [isLoading, loadingKind]);

  useEffect(() => {
    if (!isLoading || loadingMessageQueue.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setLoadingMessageIndex((index) => {
        const nextIndex = index + 1;
        if (nextIndex < loadingMessageQueue.length) {
          return nextIndex;
        }

        setLoadingMessageQueue((currentQueue) =>
          shuffledMessages(
            currentQueue.length > 0 ? currentQueue : loadingMessageQueue,
            currentQueue[index] ?? loadingMessageQueue[index],
          ),
        );
        return 0;
      });
    }, LOADING_MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isLoading, loadingMessageQueue]);

  const runQuestTransition = (advance: () => void) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    transitionTimersRef.current.forEach(clearTimeout);
    transitionTimersRef.current = [
      setTimeout(() => {
        resetScrollForTransition();
        advance();
      }, QUEST_TRANSITION_OUT_MS),
      setTimeout(() => {
        setIsTransitioning(false);
      }, QUEST_TRANSITION_OUT_MS + QUEST_TRANSITION_IN_MS),
    ];
  };

  const handleExitClick = () => {
    playClick();
    setConfirmExit(true);
  };

  const handleExitConfirm = () => {
    playClick();
    onExitToTitle();
  };

  const handleExitCancel = () => {
    playClick();
    setConfirmExit(false);
  };

  const handleChoiceClick = (choiceId: string, choiceLabel: string) => {
    onChoiceSelect(choiceId, choiceLabel);
  };

  const handleReadStoryClick = () => {
    playClick();
    if (!speechSupported || !storyText.trim()) return;

    if (isReadingStory) {
      stopStorySpeech();
      return;
    }

    stopStorySpeech(false);
    const utterance = new SpeechSynthesisUtterance(storyText.trim());
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => {
      if (speechUtteranceRef.current === utterance) {
        speechUtteranceRef.current = null;
        setIsReadingStory(false);
      }
    };
    utterance.onerror = utterance.onend;
    speechUtteranceRef.current = utterance;
    setIsReadingStory(true);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      speechUtteranceRef.current = null;
      setIsReadingStory(false);
    }
  };

  const handleMathClick = (answer: string) => {
    if (currentMathProblem && answer === currentMathProblem.correctAnswer) {
      runQuestTransition(() => onMathAnswer(answer));
      return;
    }

    onMathAnswer(answer);
  };

  const contentKey = isLoading
    ? "loading"
    : currentMathProblem
      ? `math-${currentMathProblem.prompt}-${wrongAttempts}-${showHint}`
      : `story-${state.turn}-${sceneTitle}-${storyText}`;
  const activeHint =
    currentMathProblem && (wrongAttempts > 0 || showHint)
      ? showHint
        ? currentMathProblem.secondHint || currentMathProblem.hint
        : currentMathProblem.hint
      : null;
  const fallbackLoadingMessages =
    loadingKind === "ending"
      ? ENDING_LOADING_MESSAGES
      : loadingKind === "story"
        ? STORY_LOADING_MESSAGES
        : INTRO_LOADING_MESSAGES;
  const loadingTitle =
    loadingMessageQueue[loadingMessageIndex] ?? fallbackLoadingMessages[0];
  const loadingDetail =
    isEndingLoading
      ? "The final page and ending illustration may take a few seconds."
      : mathSolved > 0
      ? "The next page will appear as soon as the story is ready."
      : "The opening story and cover illustration are being prepared.";

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="rs-panel p-4 shadow-lg">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 items-center space-x-4">
              <div className="shrink-0 border-2 border-[var(--mq-border-strong)] bg-[var(--mq-background)] p-1">
                <div className="flex h-12 w-12 items-center justify-center bg-[var(--mq-button)] font-serif text-2xl shadow-inner rs-title">
                  {hero.name.charAt(0)}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="rs-title truncate text-xl tracking-wide">
                  {hero.name}
                </h3>
                <p className="text-sm uppercase tracking-wider text-[var(--mq-text-muted)]">
                  {hero.ancestry} {hero.className}
                </p>
              </div>
            </div>

            {topControls && (
              <div className="flex shrink-0 items-center gap-2">
                {topControls}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="w-full min-w-0 max-w-none space-y-2 text-left md:max-w-md">
            <div className="text-lg font-bold text-[var(--mq-heading)] uppercase tracking-wider">
              Math Challenges:{" "}
              <span className="text-[var(--mq-primary-hover)]">
                {mathSolved} / {maxTurns}
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--mq-text-muted)]">
              {questLength.label} · Challenge: {challenge.displayName}
            </div>
            <div
              className="h-3 overflow-hidden rounded-full border border-[var(--mq-border)] bg-[var(--mq-background)]"
              role="progressbar"
              aria-label="Math challenge progress"
              aria-valuemin={0}
              aria-valuemax={maxTurns}
              aria-valuenow={mathSolved}
            >
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--mq-primary),var(--mq-heading))] shadow-[0_0_16px_color-mix(in_srgb,var(--mq-primary)_55%,transparent)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

            {!confirmExit ? (
              <button
                onClick={handleExitClick}
                className={`mq-focus inline-flex ${EXIT_CONTROL_CLASS} border border-[var(--mq-border)] font-bold text-[var(--mq-text-muted)] transition-colors duration-150 hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-heading)]`}
                data-testid="button-exit-quest"
              >
                ← Exit Quest
              </button>
            ) : (
              <div className={`flex ${EXIT_CONTROL_CLASS} gap-2 border border-[var(--mq-danger)]`}>
                <span className="font-sans text-xs uppercase tracking-wider text-[var(--mq-text)]">
                  Exit?
                </span>
                <button
                  onClick={handleExitConfirm}
                  className="mq-focus px-2 font-sans text-xs font-bold uppercase tracking-wider text-[var(--mq-danger)] transition-colors hover:text-[var(--mq-warning)]"
                  data-testid="button-exit-confirm"
                >
                  Yes
                </button>
                <span className="text-[var(--mq-border)]">|</span>
                <button
                  onClick={handleExitCancel}
                  className="mq-focus px-2 font-sans text-xs font-bold uppercase tracking-wider text-[var(--mq-secondary)] transition-colors hover:text-[var(--mq-primary-hover)]"
                  data-testid="button-exit-cancel"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        key={contentKey}
        className={[
          "quest-stage flex-1",
          isTransitioning ? "quest-stage-exit" : "quest-stage-enter",
        ].join(" ")}
      >
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 pt-12">
            <div className="w-16 h-16 border-4 border-[var(--mq-border)] border-t-[var(--mq-heading)] border-b-[var(--mq-secondary)] rounded-sm animate-spin"></div>
            <div className="loading-bar" aria-hidden="true" />
            <div className="max-w-xl space-y-3 text-center" role="status">
              {(mathSolved > 0 || isEndingLoading) && (
                <CheckCircle2
                  className="mx-auto h-10 w-10 text-[var(--mq-success)]"
                  aria-hidden="true"
                />
              )}
              <p className="story-text text-xl italic animate-pulse">
                {loadingTitle}
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--mq-text-muted)]">
                {loadingDetail}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="rs-panel p-6 md:p-8 space-y-6">
              <h2 className="rs-title text-3xl md:text-4xl text-center pb-4 border-b border-[var(--mq-border)]">
                {sceneTitle}
              </h2>
              <SceneImage image={illustration} />
              <p className="story-text story-prose whitespace-pre-wrap">{storyText}</p>
              {speechSupported && !currentMathProblem && storyText.trim() && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    className="mq-focus inline-flex items-center gap-2 rounded-sm border border-[var(--mq-border)] bg-[var(--mq-surface-strong)] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[var(--mq-text)] shadow-[0_0_16px_color-mix(in_srgb,var(--mq-primary)_18%,transparent)] transition hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-heading)]"
                    onClick={handleReadStoryClick}
                    aria-pressed={isReadingStory}
                  >
                    {isReadingStory ? (
                      <Square className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isReadingStory ? "Stop Reading" : "Read Story"}
                  </button>
                </div>
              )}
            </div>

            {!currentMathProblem ? (
              <div className="flex flex-col gap-4 pt-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    className="mq-focus rs-button h-auto py-5 px-6 text-left justify-start text-lg w-full flex items-center disabled:pointer-events-none disabled:opacity-70"
                    onClick={() => handleChoiceClick(choice.id, choice.label)}
                    disabled={isTransitioning}
                    data-testid={`button-choice-${choice.id}`}
                  >
                    <span className="font-bold text-[var(--mq-primary-hover)] text-2xl mr-4 border-r border-[var(--mq-border)] pr-4">
                      {choice.id}
                    </span>
                    <span className="flex-1 whitespace-normal normal-case font-serif tracking-wide">
                      {choice.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="quest-math-accordion rs-panel space-y-5 overflow-hidden p-4 !border-[var(--mq-secondary)] shadow-[0_0_30px_color-mix(in_srgb,var(--mq-secondary)_35%,transparent)] md:space-y-8 md:p-8">
                <div className="text-center space-y-4 md:space-y-6">
                  <div className="inline-block bg-[var(--mq-background)] border border-[var(--mq-secondary)] text-[var(--mq-secondary)] font-bold px-4 py-2 uppercase tracking-widest mb-1 shadow-inner md:px-6 md:mb-2">
                    Math Challenge
                  </div>
                  <h3 className="text-2xl md:text-5xl font-bold font-sans py-2 md:py-4 text-[var(--mq-text)] tracking-wide leading-tight break-words">
                    <MathInlineText text={currentMathProblem.prompt} />
                  </h3>
                  <MathRichDisplay items={currentMathProblem.richDisplay} />

                  {wrongAttempts > 0 && (
                    <div
                      className="inline-flex items-center justify-center gap-2 text-[var(--mq-warning)] font-bold text-lg uppercase tracking-wider animate-in shake md:text-xl"
                      role="status"
                    >
                      <Lightbulb className="h-6 w-6" aria-hidden="true" />
                      Almost. Check the strategy and try again.
                    </div>
                  )}
                  {activeHint && (
                    <div className="mx-auto w-full max-w-lg border border-[var(--mq-secondary)] bg-[var(--mq-background)] p-3 text-center font-serif text-base text-[var(--mq-text)] shadow-[0_0_20px_color-mix(in_srgb,var(--mq-secondary)_25%,transparent)] md:p-4 md:text-lg">
                      <div className="mb-2 inline-flex items-center justify-center gap-2 text-[var(--mq-secondary)] font-bold uppercase">
                        <Lightbulb className="h-5 w-5" aria-hidden="true" />
                        {showHint ? "Support Hint" : "Hint"}
                      </div>
                      <p>
                        <MathInlineText text={activeHint} />
                      </p>
                      {showHint && (
                        <p className="mt-3 text-base text-[var(--mq-text-muted)]">
                          Good effort. This support challenge is here to help
                          you keep the quest moving.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {currentMathProblem.choices.map((ans, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    const isLongAnswer = ans.length > 24;
                    return (
                      <button
                        key={idx}
                        className={[
                          "mq-focus rs-button !border-[var(--mq-secondary)] hover:!border-[var(--mq-primary-hover)] hover:!text-[var(--mq-text)] min-h-20 h-auto w-full flex items-center justify-center whitespace-normal break-words px-4 py-4 disabled:pointer-events-none disabled:opacity-70 md:min-h-24",
                          isLongAnswer ? "text-base md:text-xl" : "text-xl md:text-3xl",
                        ].join(" ")}
                        onClick={() => handleMathClick(ans)}
                        disabled={isTransitioning}
                        data-testid={`button-math-answer-${idx}`}
                      >
                        <span className="text-[var(--mq-secondary)] font-bold mr-4 text-lg md:mr-6 md:text-xl">
                          {letters[idx]}
                        </span>
                        <MathAnswerChoice value={ans} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
