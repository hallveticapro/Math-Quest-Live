import { Button } from "@/components/ui/button";
import { GameState } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface EndingScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewHero: () => void;
}

export function EndingScreen({ state, onPlayAgain, onNewHero }: EndingScreenProps) {
  const { endingTitle, endingText, badge, mathSolved, hero } = state;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-1000">
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        <div className="space-y-4">
          <div className="inline-block p-6 bg-accent/20 rounded-full mb-4 shadow-[0_0_60px_rgba(var(--accent),0.3)]">
            <div className="text-6xl text-accent font-black tracking-widest">{badge}</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary drop-shadow-lg font-serif">
            {endingTitle}
          </h1>
          <p className="text-xl text-muted-foreground">
            A heroic tale concluded for {hero.name}.
          </p>
        </div>

        <Card className="bg-card/60 backdrop-blur-md border-primary/30 shadow-xl text-left">
          <CardContent className="p-8 space-y-6">
            <p className="text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {endingText}
            </p>
            
            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-center justify-between">
              <span className="text-lg font-medium text-secondary">Math Challenges Overcome</span>
              <span className="text-3xl font-black font-mono text-secondary">{mathSolved}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-xl px-12 py-8 rounded-full"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            Play Again
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            className="w-full sm:w-auto text-xl px-12 py-8 rounded-full border-primary/50 hover:bg-primary/10"
            onClick={onNewHero}
            data-testid="button-new-hero"
          >
            Choose New Hero
          </Button>
        </div>
        
      </div>
    </div>
  );
}
