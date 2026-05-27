import ButtonLink from '../components/ButtonLink';
import EcosystemSplitHero from '../components/EcosystemSplitHero';
import PartnersStrip from '../components/PartnersStrip';
import { ArrowRightIcon, MailIcon } from '../components/Icons';
import { ecosystemPartners } from '../data/ecosystem';
import type { Partner } from '../data/partners';
import { getUmbrellaHomePage, getUmbrellaPartners } from '../sanity/lib/queries';

export const metadata = {
  title: 'Animae Caribe | Animation, Festival, House and Caribbean Creative Community',
  description:
    'The umbrella home for Animae Caribe, connecting the Festival, Animae Caribe House, partners and Caribbean animation community.',
};

function normalizePartners(partners?: Array<{name?: string; logoUrl?: string}> | null): Partner[] {
  if (!partners?.length) {
    return ecosystemPartners;
  }

  const mapped = partners
    .filter((partner) => partner.name && partner.logoUrl)
    .map((partner) => ({name: partner.name as string, src: partner.logoUrl as string}));

  return mapped.length ? mapped : ecosystemPartners;
}

export default async function UmbrellaHome() {
  const [umbrellaPage, sanityPartners] = await Promise.all([getUmbrellaHomePage(), getUmbrellaPartners()]);
  const orderedSelectedPartners = umbrellaPage?.partnersSection?.partners;
  const partners = normalizePartners(orderedSelectedPartners?.length ? orderedSelectedPartners : sanityPartners);
  const aboutSection = umbrellaPage?.aboutSection;
  const ecosystemSection = umbrellaPage?.ecosystemSection;
  const partnersSection = umbrellaPage?.partnersSection;
  const ecosystemCards = ecosystemSection?.cards?.filter((card) => card.isVisible !== false) || [];

  return (
    <>
      <EcosystemSplitHero content={umbrellaPage?.splitHero} />

      {aboutSection?.isVisible !== false ? (
        <section className="section umbrella-about" id="about-preview">
          <div className="container split-grid">
            <div>
              {aboutSection?.showEyebrow !== false ? (
                <span className="section-kicker">{aboutSection?.eyebrow || 'About Animae Caribe'}</span>
              ) : null}
              {aboutSection?.showHeading !== false ? (
                <h2>{aboutSection?.heading || 'A platform for Caribbean imagination, industry development and cultural exchange.'}</h2>
              ) : null}
            </div>
            <div className="stacked-copy">
              {aboutSection?.showBody !== false ? (
                <p>
                  {aboutSection?.plainText ||
                    'This umbrella home will grow into the central point for Animae Caribe news, festival access, creative services, community stories and partner opportunities. For now, it gives visitors a clear map of the ecosystem while the Festival and House experiences remain distinct.'}
                </p>
              ) : null}
              {aboutSection?.showCta !== false ? (
                <ButtonLink href={aboutSection?.cta?.href || '/contact'} variant="outline">
                  {aboutSection?.cta?.label || 'Contact Animae Caribe'} <MailIcon />
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {partnersSection?.isVisible !== false ? (
        <PartnersStrip
          items={partners}
          kicker={partnersSection?.showHeading !== false ? partnersSection?.heading || 'Animae Caribe partners and collaborators' : ''}
          ariaLabel="Animae Caribe partners"
        />
      ) : null}

      {ecosystemSection?.isVisible !== false ? (
        <section className="section umbrella-contact" id="ecosystem">
          <div className="container section-heading-row">
            <div>
              {ecosystemSection?.showEyebrow !== false ? (
                <span className="section-kicker">{ecosystemSection?.eyebrow || 'Ecosystem'}</span>
              ) : null}
              {ecosystemSection?.showHeading !== false ? (
                <h2>{ecosystemSection?.heading || 'Built for audiences, artists, partners and the next wave of Caribbean stories.'}</h2>
              ) : null}
              {ecosystemSection?.showIntro !== false && ecosystemSection?.intro ? <p>{ecosystemSection.intro}</p> : null}
            </div>
            {ecosystemSection?.showCta !== false ? (
              <ButtonLink href={ecosystemSection?.cta?.href || '/festival'} variant="primary">
                {ecosystemSection?.cta?.label || 'Start with the festival'} <ArrowRightIcon />
              </ButtonLink>
            ) : null}
          </div>
          {ecosystemSection?.showCards !== false && ecosystemCards.length ? (
            <div className="container services-grid mt-8">
              {ecosystemCards.map((card, index) => (
                <article className="services-card glass-card" key={`${card.title || 'ecosystem-card'}-${index}`}>
                  <span className="services-number">{card.number || String(index + 1).padStart(2, '0')}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
