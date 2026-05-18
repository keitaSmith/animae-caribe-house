import ButtonLink from './ButtonLink';
import { ArrowRightIcon } from './Icons';

export default function AboutTeaser() {
  return (
    <section className="section about-teaser" id="about-preview">
      <div className="container split-grid">
        <div>
          <span className="section-kicker">About us</span>
          <h2>A creative house for Caribbean animation, talent and digital storytelling.</h2>
        </div>
        <div className="stacked-copy">
          <p>
            Animae Caribe House brings digital creatives together around animation, story development, visual culture and community.
            The website should feel like a living showcase: cinematic, inviting and built to grow as new work, articles and updates are added.
          </p>
          <ButtonLink href="/about" variant="outline">
            Read about the house <ArrowRightIcon />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
