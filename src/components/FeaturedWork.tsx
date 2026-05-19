import { featuredProjects } from '../data/projects';
import ButtonLink from './ButtonLink';
import { ArrowRightIcon, MailIcon } from './Icons';

export default function FeaturedWork() {
  return (
    <section className="section featured-work" id="featured-work">
      <div className="container featured-work-header centered">
        <h2>Featured Projects</h2>
        <p>
          A curated look at the stories, visual worlds and creative experiments taking shape inside Animae Caribe House.
          We Animate in Sunshine.
        </p>
        <div className="featured-work-actions">
          <ButtonLink href="/portfolio" variant="outline">
            View portfolio <ArrowRightIcon />
          </ButtonLink>
          <ButtonLink href="mailto:info@animaecaribehouse.com" variant="soft">
            <MailIcon /> Get in touch
          </ButtonLink>
        </div>
      </div>

      <div className="container work-grid">
        {featuredProjects.map((project) => (
          <article className="work-card glass-card" key={project.title}>
            <img src={project.image} alt="" />
            <div className="work-card-body">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
