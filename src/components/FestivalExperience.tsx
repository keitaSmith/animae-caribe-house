import Hero from './Hero';
import AboutTeaser from './AboutTeaser';
import PartnersStrip from './PartnersStrip';
import ServicesSection from './ServicesSection';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon, MailIcon } from './Icons';
import { festivalEvents, festivalHighlights, festivalPartners } from '../data/festival';
import type { Partner } from '../data/partners';
import type { SanityCardItem, SanityEvent, SanityFestivalPage } from '../sanity/lib/types';

type FestivalExperienceProps = {
  content?: SanityFestivalPage | null;
  partners?: Partner[] | null;
  events?: SanityEvent[] | null;
};

function formatEventDate(date?: string) {
  if (!date) return undefined;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric'}).format(parsed);
}

function normalizeEvents(events?: SanityEvent[] | null) {
  if (!events?.length) {
    return festivalEvents;
  }

  return events
    .filter((event) => event.title)
    .map((event) => ({
      date: formatEventDate(event.date) || '',
      time: event.startTime || '',
      title: event.title || '',
      description: event.shortDescription || '',
      location: event.venue || '',
      category: event.eventType || event.attendanceType || 'Festival',
    }));
}

function normalizeHighlights(cards?: SanityCardItem[] | null) {
  if (!cards?.length) {
    return festivalHighlights;
  }

  return cards
    .filter((card) => card.title && card.description)
    .map((card, index) => ({
      number: card.number || String(index + 1).padStart(2, '0'),
      title: card.title || '',
      description: card.description || '',
    }));
}

export default function FestivalExperience({content, partners, events}: FestivalExperienceProps) {
  const firstHeroCta = content?.hero?.ctas?.[0];
  const aboutCta = content?.aboutSection?.cta;
  const eventCta = content?.eventsPreview?.cta;
  const archiveCta = content?.archiveTeaser?.cta;
  const finalCta = content?.finalCta?.cta;
  const highlightCards = normalizeHighlights(content?.programmingSection?.cards);
  const eventCards = normalizeEvents(events);
  const selectedPartners =
    content?.partnersSection?.partners
      ?.filter((partner) => partner.name && partner.logoUrl)
      .map((partner) => ({name: partner.name as string, src: partner.logoUrl as string})) || null;
  const partnerItems = selectedPartners?.length ? selectedPartners : partners;

  return (
    <>
      <Hero
        ariaLabel="Animae Caribe Festival introduction"
        logoSrc={null}
        logoAlt="Animae Caribe"
        title={content?.hero?.heading || 'Animae Caribe Festival'}
        copy={
          content?.hero?.copy ||
          'A cinematic celebration of animation, Caribbean creativity, screenings, industry development and community.'
        }
        contactHref={firstHeroCta?.href || 'mailto:festival@animaecaribe.com'}
        contactLabel={firstHeroCta?.label || 'Attend the festival'}
        showreelLabel={content?.hero?.showreel?.buttonLabel || 'Watch festival reel'}
        showreelPlaybackId={content?.hero?.showreel?.muxPlaybackId}
        showreelPosterSrc={content?.hero?.showreel?.customPosterImageUrl || content?.hero?.showreel?.fallbackImageUrl}
        showreelTitle="Animae Caribe Festival Showreel"
        showreelStartTimeSeconds={content?.hero?.showreel?.startTimeSeconds}
        showreelEndTimeSeconds={content?.hero?.showreel?.endTimeSeconds}
        showreelPosterTimeSeconds={content?.hero?.showreel?.posterTimeSeconds}
        showreelAriaLabel={content?.hero?.showreel?.ariaLabel}
      />

      <AboutTeaser
        kicker={content?.aboutSection?.eyebrow || 'About the Festival'}
        title={content?.aboutSection?.heading || 'A festival home for Caribbean animation, creative exchange and industry momentum.'}
        copy={
          content?.aboutSection?.plainText ||
          'Animae Caribe Festival brings artists, audiences, studios, students and partners together through screenings, workshops, panels, showcases and community experiences. It celebrates Caribbean imagination while creating practical pathways for animation talent and regional industry development.'
        }
        ctaHref={aboutCta?.href || '/festival#programme'}
        ctaLabel={aboutCta?.label || 'Explore the programme'}
      />

      <PartnersStrip
        items={partnerItems?.length ? partnerItems : festivalPartners}
        kicker={content?.partnersSection?.heading || 'Festival partners and collaborators'}
        ariaLabel="Festival partners and collaborators"
      />

      <ServicesSection
        id="programming"
        kicker={content?.programmingSection?.eyebrow || 'Festival Programming'}
        title={content?.programmingSection?.heading || 'Highlights'}
        intro={
          content?.programmingSection?.intro ||
          'A programme shaped around screenings, workshops, showcases, industry connection and community experiences for Caribbean animation.'
        }
        items={highlightCards}
      />

      <section className="section festival-programme-section" id="programme">
        <div className="container">
          <div className="services-header">
            <div>
              <span className="section-kicker">Programme Preview</span>
              <h2>{content?.eventsPreview?.heading || 'Upcoming festival moments'}</h2>
            </div>
            <p>
              {content?.eventsPreview?.intro ||
                'Temporary local programme data keeps the page ready for review now. A full calendar can connect to a CMS later when the festival content model is confirmed.'}
            </p>
          </div>

          <div className="festival-events-grid">
            {eventCards.map((event) => (
              <article className="festival-event-card glass-card" key={event.title}>
                <div className="festival-event-meta">
                  <span>{event.date}</span>
                  <small>{event.time}</small>
                </div>
                <div>
                  <p className="festival-event-category">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <strong>{event.location}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="festival-programme-actions">
            <ButtonLink href={eventCta?.href || '/festival#programme'} variant="primary">
              {eventCta?.label || 'See festival calendar'} <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section festival-archive-section">
        <div className="container split-grid">
          <div>
            <span className="section-kicker">{content?.archiveTeaser?.eyebrow || 'Past Editions'}</span>
            <h2>{content?.archiveTeaser?.heading || 'Festival archive coming into focus.'}</h2>
          </div>
          <p>
            {content?.archiveTeaser?.copy ||
              'Past festival highlights, news, galleries, artist stories and edition-by-edition recaps can be added here later without changing the current House experience or introducing WordPress/Sanity yet.'}
          </p>
          {archiveCta?.href && archiveCta.label ? (
            <ButtonLink href={archiveCta.href} variant="outline">
              {archiveCta.label} <ArrowRightIcon />
            </ButtonLink>
          ) : null}
        </div>
      </section>

      <section className="section festival-cta-section">
        <div className="container festival-cta-shell glass-panel">
          <div>
            <span className="section-kicker">{content?.finalCta?.eyebrow || 'Join the Festival'}</span>
            <h2>{content?.finalCta?.heading || 'Attend, submit, partner, sponsor or volunteer with Animae Caribe Festival.'}</h2>
            <p>
              {content?.finalCta?.copy ||
                'This page is ready for the next layer of real calls-to-action when dates, submissions and partner packages are finalized.'}
            </p>
          </div>
          <div className="festival-cta-actions">
            <ButtonLink href={finalCta?.href || 'mailto:festival@animaecaribe.com'} variant="primary">
              <MailIcon /> {finalCta?.label || 'Partner with us'}
            </ButtonLink>
            <ButtonLink href="mailto:festival@animaecaribe.com" variant="outline">
              Submit your work <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
