# Inversa Rx Optical & Pharmacy website

A one-page static Astro site for Inversa Rx Optical and Inversa Rx Pharmacy in the Bronx.
All content comes from the Jamaica Observer article of 19 Nov 2026. Nothing is made up:
details the article didn't give (address, phone, hours, insurance) are blank in the config,
and the site shows a "call us / send a request" fallback until you fill them in.

## Before launch
Edit `src/config.ts`:
- `address`, `mapsUrl`, `phone`, `email`, `hours`, `insurance`, `socials`
- Check the pricing wording for the US$75 "comprehensive" visit (the article doesn't say what it covers).

## Run
```
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Deploy (Netlify)
New site → this repo → Base directory `inversa-rx`. The booking form uses Netlify Forms;
submissions appear under Site → Forms. Turn on email notifications there.
The form only asks for contact info and a preferred time, never medical details.
