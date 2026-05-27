import type {
  SanityEvent,
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
  title,
  date,
  startTime,
  endTime,
  venue,
  eventType,
  shortDescription,
  attendanceType,
  buttonLabel,
  ticketUrl,
  registrationUrl
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
      showBody,
      showCta,
      eyebrow,
      heading,
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
        description,
        cta
      },
      cta
    },
    partnersSection{
      isVisible,
      showHeading,
      showIntro,
      showCta,
      heading,
      intro,
      cta,
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
      showHeading,
      showCopy,
      showCtas,
      heading,
      copy,
      ctas,
      "backgroundImageUrl": backgroundImage.asset->url,
      showreel{
        muxPlaybackId,
        startTimeSeconds,
        endTimeSeconds,
        posterMode,
        posterTimeSeconds,
        buttonLabel,
        "customPosterImageUrl": customPosterImage.asset->url,
        "fallbackImageUrl": fallbackImage.asset->url
      }
    },
    aboutSection{isVisible, showEyebrow, showHeading, showBody, showCta, eyebrow, heading, plainText, cta},
    partnersSection{
      isVisible,
      showHeading,
      showIntro,
      showCta,
      heading,
      intro,
      cta,
      partners[]->{
        ${partnerProjection}
      }
    },
    programmingSection{isVisible, showEyebrow, showHeading, showIntro, eyebrow, heading, intro, cards[]{isVisible, number, title, description}},
    eventsPreview{isVisible, showHeading, showIntro, showCta, heading, intro, cta},
    archiveTeaser{isVisible, showEyebrow, showHeading, showCopy, showCta, eyebrow, heading, copy, cta},
    finalCta{isVisible, showEyebrow, showHeading, showCopy, showCta, eyebrow, heading, copy, cta}
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
  return sanityFetch(`*[_type == "festivalEdition" && isActive == true][0]{
    title,
    year,
    theme,
    startDate,
    endDate,
    location,
    description,
    "heroImageUrl": heroImage.asset->url
  }`);
}

export async function getFeaturedFestivalEvents() {
  return sanityFetch<SanityEvent[]>(`*[_type == "event" && isFeatured == true] | order(date asc, startTime asc)[0...6]{
    ${eventProjection}
  }`);
}

export async function getAllFestivalEvents() {
  return sanityFetch<SanityEvent[]>(`*[_type == "event"] | order(date asc, startTime asc){
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
