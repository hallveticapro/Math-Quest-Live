import { useState } from "react";
import { DIFFICULTY_OPTIONS } from "../math/floridaBestMath";
import { playClick } from "../lib/sounds";

export function TitleScreen({
  onBegin,
  onQuickStart,
  isQuickStarting = false,
}: {
  onBegin: () => void;
  onQuickStart: (difficulty: string) => void;
  isQuickStarting?: boolean;
}) {
  const [showQuickStartChoices, setShowQuickStartChoices] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-8 w-full max-w-3xl">
        <h1 className="rs-title text-6xl md:text-8xl font-black tracking-tight drop-shadow-[0_0_20px_var(--mq-primary)]">
          MathQuest Live
        </h1>
        
        <div className="rs-hr my-4"></div>
        
        <p className="text-2xl md:text-3xl text-[var(--mq-text)] font-serif italic max-w-2xl mx-auto" style={{ fontFamily: "var(--app-font-story)" }}>
          A new math adventure every time.
        </p>
        
        <div className="rs-hr my-4"></div>
      </div>
      
      <div className="flex w-full max-w-md flex-col gap-4">
        <button
          className="mq-focus rs-button text-2xl px-16 py-6 tracking-wider w-full"
          onClick={() => {
            playClick();
            onBegin();
          }}
          data-testid="button-begin-quest"
        >
          Begin Quest
        </button>

        <button
          className="mq-focus rs-button w-full px-8 py-4 text-lg tracking-wider !bg-[var(--mq-background)]"
          onClick={() => {
            playClick();
            setShowQuickStartChoices((showing) => !showing);
          }}
          disabled={isQuickStarting}
          aria-label="Quick Start Adventure with random safe choices"
          data-testid="button-quick-start"
        >
          {isQuickStarting ? "Preparing Your Quest..." : "Quick Start Adventure"}
        </button>

        {showQuickStartChoices && (
          <div
            className="grid grid-cols-2 gap-3 rounded-sm border border-[var(--mq-border)] bg-[var(--mq-surface)] p-3 shadow-[0_0_24px_color-mix(in_srgb,var(--mq-primary)_25%,transparent)] animate-in fade-in zoom-in-95 duration-150"
            aria-label="Choose a Quick Start challenge level"
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.key}
                className="mq-focus rounded-sm border-2 border-[var(--mq-border)] bg-[var(--mq-surface-strong)] px-3 py-3 text-left transition-colors hover:border-[var(--mq-border-strong)] hover:bg-[var(--mq-button-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  playClick();
                  onQuickStart(option.value);
                }}
                disabled={isQuickStarting}
                data-testid={`button-quick-start-${option.key}`}
              >
                <span className="block font-serif text-lg text-[var(--mq-heading)]">
                  {option.label}
                </span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-[var(--mq-text-muted)]">
                  {option.displayName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[var(--mq-text-muted)] font-serif italic mt-12 max-w-md" style={{ fontFamily: "var(--app-font-story)" }}>
        Adventures await brave souls who dare to solve the mysteries within...
      </p>
    </div>
  );
}
