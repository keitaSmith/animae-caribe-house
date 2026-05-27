export type SanityCta = {
  label?: string;
  href?: string;
  style?: 'primary' | 'soft' | 'outline';
};

export type SanityImage = {
  url?: string;
  alt?: string;
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
  website?: string;
  logoUrl?: string;
  relatedExperiences?: string[];
  relatedExperience?: string;
  partnerTypes?: string[];
  partnerType?: string;
};

export type SanityCardItem = SanityVisibilityFields & {
  number?: string;
  title?: string;
  description?: string;
  cta?: SanityCta;
};

export type SanityEvent = {
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  shortDescription?: string;
  venue?: string;
  eventType?: string;
  attendanceType?: string;
  buttonLabel?: string;
  ticketUrl?: string;
  registrationUrl?: string;
};

export type SanityPartnerSection = {
  isVisible?: boolean;
  showHeading?: boolean;
  showIntro?: boolean;
  showCta?: boolean;
  heading?: string;
  intro?: string;
  partners?: SanityPartner[];
  cta?: SanityCta;
};

export type SanityUmbrellaHomePage = {
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
  aboutSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    plainText?: string;
    cta?: SanityCta;
  };
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
  hero?: SanityVisibilityFields & {
    heading?: string;
    copy?: string;
    ctas?: SanityCta[];
    backgroundImageUrl?: string;
    showreel?: {
      muxPlaybackId?: string;
      buttonLabel?: string;
      startTimeSeconds?: number;
      endTimeSeconds?: number;
      posterMode?: 'muxFrame' | 'customImage' | 'fallbackImage';
      posterTimeSeconds?: number;
      customPosterImageUrl?: string;
      fallbackImageUrl?: string;
      ariaLabel?: string;
    };
  };
  aboutSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    plainText?: string;
    cta?: SanityCta;
  };
  partnersSection?: SanityPartnerSection;
  programmingSection?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    cards?: SanityCardItem[];
  };
  eventsPreview?: SanityVisibilityFields & {
    heading?: string;
    intro?: string;
    cta?: SanityCta;
  };
  archiveTeaser?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    copy?: string;
    cta?: SanityCta;
  };
  finalCta?: SanityVisibilityFields & {
    eyebrow?: string;
    heading?: string;
    copy?: string;
    cta?: SanityCta;
  };
};
