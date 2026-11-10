"""Synthesize the soundtrack for every episode.

No samples are used. Organ, worship pad, drums, tambourine, coin clink,
applause, crickets and the rest are generated here, timed to the frames
in src/episodes. Run:  python3 scripts/make_audio.py  [episode ...]
Writes public/audio/<episode>.wav
"""
import sys
import wave
import numpy as np

SR = 48000
FPS = 30
TITLE, CARD, END = 90, 50, 120


def note(name):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    semis = names[name[0]] + (1 if "#" in name else 0) - (1 if "b" in name[1:-1] else 0) + (int(name[-1]) - 4) * 12
    return 440.0 * 2 ** (semis / 12)


C_MAJ = [note("C3"), note("E3"), note("G3"), note("C4")]
F_MAJ = [note("F2"), note("A3"), note("C4"), note("F4")]
G_MAJ = [note("G2"), note("B3"), note("D4"), note("G4")]
A_MIN = [note("A2"), note("E3"), note("A3"), note("C4")]
HYMN = [C_MAJ, F_MAJ, C_MAJ, G_MAJ, C_MAJ]
WORSHIP = [A_MIN, F_MAJ, C_MAJ, G_MAJ]


def lowpass(x, cutoff):
    # One-pole low-pass, vectorised in blocks via exponential filter recurrence.
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def env(n, a=0.02, r=0.2):
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


