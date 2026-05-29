import type {
  SanityEvent,
  SanityFestivalEdition,
  SanityFestivalPage,
  SanityPartner,
  SanityUmbrellaHomePage,
} from './types';
import {sanityFetch} from './client';

const partnerProjection = `
  name,
  website,
  "logoUrl": logo.asset->url,
  relatedExperiences,
  relatedExperience,
  partnerTypes,
  partnerType
`;

const eventProjection = `
  _id,
  title,
  "slug": slug.current,
  startDateTime,
  endDateTime,
  date,
  startTime,
  endTime,
  venue,
  eventType,
  shortDescription,
  attendanceType,
  priceLabel,
  buttonLabel,
  ticketUrl,
  registrationUrl,
  "imageUrl": image.asset->url,
  festivalEdition->{
    _id,
    title,
    theme,
    year,
    startDate,
    endDate,
    location,
    description,
    isActive
  }
`;

const festivalEditionProjection = `
  _id,
  title,
  year,
  theme,
  startDate,
  endDate,
  location,
  description,
  isActive
`;

export async function getSiteSettings() {
  return sanityFetch(`*[_type == "siteSettings"][0]{
    siteTitle,
    defaultSeo,
    contactEmail,
    contactPhone,
    location,
    footerCopy,
    navigationLinks,
    footerLinks,
    socialLinks
  }`);
}

export async function getUmbrellaHomePage() {
  return sanityFetch<SanityUmbrellaHomePage>(`*[_type == "umbrellaHomePage"][0]{
    splitHero{
      isVisible,
      leftPanel{
        showEyebrow,
        showTitle,
        showDescription,
        showCta,
        showMedia,
        eyebrow,
        title,
        description,
        cta,
        "backgroundImageUrl": backgroundImage.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        video{
          title,
          muxPlaybackId,
          startTimeSeconds,
          endTimeSeconds,
          posterMode,
          posterTimeSeconds,
          "customPosterImage": {
            "url": customPosterImage.asset->url,
            "alt": customPosterImage.alt
          },
          "fallbackImage": {
            "url": fallbackImage.asset->url,
            "alt": fallbackImage.alt
          },
          ariaLabel
        }
      },
      rightPanel{
        showEyebrow,
        showTitle,
        showDescription,
        showCta,
        showMedia,
        eyebrow,
        title,
        description,
        cta,
        "backgroundImageUrl": backgroundImage.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        video{
          title,
          muxPlaybackId,
          startTimeSeconds,
          endTimeSeconds,
          posterMode,
          posterTimeSeconds,
          "customPosterImage": {
            "url": customPosterImage.asset->url,
            "alt": customPosterImage.alt
          },
          "fallbackImage": {
            "url": fallbackImage.asset->url,
            "alt": fallbackImage.alt
          },
          ariaLabel
        }
      }
    },
    aboutSection{
      isVisible,
      showEyebrow,
      showHeading,
      showDescription,
      showCta,
      eyebrow,
      heading,
      description,
      plainText,
      cta
    },
    ecosystemSection{
      isVisible,
      showEyebrow,
      showHeading,
      showIntro,
      showCards,
      showCta,
      eyebrow,
      heading,
      intro,
      cards[]{
        isVisible,
        number,
        title,
        description
      },
      cta
    },
    partnersSection{
      isVisible,
      eyebrow,
      heading,
      partners[]->{
        ${partnerProjection}
      }
    }
  }`);
}

export async function getFestivalPage() {
  return sanityFetch<SanityFestivalPage>(`*[_type == "festivalPage"][0]{
    hero{
      isVisible,
      heading,
      copy,
      primaryCta,
      backgroundVideo{
        title,
        muxPlaybackId,
        startTimeSeconds,
        endTimeSeconds,
        posterMode,
        posterTimeSeconds,
        "customPosterImage": {
          "url": customPosterImage.asset->url,
          "alt": customPosterImage.alt
        },
        "fallbackImage": {
          "url": fallbackImage.asset->url,
          "alt": fallbackImage.alt
        },
        ariaLabel
      },
      ctas,
      showreel{
        muxPlaybackId,
        modalTitle,
        modalDescription,
        startTimeSeconds,
        endTimeSeconds,
        posterMode,
        posterTimeSeconds,
        buttonLabel,
        "customPosterImageUrl": customPosterImage.asset->url,
        "fallbackImageUrl": fallbackImage.asset->url
      }
    },
    aboutSection{isVisible, showEyebrow, showHeading, showDescription, showCta, eyebrow, heading, description, plainText, cta},
    partnersSection{
      isVisible,
      eyebrow,
      heading,
      partners[]->{
        ${partnerProjection}
      }
    },
    programmingSection{isVisible, showEyebrow, showHeading, showDescription, eyebrow, heading, description, intro, cards[]{isVisible, number, title, description}},
    calendarSection{
      isVisible,
      eyebrow,
      heading,
      description,
      modalTitle,
      downloadLabel,
      downloadButtonStyle,
      "calendarImage": {
        "url": calendarImage.asset->url,
        "alt": calendarImage.alt
      }
    },
    eventsPreview{
      isVisible,
      showEyebrow,
      showHeading,
      showDescription,
      showCta,
      eyebrow,
      heading,
      description,
      festivalEdition->{
        _id,
        title,
        year,
        isActive
      },
      maxEvents,
      cta,
      events[]->{
        ${eventProjection}
      }
    },
    venueSection{
      isVisible,
      eyebrow,
      heading,
      description,
      venueName,
      address,
      googleMapsEmbedUrl,
      googleMapsUrl,
      mapCtaLabel,
      mapButtonStyle
    },
    archiveTeaser{isVisible, showEyebrow, showHeading, showDescription, showCta, eyebrow, heading, description, plainText, cta},
    finalCta{
      isVisible,
      showEyebrow,
      showHeading,
      showDescription,
      eyebrow,
      heading,
      description,
      plainText,
      primaryCta,
      secondaryCta,
      cta
    }
  }`);
}

