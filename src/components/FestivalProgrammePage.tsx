import ButtonLink from './ButtonLink';
import {ArrowRightIcon, ExternalIcon} from './Icons';
import type {SanityEvent, SanityFestivalEdition} from '../sanity/lib/types';
import {getPastEditionsRoute} from '../lib/festivalRoutes';

type ProgrammeItem = {
  dateKey: string;
  dateLabel: string;
  timeLabel: string;
  title: string;
  description: string;
  venue: string;
  category: string;
  attendanceLabel?: string;
  priceLabel?: string;
  actionHref?: string;
  actionLabel?: string;
};

type FestivalProgrammePageProps = {
  year: string;
  edition?: SanityFestivalEdition | null;
  events?: SanityEvent[] | null;
  eyebrow: string;
  title: string;
  intro: string;
  emptyMessage: string;
  backHref: string;
  backLabel: string;
};

function formatDateLabel(dateTime?: string, legacyDate?: string) {
  if (dateTime) {
    const parsed = new Date(dateTime);

    if (!Number.isNaN(parsed.getTime())) {
      return {
        key: parsed.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat('en', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }).format(parsed),
      };
    }
  }

  if (legacyDate) {
    const parsed = new Date(`${legacyDate}T00:00:00`);

    if (!Number.isNaN(parsed.getTime())) {
      return {
        key: legacyDate,
        label: new Intl.DateTimeFormat('en', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }).format(parsed),
      };
    }

    return {key: legacyDate, label: legacyDate};
  }

  return {key: 'date-tba', label: 'Date to be announced'};
}

function formatTimeLabel(event: SanityEvent) {
  const start = event.startDateTime ? new Date(event.startDateTime) : null;
  const end = event.endDateTime ? new Date(event.endDateTime) : null;

  if (start && !Number.isNaN(start.getTime())) {
    const startLabel = new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(start);

    if (end && !Number.isNaN(end.getTime())) {
      const endLabel = new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(end);

      return `${startLabel} - ${endLabel}`;
    }

    return startLabel;
  }

  if (event.startTime && event.endTime) {
    return `${event.startTime} - ${event.endTime}`;
  }

  return event.startTime || 'Time to be announced';
}

function normalizeProgrammeItems(events?: SanityEvent[] | null): ProgrammeItem[] {
  if (!events?.length) {
    return [];
  }

  return events
    .filter((event) => event.title && (event.startDateTime || event.date))
    .map((event) => {
      const date = formatDateLabel(event.startDateTime, event.date);
      const actionHref = event.ticketUrl || event.registrationUrl;

      return {
        dateKey: date.key,
        dateLabel: date.label,
        timeLabel: formatTimeLabel(event),
        title: event.title || '',
        description: event.shortDescription || '',
        venue: event.venue || 'Venue to be announced',
        category: event.eventType || 'Festival event',
        attendanceLabel: event.attendanceType,
        priceLabel: event.priceLabel,
        actionHref,
        actionLabel: actionHref ? event.buttonLabel || (event.ticketUrl ? 'Get tickets' : 'Register now') : undefined,
      };
    });
}

function groupProgrammeItems(items: ProgrammeItem[]) {
  const groups = new Map<string, {dateLabel: string; items: ProgrammeItem[]}>();

  items.forEach((item) => {
    const existing = groups.get(item.dateKey);

    if (existing) {
      existing.items.push(item);
      return;
    }

    groups.set(item.dateKey, {dateLabel: item.dateLabel, items: [item]});
  });

  return Array.from(groups.entries()).map(([dateKey, value]) => ({
    dateKey,
    dateLabel: value.dateLabel,
    items: value.items,
  }));
}

function formatEditionRange(edition: SanityFestivalEdition | null | undefined, year: string) {
  if (!edition?.startDate || !edition?.endDate) {
    return edition?.location || `Festival programme for ${yearLabel(edition?.year || Number(year))}`;
  }

  const start = new Date(`${edition.startDate}T00:00:00`);
  const end = new Date(`${edition.endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return edition.location || `Festival programme for ${yearLabel(edition?.year || Number(year))}`;
  }

  const startLabel = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric'}).format(start);
  const endLabel = new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric'}).format(end);

  return edition.location ? `${startLabel} - ${endLabel} · ${edition.location}` : `${startLabel} - ${endLabel}`;
}

function yearLabel(year?: number) {
  return year ? String(year) : 'this edition';
}

export default function FestivalProgrammePage({
  year,
  edition,
  events,
  eyebrow,
  title,
  intro,
  emptyMessage,
  backHref,
  backLabel,
}: FestivalProgrammePageProps) {
  const groupedEvents = groupProgrammeItems(normalizeProgrammeItems(events));

  return (
    <>
      <section className="festival-programme-page-hero">
        <div className="container festival-programme-page-hero-shell">
          <div>
            <span className="section-kicker">{eyebrow}</span>
            <h1>{title}</h1>
            <p>
              {edition?.description ||
                intro ||
                `Browse the day-by-day programme for Animae Caribe Festival ${year}.`}
            </p>
          </div>
          <div className="festival-programme-page-meta">
            <p>{formatEditionRange(edition, year)}</p>
            <div className="festival-programme-page-actions">
              <ButtonLink href={backHref} variant="outline">
                {backLabel} <ArrowRightIcon />
              </ButtonLink>
              <ButtonLink href={getPastEditionsRoute()} variant="soft">
                Past Editions <ArrowRightIcon />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section festival-programme-page-section">
        <div className="container festival-programme-page-shell">
          {groupedEvents.length ? (
            groupedEvents.map((group) => (
              <section className="festival-programme-day-block" key={group.dateKey}>
                <div className="festival-programme-day-heading">
                  <span className="section-kicker">Festival Day</span>
                  <h2>{group.dateLabel}</h2>
                </div>
                <div className="festival-programme-day-events">
                  {group.items.map((event) => (
                    <article className="festival-event-card glass-card" key={`${group.dateKey}-${event.title}-${event.timeLabel}`}>
                      <div className="festival-event-meta">
                        <span>{group.dateLabel}</span>
                        <small>{event.timeLabel}</small>
                      </div>
                      <div>
                        <p className="festival-event-category">{event.category}</p>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <strong>{event.venue}</strong>
                        {event.attendanceLabel || event.priceLabel ? (
                          <div className="festival-programme-event-flags">
                            {event.attendanceLabel ? <span>{event.attendanceLabel}</span> : null}
                            {event.priceLabel ? <span>{event.priceLabel}</span> : null}
                          </div>
                        ) : null}
                        {event.actionHref && event.actionLabel ? (
                          <div className="festival-programme-event-action">
                            <ButtonLink href={event.actionHref} variant="outline" external>
                              {event.actionLabel} <ExternalIcon />
                            </ButtonLink>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="festival-programme-empty glass-panel">
              <span className="section-kicker">Programme updates</span>
              <h2>{emptyMessage}</h2>
              <p>
                Return to the Festival homepage for previews, partners, venue details, and updates as the programme
                takes shape.
              </p>
              <ButtonLink href={backHref} variant="primary">
                {backLabel} <ArrowRightIcon />
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
