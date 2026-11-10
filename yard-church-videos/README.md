# Yard Church vs Foreign Church: animated episodes

The episodes are drawn and animated in code with [Remotion](https://www.remotion.dev), which turns React components into MP4 video. Everything is made here: the characters, the churches, the captions and the soundtrack. No stock footage, photos or samples are used.

## What's here

| Path | What it is |
|---|---|
| `src/characters.tsx` | Mother Brown, Junior, the usher, Pastor Jordan, crowd silhouettes, and `Person` for everyone else (Sister Pearl, Brother Campbell, the band, volunteers, kids) |
| `src/sets.tsx` | The yard church, the churchyard, the modern auditorium, the kids' room and the lobby café |
| `src/props.tsx` | Collection plate, tambourine, drum kit, hymnal, clock, Dutch pot and more |
| `src/ui.tsx` | Title card, Then / Now cards, captions, closing vote card |
| `src/EpisodeShell.tsx` | The shape every episode shares: title, Then, Now, vote card, soundtrack |
| `src/episodes.tsx` | The list of all six episodes |
| `src/episodes/<name>/` | Each episode's Then and Now scenes |
| `scripts/make_audio.py` | Synthesizes each episode's soundtrack: organ, worship pad, drums, tambourine, applause, crickets and more |
| `public/fonts/` | Fonts, stored locally so rendering works offline |

## Preview and edit

```sh
cd yard-church-videos
npm install
npm run dev
```

This opens Remotion Studio, where you can scrub through the episode frame by frame. Captions are in the scene files, for example `src/episodes/devotion/Devotion.tsx`. Change the `text` on a `<Caption>` and the preview updates.

## Episodes

| # | Composition | Output file |
|---|---|---|
| 1 | `Ep01-Devotion` | `ep01-devotion.mp4` |
| 2 | `Ep02-TestimonyService` | `ep02-testimony-service.mp4` |
| 3 | `Ep03-TheOffering` | `ep03-the-offering.mp4` |
| 4 | `Ep04-GettingTheSpirit` | `ep04-getting-the-spirit.mp4` |
| 5 | `Ep05-PickneyBehaviour` | `ep05-pickney-behaviour.mp4` |
| 6 | `Ep06-AfterChurch` | `ep06-after-church.mp4` |

## Render an episode

```sh
python3 scripts/make_audio.py devotion   # only if you changed the sound timing; no name = all six
npx remotion render Ep01-Devotion ../yard-church/public/videos/ep01-devotion.mp4 --codec=h264 --crf=23
```

Each video is 1080 × 1920 (vertical, for TikTok, Reels and Shorts), 30 fps, about 40 seconds.

## Adding voices

The episodes use on-screen captions and music, with no spoken dialogue. To add voices, record each line, put the files in `public/audio/`, and add an `<Audio>` for each one at the frame its caption starts.
