import { Check, Music, Settings, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  COLOR_SCHEMES,
  getColorScheme,
  type ColorSchemeId,
} from "../colorSchemes";
import { DIFFICULTY_OPTIONS } from "../math/floridaBestMath";
import { playClick } from "../lib/sounds";
import { MUSIC_LIBRARY } from "../lib/musicLibrary";

type QuestSettingsDialogProps = {
  colorSchemeId: ColorSchemeId;
  difficulty: string;
  isMathActive: boolean;
  onColorSchemeChange: (schemeId: ColorSchemeId) => void;
  onDifficultyChange: (difficulty: string) => void;
  backgroundMusicEnabled: boolean;
  backgroundMusicVolume: number;
  soundEffectsEnabled: boolean;
  onBackgroundMusicEnabledChange: (enabled: boolean) => void;
  onBackgroundMusicVolumeChange: (volume: number) => void;
  onSoundEffectsEnabledChange: (enabled: boolean) => void;
  showChallengeSettings?: boolean;
  variant?: "floating" | "inline";
};

const triggerBaseClass =
  "mq-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mq-border)] bg-[var(--mq-background)]/90 text-[var(--mq-text)] shadow-lg transition-colors hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-primary-hover)]";

export function QuestSettingsDialog({
  colorSchemeId,
  difficulty,
  isMathActive,
  onColorSchemeChange,
  onDifficultyChange,
  backgroundMusicEnabled,
  backgroundMusicVolume,
  soundEffectsEnabled,
  onBackgroundMusicEnabledChange,
  onBackgroundMusicVolumeChange,
  onSoundEffectsEnabledChange,
  showChallengeSettings = true,
  variant = "floating",
}: QuestSettingsDialogProps) {
  const activeScheme = getColorScheme(colorSchemeId);
  const hasMusicTracks = MUSIC_LIBRARY.length > 0;
  const triggerClass =
    variant === "floating"
      ? `${triggerBaseClass} fixed right-[calc(max(1rem,env(safe-area-inset-right))+3.75rem)] top-[max(1rem,env(safe-area-inset-top))] z-40`
      : triggerBaseClass;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open settings"
          className={triggerClass}
          data-testid="button-quest-settings"
        >
          <Settings className="h-6 w-6" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] max-w-3xl overflow-y-auto border-2 border-[var(--mq-border)] bg-[var(--mq-surface)] text-[var(--mq-text)] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <DialogHeader>
          <DialogTitle className="rs-title text-3xl">
            Quest Settings
          </DialogTitle>
          <DialogDescription className="text-[var(--mq-text-muted)]">
            Session-only choices for this adventure. Nothing is saved after
            refresh.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 font-sans">
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">
                Audio
              </h3>
              <p className="text-sm text-[var(--mq-text-muted)]">
                Session-only audio choices. Music library:{" "}
                {MUSIC_LIBRARY.length} track
                {MUSIC_LIBRARY.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AudioToggle
                enabled={backgroundMusicEnabled && hasMusicTracks}
                icon={backgroundMusicEnabled ? Music : VolumeX}
                label="Background Music"
                detail={
                  hasMusicTracks
                    ? "Rotates through local quest music."
                    : "No music tracks found."
                }
                onToggle={() => {
                  playClick();
                  onBackgroundMusicEnabledChange(!backgroundMusicEnabled);
                }}
                disabled={MUSIC_LIBRARY.length === 0}
              />
              <AudioToggle
                enabled={soundEffectsEnabled}
                icon={soundEffectsEnabled ? Volume2 : VolumeX}
                label="Navigation Sound Effects"
                detail="Controls clicks, transitions, answer chimes, and fanfare."
                onToggle={() => {
                  playClick();
                  onSoundEffectsEnabledChange(!soundEffectsEnabled);
                }}
              />
            </div>

            <label className="block rounded-sm border border-[var(--mq-border)] bg-[var(--mq-surface-strong)] p-4">
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-bold uppercase tracking-widest text-[var(--mq-primary-hover)]">
                    Background Music Volume
                  </span>
                  <span className="text-sm text-[var(--mq-text-muted)]">
                    {Math.round(backgroundMusicVolume * 100)}%
                  </span>
                </span>
              </span>
              <input
                className="mq-focus mt-3 w-full accent-[var(--mq-primary)]"
                type="range"
                min="0"
                max="100"
                step="5"
                value={Math.round(backgroundMusicVolume * 100)}
                onChange={(event) => {
                  onBackgroundMusicVolumeChange(Number(event.target.value) / 100);
                }}
                disabled={!hasMusicTracks}
                aria-label="Background music volume"
              />
            </label>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">
                Color Scheme
              </h3>
              <p className="text-sm text-[var(--mq-text-muted)]">
                Current colors: {activeScheme.name}. Changes apply instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COLOR_SCHEMES.map((scheme) => {
                const selected = scheme.id === colorSchemeId;
                return (
                  <button
                    key={scheme.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      onColorSchemeChange(scheme.id);
                    }}
                    aria-pressed={selected}
                    className={[
                      "mq-focus relative rounded-sm border-2 p-4 text-left transition-all",
                      "bg-[var(--mq-surface-strong)] hover:border-[var(--mq-border-strong)] hover:bg-[var(--mq-button-hover)]",
                      selected
                        ? "border-[var(--mq-border-strong)] shadow-[0_0_20px_color-mix(in_srgb,var(--mq-primary)_40%,transparent)]"
                        : "border-[var(--mq-border)]",
                    ].join(" ")}
                    data-testid={`button-settings-color-${scheme.id}`}
                  >
                    {selected && <SelectedBadge />}
                    <div className="pr-24">
                      <div className="font-serif text-xl text-[var(--mq-heading)]">
                        {scheme.name}
                      </div>
                      <p className="mt-1 text-sm text-[var(--mq-text-muted)]">
                        {scheme.description}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2" aria-hidden="true">
                      {[
                        scheme.colors.background,
                        scheme.colors.surface,
                        scheme.colors.heading,
                        scheme.colors.primary,
                        scheme.colors.secondary,
                      ].map((color) => (
                        <span
                          key={color}
                          className="h-6 w-6 rounded-full border border-white/40"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {showChallengeSettings && (
            <section className="space-y-3">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">
                  Challenge Level
                </h3>
                <p className="text-sm text-[var(--mq-text-muted)]">
                  Changes affect future math challenges only.
                </p>
                {isMathActive && (
                  <p className="mt-2 border border-[var(--mq-warning)] bg-[var(--mq-background)] p-3 text-sm text-[var(--mq-text)]">
                    Challenge changes apply after this question.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DIFFICULTY_OPTIONS.map((option) => {
                  const selected = option.value === difficulty;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        playClick();
                        onDifficultyChange(option.value);
                      }}
                      aria-pressed={selected}
                      className={[
                        "mq-focus relative rounded-sm border-2 p-4 text-left transition-all",
                        "bg-[var(--mq-surface-strong)] hover:border-[var(--mq-border-strong)] hover:bg-[var(--mq-button-hover)]",
                        selected
                          ? "border-[var(--mq-border-strong)] shadow-[0_0_20px_color-mix(in_srgb,var(--mq-primary)_40%,transparent)]"
                          : "border-[var(--mq-border)]",
                      ].join(" ")}
                      data-testid={`button-settings-difficulty-${option.key}`}
                    >
                      {selected && <SelectedBadge />}
                      <div className="pr-24">
                        <div className="font-serif text-xl text-[var(--mq-heading)]">
                          {option.label} / {option.displayName}
                        </div>
                        <p className="mt-1 text-sm text-[var(--mq-text-muted)]">
                          {option.description}
                        </p>
                        <p className="mt-2 text-sm text-[var(--mq-text)]">
                          {option.studentSummary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AudioToggle({
  enabled,
  icon: Icon,
  label,
  detail,
  onToggle,
  disabled = false,
}: {
  enabled: boolean;
  icon: typeof Music;
  label: string;
  detail: string;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={enabled}
      className={[
        "mq-focus flex items-start gap-3 rounded-sm border-2 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-55",
        "bg-[var(--mq-surface-strong)] hover:border-[var(--mq-border-strong)] hover:bg-[var(--mq-button-hover)]",
        enabled
          ? "border-[var(--mq-border-strong)] shadow-[0_0_20px_color-mix(in_srgb,var(--mq-primary)_35%,transparent)]"
          : "border-[var(--mq-border)]",
      ].join(" ")}
    >
      <Icon
        className="mt-1 h-5 w-5 shrink-0 text-[var(--mq-heading)]"
        aria-hidden="true"
      />
      <span>
        <span className="block font-bold uppercase tracking-wide text-[var(--mq-text)]">
          {label}
        </span>
        <span className="mt-1 block text-sm text-[var(--mq-text-muted)]">
          {detail}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--mq-heading)]">
          {enabled ? "On" : "Off"}
        </span>
      </span>
    </button>
  );
}

function SelectedBadge() {
  return (
    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm border border-[var(--mq-border-strong)] bg-[var(--mq-background)] px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--mq-heading)]">
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      Selected
    </span>
  );
}
