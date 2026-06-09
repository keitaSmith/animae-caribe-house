import type { Partner } from '@/data/partners';
import type { SanityPartner } from '@/sanity/lib/types';

export function normalizeSanityPartners(partners?: SanityPartner[] | null): Partner[] {
  if (!partners?.length) {
    return [];
  }

  return partners
    .filter((partner) => partner.name && partner.logoUrl)
    .map((partner) => ({
      name: partner.name as string,
      src: partner.logoUrl as string,
    }));
}

function getPartnerRowCount(totalPartners: number) {
  if (totalPartners <= 0) {
    return 0;
  }

  if (totalPartners === 1) {
    return 1;
  }

  if (totalPartners <= 20) {
    return 2;
  }

  if (totalPartners <= 36) {
    return 3;
  }

  return 4;
}

export function splitPartnersIntoBalancedRows(items: Partner[]): Partner[][] {
  const rowCount = getPartnerRowCount(items.length);

  if (!rowCount) {
    return [];
  }

  const baseSize = Math.floor(items.length / rowCount);
  const remainder = items.length % rowCount;
  const rows: Partner[][] = [];
  let startIndex = 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const size = baseSize + (rowIndex < remainder ? 1 : 0);
    const rowItems = items.slice(startIndex, startIndex + size);

    if (rowItems.length) {
      rows.push(rowItems);
    }

    startIndex += size;
  }

  return rows;
}
