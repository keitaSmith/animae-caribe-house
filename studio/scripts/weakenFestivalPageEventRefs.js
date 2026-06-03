const {getCliClient} = require('sanity/cli')

const apiVersion = '2026-05-27'
const applyChanges = process.argv.includes('--apply')

const client = getCliClient({apiVersion})

const query = `*[_type == "festivalPage"]{
  _id,
  title,
  "eventRefs": eventsPreview.events[]{
    _key,
    _ref,
    _weak,
    "eventTitle": @->title
  }
}`

function createPatchPath(refKey) {
  return `eventsPreview.events[_key=="${refKey}"]._weak`
}

async function main() {
  const docs = await client.fetch(query)
  const patches = docs
    .map((doc) => {
      const strongRefs = (doc.eventRefs || []).filter((ref) => ref?._ref && ref._weak !== true)

      return strongRefs.length
        ? {
            documentId: doc._id,
            documentType: 'festivalPage',
            title: doc.title || null,
            strongRefs,
          }
        : null
    })
    .filter(Boolean)

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? 'apply' : 'dry-run',
        documentsWithStrongFestivalPageEventRefs: patches.length,
        totalStrongRefs: patches.reduce((sum, patch) => sum + patch.strongRefs.length, 0),
        patches,
      },
      null,
      2
    )
  )

  if (!applyChanges || !patches.length) {
    return
  }

  for (const patch of patches) {
    const nextPatch = client.patch(patch.documentId)

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
