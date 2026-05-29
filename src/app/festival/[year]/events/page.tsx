import {notFound} from 'next/navigation';
import FestivalProgrammePage from '../../../../components/FestivalProgrammePage';
import {festivalEvents} from '../../../../data/festival';
import {DEFAULT_FESTIVAL_YEAR, isValidFestivalYear} from '../../../../lib/festivalRoutes';
import {isSanityConfigured} from '../../../../sanity/lib/client';
import {getFestivalEditionByYear, getFestivalEventsByEdition} from '../../../../sanity/lib/queries';
import type {SanityEvent} from '../../../../sanity/lib/types';

type FestivalEventsPageProps = {
  params: Promise<{
    year: string;
  }>;
};

function getFallbackEvents(year: string): SanityEvent[] | null {
  if (year !== String(DEFAULT_FESTIVAL_YEAR)) {
    return null;
  }

  return festivalEvents.map((event, index) => ({
    _id: `fallback-${index}`,
    date: event.date,
    startTime: event.time,
    title: event.title,
    shortDescription: event.description,
    venue: event.location,
    eventType: event.category,
  }));
}

export async function generateMetadata({params}: FestivalEventsPageProps) {
  const {year} = await params;
  const edition = await getFestivalEditionByYear(year);

  return {
    title: edition?.title ? `${edition.title} Programme` : `Animae Caribe Festival ${year} Programme`,
    description:
      edition?.description || `The day-by-day programme for Animae Caribe Festival ${year}.`,
  };
}

export default async function FestivalEventsPage({params}: FestivalEventsPageProps) {
  const {year} = await params;

  if (!isValidFestivalYear(year)) {
    notFound();
  }

  const edition = await getFestivalEditionByYear(year);

  if (isSanityConfigured && !edition?._id) {
    notFound();
  }

  const sanityEvents = edition?._id ? await getFestivalEventsByEdition(edition._id) : null;
  const events = sanityEvents?.length ? sanityEvents : isSanityConfigured ? null : getFallbackEvents(year);

  return (
    <FestivalProgrammePage
      year={year}
      edition={edition}
      events={events}
      eyebrow={`Festival ${year}`}
      title={edition?.title || `Animae Caribe Festival ${year}`}
      intro={`Follow the full day-by-day programme for Animae Caribe Festival ${year}, from screenings and panels to workshops and community events.`}
      emptyMessage="The full programme will be announced soon."
      backHref="/festival"
      backLabel="Back to Festival Home"
    />
  );
}
