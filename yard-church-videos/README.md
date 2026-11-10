# Yard Church vs Foreign Church: animated episodes

The episodes are drawn and animated in code with [Remotion](https://www.remotion.dev), which turns React components into MP4 video. Everything is made here: the characters, the churches, the captions and the soundtrack. No stock footage, photos or samples are used.

## What's here

| Path | What it is |
|---|---|
| `src/characters.tsx` | Mother Brown, Junior, the usher, Pastor Jordan, crowd silhouettes |
| `src/sets.tsx` | The yard church (louvre windows, hymn board, pews) and the modern auditorium |
| `src/ui.tsx` | Title card, Then / Now cards, captions, closing vote card |
| `src/episodes/offering/` | Episode 3, The Offering: the Then scene, the Now scene and the full timeline |
| `scripts/make_offering_audio.py` | Synthesizes the organ, worship pad, coin clink, tambourine and other sounds |
| `public/fonts/` | Fonts, stored locally so rendering works offline |

## Preview and edit

```sh
cd yard-church-videos
npm install
npm run dev
```

This opens Remotion Studio, where you can scrub through the episode frame by frame. Captions are in the scene files, for example `src/episodes/offering/ThenScene.tsx`. Change the `text` on a `<Caption>` and the preview updates.

## Render an episode

```sh
python3 scripts/make_offering_audio.py   # only if you changed the sound timing
npx remotion render Ep03-TheOffering ../yard-church/public/videos/ep03-the-offering.mp4 --codec=h264 --crf=23
```

The video is 1080 × 1920 (vertical, for TikTok, Reels and Shorts), 30 fps, about 40 seconds.

## Adding voices

The episodes use on-screen captions and music, with no spoken dialogue. To add voices, record each line, put the files in `public/audio/`, and add an `<Audio>` for each one at the frame its caption starts.
