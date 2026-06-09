'use client'

import {useEffect, useMemo, useRef} from 'react'
import {PatchEvent, set, SlugInput, type SlugInputProps, useClient, useFormValue} from 'sanity'
import {SANITY_API_VERSION, buildUniqueSlugForType, defaultSlugify} from './slugUtils'

type SanityDocumentLike = {
  _id?: string
  _type?: string
  [key: string]: unknown
}

function resolveSourceValue(document: SanityDocumentLike | undefined, source: unknown) {
  if (!document || typeof source !== 'string') {
    return ''
  }

  const value = document[source]
  return typeof value === 'string' ? value : ''
}

export function AutoSlugInput(props: SlugInputProps) {
  const client = useClient({apiVersion: SANITY_API_VERSION})
  const documentValue = useFormValue([]) as SanityDocumentLike | undefined
  const requestedSource = props.schemaType.options?.source
  const sourceValue = useMemo(() => resolveSourceValue(documentValue, requestedSource), [documentValue, requestedSource])
  const currentSlug = props.value?.current || ''
  const lastAutoFillKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (props.readOnly || currentSlug || !sourceValue.trim()) {
      return
    }

    const documentType = documentValue?._type
    if (!documentType) {
      return
    }

    const baseSlug = defaultSlugify(sourceValue)
    if (!baseSlug) {
      return
    }

    const autofillKey = `${documentValue?._id || 'new'}:${sourceValue}`

    if (lastAutoFillKeyRef.current === autofillKey) {
      return
    }

    let isCancelled = false

    const run = async () => {
      const uniqueSlug = await buildUniqueSlugForType({
        client,
        baseSlug,
        type: documentType,
        documentId: documentValue?._id,
      })

      if (isCancelled || !uniqueSlug) {
        return
      }

      lastAutoFillKeyRef.current = autofillKey
      props.onChange(
        PatchEvent.from(
          set({
            _type: 'slug',
            current: uniqueSlug,
          })
        )
      )
    }

    void run()

    return () => {
      isCancelled = true
    }
  }, [client, currentSlug, documentValue?._id, documentValue?._type, props, props.readOnly, sourceValue])

  return <SlugInput {...props} />
}
