# News & Media

The News & Media section lives at `/news-media` and combines manually edited Sanity articles with videos imported from trusted YouTube sources.

## Manual Articles

Articles use the existing Sanity `post` document type. To publish an article:

1. Create or edit a `Post / news` document in Sanity.
2. Add `title`, `slug`, `excerpt`, `featuredImage`, `publishedAt`, and `body`.
3. Add optional `author`, `categories`, `tags`, and `seo` fields.
4. Keep `Show on website` enabled.

Older posts that only have the legacy `date` field still work. New articles should use `publishedAt`.

## Trusted YouTube Sources

The importer scans only active `youtubeSource` documents in Sanity. It does not run public YouTube search.

Required source fields:

- `title`
- `channelId`
- `sourceUrl`
- `isActive`
- `isOfficialSource`
- `requiredKeywords`
- `autoPublish`
- `initialBackfillStatus`

Official Animae Caribe sources should set `sourceType: official` and `isOfficialSource: true`. Official all-upload import is still disabled unless the channel ID is also listed in the server-side `OFFICIAL_ANIMAE_CARIBE_YOUTUBE_CHANNEL_IDS` allowlist. Official sources import all uploads, set `isVisible: true`, and set `reviewStatus: autoPublished`.

Trusted external sources should set `sourceType: trustedMedia`, `isOfficialSource: false`, and add `requiredKeywords`. External videos import only when the video title or description contains at least one required keyword. Matching is case-insensitive, and the matched terms are stored on the video document.

Non-official sources with missing or empty `requiredKeywords` fail safely by importing nothing and logging a warning.

If `autoPublish` is enabled on a trusted external source, matched videos are visible immediately with `reviewStatus: autoPublished`. If `autoPublish` is disabled, matched videos are imported with `isVisible: false` and `reviewStatus: needsReview`.

## Initial Backfill

New sources default to `initialBackfillStatus: pending`. Existing sources with no `initialBackfillCompletedAt` are also treated as needing initial backfill, including sources whose last backfill attempt failed.

When the importer runs, each active source does one of two things:

- If `initialBackfillStatus` is pending or `initialBackfillCompletedAt` is empty, it performs a one-time backfill scan of older channel uploads.
- After the initial backfill is completed, future importer runs only check recent uploads.

Successful backfills set:

- `initialBackfillStatus: completed`
- `initialBackfillCompletedAt`
- `lastSuccessfulSyncAt`
- `lastCheckedAt`

Failed backfills set:

- `initialBackfillStatus: failed`
- `initialBackfillLastError`
- `lastCheckedAt`

## Imported YouTube Videos

Imported videos use the `youtubeVideo` document type. The importer stores:

- `title`
- `slug`
- `youtubeVideoId`
- `youtubeUrl`
- `embedUrl`
- `description`
- `thumbnailUrl`
- `publishedAt`
- `channelId`
- `channelTitle`
- `source`
- `sourceType`
- `youtubeCategoryId`
- `youtubeCategoryTitle`
- `youtubeTags`
- `matchedKeywords`
- `isVisible`
- `reviewStatus`
- `importedAt`
- `lastSyncedAt`

YouTube thumbnails are referenced by `thumbnailUrl` only. They remain hosted by YouTube and are not downloaded or uploaded into Sanity image assets.

Duplicate imports are prevented by `youtubeVideoId`. Existing video documents are updated only with safe metadata:

- `title`
- `description`
- `thumbnailUrl`
- `youtubeTags`
- `youtubeCategoryId`
- `youtubeCategoryTitle`
- `lastSyncedAt`

The importer does not overwrite manual `isVisible` or `reviewStatus` decisions on existing videos.

## Visibility And Review

Articles appear when `Show on website` is enabled.

Videos appear publicly only when:

- `isVisible` is `true`
- `reviewStatus` is `approved` or `autoPublished`

To hide a video, turn off `Show on website`, set `reviewStatus` to `hidden`, or set `reviewStatus` to `rejected`. `needsReview`, `hidden`, and `rejected` videos do not appear on `/news-media`.

## Categories And Tags

Articles and videos both support simple string arrays for `categories` and `tags`. These are displayed as chips on cards and detail pages. YouTube videos also keep their original `youtubeTags` for importer metadata.

## Pagination

The archive uses query parameter pagination:

- `/news-media` shows page 1.
- `/news-media?page=2` shows the second page.

The feed sorts all visible articles and videos together by `publishedAt`, newest first. If an older article does not have `publishedAt`, it falls back to the legacy `date`.

## Detail Pages

Both content types use `/news-media/[slug]`.

Article detail pages show the title, published date, optional author, featured image, taxonomy chips, and Portable Text body.

Video detail pages show the title, published date, channel/source label, taxonomy chips, embedded YouTube player, description, and optional matched keywords.

Both detail pages show 3 recent News & Media items and previous/next links based on the unified feed order.

## Manual Import Commands

Run the importer safely as often as needed:

```bash
npm run import:youtube
```

This checks all active sources. Pending sources run their initial backfill. Completed sources run normal recent sync.

Manually re-run backfill for all active sources:

```bash
npm run import:youtube:backfill
```

Manually re-run backfill for one source:

```bash
npm run import:youtube -- --backfill --source-id=SANITY_DOCUMENT_ID
```

Or by channel ID:

```bash
npm run import:youtube -- --backfill --channel-id=YOUTUBE_CHANNEL_ID
```

Dry-run an import or backfill without writing source status or video documents:

```bash
npm run import:youtube -- --backfill --channel-id=YOUTUBE_CHANNEL_ID --dry-run
```

