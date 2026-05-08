import { Button } from "@/components/ui/button";

export function TitleScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-primary drop-shadow-2xl">
          MathQuest Live
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto font-medium">
          A new math adventure every time.
        </p>
      </div>
      
      <Button 
        size="lg" 
        className="text-2xl px-16 py-10 rounded-full shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-10px_rgba(var(--primary),0.8)] transition-all hover:scale-105"
        onClick={onBegin}
        data-testid="button-begin-quest"
      >
        Begin Quest
      </Button>
    </div>
  );
}
