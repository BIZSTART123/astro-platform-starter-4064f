#!/usr/bin/env python3
"""Fully automated morning send through the official WhatsApp Business Platform (Twilio).

Why this route: blasting from a personal WhatsApp number with a bot breaks WhatsApp's
terms and gets the number banned. The Business Platform is the sanctioned way to automate:
it needs a Twilio WhatsApp sender, an approved message template (with the video as its
header) and contacts who opted in to hear from Inversa Rx.

Setup (one time):
  1. Twilio account + WhatsApp sender for your business number (Meta business verification).
  2. Create a "marketing" content template in Twilio with a VIDEO header and a body such as:
       "Good morning {{1}} ☀️ coffee first… then watch this 😂☕  Reply STOP to opt out."
     Wait for Meta approval, then copy its Content SID (HX...).
  3. Host the rendered MP4 at a public https URL (template media variable {{2}} if your
     template uses a variable header) or set it as the template's fixed header.
  4. contacts.csv (git-ignored) with columns: name,phone,opted_in
       Damion,+13475550123,yes
     Only rows with opted_in=yes are messaged.
  5. Export credentials (never commit them):
       export TWILIO_ACCOUNT_SID=AC...  TWILIO_AUTH_TOKEN=...
       export WHATSAPP_FROM=whatsapp:+19297174415  CONTENT_SID=HX...

Run:
  python3 scripts/whatsapp_send.py                 # dry run: shows who would get what
  python3 scripts/whatsapp_send.py --send          # actually sends
  python3 scripts/whatsapp_send.py --send --media-url https://.../video.mp4

Schedule it for 7:30 AM with cron on any always-on machine:
  30 7 * * 2-4  cd /path/inversa-rx-video && python3 scripts/whatsapp_send.py --send >> out/send.log 2>&1

It is safe to re-run: numbers already messaged today (out/sent-YYYY-MM-DD.csv) are skipped.
"""
import argparse
import base64
import csv
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

E164 = re.compile(r"^\+[1-9]\d{7,14}$")


def load_contacts(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    out, skipped = [], 0
    for r in rows:
        phone = re.sub(r"[^\d+]", "", (r.get("phone") or "").strip())
        if phone and not phone.startswith("+") and len(phone) == 10:
            phone = "+1" + phone  # US numbers without country code
        if (r.get("opted_in") or "").strip().lower() not in ("yes", "y", "true", "1"):
            skipped += 1
            continue
        if not E164.match(phone):
            print(f"  skip (bad number): {r.get('name')!r} {r.get('phone')!r}")
            skipped += 1
            continue
        out.append({"name": (r.get("name") or "").strip().split(" ")[0] or "friend", "phone": phone})
    return out, skipped


def send_one(sid, token, from_, to, content_sid, variables):
    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
    data = urllib.parse.urlencode(
        {"From": from_, "To": f"whatsapp:{to}", "ContentSid": content_sid, "ContentVariables": json.dumps(variables)}
    ).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", "Basic " + base64.b64encode(f"{sid}:{token}".encode()).decode())
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read())
            return True, body.get("sid", ""), body.get("status", "")
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read()).get("message", str(e))
        except Exception:
            msg = str(e)
        return False, "", msg


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--contacts", default="contacts.csv")
    ap.add_argument("--send", action="store_true", help="actually send (default is a dry run)")
    ap.add_argument("--media-url", default="", help="public https URL of the video, if the template takes it as {{2}}")
    ap.add_argument("--per-second", type=float, default=1.0, help="send rate (keep it low)")
    ap.add_argument("--limit", type=int, default=0, help="only send to the first N (for a test batch)")
    a = ap.parse_args()

    contacts, skipped = load_contacts(a.contacts)
    today = dt.date.today().isoformat()
    os.makedirs("out", exist_ok=True)
    log_path = f"out/sent-{today}.csv"
    done = set()
    if os.path.exists(log_path):
        with open(log_path, newline="") as f:
            done = {r["phone"] for r in csv.DictReader(f) if r.get("ok") == "True"}
    queue = [c for c in contacts if c["phone"] not in done]
    if a.limit:
        queue = queue[: a.limit]
    print(f"{len(contacts)} opted-in contacts, {skipped} skipped, {len(done)} already sent today, {len(queue)} to send.")

    if not a.send:
        for c in queue[:10]:
            print(f"  would send to {c['name']} {c['phone'][:-4]}****")
        if len(queue) > 10:
            print(f"  … and {len(queue) - 10} more")
        print("Dry run only. Add --send to send.")
        return

    need = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "WHATSAPP_FROM", "CONTENT_SID"]
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        sys.exit("Missing environment variables: " + ", ".join(missing))
    sid, token = os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]
    from_, content_sid = os.environ["WHATSAPP_FROM"], os.environ["CONTENT_SID"]

    new_log = not os.path.exists(log_path)
    with open(log_path, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["time", "name", "phone", "ok", "message_sid", "status"])
        if new_log:
            w.writeheader()
        sent = failed = 0
        for c in queue:
            variables = {"1": c["name"]}
            if a.media_url:
                variables["2"] = a.media_url
            ok, msid, status = send_one(sid, token, from_, c["phone"], content_sid, variables)
            w.writerow({"time": dt.datetime.now().isoformat(timespec="seconds"), "name": c["name"], "phone": c["phone"],
                        "ok": ok, "message_sid": msid, "status": status})
            f.flush()
            sent += ok
            failed += not ok
            if not ok:
                print(f"  failed {c['phone'][:-4]}****: {status}")
            time.sleep(1.0 / max(a.per_second, 0.1))
    print(f"Sent {sent}, failed {failed}. Log: {log_path}")


if __name__ == "__main__":
    main()
