import '../styles/index.css';
import SiteShell from '../components/SiteShell';

export const metadata = {
  title: 'Animae Caribe House | Where Digital Creatives Find Community',
  description:
    'A cinematic digital home for Caribbean animation, creative production, community updates and featured work.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
