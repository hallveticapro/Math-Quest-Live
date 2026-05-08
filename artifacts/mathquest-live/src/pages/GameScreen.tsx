import { GameState } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MathProblem } from "../mathEngine";

interface GameScreenProps {
  state: GameState;
  onChoiceSelect: (choiceId: string, choiceLabel: string) => void;
  onMathAnswer: (answer: string) => void;
}

export function GameScreen({ state, onChoiceSelect, onMathAnswer }: GameScreenProps) {
  const { hero, turn, maxTurns, mathSolved, sceneTitle, storyText, choices, currentMathProblem, isLoading, wrongAttempts, showHint } = state;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row items-center justify-between bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-primary/20 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center font-bold text-xl text-primary-foreground">
              {hero.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{hero.name}</h3>
            <p className="text-sm text-muted-foreground">{hero.ancestry} {hero.className} • {state.difficulty}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <div className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Turn {turn} of {maxTurns}
          </div>
          <div className="text-xs text-muted-foreground">
            Math Solved: {mathSolved}
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Spinner className="w-16 h-16 text-primary" />
          <p className="text-xl text-muted-foreground animate-pulse">The narrator is writing the next chapter...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500">
          <Card className="border-primary/30 shadow-[0_0_20px_-10px_rgba(var(--primary),0.3)] bg-card/60 backdrop-blur-md">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">{sceneTitle}</h2>
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {storyText}
              </p>
            </CardContent>
          </Card>

          {!currentMathProblem ? (
            <div className="grid grid-cols-1 gap-4 pt-4">
              {choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="h-auto py-6 px-6 text-left justify-start text-lg whitespace-normal border-primary/20 hover:border-primary hover:bg-primary/10 transition-colors"
                  onClick={() => onChoiceSelect(choice.id, choice.label)}
                  data-testid={`button-choice-${choice.id}`}
                >
                  <span className="font-bold text-secondary mr-4 text-xl">{choice.id}</span>
                  {choice.label}
                </Button>
              ))}
            </div>
          ) : (
            <Card className="border-accent shadow-[0_0_30px_-10px_rgba(var(--accent),0.4)] animate-in slide-in-from-bottom-8 duration-500 bg-card/90">
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-block bg-accent/20 text-accent font-semibold px-4 py-1 rounded-full text-sm uppercase tracking-wider mb-2">
                    Math Challenge
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold font-mono py-4 text-foreground">
                    {currentMathProblem.prompt}
                  </h3>
                  
                  {wrongAttempts > 0 && (
                    <div className="text-destructive font-semibold text-lg animate-in shake">
                      Not quite right. Try again!
                    </div>
                  )}
                  {showHint && (
                    <div className="text-secondary font-medium bg-secondary/10 p-4 rounded-lg">
                      Hint: Take your time. We've simplified the problem to help you move forward.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMathProblem.choices.map((ans, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    return (
                      <Button
                        key={idx}
                        variant="secondary"
                        className="h-20 text-2xl font-mono shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
                        onClick={() => onMathAnswer(ans)}
                        data-testid={`button-math-answer-${idx}`}
                      >
                        <span className="opacity-50 mr-4">{letters[idx]}</span>
                        {ans}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
