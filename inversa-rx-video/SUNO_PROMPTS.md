# Suno prompts: Inversa Rx Optical WhatsApp videos

Each video is about 17–19 seconds long, so you only need a short piece of each song.
In Suno, turn on **Instrumental** for the background beds (1–3). Paste the **Style** text into
"Style of Music" and use the **Title** as the song title.

---

## 1. Breaking News (V1-BreakingNews)
**Title:** Breaking News, You're Missing

**Style:**
```
Instrumental, TV news theme into warm soul, dramatic orchestral news intro with timpani hits and brass stabs, urgent ticking synth pulse, then a sudden switch to warm Rhodes and soft gospel organ, gentle hopeful groove, 92 BPM, clean modern mix, no vocals
```
Why: the first 8 seconds are the fake "news" (drama and urgency). The switch to a warm sound lands where the video says *"Real talk… I'm concerned about you."*

---

## 2. Concerned Friend (V2-ConcernedFriend)
**Title:** Checking On You

**Style:**
```
Instrumental, warm lo-fi R&B, soft Rhodes chords, mellow bass, gentle boom-bap drums, light vinyl crackle, caring and friendly mood, like a text from someone who misses you, 84 BPM, intimate, uplifting at the end, no vocals
```

---

## 3. Eye Chart (V3-EyeChart)
**Title:** Look Closer

**Style:**
```
Instrumental, curious minimal pizzicato strings and soft marimba, playful tension that slowly builds, then opens into a bright, warm, hopeful piano and pad resolution, cinematic but gentle, 96 BPM, clean, no vocals
```

---

## Bonus: a sung jingle (if you want a voice ad)
Turn **Instrumental off**. Paste the style, then the lyrics into "Lyrics".

**Title:** Better Vision, Better Life

**Style:**
```
Upbeat neo-soul R&B jingle, warm female lead vocal, gospel-tinged backing harmonies, Rhodes and finger snaps, Bronx neighborhood feel, catchy radio ad, 96 BPM, short
```

**Lyrics:**
```
[Intro]
(Hey… when's the last time?)

[Verse]
When's the last time you really checked your eyes?
Squinting at your phone, baby, that ain't right
We've been missing you on White Plains Road
Come on in, let us take care of you, you know

[Chorus]
Inversa Rx… Better vision, better life
Inversa Rx… we'll get your eyes right
Bring your benefit card, come on through
Inversa Optical, we're concerned about you

[Outro]
Better vision… better life
```
These lyrics don't name a price, so the song stays correct when your offers change.

---

## Putting a Suno track into a video
1. Download the song from Suno as MP3.
2. Put it in `inversa-rx-video/public/audio/`, e.g. `suno-v1.mp3`.
3. Set the `music` prop to that file name (in Remotion Studio, or in `src/brand.ts` for all three).
   - `musicStartSeconds`: skip the song's intro, e.g. `12` to start right at the hook.
   - `musicVolume`: 0.55 by default; the sound effects stay on top.
4. Re-render, e.g. `npx remotion render V2-ConcernedFriend out/v2.mp4`.

Or just send me the MP3 and I'll drop it in and re-render.
