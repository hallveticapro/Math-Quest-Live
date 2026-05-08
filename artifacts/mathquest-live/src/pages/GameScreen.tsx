import { GameState } from "../types";

interface GameScreenProps {
  state: GameState;
  onChoiceSelect: (choiceId: string, choiceLabel: string) => void;
  onMathAnswer: (answer: string) => void;
}

export function GameScreen({ state, onChoiceSelect, onMathAnswer }: GameScreenProps) {
  const { hero, mathSolved, sceneTitle, storyText, choices, currentMathProblem, isLoading, wrongAttempts, showHint } = state;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="rs-panel p-4 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="border-2 border-[#c9a227] p-1 bg-[#0d0a07]">
            <div className="w-12 h-12 bg-[#3b2a1a] flex items-center justify-center font-serif text-2xl rs-title shadow-inner">
              {hero.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="rs-title text-xl tracking-wide">{hero.name}</h3>
            <p className="text-sm text-[#8c7a55] uppercase tracking-wider">{hero.ancestry} {hero.className}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <div className="text-lg font-bold text-[#c9a227] uppercase tracking-wider">
            Challenges Overcome: <span className="text-[#f0c040]">{mathSolved}</span>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 pt-12">
          <div className="w-16 h-16 border-4 border-[#6b4f1a] border-t-[#c9a227] border-b-[#c9a227] rounded-sm animate-spin"></div>
          <p className="story-text text-xl italic animate-pulse">The chronicler is writing the next chapter...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6">
          <div className="rs-panel p-6 md:p-8 space-y-6">
            <h2 className="rs-title text-3xl md:text-4xl text-center pb-4 border-b border-[#6b4f1a]">{sceneTitle}</h2>
            <p className="story-text whitespace-pre-wrap">
              {storyText}
            </p>
          </div>

          {!currentMathProblem ? (
            <div className="flex flex-col gap-4 pt-4">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  className="rs-button h-auto py-5 px-6 text-left justify-start text-lg w-full flex items-center"
                  onClick={() => onChoiceSelect(choice.id, choice.label)}
                  data-testid={`button-choice-${choice.id}`}
                >
                  <span className="font-bold text-[#f0c040] text-2xl mr-4 border-r border-[#6b4f1a] pr-4">{choice.id}</span>
                  <span className="flex-1 whitespace-normal normal-case font-serif tracking-wide">{choice.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rs-panel p-6 md:p-8 space-y-8 !border-[#2a8c7a] shadow-[0_0_30px_rgba(42,140,122,0.2)]">
              <div className="text-center space-y-6">
                <div className="inline-block bg-[#0d0a07] border border-[#2a8c7a] text-[#2a8c7a] font-bold px-6 py-2 uppercase tracking-widest mb-2 shadow-inner">
                  Math Challenge
                </div>
                <h3 className="text-3xl md:text-5xl font-bold font-sans py-4 text-[#e8d5a3] tracking-wide">
                  {currentMathProblem.prompt}
                </h3>
                
                {wrongAttempts > 0 && (
                  <div className="text-[#8c2a1a] font-bold text-xl uppercase tracking-wider animate-in shake">
                    Incorrect. Try again!
                  </div>
                )}
                {showHint && (
                  <div className="border border-[#2a8c7a] bg-[#0d0a07] p-4 text-[#e8d5a3] font-serif text-lg text-center max-w-lg mx-auto">
                    <span className="text-[#2a8c7a] font-bold mr-2 uppercase">Hint:</span> 
                    Take your time. We've simplified the problem to help you move forward.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMathProblem.choices.map((ans, idx) => {
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <button
                      key={idx}
                      className="rs-button !border-[#2a8c7a] hover:!border-[#40e0c0] hover:!text-[#ffffff] h-24 text-2xl md:text-3xl w-full flex items-center justify-center"
                      onClick={() => onMathAnswer(ans)}
                      data-testid={`button-math-answer-${idx}`}
                    >
                      <span className="text-[#2a8c7a] font-bold mr-6 text-xl">{letters[idx]}</span>
                      {ans}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
