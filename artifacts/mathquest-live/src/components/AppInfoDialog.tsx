import type { ComponentType } from "react";
import { AtSign, ExternalLink, Github, Heart, Info, Instagram, Music2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DIFFICULTY_OPTIONS } from "../math/floridaBestMath";

type AppInfoDialogProps = {
  variant?: "floating" | "inline";
};

const triggerBaseClass =
  "mq-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mq-border)] bg-[var(--mq-background)]/90 text-[var(--mq-text)] shadow-lg transition-colors hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-primary-hover)]";

export function AppInfoDialog({ variant = "floating" }: AppInfoDialogProps) {
  const triggerClass =
    variant === "floating"
      ? `${triggerBaseClass} fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-40`
      : triggerBaseClass;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open information"
          className={triggerClass}
          data-testid="button-app-info"
        >
          <Info className="h-6 w-6" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] max-w-2xl overflow-y-auto border-2 border-[var(--mq-border)] bg-[var(--mq-surface)] text-[var(--mq-text)] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <DialogHeader>
          <DialogTitle className="rs-title text-3xl">About MathQuest Live</DialogTitle>
          <DialogDescription className="text-[var(--mq-text-muted)]">
            A classroom-safe AI math adventure game for upper elementary students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 font-sans text-base leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">What It Is</h3>
            <p>
              MathQuest Live lets students choose preset hero options, read a short adventure scene, pick from safe action buttons, and solve code-generated math problems before the story continues.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">Creator</h3>
            <p>
              Designed by Andrew Hall, @hallveticapro, to help keep kids engaged while they practice math and reading skills.
            </p>
          </section>

          <section className="space-y-4 rounded-sm border border-[var(--mq-border-strong)] bg-[var(--mq-background)] p-4 shadow-[0_0_24px_color-mix(in_srgb,var(--mq-primary)_25%,transparent)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-heading)]">
                  Enjoying MathQuest Live?
                </h3>
                <p className="text-sm text-[var(--mq-text-muted)]">
                  Support server costs and classroom-friendly updates.
                </p>
              </div>
              <a
                href="https://buymeacoffee.com/hallveticapro"
                target="_blank"
                rel="noopener noreferrer"
                className="mq-focus rs-button inline-flex shrink-0 items-center gap-2 px-4 py-3 text-sm"
              >
                Buy Me a Coffee
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">Follow Me On Social Media</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InfoLink href="https://github.com/hallveticapro/math-quest-live" label="GitHub" icon={Github} />
              <InfoLink href="https://www.threads.net/@hallveticapro" label="Threads" icon={AtSign} />
              <InfoLink href="https://www.instagram.com/hallveticapro" label="Instagram" icon={Instagram} />
              <InfoLink href="https://www.tiktok.com/@hallveticapro" label="TikTok" icon={Music2} />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">Challenge Levels</h3>
            <div className="grid gap-3">
              {DIFFICULTY_OPTIONS.map((mode) => (
                <div key={mode.key} className="border border-[var(--mq-border)] bg-[var(--mq-background)] p-3">
                  <div className="font-bold text-[var(--mq-text)]">{mode.label}</div>
                  <div className="text-sm text-[var(--mq-text-muted)]">{mode.description}</div>
                  <div className="mt-1 text-sm text-[var(--mq-text-muted)]">{mode.studentSummary}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">Safety And Privacy</h3>
            <p>
              Students use preset buttons only. The MVP does not require accounts, logins, rosters, ads, analytics, or saved student progress.
            </p>
          </section>

          <footer className="border-t border-[var(--mq-border)] pt-4 text-center text-sm text-[var(--mq-text-muted)]">
            <p className="inline-flex items-center justify-center gap-1">
              Made for educators with love by Andrew Hall
              <Heart className="h-4 w-4 fill-[var(--mq-danger)] text-[var(--mq-danger)]" aria-hidden="true" />
            </p>
            <p className="mt-1">© 2026 MathQuest Live</p>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: true }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mq-focus flex items-center justify-between rounded-sm border border-[var(--mq-border)] bg-[var(--mq-background)] px-3 py-2 text-[var(--mq-text)] transition-colors hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-heading)]"
      aria-label={`Open ${label} in a new tab`}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--mq-heading)]" aria-hidden={true} />
        {label}
      </span>
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
