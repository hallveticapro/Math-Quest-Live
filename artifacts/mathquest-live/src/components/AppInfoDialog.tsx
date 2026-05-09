import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DIFFICULTY_OPTIONS } from "../math/floridaBestMath";

export function AppInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="About MathQuest Live"
          className="mq-focus fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--mq-border)] bg-[var(--mq-background)]/90 text-[var(--mq-text)] shadow-lg transition-colors hover:border-[var(--mq-border-strong)] hover:text-[var(--mq-primary-hover)]"
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

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--mq-primary-hover)]">Support</h3>
            <p>
              A Ko-fi donation link for server costs will be added later.
            </p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
