import ButtonLink from '../components/ButtonLink';
import { ArrowRightIcon } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="container page-hero centered narrow-heading">
        <span className="section-kicker">404</span>
        <h1>This page is not ready yet.</h1>
        <p>Return to the homepage and continue exploring Animae Caribe House.</p>
        <ButtonLink href="/" variant="primary">
          Back home <ArrowRightIcon />
        </ButtonLink>
      </div>
    </section>
  );
}
