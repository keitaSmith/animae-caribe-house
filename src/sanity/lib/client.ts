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
      useCdn: !token,
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
