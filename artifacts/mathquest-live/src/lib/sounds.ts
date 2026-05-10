let ctx: AudioContext | null = null;
let lastClickAt = 0;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(
  frequency: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine",
  gainRampTo = 0,
): void {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gainNode = ac.createGain();

  osc.connect(gainNode);
  gainNode.connect(ac.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime + startTime);

  gainNode.gain.setValueAtTime(0, ac.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(gain, ac.currentTime + startTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(gainRampTo, ac.currentTime + startTime + duration);

  osc.start(ac.currentTime + startTime);
  osc.stop(ac.currentTime + startTime + duration + 0.01);
}

// Correct answer — bright ascending chime (C E G C)
export function playCorrect(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone(freq, i * 0.12, 0.35, 0.18, "sine");
  });
}

// Wrong answer — gentle descending "bwop"
export function playWrong(): void {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gainNode = ac.createGain();
  osc.connect(gainNode);
  gainNode.connect(ac.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(280, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(160, ac.currentTime + 0.25);

  gainNode.gain.setValueAtTime(0.15, ac.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.35);
}

// Triumphant ending fanfare — C major arpeggio then big chord
export function playFanfare(): void {
  // Rising arpeggio
  const melody = [
    { freq: 523.25, t: 0.0, dur: 0.2 },
    { freq: 659.25, t: 0.18, dur: 0.2 },
    { freq: 783.99, t: 0.36, dur: 0.2 },
    { freq: 1046.5, t: 0.54, dur: 0.4 },
    { freq: 783.99, t: 0.72, dur: 0.15 },
    { freq: 1046.5, t: 0.88, dur: 0.6 },
  ];
  melody.forEach(({ freq, t, dur }) => {
    playTone(freq, t, dur, 0.15, "triangle");
  });

  // Harmony layer — fifth below on the big notes
  playTone(392.0, 0.54, 0.4, 0.08, "sine");
  playTone(392.0, 0.88, 0.6, 0.08, "sine");

  // Bass hit at the start
  playTone(130.81, 0.0, 0.5, 0.12, "sine");
  playTone(130.81, 0.88, 0.7, 0.12, "sine");
}

// Soft click for choice selection
export function playClick(): void {
  const now = performance.now();
  if (now - lastClickAt < 70) return;
  lastClickAt = now;

  playTone(880, 0, 0.06, 0.07, "sine", 0);
  playTone(1100, 0.03, 0.06, 0.04, "sine", 0);
}

// Soft page-turn woosh for screen transitions
export function playTransition(): void {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gainNode = ac.createGain();
  osc.connect(gainNode);
  gainNode.connect(ac.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(900, ac.currentTime + 0.15);

  gainNode.gain.setValueAtTime(0, ac.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, ac.currentTime + 0.2);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.25);
}
