import {defineArrayMember, defineField, defineType} from 'sanity'

const relatedExperienceOptions = [
  {title: 'Umbrella', value: 'umbrella'},
  {title: 'Festival', value: 'festival'},
  {title: 'House', value: 'house'},
]

const partnerTypeOptions = [
  {title: 'Partner', value: 'partner'},
  {title: 'Collaborator', value: 'collaborator'},
  {title: 'Sponsor', value: 'sponsor'},
  {title: 'Funder', value: 'funder'},
  {title: 'Venue', value: 'venue'},
  {title: 'Media partner', value: 'mediaPartner'},
  {title: 'Community partner', value: 'communityPartner'},
]

const eventTypeOptions = [
  {title: 'Screening', value: 'screening'},
  {title: 'Workshop', value: 'workshop'},
  {title: 'Panel', value: 'panel'},
  {title: 'Talk', value: 'talk'},
  {title: 'Networking', value: 'networking'},
  {title: 'Showcase', value: 'showcase'},
  {title: 'Community', value: 'community'},
]

const attendanceTypeOptions = [
  {title: 'Free', value: 'free'},
  {title: 'Paid', value: 'paid'},
  {title: 'Donation', value: 'donation'},
  {title: 'Registration required', value: 'registrationRequired'},
  {title: 'Invite only', value: 'inviteOnly'},
]

const buttonStyleOptions = [
  {title: 'Primary', value: 'primary'},
  {title: 'Soft', value: 'soft'},
  {title: 'Outline', value: 'outline'},
]

function fixedPreview(title: string, subtitle?: string) {
  return {
    prepare: () => ({
      title,
      subtitle,
    }),
  }
}

function formatPreviewDate(dateTime?: string) {
  if (!dateTime) {
    return undefined
  }

  const parsed = new Date(dateTime)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatPreviewDateRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    return undefined
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return undefined
  }

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    const month = new Intl.DateTimeFormat('en', {month: 'short'}).format(start)
    return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
  }

  if (sameYear) {
    const startLabel = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric'}).format(start)
    const endLabel = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric'}).format(end)
    return `${startLabel}–${endLabel}, ${start.getFullYear()}`
  }

  return `${formatPreviewDate(startDate)}–${formatPreviewDate(endDate)}`
}

function formatPreviewDateTime(dateTime?: string) {
  if (!dateTime) {
    return undefined
  }

  const parsed = new Date(dateTime)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed)
}

function elementVisibilityFields() {
  return [
    defineField({
      name: 'showEyebrow',
      title: 'Show eyebrow/label',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showTitle',
      title: 'Show title',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showDescription',
      title: 'Show description',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCta',
      title: 'Show CTA',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showMedia',
      title: 'Show image/video',
      type: 'boolean',
      initialValue: true,
    }),
  ]
}

const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'href', title: 'URL or path', type: 'string'}),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {list: ['primary', 'soft', 'outline']},
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
    },
    prepare: ({label, href}) => ({
      title: label || 'CTA',
      subtitle: href || 'Set label and destination',
    }),
  },
})

const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'href', title: 'URL or path', type: 'string'}),
    defineField({name: 'openInNewTab', title: 'Open in new tab', type: 'boolean'}),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
    },
    prepare: ({label, href}) => ({
      title: label || 'Link',
      subtitle: href || 'Add a destination',
    }),
  },
})

const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with alt text',
  type: 'image',
  options: {hotspot: true},
  fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
  preview: {
    select: {
      media: 'asset',
      title: 'alt',
    },
    prepare: ({media, title}) => ({
      title: title || 'Image',
      media,
    }),
  },
})

const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO fields',
  type: 'object',
  fields: [
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
    defineField({name: 'seoImage', title: 'Social image', type: 'imageWithAlt'}),
  ],
  preview: {
    select: {
      title: 'seoTitle',
      subtitle: 'seoDescription',
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'SEO fields',
      subtitle: subtitle || 'Set search and social metadata',
    }),
  },
})

