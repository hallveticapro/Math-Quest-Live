import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import { useStartGame, useTakeTurn, useGetEnding } from "@workspace/api-client-react";
import { GameState, INITIAL_STATE, Hero } from "./types";
import { generateMathProblem, generateRecoveryProblem } from "./mathEngine";
import { playCorrect, playWrong, playClick, playTransition } from "./lib/sounds";

import { TitleScreen } from "./pages/TitleScreen";
import { SetupScreen } from "./pages/SetupScreen";
import { GameScreen } from "./pages/GameScreen";
import { EndingScreen } from "./pages/EndingScreen";
import { AppInfoDialog } from "./components/AppInfoDialog";

const queryClient = new QueryClient();

const FALLBACK_SCENE = {
  sceneTitle: "The Puzzle Path",
  storyText: "The path ahead glows with gentle puzzle magic. Your hero studies the symbols and notices three safe ways forward.",
  choices: [
    { id: "A", label: "Study the symbols carefully" },
    { id: "B", label: "Ask a friendly guide for help" },
    { id: "C", label: "Look for a hidden pattern" }
  ],
  storySummary: "The hero is following a safe puzzle path and solving challenges.",
  safetyRating: "kid_safe"
};

function GameApp() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const { toast } = useToast();

  const startGameMutation = useStartGame();
  const takeTurnMutation = useTakeTurn();
  const getEndingMutation = useGetEnding();

  const handleStart = (hero: Hero, difficulty: string, adventureSeed: string, maxTurns: number) => {
    playTransition();
    setState(s => ({ ...s, hero, difficulty, adventureSeed, maxTurns, isLoading: true, screen: 'game' }));

    startGameMutation.mutate(
      { data: { hero, difficulty, adventureSeed, maxTurns } },
      {
        onSuccess: (res) => {
          setState(s => ({
            ...s,
            isLoading: false,
            sceneTitle: res.sceneTitle,
            storyText: res.storyText,
            choices: res.choices,
            storySummary: res.storySummary,
          }));
        },
        onError: () => {
          toast({ variant: "destructive", title: "Connection fading...", description: "Using fallback magic to continue." });
          setState(s => ({
            ...s,
            isLoading: false,
            sceneTitle: FALLBACK_SCENE.sceneTitle,
            storyText: FALLBACK_SCENE.storyText,
            choices: FALLBACK_SCENE.choices,
            storySummary: FALLBACK_SCENE.storySummary,
          }));
        }
      }
    );
  };

  const handleChoiceSelect = (choiceId: string, choiceLabel: string) => {
    playClick();
    setState(s => ({
      ...s,
      chosenAction: choiceLabel,
      currentMathProblem: generateMathProblem(s.difficulty)
    }));
  };

  const handleMathAnswer = (answer: string) => {
    const prob = state.currentMathProblem;
    if (!prob) return;

    if (answer === prob.correctAnswer) {
      playCorrect();
      const newMathSolved = state.mathSolved + 1;

      setState(s => ({
        ...s,
        isLoading: true,
        currentMathProblem: null,
        wrongAttempts: 0,
        showHint: false,
        recoveryMode: false,
        mathSolved: newMathSolved
      }));

      if (state.turn >= state.maxTurns) {
        getEndingMutation.mutate(
          { data: {
            hero: state.hero,
            difficulty: state.difficulty,
            adventureSeed: state.adventureSeed,
            turn: state.turn,
            maxTurns: state.maxTurns,
            storySummary: state.storySummary,
            mathSolved: newMathSolved
          }},
          {
            onSuccess: (res) => {
              setState(s => ({
                ...s,
                isLoading: false,
                screen: 'ending',
                endingTitle: res.endingTitle,
                endingText: res.endingText,
                badge: res.badge,
              }));
            },
            onError: () => {
              setState(s => ({
                ...s,
                isLoading: false,
                screen: 'ending',
                endingTitle: "A Triumphant Return",
                endingText: "You have completed your journey through the magical lands and returned safely home, wiser and stronger than before.",
                badge: "Star of Logic",
              }));
            }
          }
        );
      } else {
        const nextTurn = state.turn + 1;
        takeTurnMutation.mutate(
          { data: {
            hero: state.hero,
            difficulty: state.difficulty,
            adventureSeed: state.adventureSeed,
            turn: nextTurn,
            maxTurns: state.maxTurns,
            storySummary: state.storySummary,
            chosenAction: state.chosenAction || "",
            mathResult: `Solved a ${state.recoveryMode ? 'recovery' : 'standard'} ${prob.difficulty} problem.`
          }},
          {
            onSuccess: (res) => {
              setState(s => ({
                ...s,
                isLoading: false,
                turn: nextTurn,
                sceneTitle: res.sceneTitle,
                storyText: res.storyText,
                choices: res.choices,
                storySummary: res.storySummary,
              }));
            },
            onError: () => {
              toast({ variant: "destructive", title: "Connection fading...", description: "Using fallback magic to continue." });
              setState(s => ({
                ...s,
                isLoading: false,
                turn: nextTurn,
                sceneTitle: FALLBACK_SCENE.sceneTitle + ` (Part ${nextTurn})`,
                storyText: FALLBACK_SCENE.storyText,
                choices: FALLBACK_SCENE.choices,
                storySummary: FALLBACK_SCENE.storySummary,
              }));
            }
          }
        );
      }

    } else {
      playWrong();
      const attempts = state.wrongAttempts + 1;
      if (attempts >= 2 && !state.recoveryMode) {
        setState(s => ({
          ...s,
          wrongAttempts: 0,
          showHint: true,
          recoveryMode: true,
          currentMathProblem: generateRecoveryProblem(s.difficulty)
        }));
      } else {
        setState(s => ({ ...s, wrongAttempts: attempts }));
      }
    }
  };

  const handlePlayAgain = () => {
    handleStart(state.hero, state.difficulty, state.adventureSeed, state.maxTurns);
  };

  const handleExitToTitle = () => {
    playTransition();
    setState(INITIAL_STATE);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {state.screen === 'title' && (
        <TitleScreen onBegin={() => { playTransition(); setState(s => ({ ...s, screen: 'setup' })); }} />
      )}
      {state.screen === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}
      {state.screen === 'game' && (
        <GameScreen
          state={state}
          onChoiceSelect={handleChoiceSelect}
          onMathAnswer={handleMathAnswer}
          onExitToTitle={handleExitToTitle}
        />
      )}
      {state.screen === 'ending' && (
        <EndingScreen
          state={state}
          onPlayAgain={handlePlayAgain}
          onNewHero={() => { playTransition(); setState(INITIAL_STATE); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameApp />
        <AppInfoDialog />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
