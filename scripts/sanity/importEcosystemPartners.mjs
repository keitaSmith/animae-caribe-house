import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..', '..')

await loadEnvFile(path.join(projectRoot, '.env.local'))

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error('Missing Sanity configuration. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are available.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-09',
  token,
  useCdn: false,
})

const requestedPartners = [
  {slug: 'utt', name: 'UTT'},
  {slug: 'pavilion-plus', name: 'Pavilion+'},
  {slug: 'sightfactory', name: 'Sightfactory'},
  {slug: 'h-niherst', name: 'H + NIHERST'},
  {slug: 'hilton-trinidad-conference-centre', name: 'Hilton Trinidad & Conference Centre'},
  {slug: 'ttrs', name: 'TTRS'},
  {slug: 'p44-academy', name: 'P44 Academy'},
  {slug: 'creative-tech-hub-caribbean', name: 'Creative Tech Hub Caribbean'},
  {slug: 'kin-sound-studios', name: 'Kin Sound Studios'},
  {slug: 'guyana-animation-network', name: 'Guyana Animation Network'},
  {slug: 'ttvn', name: 'TTVN'},
  {slug: 'jn', name: 'JN'},
  {slug: 'ow-entertainment', name: 'O.W.! Entertainment'},
  {slug: 'pixl-studios', name: 'PIXL Studios'},
  {slug: 'shop-caribe', name: 'Shop Caribe'},
  {slug: 'mind-wise', name: 'Mind Wise'},
  {slug: 'google-developer-groups-port-of-spain', name: 'Google Developer Groups Port-of-Spain'},
  {slug: 'women-techmakers', name: 'Women Techmakers'},
  {slug: 'designchange', name: 'designchange'},
  {slug: 'the-imagination-company', name: 'the imagination company'},
  {slug: 'break-time-central', name: 'Break Time Central'},
]

const fileNameToSlug = new Map([
  ['utt.webp', 'utt'],
  ['pavilion_plus.webp', 'pavilion-plus'],
  ['sightfactory.webp', 'sightfactory'],
  ['h_niherst.webp', 'h-niherst'],
  ['hilton_trinidad_conference_centre.webp', 'hilton-trinidad-conference-centre'],
  ['ttrs.webp', 'ttrs'],
  ['k4_academy.webp', 'p44-academy'],
  ['creative_tech_hub_caribbean.webp', 'creative-tech-hub-caribbean'],
  ['kin_sound_studios.webp', 'kin-sound-studios'],
  ['gan_guyana_animation_network.webp', 'guyana-animation-network'],
  ['ttvn.webp', 'ttvn'],
  ['jn.webp', 'jn'],
  ['ow_entertainment.webp', 'ow-entertainment'],
  ['pixl_studios.webp', 'pixl-studios'],
  ['shop_caribe.webp', 'shop-caribe'],
  ['mind_wise.webp', 'mind-wise'],
  ['google_developer_groups_port_of_spain.webp', 'google-developer-groups-port-of-spain'],
  ['women_techmakers.webp', 'women-techmakers'],
  ['designchange.webp', 'designchange'],
  ['the_imagination_company.webp', 'the-imagination-company'],
  ['break_the_central.webp', 'break-time-central'],
])

function getArgs() {
  const args = process.argv.slice(2)
  const result = {}

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index]
    const next = args[index + 1]

    if (current === '--logos-dir' && next) {
      result.logosDir = next
      index += 1
    }
  }

  return result
}

async function loadEnvFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex)
      const value = trimmed.slice(separatorIndex + 1)

      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    // Ignore missing env file so shell-provided env vars still work.
  }
}

function toSlug(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[.!']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeName(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

async function readLogoDirectory(logosDir) {
  const entries = await fs.readdir(logosDir, {withFileTypes: true})
  const logoPaths = new Map()

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const lowerName = entry.name.toLowerCase()
    if (!lowerName.endsWith('.webp')) continue

    const slug = fileNameToSlug.get(lowerName)

    if (!slug) {
      console.warn(`Skipping unmapped logo file: ${entry.name}`)
      continue
    }

    logoPaths.set(slug, path.join(logosDir, entry.name))
  }

  return logoPaths
}

async function fetchExistingPartners() {
  const documents = await client.fetch(
    `*[_type == "partner"]{
      _id,
      name,
      "slug": slug.current,
      url,
      website
    }`
  )

  const bySlug = new Map()
  const byName = new Map()

  for (const document of documents) {
    if (document.slug) {
      bySlug.set(document.slug, document)
    }

    if (document.name) {
      byName.set(normalizeName(document.name), document)
    }
  }

  return {bySlug, byName}
}

async function uploadLogo(filePath, name) {
  const fileBuffer = await fs.readFile(filePath)
  const fileName = path.basename(filePath)

  return client.assets.upload('image', fileBuffer, {
    filename: fileName,
    contentType: 'image/webp',
    label: `${name} logo`,
    title: `${name} logo`,
  })
}

async function upsertPartner(partner, logoPaths, existingPartners, sortOrder) {
  const existingBySlug = existingPartners.bySlug.get(partner.slug)
  const existingByName = existingPartners.byName.get(normalizeName(partner.name))
  const existing = existingBySlug || existingByName
  const logoPath = logoPaths.get(partner.slug)

  if (!logoPath) {
    throw new Error(`Missing logo file for "${partner.name}" (${partner.slug}).`)
  }

  const logoAsset = await uploadLogo(logoPath, partner.name)
  const documentId = existing?._id || `partner.${partner.slug}`

  await client.createIfNotExists({
    _id: documentId,
    _type: 'partner',
    name: partner.name,
    active: true,
    relatedExperiences: [],
    sortOrder,
    slug: {
      _type: 'slug',
      current: partner.slug,
    },
    logo: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: logoAsset._id,
      },
      alt: `${partner.name} logo`,
    },
  })

  const result = await client
    .patch(documentId)
    .set({
      name: partner.name,
      active: true,
      relatedExperiences: [],
      sortOrder,
      slug: {
        _type: 'slug',
        current: partner.slug,
      },
      logo: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: logoAsset._id,
        },
        alt: `${partner.name} logo`,
      },
    })
    .setIfMissing({
      url: existing?.url || existing?.website,
    })
    .commit()

  existingPartners.bySlug.set(partner.slug, { ...existing, _id: result._id, name: partner.name, slug: partner.slug })
  existingPartners.byName.set(normalizeName(partner.name), { ...existing, _id: result._id, name: partner.name, slug: partner.slug })

  return {
    id: result._id,
    created: !existing,
    name: partner.name,
  }
}

async function main() {
  const {logosDir} = getArgs()

  if (!logosDir) {
    throw new Error('Usage: node scripts/sanity/importEcosystemPartners.mjs --logos-dir "<directory with .webp logos>"')
  }

  const absoluteLogosDir = path.resolve(logosDir)
  const logoPaths = await readLogoDirectory(absoluteLogosDir)
  const existingPartners = await fetchExistingPartners()
  const results = []

  for (const [index, partner] of requestedPartners.entries()) {
    const result = await upsertPartner(partner, logoPaths, existingPartners, index + 1)
    results.push(result)
  }

  console.log(
    JSON.stringify(
      {
        projectId,
        dataset,
        processed: results.length,
        created: results.filter((item) => item.created).map((item) => item.name),
        updated: results.filter((item) => !item.created).map((item) => item.name),
      },
      null,
      2
    )
  )
}

await main()
