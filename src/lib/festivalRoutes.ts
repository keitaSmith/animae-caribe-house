export const DEFAULT_FESTIVAL_YEAR = 2026;

const LEGACY_PROGRAMME_HREFS = new Set(['#programme', '/festival#programme']);
const LEGACY_ARCHIVE_HREFS = new Set(['#archive', '/festival#archive']);

export function normalizeFestivalYear(year?: number | string | null) {
  if (typeof year === 'number' && Number.isFinite(year)) {
    return String(year);
  }

  if (typeof year === 'string' && /^\d{4}$/.test(year)) {
    return year;
  }

  return String(DEFAULT_FESTIVAL_YEAR);
}

export function isValidFestivalYear(year: string) {
  return /^\d{4}$/.test(year);
}

export function getFestivalEventsRoute(year?: number | string | null) {
  return `/festival/${normalizeFestivalYear(year)}/events`;
}

export function getPastEditionsRoute() {
  return '/festival/past-editions';
}

export function getPastFestivalEventsRoute(year?: number | string | null) {
  return `${getPastEditionsRoute()}/${normalizeFestivalYear(year)}/events`;
}

export function resolveProgrammeHref(
  href?: string | null,
  fallback?: number | string | null
) {
  if (!href || LEGACY_PROGRAMME_HREFS.has(href)) {
    if (typeof fallback === 'string' && fallback.startsWith('/')) {
      return fallback;
    }

    return getFestivalEventsRoute(fallback);
  }

  return href;
}

export function resolvePastEditionsHref(href?: string | null) {
  if (!href || LEGACY_ARCHIVE_HREFS.has(href)) {
    return getPastEditionsRoute();
  }

  return href;
}
