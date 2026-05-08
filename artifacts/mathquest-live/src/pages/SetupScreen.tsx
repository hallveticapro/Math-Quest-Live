import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Hero } from "../types";

const NAMES = ["Astra", "Kael", "Nova", "Mira", "Jax", "Luna", "Orion", "Sage", "Zara", "Theo", "Elara", "Milo"];
const PRONOUNS = ["she/her", "he/him", "they/them"];
const ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn"];
const CLASSES = ["Wizard", "Warrior", "Explorer", "Rogue", "Inventor", "Healer", "Beast Tamer", "Elementalist"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"];
const SEEDS = ["Random", "The Sky Temple", "The Crystal Forest", "The Clockwork Volcano", "The Moonlit Library", "The Lost Reef City", "The Floating Market", "The Dragon Egg Rescue", "The Puzzle Pyramid", "The Candy Comet", "The Tiny Giant's Garden", "The Museum After Midnight", "The Friendly Ghost Lighthouse"];

const STORY_LENGTHS = [
  { label: "Short — 8 chapters", value: 8 },
  { label: "Medium — 11 chapters", value: 11 },
  { label: "Long — 15 chapters", value: 15 },
];

export function SetupScreen({ onStart }: { onStart: (hero: Hero, difficulty: string, seed: string, maxTurns: number) => void }) {
  const [name, setName] = useState(NAMES[0]);
  const [pronouns, setPronouns] = useState(PRONOUNS[0]);
  const [ancestry, setAncestry] = useState(ANCESTRIES[0]);
  const [className, setClassName] = useState(CLASSES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [seed, setSeed] = useState(SEEDS[0]);
  const [maxTurns, setMaxTurns] = useState(8);

  const handleStart = () => {
    onStart({ name, pronouns, ancestry, className }, difficulty, seed, maxTurns);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-8 animate-in fade-in duration-500 pb-32">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-10">
          <h2 className="rs-title text-4xl md:text-5xl font-bold mb-4">Create Your Hero</h2>
          <div className="rs-hr max-w-md mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="rs-panel p-6">
            <h3 className="rs-title text-2xl mb-6 text-center border-b border-[#6b4f1a] pb-2">Hero Identity</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Name</Label>
                <Select value={name} onValueChange={setName}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-name">
                    <SelectValue placeholder="Select name" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {NAMES.map(n => <SelectItem key={n} value={n} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Pronouns</Label>
                <Select value={pronouns} onValueChange={setPronouns}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-pronouns">
                    <SelectValue placeholder="Select pronouns" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {PRONOUNS.map(p => <SelectItem key={p} value={p} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rs-panel p-6">
            <h3 className="rs-title text-2xl mb-6 text-center border-b border-[#6b4f1a] pb-2">Background</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Ancestry</Label>
                <Select value={ancestry} onValueChange={setAncestry}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-ancestry">
                    <SelectValue placeholder="Select ancestry" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {ANCESTRIES.map(a => <SelectItem key={a} value={a} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Class</Label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {CLASSES.map(c => <SelectItem key={c} value={c} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rs-panel p-6 md:col-span-2">
            <h3 className="rs-title text-2xl mb-6 text-center border-b border-[#6b4f1a] pb-2">The Quest</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Math Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {DIFFICULTIES.map(d => <SelectItem key={d} value={d} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Story Length</Label>
                <Select value={String(maxTurns)} onValueChange={v => setMaxTurns(Number(v))}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {STORY_LENGTHS.map(l => (
                      <SelectItem key={l.value} value={String(l.value)} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-[#e8d5a3] font-sans uppercase tracking-wide">Adventure Setting</Label>
                <Select value={seed} onValueChange={setSeed}>
                  <SelectTrigger className="h-14 text-lg bg-[#0d0a07] border-[#6b4f1a] text-[#e8d5a3] rounded-sm font-sans" data-testid="select-seed">
                    <SelectValue placeholder="Select setting" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c1208] border-[#6b4f1a] text-[#e8d5a3]">
                    {SEEDS.map(s => <SelectItem key={s} value={s} className="focus:bg-[#3b2a1a] focus:text-[#f0c040] font-sans text-lg">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0d0a07]/95 border-t-2 border-[#6b4f1a] flex justify-center z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
          <button
            className="rs-button text-2xl px-16 py-6 w-full max-w-md"
            onClick={handleStart}
            data-testid="button-start-adventure"
          >
            Begin Adventure
          </button>
        </div>
      </div>
    </div>
  );
}
