"""Synthesize sound effects and background music for the three versions.

No samples are used. Writes, per version (v1, v2, v3):
  public/audio/sfx-<v>.wav    sound effects timed to the frames in src/
  public/audio/music-<v>.wav  a stand-in music bed (replace with a Suno track via the `music` prop)
Run: python3 scripts/make_audio.py
"""
import os
import wave
import numpy as np

SR = 48000
FPS = 30
rng = np.random.default_rng(7)


def f(frame):
    return frame / FPS


def note(name):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    semis = names[name[0]] + (1 if "#" in name else 0) - (1 if len(name) > 2 and name[1] == "b" else 0) + (int(name[-1]) - 4) * 12
    return 440.0 * 2 ** (semis / 12)


def env(n, a=0.005, r=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


def tone(freq, dur, kind="sine", a=0.005, r=0.4):
    n = int(SR * dur)
    t = np.arange(n) / SR
    if kind == "saw":
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 9))
    elif kind == "square":
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 12, 2))
    elif kind == "keys":  # soft electric-piano-ish
        s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 3) + 0.1 * np.sin(2 * np.pi * freq * 3 * t)
    else:
        s = np.sin(2 * np.pi * freq * t)
    return s * env(n, a, r)


def chord(freqs, dur, kind="sine", a=0.005, r=0.6):
    return sum(tone(fr, dur, kind, a=a, r=r) for fr in freqs) / len(freqs)


def noise_hit(dur, r=0.08):
    n = int(SR * dur)
    return rng.standard_normal(n) * env(n, 0.001, r)


def boom(dur=1.2, f0=90):
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = f0 * np.exp(-t * 3) + 35
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * env(n, 0.002, 0.45)


