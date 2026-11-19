# Shot list: "you in action" for the Good Morning video

Film these on your phone, **vertical**, **3–4 seconds each**, in good morning light (at the
shop window, or in the car like your selfie). Don't worry about sound: the jingle plays on top.
Look straight into the lens, like you're talking to one person.

| # | Line on screen | What you do | Where |
|---|---|---|---|
| 1 | "Good morning ☀️ it's me 👋" | Big smile, small wave at the camera | Shop entrance or car |
| 2 | "Coffee's hot ☕ and I got a question for you…" | Take a sip of coffee, then look up at the camera, eyebrows raised | Counter, coffee in hand |
| 3 | "When's the last time you REALLY checked your eyes? 👀" | Lean in slowly toward the lens, squint a little, then a knowing look | Close-up, face fills the frame |
| 4 | "Be honest… are you squinting at this right now? 😂" | Hold your phone far away, squint at it, then crack up laughing | Anywhere |
| 5 | "Start your day right. Come see me at Inversa Rx Optical 👓" | Pick a pair of frames off the display, put them on, adjust, point at the camera | In front of the frame wall |

Bonus shots, if you have a minute: pointing at the "25% OFF" sign, holding a benefit card up,
a quick walk-through of the frame wall. Send them over and I'll fit them in.

## Turning them into the video (automatic)

1. Name the files by scene number: `1-wave.mov`, `2-coffee.mov`, `3-lean.mov`, `4-squint.mov`,
   `5-glasses.mov` (the part after the number doesn't matter).
2. Drop them in `inversa-rx-video/clips-inbox/`, or send them to me.
3. Run `npm run build:all`. It converts the clips, puts them under the captions, renders all five
   videos and writes the morning captions into `out/ready/`.

Any scene you skip uses your photo instead, so you can film just one or two to start.
Your clips stay on your machine; they are never uploaded to GitHub.
