import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import {
  customFetch,
  getEnding,
  startGame,
  takeTurn,
  type EndingResponse,
  type StoryTurnResponse,
} from "@workspace/api-client-react";
import { GameState, INITIAL_STATE, Hero } from "./types";
import {
  generateUniqueMathProblem,
  generateUniqueRecoveryProblem,
  type MathProblem,
} from "./mathEngine";
import {
  playCorrect,
  playWrong,
  playClick,
  playTransition,
} from "./lib/sounds";

import { TitleScreen } from "./pages/TitleScreen";
import { SetupScreen } from "./pages/SetupScreen";
import { GameScreen } from "./pages/GameScreen";
import { EndingScreen } from "./pages/EndingScreen";
import { AppInfoDialog } from "./components/AppInfoDialog";
import { QuestSettingsDialog } from "./components/QuestSettingsDialog";
import {
  applyColorScheme,
  DEFAULT_COLOR_SCHEME_ID,
  type ColorSchemeId,
} from "./colorSchemes";

const queryClient = new QueryClient();

const FALLBACK_SCENE = {
  sceneTitle: "The Puzzle Path",
  storyText:
    "The path ahead glows with gentle puzzle magic. Your hero studies the symbols and notices three safe ways forward.",
  choices: [
    { id: "A", label: "Study the symbols carefully" },
    { id: "B", label: "Ask a friendly guide for help" },
    { id: "C", label: "Look for a hidden pattern" },
  ],
  storySummary:
    "The hero is following a safe puzzle path and solving challenges.",
  safetyRating: "kid_safe",
};

type PreparedStepKind = "turn" | "ending";
type PrepareGameStepBody = {
  kind: PreparedStepKind;
  hero: Hero;
  difficulty: string;
  adventureSeed: string;
  turn: number;
  maxTurns: number;
  storySummary: string;
  chosenAction: string;
  mathSolved?: number;
};
type PrepareGameStepResponse = {
  pendingId: string;
  kind: PreparedStepKind;
  turn: number;
};
type ResolvePreparedStepResponse =
  | { kind: "turn"; turn: number; data: StoryTurnResponse }
  | { kind: "ending"; turn: number; data: EndingResponse };

function prepareGameStep(data: PrepareGameStepBody) {
  return customFetch<PrepareGameStepResponse>("/api/game/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function resolvePreparedStep(pendingId: string) {
  return customFetch<ResolvePreparedStepResponse>("/api/game/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pendingId }),
  });
}

