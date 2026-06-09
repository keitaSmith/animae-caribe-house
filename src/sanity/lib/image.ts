import {createImageUrlBuilder} from '@sanity/image-url';
import {isSanityConfigured, sanityConfig} from './client';

const builder =
  isSanityConfigured && sanityConfig.projectId
    ? createImageUrlBuilder({projectId: sanityConfig.projectId, dataset: sanityConfig.dataset})
    : null;

export function urlForImage(source: Parameters<NonNullable<typeof builder>['image']>[0] | null | undefined) {
  if (!builder || !source) {
    return null;
  }

  if (typeof source === 'object' && source !== null && 'asset' in source) {
    const asset = source.asset as { _ref?: string; _id?: string; url?: string } | null | undefined;

    if (!asset?._ref && !asset?._id && !asset?.url) {
      return null;
    }
  }

  try {
    return builder.image(source);
  } catch {
    return null;
  }
}
