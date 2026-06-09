# Sanity ecosystem partner import

This project uses the existing `partner` document type for ecosystem-wide partners and collaborators.

## Current behavior

- `active` defaults to `true`
- `logo` is required
- `url` is optional
- `relationship` is optional
- leaving `relatedExperiences` empty makes a partner ecosystem-wide
- frontend partner queries only return documents where `active !== false`

## Import logos from `logo_exports_v2_webp.zip`

1. Extract the zip to a local folder.
2. Run:

```bash
node scripts/sanity/importEcosystemPartners.mjs --logos-dir "C:\path\to\extracted\logos"
```

The importer will:

- match the provided `.webp` filenames to the intended partner names
- upload each `.webp` as a Sanity image asset without altering its background
- avoid duplicates by matching existing `partner` documents by slug or normalized name
- create or update partner documents as active, ecosystem-wide entries

## Included partner names

- UTT
- Pavilion+
- Sightfactory
- H + NIHERST
- Hilton Trinidad & Conference Centre
- TTRS
- P44 Academy
- Creative Tech Hub Caribbean
- Kin Sound Studios
- Guyana Animation Network
- TTVN
- JN
- O.W.! Entertainment
- PIXL Studios
- Shop Caribe
- Mind Wise
- Google Developer Groups Port-of-Spain
- Women Techmakers
- designchange
- the imagination company
- Break Time Central