export async function getHousePage() {
  return sanityFetch(`*[_type == "housePage"][0]{
    seo,
    hero,
    aboutSection,
    partnersSection,
    servicesSection
  }`);
}

export async function getActiveFestivalEdition() {
  return sanityFetch<SanityFestivalEdition>(`*[_type == "festivalEdition" && isActive == true][0]{
    ${festivalEditionProjection}
  }`);
}

export async function getFeaturedFestivalEvents() {
  return sanityFetch<SanityEvent[]>(`*[_type == "event" && isFeatured == true] | order(startDateTime asc, date asc, startTime asc)[0...6]{
    ${eventProjection}
  }`);
}

export async function getUpcomingFestivalEventsByEdition(editionId: string, maxEvents = 3) {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const limit = Math.min(Math.max(maxEvents, 1), 12);

  return sanityFetch<SanityEvent[]>(
    `*[
      _type == "event" &&
      references($editionId) &&
      (
        (defined(startDateTime) && startDateTime >= $now) ||
        (!defined(startDateTime) && defined(date) && date >= $today)
      )
    ] | order(startDateTime asc, date asc, startTime asc)[0...${limit}]{
      ${eventProjection}
    }`,
    {editionId, now, today}
  );
}

export async function getFestivalEditionByYear(year: number | string) {
  return sanityFetch<SanityFestivalEdition>(
    `*[_type == "festivalEdition" && year == $year][0]{
      ${festivalEditionProjection}
    }`,
    {year: Number(year)}
  );
}

export async function getAllFestivalEditions() {
  return sanityFetch<SanityFestivalEdition[]>(`*[_type == "festivalEdition" && defined(year)] | order(year desc){
    ${festivalEditionProjection}
  }`);
}

export async function getPastFestivalEditions() {
  const [allEditions, activeEdition] = await Promise.all([getAllFestivalEditions(), getActiveFestivalEdition()]);

  if (!allEditions?.length) {
    return null;
  }

  const activeYear = activeEdition?.year;

  return allEditions
    .filter((edition) => {
      if (typeof edition.year !== 'number') {
        return false;
      }

      if (typeof activeYear === 'number') {
        return edition.year < activeYear;
      }

      return edition.isActive !== true;
    })
    .sort((left, right) => (right.year || 0) - (left.year || 0));
}

export async function getFestivalEventsByEdition(editionId: string) {
  return sanityFetch<SanityEvent[]>(
    `*[
      _type == "event" &&
      references($editionId)
    ] | order(startDateTime asc, date asc, startTime asc){
      ${eventProjection}
    }`,
    {editionId}
  );
}

export async function getAllFestivalEvents() {
  return sanityFetch<SanityEvent[]>(`*[_type == "event"] | order(startDateTime asc, date asc, startTime asc){
    ${eventProjection}
  }`);
}

export async function getPartnersByExperience(experience: 'umbrella' | 'festival' | 'house') {
  return sanityFetch<SanityPartner[]>(
    `*[
      _type == "partner" &&
      (
        $experience in coalesce(relatedExperiences, []) ||
        relatedExperience == $experience
      )
    ] | order(sortOrder asc, name asc){
      ${partnerProjection}
    }`,
    {experience}
  );
}

export async function getUmbrellaPartners() {
  return getPartnersByExperience('umbrella');
}

export async function getFestivalPartners() {
  return getPartnersByExperience('festival');
}

export async function getHousePartners() {
  return getPartnersByExperience('house');
}

export async function getRecentPosts() {
  return sanityFetch(`*[_type == "post"] | order(date desc)[0...6]{
    title,
    "slug": slug.current,
    date,
    excerpt,
    relatedExperience,
    "featuredImageUrl": featuredImage.asset->url
  }`);
}

export async function getPageBySlug(slug: string) {
  return sanityFetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      excerpt,
      body,
      relatedExperience,
      sections,
      seo
    }`,
    {slug}
  );
}