const muxVideo = defineType({
  name: 'muxVideo',
  title: 'Mux video',
  type: 'object',
  description:
    'Use a Mux playback ID for hero/background video. Start, end, and poster settings are optional and should only be used when needed.',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'muxPlaybackId', title: 'Mux playback ID', type: 'string'}),
    defineField({name: 'muxAssetId', title: 'Mux asset ID', type: 'string'}),
    defineField({name: 'startTimeSeconds', title: 'Start time (seconds)', type: 'number'}),
    defineField({name: 'endTimeSeconds', title: 'End time (seconds)', type: 'number'}),
    defineField({
      name: 'posterMode',
      title: 'Poster mode',
      type: 'string',
      initialValue: 'fallbackImage',
      options: {
        list: [
          {title: 'Mux frame', value: 'muxFrame'},
          {title: 'Custom image', value: 'customImage'},
          {title: 'Fallback image', value: 'fallbackImage'},
        ],
      },
    }),
    defineField({
      name: 'posterTimeSeconds',
      title: 'Poster frame time (seconds)',
      type: 'number',
      hidden: ({parent}) => parent?.posterMode !== 'muxFrame',
    }),
    defineField({
      name: 'customPosterImage',
      title: 'Custom poster image',
      type: 'imageWithAlt',
      hidden: ({parent}) => parent?.posterMode !== 'customImage',
    }),
    defineField({
      name: 'fallbackImage',
      title: 'Fallback image',
      type: 'imageWithAlt',
    }),
    defineField({name: 'ariaLabel', title: 'Accessibility label', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'title',
      playbackId: 'muxPlaybackId',
      posterMode: 'posterMode',
    },
    prepare: ({title, playbackId, posterMode}) => ({
      title: title || 'Mux video',
      subtitle: playbackId ? `${playbackId} (${posterMode || 'poster'})` : 'Add a Mux playback ID',
    }),
  },
})

const videoShowreel = defineType({
  name: 'videoShowreel',
  title: 'Video showreel',
  type: 'object',
  description: 'Controls the reel button, modal, Mux playback ID, timing, and poster behavior.',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'label', title: 'Internal label', type: 'string'}),
    defineField({name: 'muxPlaybackId', title: 'Mux playback ID', type: 'string'}),
    defineField({name: 'muxAssetId', title: 'Mux asset ID', type: 'string'}),
    defineField({name: 'startTimeSeconds', title: 'Start time (seconds)', type: 'number'}),
    defineField({name: 'endTimeSeconds', title: 'End time (seconds)', type: 'number'}),
    defineField({
      name: 'posterMode',
      title: 'Poster mode',
      type: 'string',
      initialValue: 'fallbackImage',
      options: {
        list: [
          {title: 'Mux frame', value: 'muxFrame'},
          {title: 'Custom image', value: 'customImage'},
          {title: 'Fallback image', value: 'fallbackImage'},
        ],
      },
    }),
    defineField({
      name: 'posterTimeSeconds',
      title: 'Poster frame time (seconds)',
      type: 'number',
      hidden: ({parent}) => parent?.posterMode !== 'muxFrame',
    }),
    defineField({
      name: 'customPosterImage',
      title: 'Custom poster image',
      type: 'imageWithAlt',
      hidden: ({parent}) => parent?.posterMode !== 'customImage',
    }),
    defineField({name: 'fallbackImage', title: 'Fallback image', type: 'imageWithAlt'}),
    defineField({name: 'buttonLabel', title: 'Button label', type: 'string'}),
    defineField({name: 'modalTitle', title: 'Modal title', type: 'string'}),
    defineField({name: 'modalDescription', title: 'Modal description', type: 'text', rows: 3}),
    defineField({name: 'ariaLabel', title: 'ARIA label', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'title',
      label: 'buttonLabel',
      playbackId: 'muxPlaybackId',
    },
    prepare: ({title, label, playbackId}) => ({
      title: title || label || 'Showreel',
      subtitle: playbackId || 'Add a Mux playback ID',
    }),
  },
})

const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({name: 'platform', title: 'Platform', type: 'string'}),
    defineField({name: 'href', title: 'URL', type: 'url'}),
    defineField({name: 'label', title: 'Accessible label', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'href',
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'Social link',
      subtitle,
    }),
  },
})

const teaserSection = defineType({
  name: 'teaserSection',
  title: 'Teaser section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show title', type: 'boolean', initialValue: true}),
    defineField({name: 'showDescription', title: 'Show description', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
    defineField({name: 'plainText', title: 'Legacy plain text fallback', type: 'text', rows: 4, hidden: true}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Teaser section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}`,
    }),
  },
})

const joinFestivalSection = defineType({
  name: 'joinFestivalSection',
  title: 'Join the Festival section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show title', type: 'boolean', initialValue: true}),
    defineField({name: 'showDescription', title: 'Show description', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'cta'}),
    defineField({name: 'plainText', title: 'Legacy plain text fallback', type: 'text', rows: 4, hidden: true}),
    defineField({name: 'cta', title: 'Legacy single CTA fallback', type: 'cta', hidden: true}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Join the Festival section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}`,
    }),
  },
})

