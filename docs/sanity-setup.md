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
- Festival about copy
- Festival partners via `partner` documents where `relatedExperience == "festival"`
- Festival programming/highlight cards
- Festival featured events/programme preview
- Festival archive teaser and final CTA copy

## Schema-ready but still local/fallback-first

These content areas have schema support but are not fully wired yet to avoid disturbing finished layouts:

- House page hero, showreel, about, partners, services, featured work, stats, team, festival teaser, news teaser, FAQ, and CTA
- Global site settings-driven header/footer rendering
- General editable pages beyond the current static page templates
- Posts/news rendering from Sanity
- Media galleries and speaker/guest detail pages

## Mux showreels

Enter Mux playback IDs as strings in the showreel or video fields. Videos should remain hosted in Mux; do not upload full showreel videos to Sanity. The site supports separate House and Festival showreels, plus an optional umbrella/global showreel later.

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
