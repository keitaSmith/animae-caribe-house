# Sanity event deletion fix

This project keeps `event` documents as production content. The deletion fix only changes page-level curated references that point to events and does not modify event documents themselves.

## Schema change

The following page-level arrays now use weak references to `event` documents:

- `festivalEventsSection.events`
- `eventsPreviewSection.events`

The `event.festivalEdition` reference remains strong.

## Production data inspection

The production dataset originally contained one stored strong page-to-event reference in a `festivalPage` document:

- Document `_id`: `9f1adf3a-65c5-4d33-a3bc-7a612e7f8478`
- Array field: `eventsPreview.events[]`
- Reference `_key`: `cb3aba2ec2a0`
- Event `_ref`: `ccddfd00-ab49-49ad-8f45-3ecaa174d1c5`
- Event title: `Animae Caribe Festival 2026 Launch`

Because existing saved references do not automatically become weak when the schema changes, a one-time migration is needed for already-saved page references.

## Backup command

Run this before any dataset mutation from `D:\React-js\animae-caribe-house\studio`:

```powershell
npx sanity dataset export production D:\sanity-backups\animae-caribe-house-production-$(Get-Date -Format 'yyyyMMdd-HHmmss').tar.gz --raw
```

Backup created during this investigation:

- `D:\sanity-backups\animae-caribe-house-production-test.tar.gz`
- `D:\sanity-backups\animae-caribe-house-production-20260602-185210.tar.gz`

## Migration script

Dry run:

```powershell
npx sanity exec .\scripts\weakenFestivalPageEventRefs.js --with-user-token
```

Apply after backup:

```powershell
npx sanity exec .\scripts\weakenFestivalPageEventRefs.js --with-user-token -- --apply
```

### Scope

The script only updates `festivalPage` documents and only sets `_weak: true` on `eventsPreview.events[]` references that are currently strong. It does not delete, rename, recreate, or rewrite `event` documents.

## Migration result

The targeted migration was run during this investigation and converted the single blocking `festivalPage.eventsPreview.events[]` reference above to `_weak: true`.
