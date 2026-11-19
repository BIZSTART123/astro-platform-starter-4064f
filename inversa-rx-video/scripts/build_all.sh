#!/usr/bin/env bash
# One command, everything ready to send:
#   bash scripts/build_all.sh
#
# 1. Finds your action clips in clips-inbox/ (any phone video: .mov/.mp4), named by scene:
#      1-*.mov  "Good morning, it's me"        (wave / smile at the camera)
#      2-*.mov  "Coffee's hot"                  (sip of coffee, look up)
#      3-*.mov  "When did you last check..."    (lean in, squint)
#      4-*.mov  "Are you squinting right now?"  (laugh)
#      5-*.mov  "Come see me at Inversa Rx"     (put on glasses at the shop)
#    Missing scenes fall back to your photos.
# 2. Converts them to vertical 1080x1920, 30 fps, no audio (the jingle plays on top).
# 3. Renders all five videos into out/ready/ and writes out/ready/CAPTIONS.txt.
set -euo pipefail
cd "$(dirname "$0")/.."

INBOX="clips-inbox"
CLIPS="public/clips"
READY="out/ready"
mkdir -p "$INBOX/jutsu" "$CLIPS" "$READY"

# --- 1+2: normalize whatever clips are in the inbox ---------------------------
clips_json="["
for n in 1 2 3 4 5; do
  src="$(ls "$INBOX"/"$n"-* 2>/dev/null | head -n 1 || true)"
  if [ -n "$src" ]; then
    out="$CLIPS/scene$n.mp4"
    echo "Scene $n: using $src"
    ffmpeg -loglevel error -y -i "$src" -an \
      -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
      -c:v libx264 -pix_fmt yuv420p -crf 20 "$out"
    clips_json+="\"clips/scene$n.mp4\""
  else
    echo "Scene $n: no clip, using the photo"
    clips_json+="\"\""
  fi
  [ "$n" -lt 5 ] && clips_json+=","
done
clips_json+="]"

# --- 3: render everything -----------------------------------------------------
render() { npx remotion render "$1" "$READY/$2.mp4" --codec h264 --crf 20 --log=error ${3:+--props="$3"}; echo "  ✓ $2"; }
echo "Rendering..."
render V5-ItsMe "1-GoodMorning-ItsMe" "{\"clips\":$clips_json}"
render V1-BreakingNews "2-BreakingNews"
render V2-ConcernedFriend "3-ConcernedFriend"
render V3-EyeChart "4-EyeChart"
render V4-TheBoys "5-TheBoys"

# V6 Clear Vision Jutsu: clips in clips-inbox/jutsu/ named 1-*, 2-*, 3-*
jutsu_json="["
for n in 1 2 3; do
  src="$(ls "$INBOX"/jutsu/"$n"-* 2>/dev/null | head -n 1 || true)"
  if [ -n "$src" ]; then
    ffmpeg -loglevel error -y -i "$src" -an \
      -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
      -c:v libx264 -pix_fmt yuv420p -crf 20 "$CLIPS/jutsu$n.mp4"
    jutsu_json+="\"clips/jutsu$n.mp4\""
  else
    jutsu_json+="\"\""
  fi
  [ "$n" -lt 3 ] && jutsu_json+=","
done
jutsu_json+="]"
render V6-Jutsu "6-ClearVisionJutsu" "{\"clips\":$jutsu_json}"

cat > "$READY/CAPTIONS.txt" <<'TXT'
SEND 7:00-8:30 AM, Tue-Thu. Broadcast lists of up to 256; send list 2 a couple of hours after list 1.

1-GoodMorning-ItsMe   Good morning ☀️ coffee first… then watch this 😂☕
2-BreakingNews        Heyyy 👋 been a minute! How you been?
3-ConcernedFriend     Hey stranger!! 😄 Real quick, watch this lol
4-EyeChart            Ok be honest… 😂
5-TheBoys (guys)      Yo… this you? 💀
6-ClearVisionJutsu    Good morning ☀️ I had to try this trend 😂👓

When they reply: "Lol good morning! Come by this week, I got you 👓"
TXT
echo "Done. Everything is in $READY/"
