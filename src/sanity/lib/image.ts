import imageUrlBuilder from '@sanity/image-url';
import {isSanityConfigured, sanityConfig} from './client';

const builder =
  isSanityConfigured && sanityConfig.projectId
    ? imageUrlBuilder({projectId: sanityConfig.projectId, dataset: sanityConfig.dataset})
    : null;

export function urlForImage(source: Parameters<NonNullable<typeof builder>['image']>[0] | null | undefined) {
  if (!builder || !source) {
    return null;
  }

  return builder.image(source);
}
