import ButtonLink from '../components/ButtonLink';
import EcosystemSplitHero from '../components/EcosystemSplitHero';
import PartnersStrip from '../components/PartnersStrip';
import { ArrowRightIcon, MailIcon } from '../components/Icons';
import { ecosystemPartners } from '../data/ecosystem';

export const metadata = {
  title: 'Animae Caribe | Animation, Festival, House and Caribbean Creative Community',
  description:
    'The umbrella home for Animae Caribe, connecting the Festival, Animae Caribe House, partners and Caribbean animation community.',
};

export default function UmbrellaHome() {
  return (
    <>
      <EcosystemSplitHero />

      <section className="section umbrella-about" id="about-preview">
        <div className="container split-grid">
          <div>
            <span className="section-kicker">About Animae Caribe</span>
            <h2>A platform for Caribbean imagination, industry development and cultural exchange.</h2>
          </div>
          <div className="stacked-copy">
            <p>
              This umbrella home will grow into the central point for Animae Caribe news, festival access, creative
              services, community stories and partner opportunities. For now, it gives visitors a clear map of the
              ecosystem while the Festival and House experiences remain distinct.
            </p>
            <ButtonLink href="/contact" variant="outline">
              Contact Animae Caribe <MailIcon />
            </ButtonLink>
          </div>
        </div>
      </section>

      <PartnersStrip items={ecosystemPartners} ariaLabel="Animae Caribe partners" />

      <section className="section umbrella-contact" id="ecosystem">
        <div className="container section-heading-row">
          <div>
            <span className="section-kicker">Ecosystem</span>
            <h2>Built for audiences, artists, partners and the next wave of Caribbean stories.</h2>
          </div>
          <ButtonLink href="/festival" variant="primary">
            Start with the festival <ArrowRightIcon />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