function GameApp() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const pendingPreparationRef =
    useRef<Promise<PrepareGameStepResponse | null> | null>(null);
  const pendingStartRef = useRef<{
    key: string;
    promise: Promise<StoryTurnResponse | null>;
  } | null>(null);
  const usedProblemSignaturesRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    applyColorScheme(state.colorSchemeId);
  }, [state.colorSchemeId]);

  const getStartKey = (
    hero: Hero,
    difficulty: string,
    adventureSeed: string,
    maxTurns: number,
  ) => JSON.stringify({ hero, difficulty, adventureSeed, maxTurns });

  const prepareStart = (
    hero: Hero,
    difficulty: string,
    adventureSeed: string,
    maxTurns: number,
  ) => {
    const key = getStartKey(hero, difficulty, adventureSeed, maxTurns);
    if (pendingStartRef.current?.key === key) return;

    pendingStartRef.current = {
      key,
      promise: startGame({ hero, difficulty, adventureSeed, maxTurns }).catch(
        (err: unknown) => {
          console.warn(
            "Prepared intro failed; falling back to reveal-time start.",
            err,
          );
          return null;
        },
      ),
    };
  };

  const rememberMathProblem = (problem: MathProblem) => {
    usedProblemSignaturesRef.current.add(problem.signature);
    return problem;
  };

  const generateSessionMathProblem = (difficulty: string) =>
    rememberMathProblem(
      generateUniqueMathProblem(difficulty, usedProblemSignaturesRef.current),
    );

  const generateSessionRecoveryProblem = (difficulty: string) =>
    rememberMathProblem(
      generateUniqueRecoveryProblem(
        difficulty,
        usedProblemSignaturesRef.current,
      ),
    );

  const handleStart = (
    hero: Hero,
    difficulty: string,
    adventureSeed: string,
    maxTurns: number,
    colorSchemeId = DEFAULT_COLOR_SCHEME_ID,
  ) => {
    playTransition();
    usedProblemSignaturesRef.current = new Set();
    setState((s) => ({
      ...s,
      hero,
      difficulty,
      adventureSeed,
      maxTurns,
      colorSchemeId,
      turn: 1,
      mathSolved: 0,
      storySummary: "",
      sceneTitle: "",
      storyText: "",
      illustration: null,
      choices: [],
      currentMathProblem: null,
      chosenAction: null,
      endingTitle: "",
      endingText: "",
      badge: "",
      wrongAttempts: 0,
      showHint: false,
      recoveryMode: false,
      isLoading: true,
      screen: "game",
    }));

    const key = getStartKey(hero, difficulty, adventureSeed, maxTurns);
    const preparedStart =
      pendingStartRef.current?.key === key
        ? pendingStartRef.current.promise
        : startGame({ hero, difficulty, adventureSeed, maxTurns });
    pendingStartRef.current = null;

    preparedStart
      .then(async (res) => {
        const startResult =
          res ??
          (await startGame({ hero, difficulty, adventureSeed, maxTurns }));

        setState((s) => ({
          ...s,
          isLoading: false,
          sceneTitle: startResult.sceneTitle,
          storyText: startResult.storyText,
          illustration: startResult.image ?? null,
          choices: startResult.choices,
          storySummary: startResult.storySummary,
        }));
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Connection fading...",
          description: "Using fallback magic to continue.",
        });
        setState((s) => ({
          ...s,
          isLoading: false,
          sceneTitle: FALLBACK_SCENE.sceneTitle,
          storyText: FALLBACK_SCENE.storyText,
          illustration: null,
          choices: FALLBACK_SCENE.choices,
          storySummary: FALLBACK_SCENE.storySummary,
        }));
      });
  };

  const handleChoiceSelect = (choiceId: string, choiceLabel: string) => {
    playClick();
    const isEnding = state.turn >= state.maxTurns;
    pendingPreparationRef.current = prepareGameStep({
      kind: isEnding ? "ending" : "turn",
      hero: state.hero,
      difficulty: state.difficulty,
      adventureSeed: state.adventureSeed,
      turn: isEnding ? state.turn : state.turn + 1,
      maxTurns: state.maxTurns,
      storySummary: state.storySummary,
      chosenAction: choiceLabel,
      mathSolved: isEnding ? state.mathSolved + 1 : undefined,
    }).catch((err: unknown) => {
      console.warn(
        "Prepared turn failed; falling back to reveal-time generation.",
        err,
      );
      return null;
    });

    const mathProblem = generateSessionMathProblem(state.difficulty);
    setState((s) => ({
      ...s,
      chosenAction: choiceLabel,
      currentMathProblem: mathProblem,
    }));
  };

  const handleColorSchemeChange = (colorSchemeId: ColorSchemeId) => {
    setState((s) => ({ ...s, colorSchemeId }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    setState((s) => ({ ...s, difficulty }));
  };

  const revealEnding = async (newMathSolved: number) => {
    try {
      const prepared = await pendingPreparationRef.current;
      pendingPreparationRef.current = null;
      if (!prepared || prepared.kind !== "ending") {
        throw new Error("Prepared ending unavailable");
      }

      const resolved = await resolvePreparedStep(prepared.pendingId);
      if (resolved.kind !== "ending") {
        throw new Error("Prepared response did not contain an ending");
      }

      const res = resolved.data;
      setState((s) => ({
        ...s,
        isLoading: false,
        screen: "ending",
        endingTitle: res.endingTitle,
        endingText: res.endingText,
        illustration: res.image ?? null,
        badge: res.badge,
      }));
    } catch {
      try {
        const res = await getEnding({
          hero: state.hero,
          difficulty: state.difficulty,
          adventureSeed: state.adventureSeed,
          turn: state.turn,
          maxTurns: state.maxTurns,
          storySummary: state.storySummary,
          mathSolved: newMathSolved,
        });
        setState((s) => ({
          ...s,
          isLoading: false,
          screen: "ending",
          endingTitle: res.endingTitle,
          endingText: res.endingText,
          illustration: res.image ?? null,
          badge: res.badge,
        }));
      } catch {
        setState((s) => ({
          ...s,
          isLoading: false,
          screen: "ending",
          endingTitle: "A Triumphant Return",
          endingText:
            "You have completed your journey through the magical lands and returned safely home, wiser and stronger than before.",
          illustration: null,
          badge: "Star of Logic",
        }));
      }
    }
  };

  const revealNextTurn = async (
    newMathSolved: number,
    mathDifficulty: string,
  ) => {
    const nextTurn = state.turn + 1;
    try {
      const prepared = await pendingPreparationRef.current;
      pendingPreparationRef.current = null;
      if (!prepared || prepared.kind !== "turn" || prepared.turn !== nextTurn) {
        throw new Error("Prepared turn unavailable");
      }

      const resolved = await resolvePreparedStep(prepared.pendingId);
      if (resolved.kind !== "turn") {
        throw new Error("Prepared response did not contain a turn");
      }

      const res = resolved.data;
      setState((s) => ({
        ...s,
        isLoading: false,
        turn: nextTurn,
        sceneTitle: res.sceneTitle,
        storyText: res.storyText,
        illustration: res.image ?? null,
        choices: res.choices,
        storySummary: res.storySummary,
      }));
    } catch {
      try {
        const res = await takeTurn({
          hero: state.hero,
          difficulty: state.difficulty,
          adventureSeed: state.adventureSeed,
          turn: nextTurn,
          maxTurns: state.maxTurns,
          storySummary: state.storySummary,
          chosenAction: state.chosenAction || "",
          mathResult: `Solved a ${state.recoveryMode ? "recovery" : "standard"} ${mathDifficulty} problem.`,
        });
        setState((s) => ({
          ...s,
          isLoading: false,
          turn: nextTurn,
          sceneTitle: res.sceneTitle,
          storyText: res.storyText,
          illustration: res.image ?? null,
          choices: res.choices,
          storySummary: res.storySummary,
        }));
      } catch {
        toast({
          variant: "destructive",
          title: "Connection fading...",
          description: "Using fallback magic to continue.",
        });
        setState((s) => ({
          ...s,
          isLoading: false,
          turn: nextTurn,
          sceneTitle: FALLBACK_SCENE.sceneTitle + ` (Part ${nextTurn})`,
          storyText: FALLBACK_SCENE.storyText,
          illustration: null,
          choices: FALLBACK_SCENE.choices,
          storySummary: FALLBACK_SCENE.storySummary,
        }));
      }
    }
  };

  const handleMathAnswer = (answer: string) => {
    const prob = state.currentMathProblem;
    if (!prob) return;

    if (answer === prob.correctAnswer) {
      playCorrect();
      const newMathSolved = state.mathSolved + 1;

      setState((s) => ({
        ...s,
        isLoading: true,
        currentMathProblem: null,
        wrongAttempts: 0,
        showHint: false,
        recoveryMode: false,
        mathSolved: newMathSolved,
      }));

      if (state.turn >= state.maxTurns) {
        void revealEnding(newMathSolved);
      } else {
        void revealNextTurn(newMathSolved, prob.difficulty);
      }
    } else {
      playWrong();
      const attempts = state.wrongAttempts + 1;
      if (attempts >= 2 && !state.recoveryMode) {
        const recoveryProblem = generateSessionRecoveryProblem(prob.difficulty);
        setState((s) => ({
          ...s,
          wrongAttempts: 0,
          showHint: true,
          recoveryMode: true,
          currentMathProblem: recoveryProblem,
        }));
      } else {
        setState((s) => ({ ...s, wrongAttempts: attempts }));
      }
    }
  };

  const handlePlayAgain = () => {
    handleStart(
      state.hero,
      state.difficulty,
      state.adventureSeed,
      state.maxTurns,
      state.colorSchemeId,
    );
  };

  const handleExitToTitle = () => {
    playTransition();
    pendingPreparationRef.current = null;
    pendingStartRef.current = null;
    usedProblemSignaturesRef.current = new Set();
    applyColorScheme(DEFAULT_COLOR_SCHEME_ID);
    setState(INITIAL_STATE);
  };

  return (
    <div className="mq-app min-h-screen font-sans selection:bg-[var(--mq-primary)]/30">
      {state.screen === "title" && (
        <TitleScreen
          onBegin={() => {
            playTransition();
            applyColorScheme(DEFAULT_COLOR_SCHEME_ID);
            setState((s) => ({ ...INITIAL_STATE, screen: "setup" }));
          }}
        />
      )}
      {state.screen === "setup" && (
        <SetupScreen
          onStart={handleStart}
          onPrepareStart={prepareStart}
          onCancel={handleExitToTitle}
        />
      )}
      {state.screen === "game" && (
        <>
          <QuestSettingsDialog
            colorSchemeId={state.colorSchemeId}
            difficulty={state.difficulty}
            isMathActive={Boolean(state.currentMathProblem)}
            onColorSchemeChange={handleColorSchemeChange}
            onDifficultyChange={handleDifficultyChange}
          />
          <GameScreen
            state={state}
            onChoiceSelect={handleChoiceSelect}
            onMathAnswer={handleMathAnswer}
            onExitToTitle={handleExitToTitle}
          />
        </>
      )}
      {state.screen === "ending" && (
        <EndingScreen
          state={state}
          onPlayAgain={handlePlayAgain}
          onNewHero={() => {
            playTransition();
            usedProblemSignaturesRef.current = new Set();
            setState(INITIAL_STATE);
          }}
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
