# WhatsApp sending guide: Inversa Rx Optical videos

The goal: in the chat list and the chat, this looks like *you* checking in. The thumbnail
(the video's first frame) and your caption are all they see before they tap.

## Captions (type these, don't forward)

**V1: Breaking News** (thumbnail: "hey… you good? 👀")
- `Heyyy 👋 been a minute! How you been?`
- `Hey you! Was just thinking about you. You good?`

**V2: Concerned Friend** (thumbnail: "hey stranger 👋")
- `Hey stranger!! 😄 Real quick, watch this lol`
- `Long time no see 👀 how's everything?`

**V3: Eye Chart** (thumbnail: "ok be honest with me 😅")
- `Ok be honest… 😂`
- `Quick question for you lol 👀`

**V4: The Boys** (thumbnail: "bro… 💀"), for your guy friends
- `Bro 😂😂 the boys had to say something`
- `Yo… this you? 💀`

**V5: It's Me** (thumbnail: your selfie + "Hey… it's me 👋"), the most personal one
- `Hey! It's been too long 🙏🏾`
- `Thinking about you, how you been? ❤️`

### Make a blast feel 1-on-1
- Write every caption to **one** person: "you", never "y'all", "everyone" or "my contacts".
- For your closest people, send the **named V5** ("Hey Marcus… it's me 👋") one by one instead
  of in the broadcast: put first names in `names.txt` and run `npm run render:names`.
- Reply to each response yourself, by name. That's what makes it real.

Keep it to one short line, like a normal text. No links, prices or "special offer" in the
caption: that's what makes a message look like an ad before it's opened.

## Best way to send

1. **Use a Broadcast List** (Chats → ⋮ / New broadcast). Each person gets it as a private
   1-on-1 message from you, with no group and no "Forwarded" label.
   - Up to 256 people per list.
   - It only reaches people who **have your number saved**. Everyone else won't get it.
2. **Send a different version to each list** (e.g. 3 lists of contacts, one version each),
   then see which one gets the most replies and visits.
3. **Send it as a video, not as a document**, so the thumbnail shows.
4. **Reply to everyone who answers.** "Lol I'm good, how are you?" is the real win. That's
   where you can say "come by, I'll take care of you."

## Don't get your number flagged

WhatsApp restricts numbers when lots of people block or report them.
- Send in batches (one list, wait a few hours, the next list), not 1,000 at once.
- Only send to people who actually know you.
- Don't re-send the same video to people who didn't reply.
- For regular promos down the road, a **WhatsApp Business** account (free) lets you add
  your Inversa Rx profile, hours and catalog. It's the right home for repeat campaigns.

## Keep it genuine

It works *because* it's real: it's you, from your number, and the video itself says you're
checking on them. Avoid captions that would make it feel like a trick once they open it
(e.g. "urgent", "emergency", "did you see this about you?"). Playful and friendly lands best.

## Automation

**Make everything (one command):** `npm run build:all` in `inversa-rx-video/`. It picks up any
action clips in `clips-inbox/` (see `SHOT_LIST.md`), renders all five videos and writes the
morning captions to `out/ready/CAPTIONS.txt`.

**Sending, the free way:** WhatsApp Business app → broadcast lists, at 7:00–8:30 AM. You tap send;
everything before that is done for you.

**Sending, fully automated:** `scripts/whatsapp_send.py` sends through the official WhatsApp
Business Platform (Twilio) on a schedule. It needs a Twilio WhatsApp sender, an approved
template with the video, and **contacts who opted in** (`contacts.csv`, never committed).
Dry run first: `npm run send:dry`. Don't automate a personal WhatsApp number with bots or
"blast" apps: that breaks WhatsApp's rules and the number gets banned.
