import type {PortableTextBlock} from '@portabletext/types';

export type SanityCta = {
  label?: string;
  href?: string;
  style?: 'primary' | 'soft' | 'outline';
};

export type SanityImage = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type SanityImageSource = {
  alt?: string;
  caption?: string;
  url?: string;
  width?: number;
  height?: number;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
};

export type SanityMuxVideo = {
  title?: string;
  muxPlaybackId?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  posterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
  posterTimeSeconds?: number;
  customPosterImage?: SanityImage;
  fallbackImage?: SanityImage;
  ariaLabel?: string;
};

export type SanityVisibilityFields = {
  isVisible?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showHeading?: boolean;
  showBody?: boolean;
  showDescription?: boolean;
  showCopy?: boolean;
  showCta?: boolean;
  showCtas?: boolean;
  showIntro?: boolean;
  showCards?: boolean;
  showMedia?: boolean;
  showImage?: boolean;
  showLogo?: boolean;
  showBackgroundMedia?: boolean;
};

export type SanityPartner = {
  name?: string;
  url?: string;
  website?: string;
  logoUrl?: string;
  active?: boolean;
  relationship?: string;
  relatedExperiences?: string[];
  relatedExperience?: string;
  partnerTypes?: string[];
  partnerType?: string;
  sortOrder?: number;
};

export type SanityPerson = {
  _id?: string;
  name?: string;
  slug?: string;
  active?: boolean;
  sortOrder?: number;
  role?: string;
  bio?: string;
  image?: SanityImageSource;
};

export type SanityCardItem = SanityVisibilityFields & {
  number?: string;
  title?: string;
  description?: string;
  cta?: SanityCta;
};

export type SanityTeaserSection = SanityVisibilityFields & {
  eyebrow?: string;
  heading?: string;
  description?: string;
  plainText?: string;
  cta?: SanityCta;
};

export type SanityCalendarSection = {
  isVisible?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
  modalTitle?: string;
  downloadLabel?: string;
  downloadButtonStyle?: 'primary' | 'soft' | 'outline';
  calendarImage?: SanityImage;
};

export type SanityVenueSection = {
  isVisible?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
  venueName?: string;
  address?: string;
  googleMapsEmbedUrl?: string;
  googleMapsUrl?: string;
  mapCtaLabel?: string;
  mapButtonStyle?: 'primary' | 'soft' | 'outline';
};

export type SanityEvent = {
  _id?: string;
  slug?: string;
  startDateTime?: string;
  endDateTime?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  shortDescription?: string;
  venue?: string;
  eventType?: string;
  attendanceType?: string;
  priceLabel?: string;
  buttonLabel?: string;
  ticketUrl?: string;
  registrationUrl?: string;
  imageUrl?: string;
  festivalEdition?: {
    _id?: string;
    title?: string;
    year?: number;
    isActive?: boolean;
  };
};

export type SanityFestivalEdition = {
  _id?: string;
  title?: string;
  year?: number;
  theme?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
};

export type SanitySiteSettings = {
  siteTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  contactMapSearchText?: string;
  footerCopy?: string;
};

export type SanityPageHeroSection = {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: SanityImage;
};

export type SanityAboutSectionPageType =
  | 'directorsRemarks'
  | 'communityOutreach'
  | 'iammNetwork'
  | 'liveWorkPlayLocal'
  | 'acToonMarketplace'
  | 'tobagoEdition';

export type SanityAboutGalleryImage = SanityImage & {
  caption?: string;
};

export type SanityAboutSectionPage = {
  title?: string;
  slug?: string;
  pageType?: SanityAboutSectionPageType;
  isVisible?: boolean;
  heroVisualType?: 'ghost' | 'image';
  hero?: SanityPageHeroSection;
  directorImage?: SanityImage;
  youtubeUrl?: string;
  content?: {
    heading?: string;
    subheading?: string;
    body?: PortableTextBlock[];
  };
  galleryProvider?: 'sanity' | 'external';
  galleryImages?: SanityAboutGalleryImage[];
  externalGalleryImages?: SanityAboutGalleryImage[];
  externalGalleryUrl?: string;
  googleDriveFolderId?: string;
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: SanityImage;
  };
};

export type SanityAboutJobListing = {
  _id?: string;
  eyebrow?: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: PortableTextBlock[];
  featuredImage?: SanityImage;
  applicationInfo?: PortableTextBlock[];
  applicationUrl?: string;
  expiryDate?: string;
};

export type SanityAboutPage = {
  hero?: SanityPageHeroSection;
};

export type SanityPartnersPage = {
  hero?: SanityPageHeroSection;
};

export type SanityContactPage = {
  hero?: SanityPageHeroSection;
  contentSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
};

export type SanityPartnerSection = {
  isVisible?: boolean;
  eyebrow?: string;
  heading?: string;
  partners?: SanityPartner[];
};

export type SanityUmbrellaHomePage = {
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: SanityImage;
  };
  splitHero?: {
    isVisible?: boolean;
    leftPanel?: SanityVisibilityFields & {
      eyebrow?: string;
      title?: string;
      description?: string;
      cta?: SanityCta;
      backgroundImageUrl?: string;
      backgroundImageAlt?: string;
      video?: SanityMuxVideo;
    };
    rightPanel?: SanityVisibilityFields & {
      eyebrow?: string;
      title?: string;
      description?: string;
      cta?: SanityCta;
      backgroundImageUrl?: string;
      backgroundImageAlt?: string;
      video?: SanityMuxVideo;
    };
  };
  aboutSection?: SanityTeaserSection;
  ecosystemSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    cards?: SanityCardItem[];
    cta?: SanityCta;
  };
  partnersSection?: SanityPartnerSection;
};

export type SanityFestivalPage = {
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: SanityImage;
  };
  hero?: SanityVisibilityFields & {
    heading?: string;
    copy?: string;
    primaryCta?: SanityCta;
    backgroundVideo?: SanityMuxVideo;
    ctas?: SanityCta[];
    showreel?: {
      muxPlaybackId?: string;
      buttonLabel?: string;
      modalTitle?: string;
      modalDescription?: string;
      startTimeSeconds?: number;
      endTimeSeconds?: number;
      posterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
      posterTimeSeconds?: number;
      customPosterImageUrl?: string;
      fallbackImageUrl?: string;
      ariaLabel?: string;
    };
  };
  aboutSection?: SanityTeaserSection;
  partnersSection?: SanityPartnerSection;
  programmingSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    description?: string;
    intro?: string;
    cards?: SanityCardItem[];
  };
  speakersSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    description?: string;
    people?: SanityPerson[];
  };
  eventsPreview?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    description?: string;
    cta?: SanityCta;
    festivalEdition?: SanityFestivalEdition;
    maxEvents?: number;
    events?: SanityEvent[];
  };
  archiveTeaser?: SanityTeaserSection;
  finalCta?: SanityTeaserSection & {
    primaryCta?: SanityCta;
    secondaryCta?: SanityCta;
  };
  calendarSection?: SanityCalendarSection;
  venueSection?: SanityVenueSection;
};