class Track:
    def __init__(self, then_frames, now_frames, seed=3):
        self.then0 = TITLE + CARD
        self.now0 = self.then0 + then_frames + CARD
        self.end0 = self.now0 + now_frames
        self.total = self.end0 + END
        self.out = np.zeros(int(self.total / FPS * SR) + SR // 2)
        self.rng = np.random.default_rng(seed)

    # timing
    def t(self, frame):
        return frame / FPS

    def add(self, sig, start_s, gain=1.0):
        i = max(0, int(start_s * SR))
        j = min(len(self.out), i + len(sig))
        if j > i:
            self.out[i:j] += sig[: j - i] * gain

    # instruments
    def organ(self, freqs, dur, a=0.05, r=0.3, bright=1.0):
        t = np.arange(int(dur * SR)) / SR
        vib = 1 + 0.003 * np.sin(2 * np.pi * 6 * t)
        s = np.zeros_like(t)
        for f in freqs:
            for h, w in [(0.5, 0.5), (1, 1.0), (2, 0.7 * bright), (3, 0.35 * bright), (4, 0.25 * bright), (6, 0.12 * bright)]:
                s += w * np.sin(2 * np.pi * f * h * vib * t)
        return s / (len(freqs) * 3) * env(len(t), a, r)

    def pad(self, freqs, dur, a=0.6, r=0.8):
        t = np.arange(int(dur * SR)) / SR
        s = np.zeros_like(t)
        for f in freqs:
            for d in (-6, 0, 6):
                ph = f * 2 ** (d / 1200) * t
                s += 2 * (ph - np.floor(ph + 0.5))
        return lowpass(s / (len(freqs) * 3), 900) * env(len(t), a, r)

    def piano(self, f, dur=1.2):
        t = np.arange(int(dur * SR)) / SR
        s = sum(w * np.sin(2 * np.pi * f * h * t) for h, w in [(1, 1), (2, 0.4), (3, 0.15)])
        return s * np.exp(-t * 3) * env(len(t), 0.005, 0.1) * 0.5

    def kick(self):
        t = np.arange(int(0.35 * SR)) / SR
        f = 50 + 70 * np.exp(-t * 25)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)

    def noise_hit(self, dur, hp, decay):
        n = int(dur * SR)
        x = self.rng.standard_normal(n)
        x = x - lowpass(x, hp)
        return x * np.exp(-np.arange(n) / SR * decay)

    def snare(self):
        t = np.arange(int(0.25 * SR)) / SR
        return self.noise_hit(0.25, 1500, 18) * 0.6 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.5

    def hat(self):
        return self.noise_hit(0.06, 7000, 60) * 0.35

    def clap(self):
        s = np.zeros(int(0.2 * SR))
        for k, g in [(0, 1), (0.012, 0.8), (0.024, 0.6)]:
            h = self.noise_hit(0.18, 1200, 30) * g
            i = int(k * SR)
            m = min(len(h), len(s) - i)
            s[i:i + m] += h[:m]
        return s * 0.5

    def tamb_hit(self):
        n = int(0.12 * SR)
        t = np.arange(n) / SR
        jingle = sum(np.sin(2 * np.pi * f * t + self.rng.uniform(0, 6)) for f in self.rng.uniform(6000, 9500, 6))
        return (jingle * 0.15 + self.noise_hit(0.12, 4000, 0) * 0.5) * np.exp(-t * 30)

    def tambourine(self, start, beats, bpm=150, gain=0.35):
        for k in range(beats):
            self.add(self.tamb_hit(), start + k * 60 / bpm, gain if k % 2 == 0 else gain * 0.6)

    def clink(self):
        t = np.arange(int(0.5 * SR)) / SR
        return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(2380, 9), (3910, 12), (5630, 16), (7200, 20)]) / 3

    def whoosh(self, dur=0.45):
        n = int(dur * SR)
        return lowpass(self.rng.standard_normal(n), 2500) * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.9

    def rustle(self):
        n = int(0.35 * SR)
        x = self.noise_hit(0.35, 1500, 0)
        return x * (np.sin(np.linspace(0, 18 * np.pi, n)) > 0.2) * env(n, 0.01, 0.1) * 0.35

    def ding(self):
        t = np.arange(int(1.2 * SR)) / SR
        return (np.sin(2 * np.pi * 1318.5 * t) + 0.4 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 4)

    def crickets(self, start, dur):
        k = 0.0
        while k < dur:
            n = int(0.05 * SR)
            t = np.arange(n) / SR
            chirp = np.sin(2 * np.pi * 4300 * t) * np.sin(np.pi * t / 0.05) ** 2
            for r in range(3):
                self.add(chirp, start + k + r * 0.07, 0.18)
            k += 0.8

    def applause(self, start, dur, density=30, gain=0.25):
        for _ in range(int(dur * density)):
            self.add(self.clap(), start + self.rng.uniform(0, dur), gain * self.rng.uniform(0.4, 1))

    def scratch(self):
        n = int(0.4 * SR)
        x = self.rng.standard_normal(n)
        f = np.linspace(3000, 200, n)
        return lowpass(x, 1500) * np.sin(np.cumsum(f) / SR * 2 * np.pi) * env(n, 0.01, 0.1)

    def rain(self, start, dur, gain=0.08):
        n = int(dur * SR)
        x = self.rng.standard_normal(n)
        self.add((x - lowpass(x, 3000)) * env(n, 0.5, 0.5), start, gain)

    def cheer(self):
        s = np.zeros(int(1.0 * SR))
        for i, f in enumerate([note("C5"), note("E5"), note("G5"), note("C6")]):
            p = self.piano(f, 0.8)
            j = int(i * 0.07 * SR)
            s[j:j + len(p)] += p[: len(s) - j]
        return s

    def groove(self, start, dur, bpm=120, gain=1.0):
        step = 60 / bpm / 2
        k = 0
        while k * step < dur:
            t0 = start + k * step
            if k % 4 == 0:
                self.add(self.kick(), t0, 0.7 * gain)
            if k % 4 == 2:
                self.add(self.snare(), t0, 0.5 * gain)
            self.add(self.hat(), t0, 0.5 * gain)
            self.add(self.tamb_hit(), t0, 0.22 * gain)
            k += 1

    def pulse(self, start, end, every=0.6, gain=0.45):
        b = start
        while b < end - 0.2:
            self.add(self.kick(), b, gain)
            b += every

    def chords(self, kind, prog, start, end, length=3.0, gain=0.32):
        for i, ch in enumerate(prog * 4):
            s = start + i * length
            if s >= end:
                break
            d = min(length + 0.3, end - s + 0.05)
            sig = self.organ(ch, d, a=0.25, r=0.5, bright=0.7) if kind == "organ" else self.pad(ch, d, a=0.5, r=0.15)
            self.add(sig, s, gain)

    # shared title, cards and end
    def frame(self):
        self.add(self.organ(C_MAJ, 1.1, a=0.01, r=0.4), 0.05, 0.9)
        self.add(self.pad(A_MIN, 2.0, a=0.05, r=0.6), 0.75, 0.6)
        self.add(self.whoosh(), 2.75, 0.5)
        self.tambourine(self.t(TITLE) + 0.1, 6)
        self.add(self.whoosh(), self.t(self.now0 - CARD) - 0.1, 0.6)
        self.add(self.whoosh(), self.t(self.end0) - 0.15, 0.5)
        self.add(self.organ(C_MAJ, 3.6, a=0.1, r=1.5), self.t(self.end0), 0.45)
        self.add(self.pad(C_MAJ, 3.6, a=0.3, r=1.5), self.t(self.end0), 0.35)

    def then_at(self, f):
        return self.t(self.then0 + f)

    def now_at(self, f):
        return self.t(self.now0 + f)

    def write(self, name):
        out = self.out / np.max(np.abs(self.out)) * 0.89
        with wave.open(f"public/audio/{name}.wav", "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((out * 32767).astype(np.int16).tobytes())
        print(f"wrote public/audio/{name}.wav", round(len(out) / SR, 1), "s")


def devotion():
    tr = Track(450, 450)
    tr.frame()
    # Then: full praise groove, organ on top.
    tr.groove(tr.then_at(0), 15.0, bpm=128)
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(450), length=1.875, gain=0.28)
    # Now: soft pad and pulse, then Mother Brown's tambourine, then the band stops.
    stop = tr.now_at(338)
    tr.chords("pad", WORSHIP, tr.now_at(0), stop, gain=0.5)
    tr.pulse(tr.now_at(0), stop)
    for k in range(int((stop - tr.now_at(232)) / 0.235)):
        tr.add(tr.tamb_hit(), tr.now_at(232) + k * 0.235 + (0.06 if k % 3 == 0 else 0), 0.55)
    tr.add(tr.scratch(), stop - 0.05, 0.6)
    return tr


