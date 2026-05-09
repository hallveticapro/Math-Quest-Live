import { useEffect, useRef, useState } from "react";
import { GameState } from "../types";
import { playClick } from "../lib/sounds";
import { SceneImage } from "../components/SceneImage";

interface GameScreenProps {
  state: GameState;
  onChoiceSelect: (choiceId: string, choiceLabel: string) => void;
  onMathAnswer: (answer: string) => void;
  onExitToTitle: () => void;
}

const QUEST_TRANSITION_OUT_MS = 180;
const QUEST_TRANSITION_IN_MS = 320;

export function GameScreen({
  state,
  onChoiceSelect,
  onMathAnswer,
  onExitToTitle,
}: GameScreenProps) {
  const {
    hero,
    difficulty,
    mathSolved,
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
  const transitionTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const runQuestTransition = (advance: () => void) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    transitionTimersRef.current.forEach(clearTimeout);
    transitionTimersRef.current = [
      setTimeout(() => {
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

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="rs-panel p-4 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="border-2 border-[var(--mq-border-strong)] p-1 bg-[var(--mq-background)]">
            <div className="w-12 h-12 bg-[var(--mq-button)] flex items-center justify-center font-serif text-2xl rs-title shadow-inner">
              {hero.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="rs-title text-xl tracking-wide">{hero.name}</h3>
            <p className="text-sm text-[var(--mq-text-muted)] uppercase tracking-wider">
              {hero.ancestry} {hero.className}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-6">
          <div className="text-center md:text-right">
            <div className="text-lg font-bold text-[var(--mq-heading)] uppercase tracking-wider">
              Challenges Overcome:{" "}
              <span className="text-[var(--mq-primary-hover)]">
                {mathSolved}
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--mq-text-muted)]">
              Challenge: {difficulty}
            </div>
          </div>

          {!confirmExit ? (
            <button
              onClick={handleExitClick}
              className="mq-focus text-[var(--mq-text-muted)] hover:text-[var(--mq-heading)] border border-[var(--mq-border)] hover:border-[var(--mq-border-strong)] bg-[var(--mq-background)] px-3 py-2 text-xs uppercase tracking-widest font-sans transition-colors duration-150 rounded-sm whitespace-nowrap"
              data-testid="button-exit-quest"
            >
              ← Exit Quest
            </button>
          ) : (
            <div className="flex items-center gap-2 border border-[var(--mq-danger)] bg-[var(--mq-background)] px-3 py-2 rounded-sm">
              <span className="text-[var(--mq-text)] text-xs uppercase tracking-wider font-sans">
                Exit?
              </span>
              <button
                onClick={handleExitConfirm}
                className="mq-focus text-[var(--mq-danger)] hover:text-[var(--mq-warning)] font-bold text-xs uppercase tracking-wider font-sans px-2 transition-colors"
                data-testid="button-exit-confirm"
              >
                Yes
              </button>
              <span className="text-[var(--mq-border)]">|</span>
              <button
                onClick={handleExitCancel}
                className="mq-focus text-[var(--mq-secondary)] hover:text-[var(--mq-primary-hover)] font-bold text-xs uppercase tracking-wider font-sans px-2 transition-colors"
                data-testid="button-exit-cancel"
              >
                No
              </button>
            </div>
          )}
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
            <p className="story-text text-xl italic animate-pulse">
              The chronicler is writing the next chapter...
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="rs-panel p-6 md:p-8 space-y-6">
              <h2 className="rs-title text-3xl md:text-4xl text-center pb-4 border-b border-[var(--mq-border)]">
                {sceneTitle}
              </h2>
              <SceneImage image={illustration} />
              <p className="story-text whitespace-pre-wrap">{storyText}</p>
            </div>

            {!currentMathProblem ? (
              <div className="flex flex-col gap-4 pt-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    className="rs-button h-auto py-5 px-6 text-left justify-start text-lg w-full flex items-center disabled:pointer-events-none disabled:opacity-70"
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
              <div className="quest-math-accordion rs-panel p-6 md:p-8 space-y-8 !border-[var(--mq-secondary)] shadow-[0_0_30px_color-mix(in_srgb,var(--mq-secondary)_35%,transparent)]">
                <div className="text-center space-y-6">
                  <div className="inline-block bg-[var(--mq-background)] border border-[var(--mq-secondary)] text-[var(--mq-secondary)] font-bold px-6 py-2 uppercase tracking-widest mb-2 shadow-inner">
                    Math Challenge
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold font-sans py-4 text-[var(--mq-text)] tracking-wide">
                    {currentMathProblem.prompt}
                  </h3>

                  {wrongAttempts > 0 && (
                    <div className="text-[var(--mq-danger)] font-bold text-xl uppercase tracking-wider animate-in shake">
                      Incorrect. Try again!
                    </div>
                  )}
                  {showHint && (
                    <div className="border border-[var(--mq-secondary)] bg-[var(--mq-background)] p-4 text-[var(--mq-text)] font-serif text-lg text-center max-w-lg mx-auto">
                      <span className="text-[var(--mq-secondary)] font-bold mr-2 uppercase">
                        Hint:
                      </span>
                      Take your time. We've simplified the problem to help you
                      move forward.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMathProblem.choices.map((ans, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    return (
                      <button
                        key={idx}
                        className="rs-button !border-[var(--mq-secondary)] hover:!border-[var(--mq-primary-hover)] hover:!text-[var(--mq-text)] h-24 text-2xl md:text-3xl w-full flex items-center justify-center disabled:pointer-events-none disabled:opacity-70"
                        onClick={() => handleMathClick(ans)}
                        disabled={isTransitioning}
                        data-testid={`button-math-answer-${idx}`}
                      >
                        <span className="text-[var(--mq-secondary)] font-bold mr-6 text-xl">
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
