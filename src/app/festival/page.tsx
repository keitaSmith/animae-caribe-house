import FestivalExperience from '../../components/FestivalExperience';
import { getFeaturedFestivalEvents, getFestivalPage, getFestivalPartners } from '../../sanity/lib/queries';

export const metadata = {
  title: 'Animae Caribe Festival | Screenings, Workshops and Caribbean Animation',
  description:
    'The Animae Caribe Festival experience for screenings, workshops, panels, animation showcases, industry development and community programming.',
};

export default async function FestivalPage() {
  const [festivalPage, sanityPartners, sanityEvents] = await Promise.all([
    getFestivalPage(),
    getFestivalPartners(),
    getFeaturedFestivalEvents(),
  ]);
  const partners =
    sanityPartners
      ?.filter((partner) => partner.name && partner.logoUrl)
      .map((partner) => ({name: partner.name as string, src: partner.logoUrl as string})) || null;

  return <FestivalExperience content={festivalPage} partners={partners} events={sanityEvents} />;
}
