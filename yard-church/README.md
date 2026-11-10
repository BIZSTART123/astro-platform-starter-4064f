# Yard Church vs Foreign Church

The website for the series. Each episode shows one part of Sunday service two ways: back home in Jamaica ("Then") and in the diaspora today ("Now").

Built with [Astro](https://astro.build). It is a plain static site: no database, no login, nothing to pay for beyond hosting.

## Run it on your computer

```sh
cd yard-church
npm install
npm run dev
```

Then open http://localhost:4321.

## Add your videos

Each episode is one file in `src/content/episodes/`. Open it and paste your links:

```yaml
thenVideo: 'https://www.tiktok.com/@yourname/video/1234567890'
nowVideo: 'https://youtube.com/shorts/abc123'
```

These links work:

| Link | Shows as |
|---|---|
| `youtube.com/watch?v=…` or `youtu.be/…` | Wide (16:9) YouTube player |
| `youtube.com/shorts/…` | Tall (9:16) YouTube player |
| `tiktok.com/@you/video/…` | Tall TikTok player |
| A link ending in `.mp4`, or a file in `public` such as `/videos/ep03.mp4` | Video player (add `#vertical` to the end for a tall clip) |

To show a finished episode at the top of its page, set `episodeVideo`, for example `episodeVideo: '/videos/ep03-the-offering.mp4#vertical'`. The animated episodes are made in `../yard-church-videos`.

Leave a link empty (`''`) and the page shows a "coming soon" panel instead.

The trailer and your social links live in `src/config.ts`.

## Add a new episode

1. Copy one of the files in `src/content/episodes/`, for example `06-after-church.md`, and rename it `07-your-title.md`.
2. Change `number`, `title`, `slug` (the web address, lowercase with dashes), `hook`, the two captions and the date.
3. Write a few sentences under the `---` line. They show under the videos.
4. Set `draft: true` if you aren't ready for it to appear yet.

## Thumbnails

Without a thumbnail, each card shows the Then / Now colour split. To use your own image, put it in `public/thumbs/` and set `thumbnail: '/thumbs/devotion.jpg'`. It is also used as the share image for that episode.

## Write your About page

Open `src/pages/about.astro` and replace each `[WRITE YOUR STORY HERE …]` paragraph with your own words.

## Put it online with Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick this repository.
2. Set **Base directory** to `yard-church`. The build command and publish folder come from `netlify.toml`.
3. Deploy. When you have a domain, put it in `site` in `astro.config.mjs`, so share links and previews use it.
