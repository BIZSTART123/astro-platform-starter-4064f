#!/bin/bash
set -e
U=/root/.claude/uploads/2b250b2a-1172-507f-8019-3462752f9161
R=/home/user/astro-platform-starter-4064f/caribbean-fest-recap
S=/tmp/claude-0/-home-user-astro-platform-starter-4064f/2b250b2a-1172-507f-8019-3462752f9161/scratchpad/video
cd $S
SERIF=/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf
SANS=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
V1=$(ls $U/3b903a31*); V2=$(ls $U/5615b873*); V3=$(ls $U/21a5a11d*); V4=$(ls $U/efae7dc5*); V5=$(ls $U/3d2768c4*); V6=$(ls $U/ef97632c*)
ENC="-r 30 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 -ac 2"

# caption: $1 big line, $2 small line, starts at 0.4s
cap() {
  printf '%s' "$1" > t_$3_a.txt; printf '%s' "$2" > t_$3_b.txt
  echo "drawbox=x=0:y=ih-300:w=iw:h=190:color=black@0.55:t=fill:enable='gte(t,0.3)',drawtext=fontfile=$SERIF:textfile=t_$3_a.txt:fontsize=50:fontcolor=0xF2C14E:x=(w-tw)/2:y=h-282:alpha='min(1,max(0,(t-0.3)/0.4))',drawtext=fontfile=$SANS:textfile=t_$3_b.txt:fontsize=28:fontcolor=white:x=(w-tw)/2:y=h-205:alpha='min(1,max(0,(t-0.5)/0.4))'"
}
FILL="scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1"

# clip segment: n src start dur captionA captionB
clip() {
  local n=$1 src=$2 ss=$3 d=$4
  local fo=$(echo "$d-0.35" | bc)
  ffmpeg -v error -y -ss $ss -t $d -i "$src" -filter_complex \
   "[0:v]$FILL,$(cap "$5" "$6" $n),fade=t=in:st=0:d=0.3,fade=t=out:st=$fo:d=0.35[v];[0:a]aresample=48000,aformat=channel_layouts=stereo,afade=t=in:st=0:d=0.3,afade=t=out:st=$fo:d=0.35[a]" \
   -map "[v]" -map "[a]" $ENC seg$n.mp4
}
# still segment: n image dur audiosrc audiostart [extra vf]
still() {
  local n=$1 img=$2 d=$3 asrc=$4 ass=$5 extra=$6
  local fo=$(echo "$d-0.5" | bc)
  # simpler, robust version with slow push-in on the whole frame
  ffmpeg -v error -y -loop 1 -framerate 30 -t $d -i "$img" -ss $ass -t $d -i "$asrc" -filter_complex \
   "[0:v]split[a][b];[a]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,gblur=sigma=30,eq=brightness=-0.2[bg];[b]scale=680:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,scale=1440:2560,zoompan=z='1+0.04*on/($d*30)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=30,setsar=1${extra},fade=t=in:st=0:d=0.5,fade=t=out:st=$fo:d=0.5[v];[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.7,afade=t=in:st=0:d=0.6,afade=t=out:st=$fo:d=0.5[a]" \
   -map "[v]" -map "[a]" -t $d $ENC seg$n.mp4
}

printf 'Bible Truth Church of God International\nBronx, New York  |  November 1, 2026' > t_intro.txt
still 0 $R/miss-lou-banner.jpg 5 "$V4" 60 ",drawbox=x=0:y=ih-150:w=iw:h=110:color=black@0.6:t=fill,drawtext=fontfile=$SANS:textfile=t_intro.txt:fontsize=26:fontcolor=white:line_spacing=10:x=(w-tw)/2:y=h-135"
clip 1 "$V1" 4 7  "Spoken Word" "Poetry in the spirit of Miss Lou"
clip 2 "$V3" 12 8 "Acting It Out" "Taking the story to the people"
clip 3 "$V2" 30 7 "Solo Ministry" "Lifting voices in praise"
clip 4 "$V4" 27.13 14 "The Vocal Group" "Brought the whole house to its feet"
clip 5 "$V5" 2 5  "Caribbean Joy" "Black, green and gold all night"
clip 6 "$V5" 12 8 "Dancing in the Aisles" "Nobody could keep still"
clip 9 "$V6" 7 10 "Everybody Up!" "From the stage to the back row"
still 7 $R/proverbs-support-graphic.png 5 "$V4" 70
still 8 $R/thank-you-graphic.png 6 "$V4" 75
printf "file 'seg%d.mp4'\n" 0 1 2 3 4 5 6 9 7 8 > list.txt
# Audio cleanup for the phone recording: repair clipping, remove rumble/mud,
# lift vocal presence, light denoise, gentle compression and limiting.
CLEAN="adeclip=window=55:overlap=75:arorder=8:threshold=10,highpass=f=85:poles=2,highpass=f=85:poles=2,equalizer=f=130:t=q:w=1.0:g=-2,equalizer=f=320:t=o:w=1.2:g=-4.5,equalizer=f=650:t=q:w=1.4:g=-1.5,equalizer=f=2800:t=o:w=1.6:g=4,equalizer=f=5000:t=q:w=1.2:g=2,treble=g=1.5:f=8000:t=s,lowpass=f=14500,afftdn=nr=8:nf=-40:tn=1,acompressor=threshold=0.125:ratio=2.5:attack=15:release=220:makeup=1.6:knee=4,alimiter=limit=0.89:attack=5:release=60:level=disabled"
# Video from all segments; soundtrack = the vocal group's song (V4) from 0s.
# Segment 4 starts at 27s of the video and uses V4 from 27s, so it stays lip-synced.
TOTAL=$(for i in 0 1 2 3 4 5 6 9 7 8; do ffprobe -v error -show_entries format=duration -of csv=p=0 seg$i.mp4; done | paste -sd+ | bc)
FO=$(echo "$TOTAL-2.5" | bc)
ffmpeg -v error -y -f concat -safe 0 -i list.txt -i "$V4" -map 0:v -map 1:a -t $TOTAL \
  -af "$CLEAN,afade=t=in:st=0:d=1,afade=t=out:st=$FO:d=2.5,loudnorm=I=-14:TP=-1:LRA=11" \
  -c:v copy -c:a aac -b:a 160k -ar 48000 -movflags +faststart $R/caribbean-fest-2026-recap.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact $R/caribbean-fest-2026-recap.mp4
ls -la $R/caribbean-fest-2026-recap.mp4
