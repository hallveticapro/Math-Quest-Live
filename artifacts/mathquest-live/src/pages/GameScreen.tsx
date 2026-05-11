import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { GameState } from "../types";
import { playClick } from "../lib/sounds";
import { SceneImage } from "../components/SceneImage";
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
const EXIT_CONTROL_HEIGHT_CLASS = "min-h-12";
const INTRO_LOADING_MESSAGES = [
  "The Chronicler is opening the first page of your legend...",
  "The Illustrator is adding the final colors to your first scene...",
  "Some tales need a moment for the ink and images to settle...",
  "The first chapter is finding its shape...",
];
const STORY_LOADING_MESSAGES = [
  "Correct! The path opens.",
  "The Chronicler is writing the next page...",
  "Preparing the next story beat and challenge...",
];
const ENDING_LOADING_MESSAGES = [
  "The Chronicle is writing your ending...",
  "Every great quest needs a final page...",
  "The Illustrator is preparing your victory scene...",
  "Your reward is taking shape in starlight...",
];

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
  const transitionTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const questLength = getQuestLengthByTurns(maxTurns);
  const progressPercent = Math.min(100, Math.round((mathSolved / maxTurns) * 100));
  const challenge = getDifficultyBand(difficulty);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setLoadingMessageIndex((index) => index + 1);
    }, LOADING_MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isLoading]);

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
  const isEndingLoading =
    isLoading && mathSolved >= maxTurns && state.turn >= maxTurns;
  const loadingMessages = isEndingLoading
    ? ENDING_LOADING_MESSAGES
    : mathSolved > 0
      ? STORY_LOADING_MESSAGES
      : INTRO_LOADING_MESSAGES;
  const loadingTitle = loadingMessages[loadingMessageIndex % loadingMessages.length];
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
                className={`mq-focus ${EXIT_CONTROL_HEIGHT_CLASS} w-full rounded-sm border border-[var(--mq-border)] bg-[var(--mq-background)] px-3 py-3 font-sans text-xs font-bold uppercase tracking-widest text-[var(--mq-text-muted)] transition-colors duration-150 hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-heading)] sm:w-auto`}
                data-testid="button-exit-quest"
              >
                ← Exit Quest
              </button>
            ) : (
              <div className={`flex ${EXIT_CONTROL_HEIGHT_CLASS} w-full items-center justify-center gap-2 rounded-sm border border-[var(--mq-danger)] bg-[var(--mq-background)] px-3 py-3 sm:w-auto`}>
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
                    {currentMathProblem.prompt}
                  </h3>

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
                      <p>{activeHint}</p>
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
                    return (
                      <button
                        key={idx}
                        className="mq-focus rs-button !border-[var(--mq-secondary)] hover:!border-[var(--mq-primary-hover)] hover:!text-[var(--mq-text)] h-20 text-xl md:h-24 md:text-3xl w-full flex items-center justify-center disabled:pointer-events-none disabled:opacity-70"
                        onClick={() => handleMathClick(ans)}
                        disabled={isTransitioning}
                        data-testid={`button-math-answer-${idx}`}
                      >
                        <span className="text-[var(--mq-secondary)] font-bold mr-4 text-lg md:mr-6 md:text-xl">
                          {letters[idx]}
                        </span>
                        {ans}
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
