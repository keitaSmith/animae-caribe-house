const services = [
  {
    number: '01',
    title: 'Animation Production',
    description:
      'Full-service 2D/3D animation support, from concept development to final animated output.',
  },
  {
    number: '02',
    title: 'Story & Concept Development',
    description:
      'Helping shape ideas, characters, worlds, scripts, storyboards, and pitch-ready creative packages.',
  },
  {
    number: '03',
    title: 'Digital Content Creation',
    description:
      'Short-form, branded, educational, and campaign-ready content for screens, platforms, and audiences everywhere.',
  },
  {
    number: '04',
    title: 'Games & Interactive Media',
    description:
      'Creative support for game concepts, interactive storytelling, digital experiences, and playful world-building.',
  },
  {
    number: '05',
    title: 'AR, VR & Emerging Tech',
    description:
      'Augmented reality filters, virtual experiences, AI-assisted creative projects, and experimental digital innovation.',
  },
  {
    number: '06',
    title: 'Creative Talent & Production Teams',
    description:
      'Building flexible teams of animators, artists, designers, and digital professionals from across the Caribbean and beyond.',
  },
];

export default function ServicesSection() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="services-header">
          <div>
            <span className="section-kicker">What We Create</span>
            <h2>Services</h2>
          </div>
          <p>
            From first idea to final delivery, Animae Caribe House helps bring bold Caribbean and global stories to
            life through animation, digital content, emerging technology, and collaborative production support.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="services-card glass-card" key={service.title}>
              <span className="services-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