def testimony():
    tr = Track(450, 450)
    tr.frame()
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(450), length=3.0, gain=0.22)
    for k in range(0, 8):  # clock ticks while he greets everybody
        tr.add(tr.noise_hit(0.03, 3000, 80), tr.then_at(125) + k * 0.4, 0.25)
    tr.add(tr.organ(C_MAJ, 1.6, a=0.01, r=0.6), tr.then_at(325), 0.6)
    tr.tambourine(tr.then_at(340), 10)
    # Now: soft piano under the video, polite applause, the greeting, the hard stop.
    for i, f in enumerate([note("A4"), note("E5"), note("C5"), note("G4"), note("F4"), note("C5"), note("A4"), note("E4")]):
        tr.add(tr.piano(f, 1.5), tr.now_at(5) + i * 0.45, 0.6)
    tr.applause(tr.now_at(135), 2.0, density=18)
    tr.add(tr.organ(C_MAJ, 2.4, a=0.02, r=1.0), tr.now_at(232), 0.55)
    tr.add(tr.scratch(), tr.now_at(338), 0.5)
    return tr


def offering():
    tr = Track(450, 450)
    tr.frame()
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(450), length=3.0, gain=0.32)
    tr.add(tr.clink(), tr.then_at(222), 0.7)
    tr.add(tr.clink(), tr.then_at(226), 0.35)
    tr.add(tr.organ([note("C2"), note("F#2")], 0.7, a=0.01, r=0.3), tr.then_at(236), 0.7)
    tr.add(tr.rustle(), tr.then_at(348), 0.9)
    tr.add(tr.organ([note("C4"), note("E4"), note("G4")], 1.0, a=0.02, r=0.5), tr.then_at(386), 0.5)
    stinger = tr.now_at(322)
    tr.chords("pad", WORSHIP, tr.now_at(0), stinger, gain=0.55)
    tr.pulse(tr.now_at(0), stinger)
    tr.add(tr.ding(), tr.now_at(230), 0.45)
    tr.add(tr.organ(C_MAJ + [note("C5")], 2.6, a=0.005, r=1.2, bright=1.2), stinger, 0.85)
    tr.tambourine(stinger + 1.4, 4)
    return tr


