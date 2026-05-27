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
    <section className="page-section">
      <div className="container page-hero split-grid">
        <div>
          <span className="section-kicker">About Animae Caribe</span>
          <h1>A Caribbean animation ecosystem with a festival and a creative house.</h1>
        </div>
        <p>
          Animae Caribe connects artists, audiences, partners and emerging talent through Festival programming, House
          production work, community storytelling and industry development.
        </p>
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
