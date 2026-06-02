import {createClient} from 'next-sanity';

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-27',
};

export const isSanityConfigured = Boolean(sanityConfig.projectId && sanityConfig.dataset);

const token = process.env.SANITY_API_READ_TOKEN;

export const sanityClient = isSanityConfigured
  ? createClient({
      ...sanityConfig,
      // Pull directly from the Sanity API so CMS updates like reel playback IDs
      // show up promptly in server-rendered pages instead of lingering in CDN cache.
      useCdn: false,
      token,
      perspective: 'published',
    })
  : null;

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityClient) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return null;
  }
}
