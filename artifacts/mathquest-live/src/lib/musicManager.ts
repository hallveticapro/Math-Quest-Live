import { MUSIC_LIBRARY, type MusicTrack } from "./musicLibrary";

const FADE_MS = 900;
const CROSSFADE_MS = 1400;
const TICK_MS = 40;

function shuffleTracks(tracks: MusicTrack[], previousId: string | null) {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (
    shuffled.length > 1 &&
    previousId &&
    shuffled[0]?.id === previousId
  ) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

class BackgroundMusicManager {
  private enabled = true;
  private unlocked = false;
  private targetVolume = 0.1;
  private playlist: MusicTrack[] = [];
  private currentTrackId: string | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private fadeTimers = new Set<number>();
  private audioFadeTimers = new WeakMap<HTMLAudioElement, number>();

  get trackCount() {
    return MUSIC_LIBRARY.length;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.fadeOutCurrent(true);
      return;
    }

    this.playIfReady();
  }

  setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio && this.enabled) {
      this.fadeTo(this.currentAudio, this.targetVolume, 250);
    }
  }

  unlock() {
    this.unlocked = true;
    this.playIfReady();
  }

  stop() {
    this.fadeOutCurrent(true);
  }

  private playIfReady() {
    if (!this.enabled || !this.unlocked || MUSIC_LIBRARY.length === 0) return;
    if (this.currentAudio) return;
    this.playNextTrack(false);
  }

  private getNextTrack() {
    if (MUSIC_LIBRARY.length === 0) return null;
    if (this.playlist.length === 0) {
      this.playlist = shuffleTracks(MUSIC_LIBRARY, this.currentTrackId);
    }
    return this.playlist.shift() ?? null;
  }

  private playNextTrack(crossfade: boolean) {
    if (!this.enabled || !this.unlocked) return;
    const nextTrack = this.getNextTrack();
    if (!nextTrack) return;

    const previousAudio = this.currentAudio;
    const audio = new Audio(nextTrack.url);
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("ended", () => {
      if (this.currentAudio === audio) {
        this.playNextTrack(true);
      }
    });
    audio.addEventListener("error", () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null;
        window.setTimeout(() => this.playNextTrack(false), 250);
      }
    });

    this.currentAudio = audio;
    this.currentTrackId = nextTrack.id;

    audio
      .play()
      .then(() => {
        this.fadeTo(audio, this.targetVolume, crossfade ? CROSSFADE_MS : FADE_MS);
        if (previousAudio) {
          this.fadeTo(previousAudio, 0, CROSSFADE_MS, () => {
            previousAudio.pause();
            previousAudio.src = "";
          });
        }
      })
      .catch(() => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
      });
  }

  private fadeOutCurrent(clearCurrent: boolean) {
    const audio = this.currentAudio;
    if (!audio) return;
    if (clearCurrent) this.currentAudio = null;
    this.fadeTo(audio, 0, FADE_MS, () => {
      audio.pause();
      audio.src = "";
    });
  }

  private fadeTo(
    audio: HTMLAudioElement,
    target: number,
    durationMs: number,
    onDone?: () => void,
  ) {
    const existingTimer = this.audioFadeTimers.get(audio);
    if (existingTimer) {
      window.clearInterval(existingTimer);
      this.fadeTimers.delete(existingTimer);
    }

    const start = audio.volume;
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      audio.volume = start + (target - start) * progress;
      if (progress >= 1) {
        window.clearInterval(timer);
        this.fadeTimers.delete(timer);
        this.audioFadeTimers.delete(audio);
        audio.volume = target;
        onDone?.();
      }
    }, TICK_MS);
    this.fadeTimers.add(timer);
  }
}

export const backgroundMusicManager = new BackgroundMusicManager();
