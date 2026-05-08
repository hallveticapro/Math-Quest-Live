import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Hero } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

const NAMES = ["Astra", "Kael", "Nova", "Mira", "Jax", "Luna", "Orion", "Sage", "Zara", "Theo", "Elara", "Milo"];
const PRONOUNS = ["she/her", "he/him", "they/them"];
const ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn"];
const CLASSES = ["Wizard", "Warrior", "Explorer", "Rogue", "Inventor", "Healer", "Beast Tamer", "Elementalist"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"];
const SEEDS = ["Random", "The Sky Temple", "The Crystal Forest", "The Clockwork Volcano", "The Moonlit Library", "The Lost Reef City", "The Floating Market", "The Dragon Egg Rescue", "The Puzzle Pyramid", "The Candy Comet", "The Tiny Giant's Garden", "The Museum After Midnight", "The Friendly Ghost Lighthouse"];

export function SetupScreen({ onStart }: { onStart: (hero: Hero, difficulty: string, seed: string) => void }) {
  const [name, setName] = useState(NAMES[0]);
  const [pronouns, setPronouns] = useState(PRONOUNS[0]);
  const [ancestry, setAncestry] = useState(ANCESTRIES[0]);
  const [className, setClassName] = useState(CLASSES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [seed, setSeed] = useState(SEEDS[0]);

  const handleStart = () => {
    onStart({ name, pronouns, ancestry, className }, difficulty, seed);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-2">Choose Your Hero</h2>
          <p className="text-muted-foreground text-lg">Prepare yourself for the journey ahead.</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 px-1">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Hero Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-lg">Name</Label>
                  <Select value={name} onValueChange={setName}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-name">
                      <SelectValue placeholder="Select name" />
                    </SelectTrigger>
                    <SelectContent>
                      {NAMES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">Pronouns</Label>
                  <Select value={pronouns} onValueChange={setPronouns}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-pronouns">
                      <SelectValue placeholder="Select pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRONOUNS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-lg">Ancestry</Label>
                  <Select value={ancestry} onValueChange={setAncestry}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-ancestry">
                      <SelectValue placeholder="Select ancestry" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANCESTRIES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">Class</Label>
                  <Select value={className} onValueChange={setClassName}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">The Quest</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg">Math Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">Adventure Setting</Label>
                  <Select value={seed} onValueChange={setSeed}>
                    <SelectTrigger className="h-14 text-lg" data-testid="select-seed">
                      <SelectValue placeholder="Select setting" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEEDS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t flex justify-center z-10">
          <Button 
            size="lg" 
            className="text-2xl px-16 py-8 rounded-full shadow-[0_0_30px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.6)] w-full max-w-md"
            onClick={handleStart}
            data-testid="button-start-adventure"
          >
            Start Adventure
          </Button>
        </div>
      </div>
    </div>
  );
}