const festivalCalendarSection = defineType({
  name: 'festivalCalendarSection',
  title: 'Festival Calendar Image',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'calendarImage',
      title: 'Calendar / programme image',
      type: 'imageWithAlt',
      description: 'Upload the visible festival programme image. This image is also used inside the modal and is the source for the Download Calendar button.',
    }),
    defineField({
      name: 'modalTitle',
      title: 'Modal title',
      type: 'string',
      description: 'Optional heading shown inside the enlarged image modal.',
    }),
    defineField({
      name: 'downloadLabel',
      title: 'Download button label',
      type: 'string',
      description: 'Text shown on the download action button.',
    }),
    defineField({
      name: 'downloadButtonStyle',
      title: 'Download button style',
      type: 'string',
      options: {list: buttonStyleOptions},
      description: 'Choose which existing site button style the Download button should use.',
    }),
    defineField({
      name: 'downloadFile',
      title: 'Legacy download file',
      type: 'file',
      description: 'Legacy field no longer used on the Festival landing page. The Download button now uses the uploaded calendar image automatically.',
      options: {accept: '.pdf,image/*'},
      hidden: true,
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Legacy download URL',
      type: 'url',
      description: 'Legacy field no longer used on the Festival landing page. The Download button now uses the uploaded calendar image automatically.',
      hidden: true,
    }),
    defineField({
      name: 'shareLabel',
      title: 'Legacy share label',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'calendarImage',
      isVisible: 'isVisible',
    },
    prepare: ({title, media, isVisible}) => ({
      title: title || 'Festival Calendar Image',
      subtitle: isVisible === false ? 'Hidden' : 'Visible',
      media,
    }),
  },
})

const venueMapSection = defineType({
  name: 'venueMapSection',
  title: 'Venue / Location Map',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'venueName', title: 'Venue name', type: 'string'}),
    defineField({name: 'address', title: 'Address', type: 'text', rows: 3}),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps embed URL',
      type: 'url',
      description: 'Paste a standard Google Maps embed URL copied from the Google Maps share/embed dialog. No API key is required.',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps link',
      type: 'url',
      description: 'Optional Google Maps link used for the “Open in Google Maps” style button.',
    }),
    defineField({
      name: 'mapCtaLabel',
      title: 'Map CTA label',
      type: 'string',
      description: 'Controls the text for the Google Maps link button.',
    }),
    defineField({
      name: 'mapButtonStyle',
      title: 'Google Maps button style',
      type: 'string',
      options: {list: buttonStyleOptions},
      description: 'Choose which existing site button style the Google Maps button should use.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'venueName',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Venue / Location Map',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}`,
    }),
  },
})

const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showBody', title: 'Show body copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'showImage', title: 'Show image', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({name: 'plainText', title: 'Plain text fallback', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Rich text section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const simpleCardItem = defineType({
  name: 'simpleCardItem',
  title: 'Card item',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this card', type: 'boolean', initialValue: true}),
    defineField({name: 'number', title: 'Number/label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'number',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Card item',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}`,
    }),
  },
})

const cardItem = defineType({
  name: 'cardItem',
  title: 'Card item',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this card', type: 'boolean', initialValue: true}),
    defineField({name: 'number', title: 'Number/label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Image or icon', type: 'imageWithAlt'}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'number',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Card item',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const cardGridSection = defineType({
  name: 'cardGridSection',
  title: 'Card grid section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showIntro', title: 'Show intro copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro copy', type: 'text', rows: 3}),
    defineField({name: 'cards', title: 'Cards', type: 'array', of: [defineArrayMember({type: 'cardItem'})]}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      count: 'cards.length',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, count, isVisible}) => ({
      title: title || 'Card grid section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}${typeof count === 'number' ? ` • ${count} cards` : ''}`,
    }),
  },
})

const simpleCardGridSection = defineType({
  name: 'simpleCardGridSection',
  title: 'Card grid section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show title', type: 'boolean', initialValue: true}),
    defineField({name: 'showDescription', title: 'Show description', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'cards', title: 'Cards', type: 'array', of: [defineArrayMember({type: 'simpleCardItem'})]}),
    defineField({name: 'intro', title: 'Legacy intro fallback', type: 'text', rows: 3, hidden: true}),
    defineField({name: 'cta', title: 'Legacy CTA fallback', type: 'cta', hidden: true}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      count: 'cards.length',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, count, isVisible}) => ({
      title: title || 'Card grid section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}${typeof count === 'number' ? ` · ${count} cards` : ''}`,
    }),
  },
})

