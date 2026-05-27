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

function fixedPreview(title: string, subtitle?: string) {
  return {
    prepare: () => ({
      title,
      subtitle,
    }),
  }
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
    defineField({name: 'cards', title: 'Cards/items', type: 'array', of: [defineArrayMember({type: 'cardItem'})]}),
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
    defineField({name: 'aboutSection', title: 'About section', type: 'richTextSection'}),
    defineField({name: 'partnersSection', title: 'Partners/collaborators section', type: 'partnerSectionSettings'}),
    defineField({
      name: 'ecosystemSection',
      title: 'Ecosystem section',
      type: 'ecosystemSection',
      description: 'Controls the ecosystem heading, copy, cards, and its CTA on the homepage.',
    }),
    defineField({name: 'footerNote', title: 'Footer note', type: 'text', rows: 3}),
  ],
  preview: fixedPreview('Umbrella Homepage', 'animaecaribe.com root page'),
})

const festivalPage = defineType({
  name: 'festivalPage',
  title: 'Festival page',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection'}),
    defineField({name: 'aboutSection', title: 'About section', type: 'richTextSection'}),
    defineField({name: 'partnersSection', title: 'Partners section', type: 'partnerSectionSettings'}),
    defineField({name: 'programmingSection', title: 'Programming/highlights', type: 'cardGridSection'}),
    defineField({name: 'eventsPreview', title: 'Events/programme preview', type: 'eventsPreviewSection'}),
    defineField({name: 'archiveTeaser', title: 'Past editions/archive teaser', type: 'archiveTeaserSection'}),
    defineField({name: 'finalCta', title: 'Final CTA', type: 'archiveTeaserSection'}),
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
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'year', title: 'Year', type: 'number'}),
    defineField({name: 'theme', title: 'Theme', type: 'string'}),
    defineField({name: 'startDate', title: 'Start date', type: 'date'}),
    defineField({name: 'endDate', title: 'End date', type: 'date'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'heroImage', title: 'Hero/key image', type: 'imageWithAlt'}),
    defineField({name: 'isActive', title: 'Active edition', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'Festival edition',
      subtitle: subtitle ? String(subtitle) : undefined,
    }),
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
    defineField({name: 'festivalEdition', title: 'Festival edition', type: 'reference', to: [{type: 'festivalEdition'}]}),
    defineField({name: 'date', title: 'Date', type: 'date'}),
    defineField({name: 'startTime', title: 'Start time', type: 'string'}),
    defineField({name: 'endTime', title: 'End time', type: 'string'}),
    defineField({name: 'venue', title: 'Venue/location', type: 'string'}),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      options: {list: eventTypeOptions},
    }),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({
      name: 'speakers',
      title: 'Speakers/guests',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
    }),
    defineField({name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({
      name: 'attendanceType',
      title: 'Attendance type',
      type: 'string',
      options: {list: attendanceTypeOptions},
    }),
    defineField({name: 'priceLabel', title: 'Price label', type: 'string'}),
    defineField({name: 'priceAmount', title: 'Price amount', type: 'number'}),
    defineField({name: 'currency', title: 'Currency', type: 'string'}),
    defineField({name: 'ticketUrl', title: 'Ticket URL', type: 'url'}),
    defineField({name: 'registrationUrl', title: 'Registration URL', type: 'url'}),
    defineField({name: 'buttonLabel', title: 'Button label', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
    prepare: ({title, subtitle}) => ({
      title: title || 'Event',
      subtitle,
    }),
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
  richTextSection,
  cardItem,
  cardGridSection,
  ecosystemSection,
  heroSection,
  splitHeroPanel,
  splitHeroSection,
  partnerSectionSettings,
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
