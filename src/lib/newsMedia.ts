import {cache} from 'react';
import type {PortableTextBlock} from '@portabletext/types';
import {sanityFetch} from '@/sanity/lib/client';
import {urlForImage} from '@/sanity/lib/image';

export type NewsMediaType = 'article' | 'video';

export type NewsMediaItem = {
  id: string;
  type: NewsMediaType;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  detailImageUrl?: string;
  publishedAt?: string;
  categories: string[];
  tags: string[];
  sourceLabel?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  embedUrl?: string;
};

export type NewsMediaDetail = NewsMediaItem & {
  author?: string;
  body?: PortableTextBlock[];
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  matchedKeywords: string[];
};

export type NewsMediaPageResult = {
  items: NewsMediaItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type NewsMediaAdjacentPosts = {
  previous?: NewsMediaItem;
  next?: NewsMediaItem;
};

type RawNewsMediaItem = {
  _id?: string;
  _type?: 'post' | 'youtubeVideo';
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  image?: SanityImageSource;
  publishedAt?: string;
  date?: string;
  categories?: string[];
  tags?: string[];
  channelTitle?: string;
  source?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  embedUrl?: string;
  author?: string;
  body?: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  seoImage?: SanityImageSource;
  matchedKeywords?: string[];
};

type SanityImageSource = {
  _type?: 'image';
  alt?: string;
  caption?: string;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
};

const PAGE_SIZE = 9;

const articleVisibilityFilter = `_type == "post" && defined(slug.current) && coalesce(isVisible, true) == true`;
const videoVisibilityFilter = `_type == "youtubeVideo" && defined(slug.current) && isVisible == true && coalesce(reviewStatus, "needsReview") in ["approved", "autoPublished"]`;
const unifiedFilter = `(${articleVisibilityFilter}) || (${videoVisibilityFilter})`;
const unifiedOrderField = `coalesce(publishedAt, date, _createdAt)`;

const normalizedProjection = `
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  description,
  "image": select(
    _type == "post" => coalesce(
      featuredImage{
        ...,
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        }
      },
      seo.seoImage{
        ...,
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        }
      }
    )
  ),
  "imageUrl": select(
    _type == "youtubeVideo" => thumbnailUrl
  ),
  "imageAlt": coalesce(featuredImage.alt, seo.seoImage.alt),
  "publishedAt": ${unifiedOrderField},
  "categories": coalesce(categories, []),
  "tags": coalesce(tags, []),
  channelTitle,
  "source": source->title,
  youtubeVideoId,
  youtubeUrl,
  embedUrl
`;

const detailProjection = `
  ${normalizedProjection},
  author,
  body,
  "seoTitle": seo.seoTitle,
  "seoDescription": seo.seoDescription,
  "seoImage": seo.seoImage{
    ...,
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    }
  },
  "seoImageUrl": seo.seoImage.asset->url,
  "matchedKeywords": coalesce(matchedKeywords, [])
`;

function uniqueStrings(values?: string[]) {
  return Array.from(new Set((values || []).map((value) => value?.trim()).filter(Boolean) as string[]));
}

function normalizeType(type?: RawNewsMediaItem['_type']): NewsMediaType {
  return type === 'youtubeVideo' ? 'video' : 'article';
}

function buildSanityImageUrl(image: SanityImageSource | undefined, width: number, height: number) {
  return (
    urlForImage(image)
      ?.width(width)
      .height(height)
      .fit('crop')
      .auto('format')
      .url() || image?.asset?.url
  );
}

function normalizeItem(raw: RawNewsMediaItem): NewsMediaItem | null {
  if (!raw._id || !raw.title || !raw.slug) {
    return null;
  }

  const type = normalizeType(raw._type);
  const cardImageUrl =
    type === 'article'
      ? buildSanityImageUrl(raw.image, 960, 600)
      : raw.imageUrl;
  const detailImageUrl =
    type === 'article'
      ? buildSanityImageUrl(raw.image, 1440, 810)
      : raw.imageUrl;

  return {
    id: raw._id,
    type,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt || raw.description,
    imageUrl: cardImageUrl,
    imageAlt: raw.imageAlt || raw.title,
    detailImageUrl,
    publishedAt: raw.publishedAt || raw.date,
    categories: uniqueStrings(raw.categories),
    tags: uniqueStrings(raw.tags),
    sourceLabel: type === 'video' ? raw.channelTitle || raw.source : undefined,
    youtubeVideoId: raw.youtubeVideoId,
    youtubeUrl: raw.youtubeUrl,
    embedUrl: raw.embedUrl,
  };
}

function normalizeDetail(raw: RawNewsMediaItem): NewsMediaDetail | null {
  const item = normalizeItem(raw);

  if (!item) {
    return null;
  }

  return {
    ...item,
    author: raw.author,
    body: raw.body,
    description: raw.description,
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    seoImageUrl: buildSanityImageUrl(raw.seoImage, 1200, 630) || raw.seoImageUrl,
    matchedKeywords: uniqueStrings(raw.matchedKeywords),
  };
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  if (totalPages > 0 && page > totalPages) {
    return totalPages;
  }

  return Math.floor(page);
}

export class NewsMediaRepository {
  async getPage(page: number, pageSize = PAGE_SIZE): Promise<NewsMediaPageResult> {
    const requestedPage = Math.max(1, Math.floor(page || 1));
    const countQuery = `count(*[${unifiedFilter}])`;
    const totalItems = (await sanityFetch<number>(countQuery)) || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = clampPage(requestedPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const items =
      (await sanityFetch<RawNewsMediaItem[]>(
        `*[${unifiedFilter}] | order(${unifiedOrderField} desc)[$start...$end]{
          ${normalizedProjection}
        }`,
        {start, end}
      )) || [];

    return {
      items: items.map(normalizeItem).filter(Boolean) as NewsMediaItem[],
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }

  async getBySlug(slug: string): Promise<NewsMediaDetail | null> {
    const raw = await sanityFetch<RawNewsMediaItem>(
      `*[${unifiedFilter} && slug.current == $slug][0]{
        ${detailProjection}
      }`,
      {slug}
    );

    return raw ? normalizeDetail(raw) : null;
  }

  async getRecent(excludedSlug?: string, limit = 3): Promise<NewsMediaItem[]> {
    const items =
      (await sanityFetch<RawNewsMediaItem[]>(
        `*[${unifiedFilter} && slug.current != $excludedSlug] | order(${unifiedOrderField} desc)[0...$limit]{
          ${normalizedProjection}
        }`,
        {excludedSlug: excludedSlug || '', limit}
      )) || [];

    return items.map(normalizeItem).filter(Boolean) as NewsMediaItem[];
  }

  async getAdjacent(slug: string): Promise<NewsMediaAdjacentPosts> {
    const items =
      (await sanityFetch<RawNewsMediaItem[]>(
        `*[${unifiedFilter}] | order(${unifiedOrderField} desc){
          ${normalizedProjection}
        }`
      )) || [];
    const normalized = items.map(normalizeItem).filter(Boolean) as NewsMediaItem[];
    const currentIndex = normalized.findIndex((item) => item.slug === slug);

    if (currentIndex < 0) {
      return {};
    }

    return {
      next: normalized[currentIndex - 1],
      previous: normalized[currentIndex + 1],
    };
  }
}

export const getNewsMediaRepository = cache(() => new NewsMediaRepository());

export function formatNewsMediaDate(value?: string) {
  if (!value) {
    return 'Date to be announced';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date to be announced';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