## Historical Keyword Search

For large trusted media channels, uploads backfill may spend a lot of quota walking unrelated newest-first uploads before it reaches older relevant coverage. Historical search is a search-first mode for trusted external channels.

Use it when:

- The channel uploads frequently.
- You need older videos across many years.
- You have reliable `requiredKeywords`.
- You want to discover matching videos without scanning every unrelated upload.

Historical search loops through each `requiredKeyword` and each year/date window, then calls YouTube `search.list` with:

- `channelId`
- `q`
- `type=video`
- `publishedAfter`
- `publishedBefore`
- `order=date`

Every candidate is then fetched through the full video metadata API and locally verified against title and description. Non-matching videos are never imported.

Dry-run historical search for a channel:

```bash
npm run import:youtube -- --historical-search --channel-id=YOUTUBE_CHANNEL_ID --dry-run
```

Search a specific year range:

```bash
npm run import:youtube -- --historical-search --channel-id=YOUTUBE_CHANNEL_ID --from-year=2005 --to-year=2026 --dry-run
```

Apply historical search imports after reviewing the dry-run:

```bash
npm run import:youtube -- --historical-search --channel-id=YOUTUBE_CHANNEL_ID --from-year=2005 --to-year=2026
```

Historical search is only useful for trusted external sources. Official Animae Caribe sources should continue to use uploads playlist sync/backfill.

Historical search env options:

- `YOUTUBE_HISTORICAL_FROM_YEAR`, default `2005`
- `YOUTUBE_HISTORICAL_TO_YEAR`, default current year
- `YOUTUBE_HISTORICAL_WINDOW`, default `year`
- `YOUTUBE_HISTORICAL_MAX_RESULTS_PER_KEYWORD_YEAR`, default `50`

Quota note: historical search uses YouTube `search.list`, which is more quota-expensive than playlist walking. A source with 3 keywords across 22 years can make up to 66 search calls before metadata fetches. Use `--dry-run` first, keep keywords specific, and raise `YOUTUBE_HISTORICAL_MAX_RESULTS_PER_KEYWORD_YEAR` only when needed.

## Environment Variables

Required:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`
- `YOUTUBE_API_KEY`
- `OFFICIAL_ANIMAE_CARIBE_YOUTUBE_CHANNEL_IDS`, comma-separated, required before any source can import all uploads as official

Required only for protected cron/API runs:

- `CRON_SECRET`

Optional importer limits:

- `YOUTUBE_BACKFILL_MAX_PAGES`, default `10`
- `YOUTUBE_BACKFILL_MAX_RESULTS`, default `250`
- `YOUTUBE_RECENT_SYNC_MAX_RESULTS`, default `25`

## Cron/API Trigger

The protected route is:

```text
/api/youtube-import
```

It accepts `GET` or `POST` and requires `CRON_SECRET` through one of these:

- `Authorization: Bearer <CRON_SECRET>`
- `x-cron-secret: <CRON_SECRET>`
- `?secret=<CRON_SECRET>`

Normal sync:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/youtube-import
```

Manual backfill through the protected route:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://your-domain.com/api/youtube-import?backfill=1&channelId=YOUTUBE_CHANNEL_ID"
```

Dry-run through the protected route:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://your-domain.com/api/youtube-import?backfill=1&dryRun=1&channelId=YOUTUBE_CHANNEL_ID"
```

Dry-run historical search through the protected route:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://your-domain.com/api/youtube-import?historicalSearch=1&dryRun=1&channelId=YOUTUBE_CHANNEL_ID&fromYear=2005&toYear=2026"
```

No scheduled cron is configured in this repo yet. On Vercel, schedule `/api/youtube-import` and provide `CRON_SECRET` in the request headers or query string.

## Cleanup Commands

The cleanup command is designed for incident response when unrelated YouTube videos were imported as `autoPublished` without matched keywords. Dry-run is the default.

Dry-run cleanup for a channel:

```bash
npm run cleanup:youtube-imports -- --channel-id=YOUTUBE_CHANNEL_ID
```

Dry-run cleanup for a specific source:

```bash
npm run cleanup:youtube-imports -- --channel-id=YOUTUBE_CHANNEL_ID --source-id=SANITY_SOURCE_ID
```

Apply the safe cleanup, which hides matching videos without deleting them:

```bash
npm run cleanup:youtube-imports -- --channel-id=YOUTUBE_CHANNEL_ID --source-id=SANITY_SOURCE_ID --apply
```

Delete is intentionally harder to run and should only happen after a dry-run confirms the list:

```bash
npm run cleanup:youtube-imports -- --channel-id=YOUTUBE_CHANNEL_ID --source-id=SANITY_SOURCE_ID --delete --apply --confirm-delete
```

## Logging

The importer logs:

- active sources found
- source scanned
- backfill vs normal sync mode
- source policy, including official vs trusted external and keyword count
- uploads playlist ID
- total upload videos inspected, shown as `checked` and `total upload videos inspected`
- historical search keyword and year/date window
- historical search candidates, accepted matches, local-verification rejects, duplicates, imported, and updated
- videos imported
- videos skipped because keywords did not match
- duplicates prevented/existing videos updated
- `stoppedBecause`, one of `endOfPlaylist`, `maxPages`, `maxResults`, or `error`
- `reachedEndOfUploads`, true or false
- errors

`checked` means upload videos collected from the channel uploads playlist for inspection. It does not mean keyword-matched candidates only. For trusted external sources, non-matching inspected uploads count as keyword skips.
