import type {SanityClient} from 'sanity'
import type {SlugValidationContext} from '@sanity/types'

export const SANITY_API_VERSION = '2026-05-27'

export function defaultSlugify(input?: string, maxLength = 96) {
  const base = `${input || ''}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/['".,!?():]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base.slice(0, maxLength).replace(/-+$/g, '')
}

export function getPublishedDocumentId(documentId?: string) {
  return documentId?.replace(/^drafts\./, '')
}

export function getDraftDocumentId(documentId?: string) {
  const publishedId = getPublishedDocumentId(documentId)

  return publishedId ? `drafts.${publishedId}` : undefined
}

export async function isSlugUniqueForType({
  client,
  slug,
  type,
  documentId,
}: {
  client: SanityClient
  slug: string
  type: string
  documentId?: string
}) {
  if (!slug || !type) {
    return true
  }

  const publishedId = getPublishedDocumentId(documentId)
  const draftId = getDraftDocumentId(documentId)
  const duplicateCount = await client.fetch<number>(
    `count(*[
      _type == $type &&
      slug.current == $slug &&
      !(_id in [$draftId, $publishedId])
    ])`,
    {
      type,
      slug,
      draftId,
      publishedId,
    }
  )

  return duplicateCount === 0
}

export async function buildUniqueSlugForType({
  client,
  baseSlug,
  type,
  documentId,
}: {
  client: SanityClient
  baseSlug: string
  type: string
  documentId?: string
}) {
  if (!baseSlug) {
    return ''
  }

  const publishedId = getPublishedDocumentId(documentId)
  const draftId = getDraftDocumentId(documentId)
  const matchingSlugs =
    (await client.fetch<Array<{slug?: string}>>(
      `*[
        _type == $type &&
        (
          slug.current == $baseSlug ||
          slug.current match $slugPrefix
        ) &&
        !(_id in [$draftId, $publishedId])
      ]{
        "slug": slug.current
      }`,
      {
        type,
        baseSlug,
        slugPrefix: `${baseSlug}-*`,
        draftId,
        publishedId,
      }
    )) || []

  const used = new Set(matchingSlugs.map((item) => item.slug).filter((value): value is string => Boolean(value)))

  if (!used.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2

  while (used.has(`${baseSlug}-${suffix}`)) {
    suffix += 1
  }

  return `${baseSlug}-${suffix}`
}

export function createTypeScopedSlugIsUnique(type: string) {
  return async (slug: string, context: SlugValidationContext) => {
    const documentId = typeof context.document?._id === 'string' ? context.document._id : undefined
    const client = context.getClient({apiVersion: SANITY_API_VERSION})

    return isSlugUniqueForType({
      client,
      slug,
      type,
      documentId,
    })
  }
}
