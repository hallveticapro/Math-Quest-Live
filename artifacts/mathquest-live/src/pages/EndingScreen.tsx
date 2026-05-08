import { GameState } from "../types";

interface EndingScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewHero: () => void;
}

export function EndingScreen({ state, onPlayAgain, onNewHero }: EndingScreenProps) {
  const { endingTitle, endingText, badge, mathSolved, hero } = state;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-1000 bg-[#0d0a07]">
      <div className="max-w-3xl w-full space-y-10 text-center">
        
        <div className="space-y-6">
          <div className="inline-flex flex-col items-center p-8 bg-[#1c1208] border-4 border-[#c9a227] shadow-[0_0_50px_rgba(201,162,39,0.3)] mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[#c9a227] opacity-10 mix-blend-overlay"></div>
            <span className="text-[#c9a227] font-sans uppercase tracking-widest text-sm mb-4 font-bold">Quest Complete</span>
            <div className="rs-title text-4xl md:text-5xl font-black">{badge}</div>
          </div>
          
          <h1 className="rs-title text-5xl md:text-7xl font-bold pt-4">
            {endingTitle}
          </h1>
        </div>

        <div className="rs-panel p-8 md:p-10 text-left space-y-8">
          <p className="story-text text-xl md:text-2xl leading-loose">
            {endingText}
          </p>
          
          <div className="border-t-2 border-b-2 border-[#2a8c7a] py-6 flex flex-col md:flex-row items-center justify-between bg-[#0d0a07]/50 px-6">
            <span className="text-xl font-bold text-[#2a8c7a] uppercase tracking-widest mb-2 md:mb-0">Challenges Overcome</span>
            <span className="text-5xl font-black font-sans text-[#2a8c7a] drop-shadow-[0_0_10px_rgba(42,140,122,0.5)]">{mathSolved}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button 
            className="rs-button w-full sm:w-auto text-xl px-12 py-6"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            Quest Again
          </button>
          <button 
            className="rs-button w-full sm:w-auto text-xl px-12 py-6 !bg-[#0d0a07] !text-[#8c7a55] !border-[#4a3610]"
            onClick={onNewHero}
            data-testid="button-new-hero"
          >
            New Hero
          </button>
        </div>
        
      </div>
    </div>
  );
}
