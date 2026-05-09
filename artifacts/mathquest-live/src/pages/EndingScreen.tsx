import { useEffect } from "react";
import { GameState } from "../types";
import { playFanfare } from "../lib/sounds";
import { SceneImage } from "../components/SceneImage";

interface EndingScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewHero: () => void;
}

export function EndingScreen({ state, onPlayAgain, onNewHero }: EndingScreenProps) {
  const { endingTitle, endingText, badge, mathSolved, hero, illustration } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      playFanfare();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-1000 bg-[var(--mq-background)]">
      <div className="max-w-3xl w-full space-y-10 text-center">

        <div className="space-y-6">
          <div className="inline-flex flex-col items-center p-8 bg-[var(--mq-surface)] border-4 border-[var(--mq-border-strong)] shadow-[0_0_50px_color-mix(in_srgb,var(--mq-primary)_35%,transparent)] mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--mq-heading)] opacity-10 mix-blend-overlay"></div>
            <span className="text-[var(--mq-heading)] font-sans uppercase tracking-widest text-sm mb-4 font-bold">Quest Complete</span>
            <div className="rs-title text-4xl md:text-5xl font-black">{badge}</div>
          </div>

          <h1 className="rs-title text-5xl md:text-7xl font-bold pt-4">
            {endingTitle}
          </h1>
          <p className="text-[var(--mq-text-muted)] story-text text-lg">
            A heroic tale concluded for {hero.name}.
          </p>
        </div>

        <div className="rs-panel p-8 md:p-10 text-left space-y-8">
          <SceneImage image={illustration} />

          <p className="story-text text-xl md:text-2xl leading-loose">
            {endingText}
          </p>

          <div className="border-t-2 border-b-2 border-[var(--mq-secondary)] py-6 flex flex-col md:flex-row items-center justify-between bg-[var(--mq-background)]/50 px-6">
            <span className="text-xl font-bold text-[var(--mq-secondary)] uppercase tracking-widest mb-2 md:mb-0">Challenges Overcome</span>
            <span className="text-5xl font-black font-sans text-[var(--mq-secondary)] drop-shadow-[0_0_10px_var(--mq-secondary)]">{mathSolved}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button
            className="mq-focus rs-button w-full sm:w-auto text-xl px-12 py-6"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            Quest Again
          </button>
          <button
            className="mq-focus rs-button w-full sm:w-auto text-xl px-12 py-6 !bg-[var(--mq-background)] !text-[var(--mq-text-muted)] !border-[var(--mq-border)]"
            onClick={onNewHero}
            data-testid="button-new-hero"
          >
            New Hero
          </button>
        </div>

      </div>
    </div>
  );
}
