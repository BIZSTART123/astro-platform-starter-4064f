"""Synthesize the soundtrack: news sting, tension pulse, glitch, reveal hit, warm outro.

No samples are used. Timings match the frame timeline in src/BreakingNews.tsx (30 fps).
Run: python3 scripts/make_audio.py  -> public/audio/breaking-news.wav
"""
import os
import wave
import numpy as np

SR = 48000
FPS = 30
DUR = 510 / FPS
t_all = np.arange(int(SR * DUR)) / SR
mix = np.zeros_like(t_all)
rng = np.random.default_rng(7)


def f(frame):
    return frame / FPS


def add(start_s, sig, gain=1.0):
    i = int(start_s * SR)
    n = min(len(sig), len(mix) - i)
    if n > 0:
        mix[i:i + n] += sig[:n] * gain


def env(n, a=0.005, r=0.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / r)
    return e


def tone(freq, dur, kind="saw", a=0.005, r=0.4):
    n = int(SR * dur)
    t = np.arange(n) / SR
    if kind == "saw":
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 9))
    elif kind == "square":
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 12, 2))
    else:
        s = np.sin(2 * np.pi * freq * t)
    return s * env(n, a, r)


def chord(freqs, dur, kind="saw", r=0.6):
    return sum(tone(fr, dur, kind, r=r) for fr in freqs) / len(freqs)


def noise_hit(dur, r=0.08):
    n = int(SR * dur)
    return rng.standard_normal(n) * env(n, 0.001, r)


def boom(dur=1.2, f0=90):
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = f0 * np.exp(-t * 3) + 35
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * env(n, 0.002, 0.45)


def riser(dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    freq = 200 + 1400 * (t / dur) ** 2
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return (np.sin(phase) * 0.4 + rng.standard_normal(n) * 0.25) * (t / dur) ** 1.5


# 1. News sting: big boom + brassy stabs (D minor-ish), 0-2s
add(0.0, boom(1.4), 0.9)
add(0.0, noise_hit(0.5, 0.15), 0.35)
stabs = [(0.00, [146.8, 220.0, 293.7, 349.2]), (0.33, [146.8, 220.0, 293.7, 349.2]),
         (0.55, [174.6, 261.6, 349.2, 440.0]), (1.0, [196.0, 293.7, 392.0, 466.2])]
for s, ch in stabs:
    add(s, chord(ch, 0.9, "saw", r=0.35 if s < 1 else 0.8), 0.35)

# 2. Report: ticking news pulse + low drone, frames 60-165
for i, fr in enumerate(range(60, 165, 8)):
    add(f(fr), tone(1760 if i % 4 == 0 else 1320, 0.05, "sine", r=0.02), 0.12)
    add(f(fr), noise_hit(0.04, 0.01), 0.05)
for fr in range(60, 165, 30):
    add(f(fr), tone(73.4, 1.2, "saw", r=0.5), 0.18)

# 3. Twist: glitch bursts at 165, riser into the YOU hit at 213
for k in range(6):
    add(f(165) + k * 0.06, noise_hit(0.05, 0.02) * np.sign(np.sin(np.arange(int(SR * 0.05)) * 0.3)), 0.25)
add(f(183), riser(f(213) - f(183)), 0.35)
add(f(213), boom(1.6, 120), 1.0)
add(f(213), noise_hit(0.8, 0.25), 0.3)
add(f(213), chord([110, 164.8, 220, 277.2, 329.6], 1.4, "saw", r=0.7), 0.4)

# 4. Ask: playful pluck melody (C major), frames 255-360
mel = [523.3, 659.3, 784.0, 659.3, 880.0, 784.0, 659.3, 587.3]
for i, fr in enumerate(mel):
    add(f(258) + i * 0.22, tone(fr, 0.35, "square", r=0.12), 0.12)
for ch, s in [([130.8, 196.0, 261.6], 258), ([174.6, 220.0, 261.6], 290), ([196.0, 246.9, 293.7], 322)]:
    add(f(s), chord(ch, 1.2, "sine", r=0.7), 0.22)

# 5. CTA: warm resolve + chime, frames 360-465
add(f(360), chord([130.8, 196.0, 261.6, 329.6, 392.0], 4.8, "sine", r=2.2), 0.3)
for i, fr in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
    add(f(362) + i * 0.09, tone(fr, 1.2, "sine", r=0.5), 0.1)

# fade out + normalize + soft clip
fade = np.ones_like(mix)
n_f = int(SR * 0.6)
fade[-n_f:] = np.linspace(1, 0, n_f)
mix *= fade
mix = np.tanh(mix * 1.2)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89

os.makedirs("public/audio", exist_ok=True)
pcm = (mix * 32767).astype(np.int16)
stereo = np.column_stack([pcm, pcm]).ravel()
with wave.open("public/audio/breaking-news.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("wrote public/audio/breaking-news.wav", round(DUR, 2), "s")
