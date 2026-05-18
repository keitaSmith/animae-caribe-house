# Animae Caribe House — Next.js starter files

This ZIP is the Next.js version of the starter. Use it after creating the app with `create-next-app`.

## Create the project

```bash
npx create-next-app@latest animae-caribe-house
cd animae-caribe-house
```

Recommended answers:

```txt
TypeScript: Yes or No — this starter uses JSX, both are fine in a normal Next setup
ESLint: Yes
Tailwind CSS: Yes is okay, but this starter uses regular CSS for now
src/ directory: Yes
App Router: Yes
Turbopack: Yes is okay
Customize import alias: No
```

## Install the starter

1. Delete the generated `src` folder from the new Next project.
2. Copy this ZIP's `src` folder into the project.
3. Copy this ZIP's `public/assets` and `public/videos` folders into the project's `public` folder.
4. Run:

```bash
npm run dev
```

## Hero video

Place optimized hero video files here:

```txt
public/videos/hero-showreel.webm
public/videos/hero-showreel.mp4
```

The starter includes a poster background, so it will still look fine before the video files are added.

## Main files to edit

```txt
src/data/site.js        Contact details, showreel URL, shop URL
src/data/stats.js       Animated stat numbers
src/data/partners.js    Partner placeholders
src/data/projects.js    Featured work cards
src/data/articles.js    News/article placeholders
src/styles/index.css    Main styling
```

## Notes

This starter uses normal CSS rather than Tailwind classes. Tailwind can still be added/refactored later, but regular CSS keeps the starter easy to inspect and customize.
