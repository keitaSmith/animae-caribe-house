export const metadata = {
  title: 'Team | Animae Caribe House',
};

export default function Team() {
  return (
    <section className="page-section">
      <div className="container page-hero centered narrow-heading">
        <span className="section-kicker">Team</span>
        <h1>The creative minds behind Animae Caribe House.</h1>
        <p>
          Replace the placeholder with the final group shot, then add individual team cards once names, roles and bios are approved.
        </p>
      </div>

      <div className="container team-page-card glass-card">
        <img src="/assets/studio-placeholder.webp" alt="Team group shot placeholder" />
        <div>
          <h2>One strong group image first.</h2>
          <p>
            This keeps the first version simple and polished. A later phase can introduce detailed profiles for directors, animators, producers, writers, designers and collaborators.
          </p>
        </div>
      </div>
    </section>
  );
}
