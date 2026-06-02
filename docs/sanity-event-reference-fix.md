# Sanity event deletion fix

This project keeps `event` documents as production content. The deletion fix only changes page-level curated references that point to events and does not modify event documents themselves.

## Schema change

The following page-level arrays now use weak references to `event` documents:

- `festivalEventsSection.events`
- `eventsPreviewSection.events`

The `event.festivalEdition` reference remains strong.

## Production data inspection

The current production dataset contains at least one stored strong page-to-event reference in a `festivalPage` document:

- Document `_id`: `9f1adf3a-65c5-4d33-a3bc-7a612e7f8478`
- Array field: `eventsPreview.events[]`
- Reference `_key`: `cb3aba2ec2a0`

Because existing saved references do not automatically become weak when the schema changes, a one-time migration is needed for already-saved page references.

## Backup command

Run this before any dataset mutation from `D:\React-js\animae-caribe-house\studio`:

```powershell
npx sanity dataset export production D:\sanity-backups\animae-caribe-house-production-$(Get-Date -Format 'yyyyMMdd-HHmmss').tar.gz --raw
```

## Migration script

Dry run:

```powershell
node .\scripts\sanity\weakenFestivalPageEventRefs.mjs
```

Apply after backup:

```powershell
node .\scripts\sanity\weakenFestivalPageEventRefs.mjs --apply
```

### Scope

The script only updates `festivalPage` documents and only sets `_weak: true` on `eventsPreview.events[]` references that are currently strong. It does not delete, rename, recreate, or rewrite `event` documents.
