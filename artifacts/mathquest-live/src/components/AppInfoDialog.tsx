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
          className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#6b4f1a] bg-[#0d0a07]/90 text-[#e8d5a3] shadow-lg transition-colors hover:border-[#c9a227] hover:text-[#f0c040] focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:ring-offset-2 focus:ring-offset-[#0d0a07]"
          data-testid="button-app-info"
        >
          <Info className="h-6 w-6" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] max-w-2xl overflow-y-auto border-2 border-[#6b4f1a] bg-[#1c1208] text-[#e8d5a3] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <DialogHeader>
          <DialogTitle className="rs-title text-3xl">About MathQuest Live</DialogTitle>
          <DialogDescription className="text-[#bca873]">
            A classroom-safe AI math adventure game for upper elementary students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 font-sans text-base leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[#f0c040]">What It Is</h3>
            <p>
              MathQuest Live lets students choose preset hero options, read a short adventure scene, pick from safe action buttons, and solve code-generated math problems before the story continues.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[#f0c040]">Creator</h3>
            <p>
              Designed by Andrew Hall, @hallveticapro, to help keep kids engaged while they practice math and reading skills.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[#f0c040]">Support</h3>
            <p>
              A Ko-fi donation link for server costs will be added later.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[#f0c040]">Challenge Levels</h3>
            <div className="grid gap-3">
              {DIFFICULTY_OPTIONS.map((mode) => (
                <div key={mode.key} className="border border-[#6b4f1a] bg-[#0d0a07] p-3">
                  <div className="font-bold text-[#e8d5a3]">{mode.label}</div>
                  <div className="text-sm text-[#bca873]">{mode.description}</div>
                  <div className="mt-1 text-sm text-[#bca873]">{mode.studentSummary}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-wide text-[#f0c040]">Safety And Privacy</h3>
            <p>
              Students use preset buttons only. The MVP does not require accounts, logins, rosters, ads, analytics, or saved student progress.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
