import Hero from './Hero';
import AboutTeaser from './AboutTeaser';
import PartnersStrip from './PartnersStrip';
import ServicesSection from './ServicesSection';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon, MailIcon } from './Icons';
import { festivalEvents, festivalHighlights, festivalPartners } from '../data/festival';

export default function FestivalExperience() {
  return (
    <>
      <Hero
        ariaLabel="Animae Caribe Festival introduction"
        logoSrc={null}
        logoAlt="Animae Caribe"
        title="Animae Caribe Festival"
        copy="A cinematic celebration of animation, Caribbean creativity, screenings, industry development and community."
        contactHref="mailto:festival@animaecaribe.com"
        contactLabel="Attend the festival"
        showreelLabel="Watch festival reel"
      />

      <AboutTeaser
        kicker="About the Festival"
        title="A festival home for Caribbean animation, creative exchange and industry momentum."
        copy="Animae Caribe Festival brings artists, audiences, studios, students and partners together through screenings, workshops, panels, showcases and community experiences. It celebrates Caribbean imagination while creating practical pathways for animation talent and regional industry development."
        ctaHref="/festival#programme"
        ctaLabel="Explore the programme"
      />

      <PartnersStrip
        items={festivalPartners}
        kicker="Festival partners and collaborators"
        ariaLabel="Festival partners and collaborators"
      />

      <ServicesSection
        id="programming"
        kicker="Festival Programming"
        title="Highlights"
        intro="A programme shaped around screenings, workshops, showcases, industry connection and community experiences for Caribbean animation."
        items={festivalHighlights}
      />

      <section className="section festival-programme-section" id="programme">
        <div className="container">
          <div className="services-header">
            <div>
              <span className="section-kicker">Programme Preview</span>
              <h2>Upcoming festival moments</h2>
            </div>
            <p>
              Temporary local programme data keeps the page ready for review now. A full calendar can connect to a CMS
              later when the festival content model is confirmed.
            </p>
          </div>

          <div className="festival-events-grid">
            {festivalEvents.map((event) => (
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
            <ButtonLink href="/festival#programme" variant="primary">
              See festival calendar <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section festival-archive-section">
        <div className="container split-grid">
          <div>
            <span className="section-kicker">Past Editions</span>
            <h2>Festival archive coming into focus.</h2>
          </div>
          <p>
            Past festival highlights, news, galleries, artist stories and edition-by-edition recaps can be added here
            later without changing the current House experience or introducing WordPress/Sanity yet.
          </p>
        </div>
      </section>

      <section className="section festival-cta-section">
        <div className="container festival-cta-shell glass-panel">
          <div>
            <span className="section-kicker">Join the Festival</span>
            <h2>Attend, submit, partner, sponsor or volunteer with Animae Caribe Festival.</h2>
            <p>
              This page is ready for the next layer of real calls-to-action when dates, submissions and partner packages
              are finalized.
            </p>
          </div>
          <div className="festival-cta-actions">
            <ButtonLink href="mailto:festival@animaecaribe.com" variant="primary">
              <MailIcon /> Partner with us
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
