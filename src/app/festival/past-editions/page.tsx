import PastFestivalEditionsPage from '../../../components/PastFestivalEditionsPage';
import {DEFAULT_FESTIVAL_YEAR} from '../../../lib/festivalRoutes';
import {getActiveFestivalEdition, getPastFestivalEditions} from '../../../sanity/lib/queries';

export const metadata = {
  title: 'Animae Caribe Festival Past Editions',
  description: 'Browse past Animae Caribe Festival editions and jump directly into their event programmes.',
};

export default async function FestivalPastEditionsIndexPage() {
  const [activeEdition, editions] = await Promise.all([getActiveFestivalEdition(), getPastFestivalEditions()]);
  const currentYear = activeEdition?.year || DEFAULT_FESTIVAL_YEAR;

  return <PastFestivalEditionsPage editions={editions} currentYear={currentYear} />;
}