const ecosystemSection = defineType({
  name: 'ecosystemSection',
  title: 'Ecosystem section',
  type: 'object',
  description: 'Controls the ecosystem section on the umbrella homepage, including its own CTA.',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showIntro', title: 'Show intro copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCards', title: 'Show cards/items', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show ecosystem CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro/copy', type: 'text', rows: 3}),
    defineField({name: 'cards', title: 'Cards/items', type: 'array', of: [defineArrayMember({type: 'simpleCardItem'})]}),
    defineField({
      name: 'cta',
      title: 'Ecosystem CTA',
      type: 'cta',
      description: 'This controls the CTA currently shown in the umbrella ecosystem section.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Ecosystem section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const festivalHeroSection = defineType({
  name: 'festivalHeroSection',
  title: 'Festival hero section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({name: 'copy', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'cta'}),
    defineField({
      name: 'backgroundVideo',
      title: 'Hero background video',
      type: 'muxVideo',
      description: 'Controls the cinematic looping background video inside the Festival hero.',
    }),
    defineField({
      name: 'showreel',
      title: 'Watch Showreel modal video',
      type: 'videoShowreel',
      description: 'Controls the Festival hero Watch Showreel button, the Festival menu Watch Showreel button, and the modal video.',
    }),
    defineField({name: 'ctas', title: 'Legacy CTA buttons', type: 'array', of: [defineArrayMember({type: 'cta'})], hidden: true}),
    defineField({name: 'backgroundImage', title: 'Legacy background image', type: 'imageWithAlt', hidden: true}),
  ],
  preview: {
    select: {
      title: 'heading',
      isVisible: 'isVisible',
    },
    prepare: ({title, isVisible}) => ({
      title: title || 'Festival hero section',
      subtitle: isVisible === false ? 'Hidden' : 'Visible',
    }),
  },
})

