import ButtonLink from '../../components/ButtonLink';
import { ArrowRightIcon } from '../../components/Icons';

const processItems = [
  'Script and story development',
  'Storyboard and visual planning',
  'Character design and world building',
  'Backgrounds, colour and concept art',
  'Animation production support',
  'Showcase, articles and community updates',
];

export const metadata = {
  title: 'About | Animae Caribe House',
};

export default function About() {
  return (
    <section className="page-section">
      <div className="container page-hero split-grid">
        <div>
          <span className="section-kicker">About Animae Caribe House</span>
          <h1>A digital home for Caribbean creative production.</h1>
        </div>
        <p>
          This page can expand the story behind Animae Caribe House: what it is, who it serves, what it produces and why a dedicated platform matters for Caribbean animation and digital storytelling.
        </p>
      </div>

      <div className="container image-copy-grid page-feature">
        <div className="image-frame">
          <img src="/assets/studio-placeholder.webp" alt="Animation studio placeholder" />
        </div>
        <div className="glass-panel content-panel">
          <h2>From idea to animated world.</h2>
          <p>
            The full services story can be developed over time. For launch, this page can introduce the creative path clearly and leave room for deeper service details later.
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
