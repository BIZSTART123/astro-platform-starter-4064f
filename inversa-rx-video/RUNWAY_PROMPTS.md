# Runway prompts for V5 "It's Me"

V5 uses your selfie as a still photo with a slow camera move. To make it truly move, upload the
same selfie to **Runway → Image to Video** (Gen-4 or newer), **9:16 vertical**, 5–10 seconds,
and use these prompts. Make one clip per scene, or one 10s clip that covers the first three.

Keep each prompt about motion only. Runway already sees the photo.

**Clip 1: "Hey… it's me 👋"** (0–2.5s)
```
The man in the driver's seat looks into the phone camera, breaks into a warm, easy smile and gives a small friendly wave with his right hand. Natural handheld selfie motion, slight sway. Soft late-afternoon light through the car windows. Realistic, unposed.
```

**Clip 2: "Real quick… I gotta ask you something"** (2.5–5.5s)
```
The man leans a little closer to the camera with a playful, curious look, raises one eyebrow and nods slightly as if about to ask a question. Subtle handheld camera movement. Realistic, natural.
```

**Clip 3: "When's the last time you REALLY checked your eyes? 👀"** (5.5–9s)
```
The camera slowly pushes in toward the man's eyes. He squints, narrows his eyes as if trying to read something far away, then relaxes into a knowing, caring look straight into the lens. Smooth slow push-in, shallow depth of field, realistic.
```

**Clip 4: "I'm concerned about you ❤️"** (9–12s)
```
The man's expression softens into a sincere, caring look at the camera, a slow small nod, gentle smile. Very subtle handheld motion. Warm, intimate, realistic.
```

**Clip 5: "Come see me at Inversa Rx Optical 👓"** (12–14.5s)
```
The man lifts a pair of stylish black rectangular eyeglasses into frame, puts them on, adjusts them with one finger and gives a confident smile and a nod to the camera. Natural handheld selfie motion, realistic.
```

Tip: in Runway, set camera motion to "handheld" or "static" and avoid big moves. Big moves
distort faces. Re-roll a clip if your face changes; it should still look exactly like you.

## Even better: film it yourself (30 seconds of work)

A real selfie video beats any AI. Sit in the car like in the photo, phone vertical, and say:

> "Hey… it's me. Real quick, I gotta ask you something. When's the last time you *really*
> checked your eyes? I'm not playing, I'm concerned about you. Come see me at Inversa Rx Optical."

About 12–14 seconds. Send it over and I'll put the captions, ticker, jingle and end card on it.

## Dropping a clip in

Put the MP4 in `inversa-rx-video/public/` (e.g. `me-runway.mp4`) and set the V5 `selfieVideo`
prop to its name. The video plays under the same captions instead of the still photo.
Or just send it to me.