const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showCopy', title: 'Show copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCtas', title: 'Show CTA buttons', type: 'boolean', initialValue: true}),
    defineField({name: 'showLogo', title: 'Show hero logo', type: 'boolean', initialValue: true}),
    defineField({name: 'showBackgroundMedia', title: 'Show background image/video', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'copy', title: 'Copy', type: 'text', rows: 3}),
    defineField({name: 'logo', title: 'Hero logo', type: 'imageWithAlt'}),
    defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
    defineField({name: 'backgroundVideo', title: 'Background video', type: 'muxVideo'}),
    defineField({name: 'showreel', title: 'Showreel', type: 'videoShowreel'}),
    defineField({name: 'ctas', title: 'CTA buttons', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Hero section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const splitHeroPanel = defineType({
  name: 'splitHeroPanel',
  title: 'Split hero panel',
  type: 'object',
  fields: [
    ...elementVisibilityFields(),
    defineField({name: 'eyebrow', title: 'Eyebrow/label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
    defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
    defineField({
      name: 'video',
      title: 'Mux video',
      type: 'muxVideo',
      description: 'Use this to control the panel background video and thumbnail behavior.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eyebrow',
      showMedia: 'showMedia',
    },
    prepare: ({title, subtitle, showMedia}) => ({
      title: title || 'Split hero panel',
      subtitle: `${showMedia === false ? 'Media hidden' : 'Media visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const splitHeroSection = defineType({
  name: 'splitHeroSection',
  title: 'Split hero section',
  type: 'object',
  description: 'The umbrella homepage hero is made of two panels only: House on the left and Festival on the right.',
  fields: [
    defineField({name: 'isVisible', title: 'Show split hero', type: 'boolean', initialValue: true}),
    defineField({
      name: 'leftPanel',
      title: 'Left panel: Animae Caribe House',
      type: 'splitHeroPanel',
      description: 'Controls the left panel of the homepage split hero.',
    }),
    defineField({
      name: 'rightPanel',
      title: 'Right panel: Animae Caribe Festival',
      type: 'splitHeroPanel',
      description: 'Controls the right panel of the homepage split hero.',
    }),
  ],
  preview: fixedPreview('Split Hero', 'Two-panel umbrella homepage hero'),
})

const partnersMarqueeSection = defineType({
  name: 'partnersMarqueeSection',
  title: 'Partners & collaborators section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'partners',
      title: 'Selected partners',
      type: 'array',
      description:
        'If you choose partners here, the frontend will respect this manual order. If left empty, it falls back to experience-based partner queries.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'partner'}]})],
    }),
    defineField({name: 'heading', title: 'Legacy title fallback', type: 'string', hidden: true}),
    defineField({name: 'intro', title: 'Legacy intro fallback', type: 'text', rows: 3, hidden: true}),
    defineField({name: 'cta', title: 'Legacy CTA fallback', type: 'cta', hidden: true}),
  ],
  preview: {
    select: {
      eyebrow: 'eyebrow',
      count: 'partners.length',
      isVisible: 'isVisible',
    },
    prepare: ({eyebrow, count, isVisible}) => ({
      title: eyebrow || 'Partners & collaborators section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${typeof count === 'number' ? ` · ${count} selected` : ''}`,
    }),
  },
})

const partnerSectionSettings = defineType({
  name: 'partnerSectionSettings',
  title: 'Partner section settings',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showIntro', title: 'Show intro copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro copy', type: 'text', rows: 3}),
    defineField({
      name: 'partners',
      title: 'Selected partners',
      type: 'array',
      description:
        'If you choose partners here, the frontend will respect this manual order. If left empty, it falls back to experience-based partner queries.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'partner'}]})],
    }),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'heading',
      count: 'partners.length',
      isVisible: 'isVisible',
    },
    prepare: ({title, count, isVisible}) => ({
      title: title || 'Partner section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${typeof count === 'number' ? ` • ${count} selected` : ''}`,
    }),
  },
})

const festivalEventsSection = defineType({
  name: 'festivalEventsSection',
  title: 'Upcoming events section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show title', type: 'boolean', initialValue: true}),
    defineField({name: 'showDescription', title: 'Show description', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label shown above the section title.',
    }),
    defineField({name: 'heading', title: 'Title', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Intro text shown below the heading.',
    }),
    defineField({
      name: 'festivalEdition',
      title: 'Festival Year / Edition',
      type: 'reference',
      to: [{type: 'festivalEdition'}],
      description:
        'Select the festival edition whose events should be shown, for example “Animae Caribe Festival 2026”.',
    }),
    defineField({
      name: 'maxEvents',
      title: 'Maximum number of events',
      type: 'number',
      description: 'Choose how many upcoming events to show in this section.',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
    defineField({
      name: 'events',
      title: 'Legacy manual event selection',
      type: 'array',
      description: 'Deprecated manual fallback. Upcoming events are now selected automatically by Festival Year / Edition.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'event'}]})],
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'festivalEdition.title',
      maxEvents: 'maxEvents',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, maxEvents, isVisible}) => ({
      title: title || 'Upcoming events section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` · ${subtitle}` : ''}${maxEvents ? ` · max ${maxEvents}` : ''}`,
    }),
  },
})

const eventsPreviewSection = defineType({
  name: 'eventsPreviewSection',
  title: 'Events preview section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showIntro', title: 'Show intro copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro copy', type: 'text', rows: 3}),
    defineField({
      name: 'events',
      title: 'Featured events',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'event'}]})],
    }),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'heading',
      count: 'events.length',
      isVisible: 'isVisible',
    },
    prepare: ({title, count, isVisible}) => ({
      title: title || 'Events preview',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${typeof count === 'number' ? ` • ${count} selected` : ''}`,
    }),
  },
})

const archiveTeaserSection = defineType({
  name: 'archiveTeaserSection',
  title: 'Archive teaser section',
  type: 'object',
  fields: [
    defineField({name: 'isVisible', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'showEyebrow', title: 'Show eyebrow/label', type: 'boolean', initialValue: true}),
    defineField({name: 'showHeading', title: 'Show heading', type: 'boolean', initialValue: true}),
    defineField({name: 'showCopy', title: 'Show copy', type: 'boolean', initialValue: true}),
    defineField({name: 'showCta', title: 'Show CTA', type: 'boolean', initialValue: true}),
    defineField({name: 'showImage', title: 'Show image', type: 'boolean', initialValue: true}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'copy', title: 'Copy', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'}),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      isVisible: 'isVisible',
    },
    prepare: ({title, subtitle, isVisible}) => ({
      title: title || 'Archive teaser section',
      subtitle: `${isVisible === false ? 'Hidden' : 'Visible'}${subtitle ? ` • ${subtitle}` : ''}`,
    }),
  },
})

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site title', type: 'string'}),
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seoFields'}),
    defineField({name: 'whiteLogo', title: 'White Animae Caribe logo', type: 'imageWithAlt'}),
    defineField({name: 'blackLogo', title: 'Black Animae Caribe logo', type: 'imageWithAlt'}),
    defineField({name: 'navigationLinks', title: 'Navigation links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
    defineField({name: 'footerLinks', title: 'Footer links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
    defineField({name: 'contactEmail', title: 'Contact email', type: 'email'}),
    defineField({name: 'contactPhone', title: 'Contact phone', type: 'string'}),
    defineField({name: 'location', title: 'Address/location', type: 'string'}),
    defineField({name: 'socialLinks', title: 'Social links', type: 'array', of: [defineArrayMember({type: 'socialLink'})]}),
    defineField({name: 'footerCopy', title: 'Footer copy', type: 'text', rows: 3}),
    defineField({name: 'defaultCtas', title: 'Default CTAs', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
  ],
  preview: fixedPreview('Site Settings', 'Global navigation, footer, contact, and logo settings'),
})

const umbrellaHomePage = defineType({
  name: 'umbrellaHomePage',
  title: 'Umbrella homepage',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
    defineField({name: 'splitHero', title: 'Split hero', type: 'splitHeroSection'}),
    defineField({name: 'aboutSection', title: 'About section', type: 'teaserSection'}),
    defineField({name: 'partnersSection', title: 'Partners/collaborators section', type: 'partnersMarqueeSection'}),
    defineField({
      name: 'ecosystemSection',
      title: 'Ecosystem section',
      type: 'ecosystemSection',
      description: 'Controls the ecosystem heading, copy, cards, and its CTA on the homepage.',
    }),
  ],
  preview: fixedPreview('Umbrella Homepage', 'animaecaribe.com root page'),
})

const festivalPage = defineType({
  name: 'festivalPage',
  title: 'Festival page',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
    defineField({name: 'hero', title: 'Hero', type: 'festivalHeroSection'}),
    defineField({name: 'aboutSection', title: 'About section', type: 'teaserSection'}),
    defineField({name: 'partnersSection', title: 'Partners section', type: 'partnersMarqueeSection'}),
    defineField({name: 'programmingSection', title: 'Programming/highlights', type: 'simpleCardGridSection'}),
    defineField({name: 'calendarSection', title: 'Festival Calendar Image', type: 'festivalCalendarSection'}),
    defineField({name: 'eventsPreview', title: 'Events/programme preview', type: 'festivalEventsSection'}),
    defineField({name: 'venueSection', title: 'Venue / Location Map', type: 'venueMapSection'}),
    defineField({name: 'archiveTeaser', title: 'Past Editions', type: 'teaserSection'}),
    defineField({name: 'finalCta', title: 'Join the Festival', type: 'joinFestivalSection'}),
  ],
  preview: fixedPreview('Festival Page', 'animaecaribe.com/festival'),
})

const housePage = defineType({
  name: 'housePage',
  title: 'House page',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection'}),
    defineField({name: 'aboutSection', title: 'About section', type: 'richTextSection'}),
    defineField({name: 'partnersSection', title: 'Partners section', type: 'partnerSectionSettings'}),
    defineField({name: 'servicesSection', title: 'House service cards', type: 'cardGridSection'}),
    defineField({name: 'featuredWorkSection', title: 'Featured work section', type: 'richTextSection'}),
    defineField({name: 'statsSection', title: 'Stats section', type: 'cardGridSection'}),
    defineField({name: 'teamSection', title: 'Team teaser', type: 'richTextSection'}),
    defineField({name: 'festivalTeaserSection', title: 'Festival teaser', type: 'richTextSection'}),
    defineField({name: 'newsSection', title: 'News teaser', type: 'richTextSection'}),
    defineField({name: 'faqSection', title: 'FAQ content', type: 'array', of: [defineArrayMember({type: 'cardItem'})]}),
    defineField({name: 'ctaSection', title: 'CTA section', type: 'archiveTeaserSection'}),
  ],
  preview: fixedPreview('House Page', 'animaecaribehouse.com experience'),
})

const festivalEdition = defineType({
  name: 'festivalEdition',
  title: 'Festival edition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The public name of the festival edition, e.g. “Animae Caribe Festival 2026”.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
      defineField({
        name: 'year',
        title: 'Year',
        type: 'number',
        description: 'The year this edition belongs to.',
      }),
      defineField({
        name: 'theme',
        title: 'Theme',
        type: 'string',
        description: 'Optional public festival theme for this edition.',
      }),
      defineField({name: 'startDate', title: 'Start date', type: 'date'}),
      defineField({name: 'endDate', title: 'End date', type: 'date'}),
      defineField({name: 'location', title: 'Location', type: 'string'}),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 4,
        description: 'Optional year-specific overview copy used by programme pages and the current Festival landing page.',
      }),
      defineField({
        name: 'calendarImage',
        title: 'Legacy festival calendar / programme image',
        type: 'imageWithAlt',
        description: 'Legacy field not currently used on the Festival landing page. The current calendar image is managed from the Festival Page document.',
        hidden: true,
      }),
      defineField({
        name: 'calendarDownloadFile',
        title: 'Legacy festival calendar download file',
        type: 'file',
        description: 'Legacy field not currently used on the Festival landing page.',
        options: {accept: '.pdf,image/*'},
        hidden: true,
      }),
      defineField({
        name: 'calendarDownloadUrl',
        title: 'Legacy festival calendar download URL',
        type: 'url',
        description: 'Legacy field not currently used on the Festival landing page.',
        hidden: true,
      }),
      defineField({
        name: 'venueName',
        title: 'Legacy venue name',
        type: 'string',
        description: 'Legacy field not currently used on the Festival landing page. Venue / map content is managed from the Festival Page document.',
        hidden: true,
      }),
      defineField({
        name: 'venueAddress',
        title: 'Legacy venue address',
        type: 'text',
        rows: 3,
        description: 'Legacy field not currently used on the Festival landing page. Venue / map content is managed from the Festival Page document.',
        hidden: true,
      }),
      defineField({
        name: 'googleMapsEmbedUrl',
        title: 'Legacy Google Maps embed URL',
        type: 'url',
        description: 'Legacy field not currently used on the Festival landing page.',
        hidden: true,
      }),
      defineField({
        name: 'googleMapsUrl',
        title: 'Legacy Google Maps link',
        type: 'url',
        description: 'Legacy field not currently used on the Festival landing page.',
        hidden: true,
      }),
      defineField({
        name: 'isActive',
        title: 'Active edition',
        type: 'boolean',
        initialValue: false,
        description:
          'Only one Festival Edition should be active at a time. The active edition controls the current Festival page, current programme links, and year-specific festival content.',
        validation: (Rule) =>
          Rule.custom(async (value, context) => {
            if (!value) {
              return true
            }

            const currentId = context.document?._id?.replace(/^drafts\./, '')
            const draftId = currentId ? `drafts.${currentId}` : context.document?._id
            const client = context.getClient({apiVersion: '2026-05-27'})
            const activeCount = await client.fetch<number>(
              `count(*[_type == "festivalEdition" && isActive == true && !(_id in [$draftId, $publishedId])])`,
              {
                draftId,
                publishedId: currentId || context.document?._id,
              }
            )

            if (activeCount > 0) {
              return 'Only one Festival Edition can be active at a time. Unset the current active edition first.'
            }

            return true
          }),
      }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      isActive: 'isActive',
      startDate: 'startDate',
      endDate: 'endDate',
      location: 'location',
    },
    prepare: ({title, year, isActive, startDate, endDate, location}) => {
      const previewTitle = title || (year ? `Animae Caribe Festival ${year}` : 'Festival Edition')
      const parts: string[] = []

      const dateRange = formatPreviewDateRange(startDate, endDate)

      if (dateRange) {
        parts.push(dateRange)
      } else if (year) {
        parts.push(String(year))
      }

      if (isActive) {
        parts.push('Active')
      }

      if (location) {
        parts.push(location)
      }

      return {
        title: previewTitle,
        subtitle: parts.join(' · ') || 'Festival Edition',
      }
    },
  },
})

const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt'}),
    defineField({name: 'website', title: 'Website', type: 'url'}),
    defineField({
      name: 'partnerTypes',
      title: 'Partner types',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: partnerTypeOptions},
      description: 'A partner can belong to more than one category.',
    }),
    defineField({
      name: 'relatedExperiences',
      title: 'Related experiences',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: relatedExperienceOptions},
      description: 'A partner can appear across umbrella, festival, and house.',
    }),
    defineField({
      name: 'partnerType',
      title: 'Legacy partner type',
      type: 'string',
      options: {list: partnerTypeOptions},
      hidden: true,
    }),
    defineField({
      name: 'relatedExperience',
      title: 'Legacy related experience',
      type: 'string',
      options: {list: relatedExperienceOptions},
      hidden: true,
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'sortOrder', title: 'Sort order', type: 'number'}),
    defineField({name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {
      title: 'name',
      experiences: 'relatedExperiences',
      legacyExperience: 'relatedExperience',
    },
    prepare: ({title, experiences, legacyExperience}) => ({
      title: title || 'Partner',
      subtitle:
        experiences?.length ? experiences.join(', ') : legacyExperience ? String(legacyExperience) : 'Partner document',
    }),
  },
})

const person = defineType({
  name: 'person',
  title: 'Person / speaker / guest',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'role', title: 'Role/title', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({name: 'links', title: 'Links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Person',
      subtitle,
      media,
    }),
  },
})

const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'festivalEdition',
      title: 'Festival Year / Edition',
      type: 'reference',
      to: [{type: 'festivalEdition'}],
      description:
        'Select the festival year this event belongs to, for example “Animae Caribe Festival 2026”. This helps group events by festival edition and supports future archive pages.',
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start date & time',
      type: 'datetime',
      description: 'The full start date and time for this event.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End date & time',
      type: 'datetime',
      description: 'The full end date and time for this event.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startValue = context.document?.startDateTime

          if (typeof value !== 'string' || typeof startValue !== 'string') {
            return true
          }

          return new Date(value).getTime() >= new Date(startValue).getTime()
            ? true
            : 'End date & time cannot be before the start date & time.'
        }),
    }),
    defineField({
      name: 'date',
      title: 'Legacy date fallback',
      type: 'date',
      description: 'Legacy fallback for older event documents. Use Start date & time instead for new content.',
    }),
    defineField({
      name: 'startTime',
      title: 'Legacy start time fallback',
      type: 'string',
      description: 'Legacy fallback for older event documents. Use Start date & time instead for new content.',
    }),
    defineField({
      name: 'endTime',
      title: 'Legacy end time fallback',
      type: 'string',
      description: 'Legacy fallback for older event documents. Use End date & time instead for new content.',
    }),
    defineField({name: 'venue', title: 'Venue/location', type: 'string'}),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      options: {list: eventTypeOptions},
    }),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Legacy body content', type: 'array', of: [defineArrayMember({type: 'block'})], hidden: true}),
    defineField({name: 'image', title: 'Legacy image', type: 'imageWithAlt', hidden: true}),
    defineField({
      name: 'speakers',
      title: 'Legacy speakers/guests',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
      hidden: true,
    }),
    defineField({name: 'isFeatured', title: 'Legacy featured flag', type: 'boolean', initialValue: false, hidden: true}),
    defineField({
      name: 'attendanceType',
      title: 'Attendance type',
      type: 'string',
      options: {list: attendanceTypeOptions},
    }),
    defineField({name: 'priceLabel', title: 'Legacy price label', type: 'string', hidden: true}),
    defineField({name: 'priceAmount', title: 'Legacy price amount', type: 'number', hidden: true}),
    defineField({name: 'currency', title: 'Legacy currency', type: 'string', hidden: true}),
    defineField({name: 'ticketUrl', title: 'Legacy ticket URL', type: 'url', hidden: true}),
    defineField({name: 'registrationUrl', title: 'Legacy registration URL', type: 'url', hidden: true}),
    defineField({name: 'buttonLabel', title: 'Legacy button label', type: 'string', hidden: true}),
  ],
  preview: {
    select: {
      title: 'title',
      startDateTime: 'startDateTime',
      legacyDate: 'date',
      legacyStartTime: 'startTime',
      editionTitle: 'festivalEdition.title',
      editionYear: 'festivalEdition.year',
    },
    prepare: ({title, startDateTime, legacyDate, legacyStartTime, editionTitle, editionYear}) => {
      const previewTitle = title || 'Event'
      const timeLabel = formatPreviewDateTime(startDateTime)
      const editionLabel = editionTitle || (editionYear ? `Animae Caribe Festival ${editionYear}` : undefined)

      if (timeLabel) {
        return {
          title: previewTitle,
          subtitle: [timeLabel, editionLabel].filter(Boolean).join(' · '),
        }
      }

      if (legacyDate || legacyStartTime) {
        return {
          title: previewTitle,
          subtitle: [legacyDate, legacyStartTime, editionLabel].filter(Boolean).join(' · '),
        }
      }

      return {
        title: previewTitle,
        subtitle: 'Start date/time missing',
      }
    },
  },
})

const post = defineType({
  name: 'post',
  title: 'Post / news',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'date', title: 'Date', type: 'datetime'}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'featuredImage', title: 'Featured image', type: 'imageWithAlt'}),
    defineField({name: 'categories', title: 'Categories/tags', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'relatedExperience', title: 'Related experience', type: 'string', options: {list: relatedExperienceOptions}}),
    defineField({name: 'relatedFestivalEdition', title: 'Related festival edition', type: 'reference', to: [{type: 'festivalEdition'}]}),
    defineField({name: 'originalWordPressUrl', title: 'Original WordPress URL', type: 'url'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'featuredImage',
    },
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Post',
      subtitle,
      media,
    }),
  },
})

const page = defineType({
  name: 'page',
  title: 'General page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'relatedExperience', title: 'Related experience', type: 'string', options: {list: relatedExperienceOptions}}),
    defineField({
      name: 'sections',
      title: 'Flexible sections',
      type: 'array',
      of: [
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'cardGridSection'}),
        defineArrayMember({type: 'partnerSectionSettings'}),
        defineArrayMember({type: 'archiveTeaserSection'}),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'Page',
      subtitle,
    }),
  },
})

const mediaGallery = defineType({
  name: 'mediaGallery',
  title: 'Media gallery',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'relatedExperience', title: 'Related experience', type: 'string', options: {list: relatedExperienceOptions}}),
    defineField({name: 'relatedFestivalEdition', title: 'Related festival edition', type: 'reference', to: [{type: 'festivalEdition'}]}),
    defineField({name: 'images', title: 'Images', type: 'array', of: [defineArrayMember({type: 'imageWithAlt'})]}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'relatedExperience',
      media: 'images.0',
    },
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Media gallery',
      subtitle,
      media,
    }),
  },
})

export const schemaTypes = [
  cta,
  link,
  imageWithAlt,
  seoFields,
  muxVideo,
    videoShowreel,
    socialLink,
    teaserSection,
    joinFestivalSection,
    festivalCalendarSection,
    venueMapSection,
    richTextSection,
  simpleCardItem,
  cardItem,
  cardGridSection,
  simpleCardGridSection,
  ecosystemSection,
  festivalHeroSection,
  heroSection,
  splitHeroPanel,
  splitHeroSection,
  partnersMarqueeSection,
  partnerSectionSettings,
  festivalEventsSection,
  eventsPreviewSection,
  archiveTeaserSection,
  siteSettings,
  umbrellaHomePage,
  festivalPage,
  housePage,
  festivalEdition,
  event,
  partner,
  post,
  page,
  mediaGallery,
  person,
]
