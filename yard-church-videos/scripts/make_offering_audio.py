"""Synthesize the soundtrack for Episode 3 (The Offering).

No samples are used: organ, pad, coin clink, whoosh, tambourine and ding
are all generated here, timed to the frames in src/episodes/offering.
Run: python3 scripts/make_offering_audio.py
"""
import wave
import numpy as np

SR = 48000
FPS = 30
TOTAL_FRAMES = 90 + 50 + 450 + 50 + 450 + 120
N = int(TOTAL_FRAMES / FPS * SR) + SR // 2
out = np.zeros(N)
rng = np.random.default_rng(3)

# Global start frame of each part (matches OFFERING_TIMELINE).
THEN0 = 140
NOW0 = 640
END0 = 1090


def t_of(frame):
    return frame / FPS


def note(name):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    letter, octave = name[0], int(name[-1])
    semis = names[letter] + (1 if "#" in name else 0) + (octave - 4) * 12
    return 440.0 * 2 ** (semis / 12)


def add(sig, start_s, gain=1.0):
    i = int(start_s * SR)
    j = min(N, i + len(sig))
    out[i:j] += sig[: j - i] * gain


def env(n, a=0.02, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def organ(freqs, dur, a=0.05, r=0.3, bright=1.0):
    t = np.arange(int(dur * SR)) / SR
    vib = 1 + 0.003 * np.sin(2 * np.pi * 6 * t)
    s = np.zeros_like(t)
    for f in freqs:
        for h, w in [(0.5, 0.5), (1, 1.0), (2, 0.7 * bright), (3, 0.35 * bright), (4, 0.25 * bright), (6, 0.12 * bright)]:
            s += w * np.sin(2 * np.pi * f * h * vib * t)
    s /= len(freqs) * 3
    return s * env(len(t), a, r)


def lowpass(x, cutoff):
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y


def pad(freqs, dur, a=0.6, r=0.8):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        for d in (-0.6, 0, 0.6):
            ph = (f * 2 ** (d / 1200 * 10)) * t
            s += 2 * (ph - np.floor(ph + 0.5))
    s /= len(freqs) * 3
    s = lowpass(s, 900)
    return s * env(len(t), a, r)


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    f = 50 + 70 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def clink():
    t = np.arange(int(0.5 * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(2380, 9), (3910, 12), (5630, 16), (7200, 20)])
    return s / 3


def whoosh(dur=0.45):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    y = lowpass(x, 2500)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return y * shape * 0.9


def rustle():
    n = int(0.35 * SR)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 1500)
    bursts = (np.sin(np.linspace(0, 18 * np.pi, n)) > 0.2).astype(float)
    return x * bursts * env(n, 0.01, 0.1) * 0.35


def tambourine(start, beats, bpm=150):
    for k in range(beats):
        n = int(0.12 * SR)
        t = np.arange(n) / SR
        jingle = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in rng.uniform(6000, 9500, 6))
        noise = rng.standard_normal(n)
        noise = noise - lowpass(noise, 4000)
        s = (jingle * 0.15 + noise * 0.5) * np.exp(-t * 30)
        add(s, start + k * 60 / bpm, 0.35 if k % 2 == 0 else 0.22)


def ding():
    t = np.arange(int(1.2 * SR)) / SR
    return (np.sin(2 * np.pi * 1318.5 * t) + 0.4 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 4)


C_MAJ = [note("C3"), note("E3"), note("G3"), note("C4")]
F_MAJ = [note("F2"), note("A3"), note("C4"), note("F4")]
G_MAJ = [note("G2"), note("B3"), note("D4"), note("G4")]
A_MIN = [note("A2"), note("E3"), note("A3"), note("C4")]

# Title: organ hit for Yard Church, pad for Foreign Church.
add(organ(C_MAJ, 1.1, a=0.01, r=0.4), 0.05, 0.9)
add(pad(A_MIN, 2.0, a=0.05, r=0.6), 0.75, 0.6)
add(whoosh(), 2.75, 0.5)

# Then card: tambourine.
tambourine(t_of(90) + 0.1, 6)

# Then scene: hymn on the organ.
t0 = t_of(THEN0)
for i, ch in enumerate([C_MAJ, F_MAJ, C_MAJ, G_MAJ, C_MAJ]):
    add(organ(ch, 3.2, a=0.25, r=0.5, bright=0.7), t0 + i * 3.0, 0.32)
add(clink(), t_of(THEN0 + 222), 0.7)
add(clink(), t_of(THEN0 + 226), 0.35)
add(organ([note("C2"), note("F#2")], 0.7, a=0.01, r=0.3), t_of(THEN0 + 236), 0.7)  # suspicious "dun"
add(rustle(), t_of(THEN0 + 348), 0.9)
add(organ([note("C4"), note("E4"), note("G4")], 1.0, a=0.02, r=0.5), t_of(THEN0 + 386), 0.5)  # "Praise Him"

# Now card.
add(whoosh(), t_of(590) - 0.1, 0.6)

# Now scene: worship pad and a soft pulse, cut short when Mother Brown appears.
n0 = t_of(NOW0)
stinger = t_of(NOW0 + 322)
for i, ch in enumerate([A_MIN, F_MAJ, C_MAJ, G_MAJ]):
    start = n0 + i * 3.0
    if start < stinger:
        add(pad(ch, min(3.4, stinger - start + 0.05), a=0.5, r=0.15), start, 0.55)
b = n0
while b < stinger - 0.2:
    add(kick(), b, 0.45)
    b += 0.6
add(ding(), t_of(NOW0 + 230), 0.45)
# The old church is back: organ sforzando.
add(organ(C_MAJ + [note("C5")], 2.6, a=0.005, r=1.2, bright=1.2), stinger, 0.85)
tambourine(stinger + 1.4, 4)

# End card: both worlds together.
add(whoosh(), t_of(END0) - 0.15, 0.5)
add(organ(C_MAJ, 3.6, a=0.1, r=1.5), t_of(END0), 0.45)
add(pad(C_MAJ, 3.6, a=0.3, r=1.5), t_of(END0), 0.35)

peak = np.max(np.abs(out))
out = out / peak * 0.89
pcm = (out * 32767).astype(np.int16)
with wave.open("public/audio/offering.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote public/audio/offering.wav", round(len(pcm) / SR, 1), "s")