def kick():
    n = int(SR * 0.35)
    t = np.arange(n) / SR
    freq = 110 * np.exp(-t * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * env(n, 0.001, 0.12)


def sweep(dur, f0, f1, noise=0.25):
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = f0 + (f1 - f0) * (t / dur) ** 2
    return (np.sin(2 * np.pi * np.cumsum(freq) / SR) * 0.4 + rng.standard_normal(n) * noise) * (t / dur) ** 1.5


def pop():
    n = int(SR * 0.09)
    t = np.arange(n) / SR
    freq = 900 * np.exp(-t * 30) + 500
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * env(n, 0.001, 0.03)


class Track:
    def __init__(self, frames):
        self.x = np.zeros(int(SR * frames / FPS))

    def add(self, start_s, sig, gain=1.0):
        i = int(start_s * SR)
        n = min(len(sig), len(self.x) - i)
        if n > 0:
            self.x[i:i + n] += sig[:n] * gain

    def save(self, path, peak=0.89, fade=0.5):
        m = self.x.copy()
        nf = int(SR * fade)
        m[-nf:] *= np.linspace(1, 0, nf)
        m = np.tanh(m * 1.2)
        m /= np.max(np.abs(m)) + 1e-9
        m *= peak
        pcm = (m * 32767).astype(np.int16)
        with wave.open(path, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
        print("wrote", path, round(len(m) / SR, 2), "s")


def progression(tr, start, end, chords, bar_s, kind="keys", gain=0.3, r=1.0):
    t = start
    i = 0
    while t < end:
        tr.add(t, chord([note(n) for n in chords[i % len(chords)]], bar_s * 1.2, kind, a=0.02, r=r), gain)
        t += bar_s
        i += 1


def drums(tr, start, end, bpm, gain=0.35):
    beat = 60 / bpm
    t = start
    k = 0
    while t < end:
        if k % 4 in (0, 2):
            tr.add(t, kick(), gain)
        tr.add(t + beat / 2, noise_hit(0.05, 0.015), gain * 0.18)
        if k % 4 in (1, 3):
            tr.add(t, noise_hit(0.18, 0.05), gain * 0.25)
        t += beat
        k += 1


os.makedirs("public/audio", exist_ok=True)

# ---------------- v1: Breaking News (570 frames) ----------------
END = 570
sfx = Track(END)
sfx.add(0.0, boom(1.4), 0.9)
sfx.add(0.0, noise_hit(0.5, 0.15), 0.35)
# news stabs in E major to sit with the jingle (jingle 1 is in E major)
for s, ch in [(0.00, ["E3", "B3", "E4", "G#4"]), (0.33, ["E3", "B3", "E4", "G#4"]), (0.55, ["A3", "E4", "A4", "C#5"]), (1.0, ["B3", "F#4", "B4", "D#5"])]:
    sfx.add(s, chord([note(n) for n in ch], 0.9, "saw", r=0.35 if s < 1 else 0.8), 0.35)
for k in range(6):
    sfx.add(f(165) + k * 0.06, noise_hit(0.05, 0.02), 0.25)
sfx.add(f(183), sweep(f(213) - f(183), 200, 1600), 0.35)
sfx.add(f(213), boom(1.6, 120), 1.0)
sfx.add(f(213), noise_hit(0.8, 0.25), 0.3)
sfx.add(f(255), sweep(0.4, 300, 1200, 0.1), 0.2)
sfx.add(f(317), tone(note("E5"), 0.8, "sine", r=0.4), 0.18)  # soft "concern" chime
for i, n in enumerate(["E6", "G#6", "B6", "E7"]):
    sfx.add(f(422) + i * 0.09, tone(note(n), 1.2, "sine", r=0.5), 0.12)
sfx.save("public/audio/sfx-v1.wav")

mus = Track(END)
for fr in range(60, 255, 8):  # news ticking
    mus.add(f(fr), tone(1760 if (fr // 8) % 4 == 0 else 1320, 0.05, r=0.02), 0.1)
for fr in range(60, 255, 30):
    mus.add(f(fr), tone(note("D2"), 1.2, "saw", r=0.5), 0.2)
progression(mus, f(255), f(END), [["C3", "E4", "G4"], ["A2", "E4", "A4"], ["F2", "C4", "A4"], ["G2", "D4", "B4"]], 1.6)
mel = ["E5", "G5", "A5", "G5", "E5", "D5", "C5", "D5"]
for i, n in enumerate(mel * 2):
    mus.add(f(260) + i * 0.4, tone(note(n), 0.5, "keys", r=0.25), 0.14)
mus.save("public/audio/music-v1.wav", peak=0.8)

# ---------------- v2: Concerned Friend (522 frames) ----------------
END = 522
sfx = Track(END)
for fr in [28, 68, 112, 174, 220, 278]:
    sfx.add(f(fr), pop(), 0.5)
sfx.add(f(112), tone(note("A5"), 0.4, r=0.2), 0.12)  # the big question gets a little sparkle
sfx.add(f(320), pop(), 0.45)
sfx.add(f(320) + 0.06, tone(note("D6"), 0.3, r=0.15), 0.12)
for i, n in enumerate(["D6", "F#6", "A6", "D7"]):  # D major, like jingle 2
    sfx.add(f(374) + i * 0.09, tone(note(n), 1.2, r=0.5), 0.1)
sfx.save("public/audio/sfx-v2.wav")

mus = Track(END)
bar = 60 / 84 * 4
progression(mus, 0.0, f(END), [["F3", "A3", "C4", "E4"], ["E3", "G3", "B3", "D4"], ["D3", "F3", "A3", "C4"], ["C3", "E3", "G3", "B3"]], bar, r=1.4)
for i in range(int(f(END) / bar) + 1):
    mus.add(i * bar, tone(note(["F2", "E2", "D2", "C2"][i % 4]), bar, "sine", a=0.02, r=1.2), 0.35)
drums(mus, bar, f(END), 84, 0.3)
mus.save("public/audio/music-v2.wav", peak=0.8)

# ---------------- v3: Eye Chart (522 frames) ----------------
END = 522
sfx = Track(END)
for i, fr in enumerate([20, 44, 68, 92, 116]):
    sfx.add(f(fr), tone(note(["E5", "F#5", "G#5", "B5", "C#6"][i]), 0.5, "keys", r=0.2), 0.3)
    sfx.add(f(fr), noise_hit(0.04, 0.01), 0.08)
sfx.add(f(146), tone(note("E6"), 0.3, r=0.12), 0.15)
sfx.add(f(170), sweep(f(222) - f(170), 120, 700, 0.15), 0.35)
sfx.add(f(254), noise_hit(0.03, 0.006), 0.4)  # glasses "click"
sfx.add(f(256), chord([note("E5"), note("G#5"), note("B5")], 1.0, r=0.5), 0.2)
sfx.add(f(268), sweep(0.4, 300, 1200, 0.1), 0.2)
for i, n in enumerate(["E6", "G#6", "B6", "E7"]):  # E major, like jingle 1
    sfx.add(f(374) + i * 0.09, tone(note(n), 1.2, r=0.5), 0.1)
sfx.save("public/audio/sfx-v3.wav")

mus = Track(END)
arp = ["A3", "C4", "E4", "A4", "E4", "C4"]
for i in range(int(f(268) / 0.25)):  # curious arpeggio while the test runs
    mus.add(i * 0.25, tone(note(arp[i % len(arp)]), 0.4, "keys", r=0.18), 0.12)
progression(mus, 0.0, f(268), [["A2", "E3", "A3"], ["F2", "C3", "A3"]], 2.0, "sine", 0.22, 1.2)
progression(mus, f(268), f(END), [["C3", "E3", "G3", "C4"], ["G2", "D3", "G3", "B3"], ["A2", "E3", "A3", "C4"], ["F2", "C3", "F3", "A3"]], 1.6, "keys", 0.3, 1.2)
mus.save("public/audio/music-v3.wav", peak=0.8)

# ---------------- v4: The Boys group chat (546 frames, jingle 2 in D major) ----------------
END = 546
sfx = Track(END)
for fr in [22, 60, 98, 130, 174, 226, 270, 306, 360]:
    sfx.add(f(fr), pop(), 0.5)
sfx.add(f(174), tone(note("A5"), 0.4, r=0.2), 0.12)
sfx.add(f(360) + 0.06, tone(note("D6"), 0.3, r=0.15), 0.12)
for i, n in enumerate(["D6", "F#6", "A6", "D7"]):
    sfx.add(f(398) + i * 0.09, tone(note(n), 1.2, r=0.5), 0.1)
sfx.save("public/audio/sfx-v4.wav")

mus = Track(END)
bar = 60 / 90 * 4
progression(mus, 0.0, f(END), [["D3", "F#3", "A3", "C#4"], ["B2", "D3", "F#3", "A3"], ["G2", "B2", "D3", "F#3"], ["A2", "C#3", "E3", "G3"]], bar, r=1.4)
drums(mus, 0.0, f(END), 90, 0.32)
mus.save("public/audio/music-v4.wav", peak=0.8)
