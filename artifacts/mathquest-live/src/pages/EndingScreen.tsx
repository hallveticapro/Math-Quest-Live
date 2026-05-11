import { useEffect } from "react";
import type { ReactNode } from "react";
import { GameState } from "../types";
import { playFanfare } from "../lib/sounds";
import { SceneImage } from "../components/SceneImage";
import { getQuestLengthByTurns } from "../questLengths";
import { getDifficultyBand } from "../math/floridaBestMath";

interface EndingScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewHero: () => void;
  topControls?: ReactNode;
}

function buildQuestMoments(state: GameState) {
  const moments = [
    `${state.hero.name} completed a ${getQuestLengthByTurns(state.maxTurns).label} in ${state.adventureSeed}.`,
    `The Chronicle awarded ${state.badge} for solving ${state.mathSolved} math challenge${state.mathSolved === 1 ? "" : "s"}.`,
  ];

  if (state.practicedSkills.length > 0) {
    moments.push(
      `Key skills practiced: ${state.practicedSkills.slice(0, 3).join(", ")}.`,
    );
  }

  const storyScenes = state.storyHistory
    .split(/\n{2,}/)
    .filter((entry) => entry.startsWith("Scene:"));
  const finalScene = storyScenes[storyScenes.length - 1];
  if (finalScene) {
    const title = finalScene.split("\n")[0]?.replace(/^Scene:\s*/, "").trim();
    if (title) moments.push(`Final chapter before the ending: ${title}.`);
  }

  return moments.slice(0, 4);
}

export function EndingScreen({ state, onPlayAgain, onNewHero, topControls }: EndingScreenProps) {
  const {
    endingTitle,
    endingText,
    badge,
    mathSolved,
    hero,
    illustration,
    difficulty,
    maxTurns,
    practicedSkills,
  } = state;
  const questLength = getQuestLengthByTurns(maxTurns);
  const challenge = getDifficultyBand(difficulty);
  const questMoments = buildQuestMoments(state);

  useEffect(() => {
    const timer = setTimeout(() => {
      playFanfare();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-[var(--mq-background)] p-4 md:p-8 animate-in fade-in duration-1000">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      {topControls && (
        <div className="mb-4 flex w-full items-center justify-end gap-3 px-1 pt-[env(safe-area-inset-top)]">
          {topControls}
        </div>
      )}
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full space-y-10 text-center">

        <div className="space-y-6">
          <div className="inline-flex flex-col items-center p-8 bg-[var(--mq-surface)] border-4 border-[var(--mq-border-strong)] shadow-[0_0_50px_color-mix(in_srgb,var(--mq-primary)_35%,transparent)] mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--mq-heading)] opacity-10 mix-blend-overlay"></div>
            <span className="text-[var(--mq-heading)] font-sans uppercase tracking-widest text-sm mb-4 font-bold">Chronicle Reward Earned</span>
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

          <div className="rounded-sm border border-[var(--mq-secondary)] bg-[var(--mq-background)]/60 p-5">
            <h2 className="text-center text-sm font-bold uppercase tracking-[0.25em] text-[var(--mq-secondary)]">
              Quest Moments
            </h2>
            <ul className="mt-4 space-y-3 text-left story-text text-base md:text-lg">
              {questMoments.map((moment) => (
                <li
                  key={moment}
                  className="border-l-2 border-[var(--mq-heading)] pl-4"
                >
                  {moment}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-[var(--mq-border)] bg-[var(--mq-background)]/60 p-5 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--mq-primary-hover)]">
              Quest Summary
            </h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <div className="font-bold uppercase tracking-wider text-[var(--mq-heading)]">Challenge</div>
                <div className="text-[var(--mq-text)]">{challenge.displayName}</div>
              </div>
              <div>
                <div className="font-bold uppercase tracking-wider text-[var(--mq-heading)]">Length</div>
                <div className="text-[var(--mq-text)]">{questLength.label}</div>
              </div>
              <div>
                <div className="font-bold uppercase tracking-wider text-[var(--mq-heading)]">Math</div>
                <div className="text-[var(--mq-text)]">{mathSolved} / {maxTurns}</div>
              </div>
            </div>
            {practicedSkills.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--mq-text-muted)]">
                  Skills Practiced
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {practicedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-sm border border-[var(--mq-border)] bg-[var(--mq-surface-strong)] px-3 py-1 text-sm text-[var(--mq-text)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
}
