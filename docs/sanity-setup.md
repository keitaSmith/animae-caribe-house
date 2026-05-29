# Sanity setup

Sanity Studio now lives in `studio/` and the Next.js app has a small Sanity frontend layer in `src/sanity/`.

## Local development

- Studio: `cd studio` then `npm run dev`
- Website: from the project root, run `npm run dev`

## Environment variables

Add these to the Next.js app environment:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
```

`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are safe for browser exposure. `SANITY_API_READ_TOKEN` must stay server-side. If the dataset is public, the frontend can read published content without a token; keep the token available later for preview or private reads.

## Schema location

All Studio schemas are registered in `studio/schemaTypes/index.ts`.

Document types:

- `siteSettings`
- `umbrellaHomePage`
- `festivalPage`
- `housePage`
- `festivalEdition`
- `event`
- `partner`
- `post`
- `page`
- `mediaGallery`
- `person`

Reusable object types include SEO fields, CTAs, links, social links, image with alt text, Mux video, video showreel, hero sections, split hero panels, rich text sections, card grids, partner section settings, event previews, and archive/CTA teasers.

## Frontend Sanity files

- `src/sanity/lib/client.ts`: configured `next-sanity` client and safe `sanityFetch`
- `src/sanity/lib/queries.ts`: GROQ helpers for settings, pages, editions, events, partners, posts, and generic pages
- `src/sanity/lib/image.ts`: Sanity image URL helper
- `src/sanity/lib/types.ts`: lightweight frontend data types
- `src/sanity/PortableTextRenderer.tsx`: basic Portable Text renderer for future section wiring

## Connected now

These areas read from Sanity when configured and fall back to local content when Sanity is empty or unavailable:

- Umbrella homepage split hero panel text, CTA URLs/labels, background images, and Mux playback IDs
- Umbrella homepage partner logos via `partner` documents where `relatedExperience == "umbrella"`
- Festival hero heading/copy/CTA label
- Festival hero background video and fallback poster settings
- Festival Watch Showreel modal/menu video settings
- Festival about copy
- Festival partners via `partner` documents where `relatedExperience == "festival"`
- Festival programming/highlight cards
- Festival Calendar Image section
- Festival featured events/programme preview
- Festival Venue / Location Map section
- Festival archive teaser and final CTA copy

Festival upcoming events now come primarily from:

- `Festival Page -> Events/programme preview -> Festival Year / Edition`
- `Festival Page -> Events/programme preview -> Maximum number of events`

The frontend then finds the next published upcoming `Event` documents for that Festival Edition, sorted by `startDateTime` ascending.

## Schema-ready but still local/fallback-first

These content areas have schema support but are not fully wired yet to avoid disturbing finished layouts:

- House page hero, showreel, about, partners, services, featured work, stats, team, festival teaser, news teaser, FAQ, and CTA
- Global site settings-driven header/footer rendering
- General editable pages beyond the current static page templates
- Posts/news rendering from Sanity
- Media galleries and speaker/guest detail pages

## Mux showreels

Enter Mux playback IDs as strings in the showreel or video fields. Videos should remain hosted in Mux; do not upload full showreel videos to Sanity. The site supports separate House and Festival showreels, plus an optional umbrella/global showreel later.

For the Festival page specifically:

- `Hero background video` controls the looping cinematic video inside the hero
- `Watch Showreel modal video` controls the hero Watch Showreel button, the Festival menu Watch Showreel button, and the modal video itself

These are now separate configurations and should not be confused.

## Festival events publishing notes

For a Festival event to appear on `/festival`, editors should publish:

- the referenced `Festival edition` document first
- the `Event` document itself
- the `Festival Page` document after changing the upcoming events section settings

The upcoming events section on the Festival Page is controlled by:

- `Eyebrow`
- `Title`
- `Description`
- `Festival Year / Edition`
- `Maximum number of events`

The frontend reads published content only by default. Draft-only Festival editions, Event documents, or Festival Page changes will not appear on the website until they are published.

Legacy manual event references may still exist on older Festival Page documents as a hidden fallback, but the main workflow is now automatic by Festival Edition.

The Festival Page also includes:

- `Festival Calendar Image`
  Edit this directly on the Festival Page document.
  - Upload or replace `Calendar / programme image`
  - This section is currently controlled by the `Festival Page` document, not by `Festival Edition`
  - Editors do not need to add a separate download file or download URL
  - The `Download Calendar` button automatically downloads the uploaded `Calendar / programme image`
  - `Download button style` lets editors choose the existing site button variant used on the page and inside the lightbox
  - Turn off `Show this section` to hide it entirely
  - Clicking the image opens a dark lightbox that shows the poster without a white card container

- `Past Editions`
  Editors can optionally set a CTA label and URL. If either value is missing, no button is shown.
- `Join the Festival`
  This section supports two CTA buttons:
  - `Primary CTA`
  - `Secondary CTA`

- `Venue / Location Map`
  Edit this directly on the Festival Page document.
  - This section is currently controlled by the `Festival Page` document, not by `Festival Edition`
  - Add `Venue name` and `Address` for the visible venue details
  - Paste a standard Google Maps embed URL into `Google Maps embed URL`
  - Paste a normal Google Maps share link into `Google Maps link`
  - `Map CTA label` controls the visible Google Maps button text
  - `Google Maps button style` lets editors choose the existing site button variant for the map link
  - Turn off `Show this section` to hide it entirely
  - No Google Maps API key is required when using a standard embed URL from Google Maps

## Follow-up checklist

- Add CORS origins in Sanity Manage:
- `http://localhost:3000`
- `http://localhost:3333`
- `https://animaecaribe.com`
- `https://www.animaecaribe.com`
- `https://animaecaribehouse.com`
- `https://www.animaecaribehouse.com`
- Relevant Vercel preview and production URLs

- Add Vercel environment variables for the Next.js app.
- Deploy the Studio when the schema is reviewed.
- Add Sanity structure customization for singleton editing if desired.
- Manually add old WordPress posts later, or build an importer later.
- Import historical media later after the content model has been reviewed.
