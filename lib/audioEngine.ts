/**
 * Audio Engine: Web Audio API Synthesizer + HTML5 BGM Streaming
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initBGM();
    }
  }

  private initBGM() {
    if (typeof window === "undefined" || this.bgmAudio) return;
    try {
      this.bgmAudio = new Audio("/audio/bgm.mp3");
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.22;
      this.bgmAudio.preload = "none";
    } catch (e) {
      console.warn("BGM initialization deferred:", e);
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      if (muted) {
        this.bgmAudio.pause();
        this.isBgmPlaying = false;
      } else {
        this.playBGM();
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playBGM() {
    if (this.isMuted || typeof window === "undefined") return;
    if (!this.bgmAudio) {
      this.initBGM();
    }
    if (this.bgmAudio) {
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
      }).catch(() => {
        // Autoplay may be blocked before first user gesture
      });
    }
  }

  public pauseBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  /**
   * Sound: Suara ketukan tombol / UI Tap
   */
  public playTap() {
    this.playBGM(); // Start BGM on first interaction if not playing
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  /**
   * Sound: Card Reveal Flip Sound
   */
  public playCardFlip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /**
   * Sound: Lonceng Balai Desa (Village Bell)
   */
  public playBell() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const frequencies = [440, 880, 1320];
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      const initialGain = 0.2 / (idx + 1);
      gain.gain.setValueAtTime(initialGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  /**
   * Sound: Detak Jantung Dramatis (Heartbeat)
   */
  public playHeartbeat() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playBeat = (time: number, freq: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(30, time + duration);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    };

    playBeat(now, 75, 0.15, 0.35);
    playBeat(now + 0.18, 65, 0.18, 0.25);
  }

  /**
   * Sound: Suara Malam Tiba (Chime)
   */
  public playNightChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [220, 261.63, 329.63, 440];
    notes.forEach((note, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.15;

      osc.type = "sine";
      osc.frequency.setValueAtTime(note, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  /**
   * Sound: Fanfare Kemenangan (Victory)
   */
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const melody = [
      { note: 261.63, time: 0.0, dur: 0.15 },
      { note: 329.63, time: 0.15, dur: 0.15 },
      { note: 392.00, time: 0.30, dur: 0.15 },
      { note: 523.25, time: 0.45, dur: 0.60 },
    ];

    melody.forEach(({ note, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + time;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  }

  public startAmbient(type: 'NIGHT' | 'DAY') {
    this.playBGM();
  }

  public stopAmbient() {
    // No-op (handled by BGM)
  }
}

export const audioEngine = new AudioEngine();
