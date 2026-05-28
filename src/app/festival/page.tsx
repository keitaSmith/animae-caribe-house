import FestivalExperience from '../../components/FestivalExperience';
import {DEFAULT_FESTIVAL_YEAR, getFestivalEventsRoute} from '../../lib/festivalRoutes';
import {getActiveFestivalEdition, getFestivalPage, getFestivalPartners, getUpcomingFestivalEventsByEdition} from '../../sanity/lib/queries';

export const metadata = {
  title: 'Animae Caribe Festival | Screenings, Workshops and Caribbean Animation',
  description:
    'The Animae Caribe Festival experience for screenings, workshops, panels, animation showcases, industry development and community programming.',
};

export default async function FestivalPage() {
  const [festivalPage, sanityPartners, activeEdition] = await Promise.all([
    getFestivalPage(),
    getFestivalPartners(),
    getActiveFestivalEdition(),
  ]);
  const partners =
    sanityPartners
      ?.filter((partner) => partner.name && partner.logoUrl)
      .map((partner) => ({name: partner.name as string, src: partner.logoUrl as string})) || null;
  const festivalEditionId = festivalPage?.eventsPreview?.festivalEdition?._id;
  const festivalEditionYear = festivalPage?.eventsPreview?.festivalEdition?.year || activeEdition?.year || DEFAULT_FESTIVAL_YEAR;
  const maxEvents = festivalPage?.eventsPreview?.maxEvents || 3;
  const upcomingEvents = festivalEditionId ? await getUpcomingFestivalEventsByEdition(festivalEditionId, maxEvents) : null;
  const legacySelectedEvents = festivalPage?.eventsPreview?.events?.filter(
    (event) => event.title && (event.startDateTime || event.date)
  );
  const events = upcomingEvents?.length ? upcomingEvents : legacySelectedEvents?.length ? legacySelectedEvents : null;

  return (
    <FestivalExperience
      content={festivalPage}
      partners={partners}
      events={events}
      currentProgrammeHref={getFestivalEventsRoute(festivalEditionYear)}
    />
  );
}
