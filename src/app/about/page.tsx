import ButtonLink from '../../components/ButtonLink';
import { ArrowRightIcon } from '../../components/Icons';

const processItems = [
  'Animae Caribe umbrella',
  'Festival screenings and workshops',
  'House creative production',
  'Industry development',
  'Partner collaboration',
  'Community storytelling',
];

export const metadata = {
  title: 'About | Animae Caribe',
};

export default function About() {
  return (
    <section className="page-section page-section-cinematic">
      <div className="page-cinematic-hero page-cinematic-hero-about">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">About Animae Caribe</span>
            <h1>A Caribbean animation ecosystem with a festival and a creative house.</h1>
            <p>
            Animae Caribe connects artists, audiences, partners and emerging talent through Festival programming,
            House production work, community storytelling and industry development.
            </p>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-ghost page-cinematic-ghost-about" aria-hidden="true">
              <div className="page-cinematic-ghost-ring" />
              <div className="page-cinematic-ghost-slab page-cinematic-ghost-slab-wide" />
              <div className="page-cinematic-ghost-slab page-cinematic-ghost-slab-tall" />
              <div className="page-cinematic-ghost-orb" />
              <div className="page-cinematic-ghost-line page-cinematic-ghost-line-left" />
              <div className="page-cinematic-ghost-line page-cinematic-ghost-line-right" />
            </div>
          </div>
        </div>
      </div>

      <div className="container image-copy-grid page-feature">
        <div className="image-frame">
          <img src="/assets/studio-placeholder.webp" alt="Animation studio placeholder" />
        </div>
        <div className="glass-panel content-panel">
          <h2>One ecosystem, two primary experiences.</h2>
          <p>
            The Festival gathers people around screenings, workshops, showcases and exchange. The House supports
            creative production, story development and digital talent. Together, they create a clearer home for
            Caribbean animation.
          </p>
          <div className="process-list">
            {processItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <ButtonLink href="/portfolio" variant="primary">
            Explore the work <ArrowRightIcon />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
