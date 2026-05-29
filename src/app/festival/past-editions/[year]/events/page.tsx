import {notFound} from 'next/navigation';
import FestivalProgrammePage from '../../../../../components/FestivalProgrammePage';
import {getPastEditionsRoute, isValidFestivalYear} from '../../../../../lib/festivalRoutes';
import {getFestivalEditionByYear, getFestivalEventsByEdition} from '../../../../../sanity/lib/queries';

type PastFestivalEventsPageProps = {
  params: Promise<{
    year: string;
  }>;
};

export async function generateMetadata({params}: PastFestivalEventsPageProps) {
  const {year} = await params;
  const edition = await getFestivalEditionByYear(year);

  return {
    title: edition?.title ? `${edition.title} Events Archive` : `Animae Caribe Festival ${year} Events Archive`,
    description: edition?.description || `Browse the archived event programme for Animae Caribe Festival ${year}.`,
  };
}

export default async function PastFestivalEventsPage({params}: PastFestivalEventsPageProps) {
  const {year} = await params;

  if (!isValidFestivalYear(year)) {
    notFound();
  }

  const edition = await getFestivalEditionByYear(year);

  if (!edition?._id) {
    notFound();
  }

  const events = edition?._id ? await getFestivalEventsByEdition(edition._id) : null;

  return (
    <FestivalProgrammePage
      year={year}
      edition={edition}
      events={events}
      eyebrow="Past Edition Events"
      title={edition?.title || `Animae Caribe Festival ${year}`}
      intro={`Browse the archived programme for Animae Caribe Festival ${year}.`}
      emptyMessage="No events have been added for this festival edition yet."
      backHref={getPastEditionsRoute()}
      backLabel="Back to Past Editions"
    />
  );
}
