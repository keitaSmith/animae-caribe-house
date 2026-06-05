import Image from 'next/image';
import PortableTextRenderer from '@/sanity/PortableTextRenderer';
import type {SanityAboutJobListing, SanityAboutSectionPage, SanityImage} from '@/sanity/lib/types';
import type {AboutSectionPageFallback} from '@/lib/aboutSectionPages';
import {getYouTubeEmbedUrl} from '@/lib/aboutSectionPages';
import AboutGalleryLightbox from './AboutGalleryLightbox';
import {ArrowRightIcon} from './Icons';

type AboutSectionHeroProps = {
  page?: SanityAboutSectionPage | null;
  fallback: AboutSectionPageFallback;
};

type AboutSectionMainProps = {
  page?: SanityAboutSectionPage | null;
  fallback: AboutSectionPageFallback;
  jobs?: SanityAboutJobListing[];
};

function resolveImage(page?: SanityAboutSectionPage | null): SanityImage | undefined {
  if (page?.pageType === 'directorsRemarks') {
    // hero.image is the canonical editor-facing field; directorImage is a hidden legacy fallback.
    return page.hero?.image?.url ? page.hero.image : page.directorImage;
  }

  return page?.heroVisualType === 'image' ? page.hero?.image : undefined;
}

export function AboutSectionGhostVisual() {
  return (
    <div className="about-section-ghost" aria-hidden="true">
      <span className="about-section-ghost-orb about-section-ghost-orb-cyan" />
      <span className="about-section-ghost-orb about-section-ghost-orb-gold" />
      <span className="about-section-ghost-card about-section-ghost-card-top" />
      <span className="about-section-ghost-card about-section-ghost-card-bottom" />
      <span className="about-section-ghost-line about-section-ghost-line-one" />
      <span className="about-section-ghost-line about-section-ghost-line-two" />
      <span className="about-section-ghost-dot" />
    </div>
  );
}

export function TobagoEditionHeroVisual() {
  return (
    <div className="tobago-edition-hero-visual" aria-hidden="true">
      {/* Replace this file to update the dedicated Tobago Edition hero artwork. */}
      <img src="/assets/illustrations/tobago-edition-hero.png" alt="" />
    </div>
  );
}

export function AboutSectionHero({page, fallback}: AboutSectionHeroProps) {
  const hero = page?.hero;
  const image = resolveImage(page);
  const pageType = page?.pageType || fallback.pageType;
  const eyebrow = hero?.eyebrow || fallback.hero.eyebrow;
  const title = hero?.title || fallback.hero.title;
  const description = hero?.description || fallback.hero.description;
  const heroImageClassName = [
    'page-cinematic-character',
    'page-cinematic-character-about',
    'about-section-hero-image',
    pageType === 'iammNetwork' ? 'about-section-hero-image-flat' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="page-cinematic-hero page-cinematic-hero-about about-section-hero">
      <div className="container festival-programme-page-hero-shell">
        <div className="festival-programme-page-copy">
          <span className="section-kicker">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="festival-programme-page-side">
          {image?.url ? (
            <div className={heroImageClassName}>
              <Image
                src={image.url}
                alt={image.alt || title}
                width={image.width || 640}
                height={image.height || 760}
                className="page-cinematic-character-image"
                priority
                sizes="(max-width: 680px) 72vw, (max-width: 980px) 52vw, 360px"
              />
            </div>
          ) : pageType === 'tobagoEdition' ? (
            <TobagoEditionHeroVisual />
          ) : (
            <AboutSectionGhostVisual />
          )}
        </div>
      </div>
    </div>
  );
}

function FallbackParagraphs({paragraphs}: {paragraphs: string[]}) {
  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

function AboutSectionVideo({youtubeUrl}: {youtubeUrl?: string}) {
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="about-section-video-shell">
      <iframe
        src={embedUrl}
        title="Director's Remarks video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function AboutSectionGallery({page}: {page?: SanityAboutSectionPage | null}) {
  const images = [...(page?.galleryImages || []), ...(page?.externalGalleryImages || [])].filter((image) => image.url);

  if (!images.length && !page?.externalGalleryUrl) {
    return null;
  }

  return (
    <section className="about-section-gallery-section" aria-labelledby="about-gallery-heading">
      <div className="news-media-feed-heading">
        <span className="section-kicker">Gallery</span>
        <h2 id="about-gallery-heading">Community moments</h2>
      </div>
      {images.length ? <AboutGalleryLightbox images={images} /> : null}
      {page?.externalGalleryUrl ? (
        <p className="about-section-gallery-note">
          <a href={page.externalGalleryUrl} target="_blank" rel="noreferrer">
            View external gallery <ArrowRightIcon />
          </a>
        </p>
      ) : null}
      {/* Google Photos shared albums are not a reliable public API source. A future server-side provider integration should authenticate with Google Photos or Drive and normalize images before rendering. */}
    </section>
  );
}

function JobListings({jobs = []}: {jobs?: SanityAboutJobListing[]}) {
  return (
    <section className="about-jobs-section" aria-labelledby="about-jobs-heading">
      <div className="news-media-feed-heading">
        <span className="section-kicker">Employment Opportunity</span>
        <h2 id="about-jobs-heading">Recruitment Portal - #Animate in Sunshine</h2>
      </div>

      {jobs.length ? (
        <div className="about-jobs-grid">
          {jobs.map((job) => (
            <article className="about-job-card glass-card" key={job._id || job.title}>
              {job.featuredImage?.url ? <img src={job.featuredImage.url} alt={job.featuredImage.alt || job.title || ''} loading="lazy" /> : null}
              <div className="about-job-card-body">
                <span className="section-kicker">{job.eyebrow || 'Job Listing'}</span>
                <h3>{job.title}</h3>
                {job.description ? <p>{job.description}</p> : null}
                {job.body?.length ? <PortableTextRenderer value={job.body} /> : null}
                {job.applicationInfo?.length ? (
                  <div className="about-job-application">
                    <span className="contact-detail-label">How to apply</span>
                    <PortableTextRenderer value={job.applicationInfo} />
                  </div>
                ) : null}
                {job.applicationUrl ? (
                  <a className="news-media-text-link" href={job.applicationUrl} target="_blank" rel="noreferrer">
                    Apply or learn more <ArrowRightIcon />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="news-media-empty glass-card about-jobs-empty">
          <span className="section-kicker">No active listings</span>
          <h3>There are no open recruitment opportunities right now.</h3>
          <p>Check back soon for new animation, games, and digital talent opportunities.</p>
        </div>
      )}
    </section>
  );
}

export function AboutSectionMain({page, fallback, jobs}: AboutSectionMainProps) {
  const content = page?.content;

  return (
    <div className="container page-feature about-section-main">
      {page?.pageType === 'directorsRemarks' ? <AboutSectionVideo youtubeUrl={page.youtubeUrl} /> : null}

      <div className="glass-panel content-panel about-section-content-panel">
        <span className="section-kicker">{fallback.hero.eyebrow}</span>
        <h2>{content?.heading || fallback.content.heading}</h2>
        {content?.subheading || fallback.content.subheading ? <p className="about-section-subheading">{content?.subheading || fallback.content.subheading}</p> : null}
        <div className="about-section-body">
          {content?.body?.length ? <PortableTextRenderer value={content.body} /> : <FallbackParagraphs paragraphs={fallback.content.paragraphs} />}
        </div>
      </div>

      {page?.pageType === 'communityOutreach' ? <AboutSectionGallery page={page} /> : null}
      {fallback.pageType === 'liveWorkPlayLocal' ? <JobListings jobs={jobs} /> : null}
    </div>
  );
}
