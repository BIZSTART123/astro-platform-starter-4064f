#!/usr/bin/env bash
# Renders one personalized V5 "It's Me" per first name: "Hey <name>… it's me 👋".
# Put one first name per line in names.txt (git-ignored: it's your contacts), then:
#   bash scripts/render_names.sh            -> out/names/V5-ItsMe-<name>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
LIST="${1:-names.txt}"
[ -f "$LIST" ] || { echo "Missing $LIST (one first name per line)"; exit 1; }
mkdir -p out/names
while IFS= read -r raw || [ -n "$raw" ]; do
  name="$(echo "$raw" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
  [ -z "$name" ] && continue
  safe="$(echo "$name" | tr -cd '[:alnum:]_-')"
  props="$(python3 -c 'import json,sys; print(json.dumps({"name": sys.argv[1]}))' "$name")"
  echo "Rendering for $name..."
  npx remotion render V5-ItsMe "out/names/V5-ItsMe-${safe}.mp4" --codec h264 --crf 20 --props="$props" --log=error
done < "$LIST"
echo "Done: out/names/"
