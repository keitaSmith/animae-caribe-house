import fs from 'node:fs'
import path from 'node:path'
import {createClient} from 'next-sanity'

function loadEnvFile(filePath) {
  const fullPath = path.resolve(filePath)

  if (!fs.existsSync(fullPath)) {
    return
  }

  for (const line of fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) {
      continue
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)

    if (!match) {
      continue
    }

    const [, key, rawValue] = match
    let value = rawValue.trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env.local')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN
const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN
const applyChanges = process.argv.includes('--apply')

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}

if (!readToken) {
  throw new Error('Missing SANITY_API_READ_TOKEN or SANITY_API_TOKEN for inspection')
}

if (applyChanges && !writeToken) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN for apply mode')
}

const apiVersion = '2026-05-27'

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
  perspective: 'raw',
})

const writeClient =
  applyChanges
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token: writeToken,
        perspective: 'raw',
      })
    : null

const query = `*[_type == "festivalPage"]{
  _id,
  "eventRefs": eventsPreview.events[]{
    _key,
    _ref,
    _weak
  }
}`

function createPatchPath(refKey) {
  return `eventsPreview.events[_key=="${refKey}"]._weak`
}

async function main() {
  const docs = await readClient.fetch(query)
  const patches = docs
    .map((doc) => {
      const strongRefs = (doc.eventRefs || []).filter((ref) => ref?._ref && ref._weak !== true)

      return strongRefs.length ? {documentId: doc._id, strongRefs} : null
    })
    .filter(Boolean)

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? 'apply' : 'dry-run',
        dataset,
        documentsWithStrongFestivalPageEventRefs: patches.length,
        totalStrongRefs: patches.reduce((sum, patch) => sum + patch.strongRefs.length, 0),
        patches,
      },
      null,
      2
    )
  )

  if (!applyChanges || !writeClient || !patches.length) {
    return
  }

  for (const patch of patches) {
    const nextPatch = writeClient.patch(patch.documentId)

    for (const ref of patch.strongRefs) {
      nextPatch.set({
        [createPatchPath(ref._key)]: true,
      })
    }

    await nextPatch.commit({autoGenerateArrayKeys: false})
  }

  console.log('Applied weak-reference patches successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
