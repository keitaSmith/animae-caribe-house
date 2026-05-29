import Link from 'next/link';

export const metadata = {
  title: 'Studio Setup | Animae Caribe',
};

export default function StudioSetupPage() {
  return (
    <section className="page-section page-section-cinematic">
      <div className="page-cinematic-hero page-cinematic-hero-contact">
        <div className="container festival-programme-page-hero-shell">
          <div className="festival-programme-page-copy">
            <span className="section-kicker">Sanity Studio</span>
            <h1>The Studio path is ready, but its deployment URL is not configured yet.</h1>
            <p>
              Set <code>SANITY_STUDIO_ORIGIN</code> on the root Vercel project so requests to <code>/studio</code> can
              be proxied to the separately deployed Sanity Studio.
            </p>
            <div className="festival-programme-page-actions">
              <Link className="button button-outline" href="/festival">
                Back to the site
              </Link>
            </div>
          </div>
          <div className="festival-programme-page-side">
            <div className="page-cinematic-ghost page-cinematic-ghost-contact" aria-hidden="true">
              <div className="page-cinematic-ghost-signal" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-a" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-b" />
              <div className="page-cinematic-ghost-pulse page-cinematic-ghost-pulse-c" />
              <div className="page-cinematic-ghost-dot" />
            </div>
          </div>
        </div>
      </div>

      <div className="container page-feature">
        <div className="glass-panel content-panel">
          <h2>What to configure</h2>
          <p>
            1. Deploy the Studio separately from <code>D:\React-js\animae-caribe-house\studio</code>.
          </p>
          <p>
            2. Add <code>SANITY_STUDIO_ORIGIN</code> to the root Vercel website project, for example{' '}
            <code>https://your-studio-deployment.vercel.app</code>.
          </p>
          <p>
            3. Redeploy the root website project. After that, <code>/studio</code> on the main domain will proxy to the
            Studio while keeping the browser URL on the main domain path.
          </p>
        </div>
      </div>
    </section>
  );
}
