import type {SanityAboutSectionPageType} from '@/sanity/lib/types';

export type AboutSectionPageFallback = {
  slug: string;
  pageType: SanityAboutSectionPageType;
  title: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  content: {
    heading: string;
    subheading?: string;
    paragraphs: string[];
  };
};

export const aboutSectionFallbacks: Record<string, AboutSectionPageFallback> = {
  'directors-remarks': {
    slug: 'directors-remarks',
    pageType: 'directorsRemarks',
    title: "Director's Remarks",
    hero: {
      eyebrow: "Director's Remarks",
      title: 'A message from the Animae Caribe director.',
      description:
        'Annual reflections, context, and welcome notes from the creative leadership behind Animae Caribe.',
    },
    content: {
      heading: "Director's Remarks",
      subheading: 'A yearly note for our community, collaborators, and guests.',
      paragraphs: [
        'Use Sanity to add the current annual remarks, optional director image, and optional YouTube message for this page.',
      ],
    },
  },
  'community-outreach': {
    slug: 'community-outreach',
    pageType: 'communityOutreach',
    title: 'Community Outreach',
    hero: {
      eyebrow: 'Community Outreach',
      title: 'Animation as a bridge into communities.',
      description:
        'Programmes, workshops, and creative encounters that bring Animae Caribe into classrooms, communities, and public spaces.',
    },
    content: {
      heading: 'Community Outreach',
      subheading: 'Building access, confidence, and creative possibility through animation.',
      paragraphs: [
        'Add the full Community Outreach write-up and gallery images in Sanity to publish this page.',
      ],
    },
  },
  'iamm-network': {
    slug: 'iamm-network',
    pageType: 'iammNetwork',
    title: 'IAMM Network',
    hero: {
      eyebrow: 'IAMM Network',
      title: 'A regional and international animation network.',
      description:
        'Connecting artists, producers, educators, institutions, and partners across animation, media, and digital creativity.',
    },
    content: {
      heading: 'IAMM Network',
      subheading: 'A connected network for animation, media, and creative collaboration.',
      paragraphs: [
        'Add IAMM Network copy in Sanity to explain the programme, partners, and opportunities.',
      ],
    },
  },
  'live-work-play-local': {
    slug: 'live-work-play-local',
    pageType: 'liveWorkPlayLocal',
    title: 'Live Work & Play Like a Local',
    hero: {
      eyebrow: 'Caribbean Digital Nomad Programme',
      title: 'Live Work & Play Like a Local',
      description:
        'With an abundance of digital talent, T&T is the perfect location to Live, Work and Play like a Local.',
    },
    content: {
      heading: 'Caribbean Digital Nomad Programme',
      subheading: 'Employment Opportunity · Recruitment Portal - #Animate in Sunshine',
      paragraphs: [
        'Be a Caribbean Digital Nomad for the animation and game sector and experience #islandlifebliss.',
      ],
    },
  },
  'ac-toon-marketplace': {
    slug: 'ac-toon-marketplace',
    pageType: 'acToonMarketplace',
    title: 'AC Toon Marketplace',
    hero: {
      eyebrow: 'Marketplace',
      title: 'AC Toon Marketplace',
      description:
        "The Caribbean's premiere buyers market for diverse animation and creative content.",
    },
    content: {
      heading: 'AC Toon Marketplace',
      subheading: "The Caribbean's premiere buyers market for diverse content.",
      paragraphs: [
        "AC Toon Marketplace was first launched at our 18th edition during CARIFESTA. Due to its huge success, with participants like Sesame Street, Arte France, Toon Goggles and more, we are making it an annual event as the Caribbean's premiere buyers market for diverse content. We will be hosting established buyers for content acquisition and tried and tested IPs from content creators and producers from the Caribbean and the world. Our 2021 Catalogue will contain new projects after testing several global conferences over the last 4 years. Proposed buyers will be announced closer to the festival date.",
        "Stay tuned for more details for this year's Marketplace as we have some exciting updates soon!",
      ],
    },
  },
  'tobago-edition': {
    slug: 'tobago-edition',
    pageType: 'tobagoEdition',
    title: 'Animae Caribe Tobago Edition',
    hero: {
      eyebrow: 'Tobago Edition',
      title: 'Animae Caribe Tobago Edition',
      description:
        "A softer island close to the festival experience, shaped by Tobago's tourism magic and Caribbean breeze.",
    },
    content: {
      heading: 'Animae Caribe Tobago Edition',
      subheading: 'Screenings, networking, marketplace energy, and a final-day island experience.',
      paragraphs: [
        'After two days of business networking, screenings and marketplace, the AC21 Tobago edition will take the pace down to a soft Caribbean breeze. The final day of the 20th Anniversary will take the festival to our sister isle, Tobago, where the festival experience will merge with the tourism magic of the island. Tobago Cove Studio tour and conference, outdoor screenings, cocktail receptions and our red carpet closing ceremony will bring the event to a close.',
        'Stay tuned for more updates.',
      ],
    },
  },
  'business-development': {
    slug: 'business-development',
    pageType: 'businessDevelopment',
    title: 'Business Development',
    hero: {
      eyebrow: 'Business Development',
      title: 'Growing Caribbean animation into sustainable opportunity.',
      description:
        'Business development resources, conversations, and market-facing material for creators, producers, and partners building momentum with Animae Caribe.',
    },
    content: {
      heading: 'Business Development',
      subheading: 'Resources and context for turning creative ambition into stronger business pathways.',
      paragraphs: [
        'Use Sanity to add the Business Development write-up, YouTube videos, and PDF resource for this page.',
      ],
    },
  },
};

export const aboutSectionNavItems = Object.values(aboutSectionFallbacks).map((page) => ({
  label: page.title,
  href: `/about/${page.slug}`,
}));

export function getAboutSectionFallback(slug: string) {
  return aboutSectionFallbacks[slug];
}

export function getYouTubeEmbedUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }

    if (host === 'youtube.com' && url.pathname.startsWith('/embed/')) {
      return value;
    }

    if (host === 'youtube.com' && url.pathname.startsWith('/shorts/')) {
      const videoId = url.pathname.split('/').filter(Boolean)[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = url.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}
