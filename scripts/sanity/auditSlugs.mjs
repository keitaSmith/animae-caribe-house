import fs from 'node:fs'
import path from 'node:path'
import {createClient} from 'next-sanity'

const slugAuditTargets = [
  {
    type: 'aboutSectionPage',
    label: 'About section page',
    titleField: 'title',
    requiredForPublicUrl: true,
    route: '/about/[slug]',
  },
  {
    type: 'festivalEdition',
    label: 'Festival edition',
    titleField: 'title',
    requiredForPublicUrl: false,
    note: 'Optional today. Public festival archive/programme routes use the year field instead of slug.',
  },
  {
    type: 'partner',
    label: 'Partner / collaborator',
    titleField: 'name',
    requiredForPublicUrl: false,
    note: 'Optional today. Partners are referenced and rendered without slug-based routes.',
  },
  {
    type: 'person',
    label: 'Person / speaker / guest',
    titleField: 'name',
    requiredForPublicUrl: false,
    note: 'Optional today. Speakers/guests use document IDs for internal UI state.',
  },
  {
    type: 'event',
    label: 'Event',
    titleField: 'title',
    requiredForPublicUrl: false,
    note: 'Optional today. Festival programme pages do not route to event detail pages by slug.',
  },
  {
    type: 'post',
    label: 'Post / news',
    titleField: 'title',
    requiredForPublicUrl: true,
    route: '/news-media/[slug]',
  },
  {
    type: 'aboutJobListing',
    label: 'About job listing',
    titleField: 'title',
    requiredForPublicUrl: false,
    note: 'Optional today. Job listings render inline on About pages and do not have standalone routes.',
  },
  {
    type: 'youtubeVideo',
    label: 'YouTube video',
    titleField: 'title',
    requiredForPublicUrl: true,
    route: '/news-media/[slug]',
  },
  {
    type: 'page',
    label: 'General page',
    titleField: 'title',
    requiredForPublicUrl: false,
    note: 'Optional today. The current frontend does not expose a public route for this schema.',
  },
  {
    type: 'mediaGallery',
    label: 'Media gallery',
    titleField: 'title',
    requiredForPublicUrl: false,
    note: 'Optional today. The current frontend does not expose direct gallery routes by slug.',
  },
]

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const raw = fs.readFileSync(filePath, 'utf8')

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex <= 0) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function getSanityClient() {
  loadEnvFile(path.join(process.cwd(), '.env.local'))
  loadEnvFile(path.join(process.cwd(), '.env'))

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2026-05-27',
    useCdn: false,
    token,
    perspective: 'published',
  })
}

function parseArgs(argv) {
  return {
    strict: argv.includes('--strict'),
  }
}

function formatTargetSummary(target) {
  if (target.requiredForPublicUrl) {
    return `${target.label}: required for ${target.route}`
  }

  return `${target.label}: optional`
}

function printGroup(target, items) {
  const header = `${target.label} (${target.type})`
  console.log(`\n${header}`)
  console.log('-'.repeat(header.length))
  console.log(target.requiredForPublicUrl ? `Public route: ${target.route}` : target.note)

  for (const item of items) {
    console.log(`- ${item.label || 'Untitled'} | ${item._id} | missing slug.current`)
  }
}

async function main() {
  const {strict} = parseArgs(process.argv.slice(2))
  const client = getSanityClient()

  const rows =
    (await client.fetch(
      `*[
        _type in $types &&
        !(_id in path("drafts.**")) &&
        (!defined(slug.current) || slug.current == "")
      ] | order(_type asc, coalesce(title, name, _createdAt) asc){
        _id,
        _type,
        "label": coalesce(title, name, channelTitle, "Untitled")
      }`,
      {types: slugAuditTargets.map((target) => target.type)}
    )) || []

  const grouped = new Map(slugAuditTargets.map((target) => [target.type, []]))

  for (const row of rows) {
    const list = grouped.get(row._type)

    if (list) {
      list.push(row)
    }
  }

  console.log('Sanity slug audit')
  console.log('=================')
  console.log(`Checked ${slugAuditTargets.length} document types with slug fields.`)

  for (const target of slugAuditTargets) {
    console.log(`- ${formatTargetSummary(target)}`)
  }

  let missingTotal = 0
  let requiredMissingTotal = 0

  for (const target of slugAuditTargets) {
    const items = grouped.get(target.type) || []

    if (!items.length) {
      continue
    }

    missingTotal += items.length

    if (target.requiredForPublicUrl) {
      requiredMissingTotal += items.length
    }

    printGroup(target, items)
  }

  console.log('\nSummary')
  console.log('-------')
  console.log(`Missing slugs: ${missingTotal}`)
  console.log(`Missing required public slugs: ${requiredMissingTotal}`)
  console.log(`Strict mode: ${strict ? 'on' : 'off'}`)

  if (strict && requiredMissingTotal > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(`Slug audit failed: ${error.message}`)
  process.exitCode = 1
})