def spirit():
    tr = Track(450, 480)
    tr.frame()
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(115), length=1.9, gain=0.3)
    tr.groove(tr.then_at(115), (268 - 115) / FPS, bpm=150)
    tr.chords("organ", [C_MAJ, F_MAJ], tr.then_at(115), tr.then_at(268), length=0.8, gain=0.3)
    tr.add(tr.whoosh(0.3), tr.then_at(158), 0.5)
    tr.add(tr.whoosh(0.4), tr.then_at(220), 0.5)
    tr.chords("organ", [C_MAJ], tr.then_at(270), tr.then_at(450), length=6.0, gain=0.25)
    # Now: pad, crickets, then she goes, then the quiet room.
    tr.chords("pad", WORSHIP, tr.now_at(0), tr.now_at(110), gain=0.5)
    tr.crickets(tr.now_at(115), (210 - 115) / FPS)
    tr.groove(tr.now_at(228), (330 - 228) / FPS, bpm=150, gain=0.8)
    tr.add(tr.scratch(), tr.now_at(333), 0.6)
    tr.add(tr.organ([note("C2"), note("F#2")], 0.9, a=0.01, r=0.4), tr.now_at(415), 0.7)
    return tr


def pickney():
    tr = Track(450, 450)
    tr.frame()
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(200), length=3.0, gain=0.25)
    for k in range(10):  # feet kicking the pew
        tr.add(tr.kick(), tr.then_at(110) + k * 0.3, 0.25)
    tr.add(tr.whoosh(0.25), tr.then_at(198), 0.6)
    tr.add(tr.organ([note("C2"), note("F#2"), note("C3")], 1.6, a=0.01, r=0.8), tr.then_at(214), 0.7)
    tr.add(tr.whoosh(0.25), tr.then_at(298), 0.6)
    tr.chords("organ", [C_MAJ], tr.then_at(320), tr.then_at(450), length=5, gain=0.2)
    # Now: bouncy kids' music, cheer, then silence and the organ.
    for i in range(int(7 / 0.25)):
        f = [note("C5"), note("E5"), note("G5"), note("E5")][i % 4]
        tr.add(tr.piano(f, 0.4), tr.now_at(0) + i * 0.25, 0.35)
    tr.pulse(tr.now_at(0), tr.now_at(214), every=0.5, gain=0.3)
    tr.add(tr.cheer(), tr.now_at(60), 0.6)
    tr.add(tr.organ([note("C2"), note("F#2"), note("C3")], 1.6, a=0.01, r=0.8), tr.now_at(232), 0.7)
    tr.add(tr.scratch(), tr.now_at(298), 0.5)
    return tr


def afterchurch():
    tr = Track(450, 450)
    tr.frame()
    # Then: easy afternoon, organ hymn in the distance and a tambourine.
    tr.chords("organ", HYMN, tr.then_at(0), tr.then_at(450), length=3.0, gain=0.2)
    tr.tambourine(tr.then_at(10), 30, bpm=110, gain=0.18)
    # Now: rain, cool pad, register beep, then the pot arrives.
    tr.rain(tr.now_at(0), 15.0)
    tr.chords("pad", WORSHIP, tr.now_at(0), tr.now_at(245), gain=0.4)
    tr.add(tr.ding(), tr.now_at(15), 0.25)
    tr.add(tr.organ(C_MAJ + [note("C5")], 2.6, a=0.005, r=1.2, bright=1.2), tr.now_at(246), 0.8)
    tr.tambourine(tr.now_at(345), 16, bpm=120)
    return tr


EPISODES = {"devotion": devotion, "testimony": testimony, "offering": offering,
            "spirit": spirit, "pickney": pickney, "afterchurch": afterchurch}

if __name__ == "__main__":
    for name in sys.argv[1:] or EPISODES:
        EPISODES[name]().write(name)
