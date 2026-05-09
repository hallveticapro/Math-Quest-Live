import { Button } from "@/components/ui/button";

export function TitleScreen({ onBegin }: { onBegin: () => void }) {
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
      
      <button 
        className="rs-button text-2xl px-16 py-6 tracking-wider w-full max-w-md"
        onClick={onBegin}
        data-testid="button-begin-quest"
      >
        Begin Quest
      </button>

      <p className="text-[var(--mq-text-muted)] font-serif italic mt-12 max-w-md" style={{ fontFamily: "var(--app-font-story)" }}>
        Adventures await brave souls who dare to solve the mysteries within...
      </p>
    </div>
  );
}
