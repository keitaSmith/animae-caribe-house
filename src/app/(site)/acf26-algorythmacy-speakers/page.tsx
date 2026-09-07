import type {Metadata} from 'next';

import SpeakerFlyerGrid, {type SpeakerFlyer} from '@/components/SpeakerFlyerGrid';

export const metadata: Metadata = {
  title: 'ACF26 Algorythmacy Speakers | Animae Caribe',
  description: 'Private page for Animae Caribe Festival 2026 guest speakers.',
  robots: {
    index: false,
    follow: false,
  },
};

const flyers: SpeakerFlyer[] = [
  {name: 'Andres Maand', src: '/assets/acf26-speaker-flyers/andres-maand.jpg'},
  {name: 'Brad Schiff', src: '/assets/acf26-speaker-flyers/brad-schiff.jpg'},
  {name: 'Bruce W. Smith', src: '/assets/acf26-speaker-flyers/bruce-w-smith.jpg'},
  {name: 'Chevonnese Chevers Whyte', src: '/assets/acf26-speaker-flyers/chevonnese-chevers-whyte.jpg'},
  {name: 'Christopher Lavis', src: '/assets/acf26-speaker-flyers/christopher-lavis.jpg'},
  {name: 'Denise Khumalo', src: '/assets/acf26-speaker-flyers/denise-khumalo.jpg'},
  {name: 'Dr Uohna Thiessen', src: '/assets/acf26-speaker-flyers/dr-uohna-thiessen.jpg'},
  {name: 'Eric T. Elder', src: '/assets/acf26-speaker-flyers/eric-t-elder.jpg'},
  {name: 'Ferdynand Adimefe', src: '/assets/acf26-speaker-flyers/ferdynand-adimefe.jpg'},
  {name: 'Saundra McClain', src: '/assets/acf26-speaker-flyers/saundra-mcclain.jpg'},
  {name: 'Shaun Riaz Mohammed', src: '/assets/acf26-speaker-flyers/shaun-riaz-mohammed.jpg'},
];

export default function SpeakerFlyerApprovalPage() {
  return (
    <section className="page-section speaker-flyer-page">
      <div className="container">
        <header className="speaker-flyer-intro">
          <span className="eyebrow">Private speaker review</span>
          <h1>Animae Caribe Festival 2026</h1>
          <p>
            Guest speaker flyers for the Animae Caribe Festival &amp; Algorithmacy Conference,
            taking place at IMAX Cinema from 28–30 October 2026. Select your flyer to review it at full size.
          </p>
        </header>

        <SpeakerFlyerGrid flyers={flyers} />
      </div>
    </section>
  );
}
