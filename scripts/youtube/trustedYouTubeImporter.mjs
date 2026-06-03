import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createClient} from 'next-sanity';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_BACKFILL_MAX_PAGES = 10;
const DEFAULT_BACKFILL_MAX_RESULTS = 250;
const DEFAULT_RECENT_SYNC_MAX_RESULTS = 25;
const DEFAULT_HISTORICAL_FROM_YEAR = 2005;
const DEFAULT_HISTORICAL_MAX_RESULTS_PER_KEYWORD_YEAR = 50;
const YOUTUBE_AUTH_ONLY_PARAMS = new Set([
  'forMine',
  'forDeveloper',
  'forContentOwner',
  'onBehalfOfContentOwner',
  'onBehalfOfContentOwnerChannel',
  'mine',
  'managedByMe',
]);
const REVIEW_STATUS = {
  approved: 'approved',
  autoPublished: 'autoPublished',
  hidden: 'hidden',
  needsReview: 'needsReview',
  pending: 'pending',
  rejected: 'rejected',
};

export function loadLocalEnv(cwd = process.cwd()) {
  return Promise.all(['.env.local', '.env'].map((fileName) => loadEnvFile(resolve(cwd, fileName))));
}

async function loadEnvFile(path) {
  try {
    const content = await readFile(path, 'utf8');

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split('=');

      if (!key || process.env[key]) {
        continue;
      }

      process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
    }
  } catch {
    // Missing env files are fine; deployed environments should provide variables directly.
  }
}

function readPositiveIntegerEnv(name, fallback) {
  const value = Number(process.env[name]);

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function createSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID.');
  }

  if (!dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET.');
  }

  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN.');
  }

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2026-05-27',
    useCdn: false,
    perspective: 'published',
  });
}

function getImporterConfig(overrides = {}) {
  const apiKey = overrides.youtubeApiKey || process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing YOUTUBE_API_KEY.');
  }

  return {
    youtubeApiKey: apiKey,
    backfillMaxPages: overrides.backfillMaxPages || readPositiveIntegerEnv('YOUTUBE_BACKFILL_MAX_PAGES', DEFAULT_BACKFILL_MAX_PAGES),
    backfillMaxResults:
      overrides.backfillMaxResults || readPositiveIntegerEnv('YOUTUBE_BACKFILL_MAX_RESULTS', DEFAULT_BACKFILL_MAX_RESULTS),
    recentSyncMaxResults:
      overrides.recentSyncMaxResults ||
      readPositiveIntegerEnv('YOUTUBE_RECENT_SYNC_MAX_RESULTS', DEFAULT_RECENT_SYNC_MAX_RESULTS),
    historicalFromYear:
      overrides.historicalFromYear ||
      readPositiveIntegerEnv('YOUTUBE_HISTORICAL_FROM_YEAR', DEFAULT_HISTORICAL_FROM_YEAR),
    historicalToYear:
      overrides.historicalToYear || readPositiveIntegerEnv('YOUTUBE_HISTORICAL_TO_YEAR', new Date().getFullYear()),
    historicalWindow: overrides.historicalWindow || process.env.YOUTUBE_HISTORICAL_WINDOW || 'year',
    historicalMaxResultsPerKeywordYear:
      overrides.historicalMaxResultsPerKeywordYear ||
      readPositiveIntegerEnv(
        'YOUTUBE_HISTORICAL_MAX_RESULTS_PER_KEYWORD_YEAR',
        DEFAULT_HISTORICAL_MAX_RESULTS_PER_KEYWORD_YEAR
      ),
    officialChannelIds: uniqueStrings(
      overrides.officialChannelIds ||
        String(process.env.OFFICIAL_ANIMAE_CARIBE_YOUTUBE_CHANNEL_IDS || '')
          .split(',')
          .map((value) => value.trim())
    ),
  };
}

function slugify(value) {
  const base = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return base || 'youtube-video';
}

function uniqueStrings(values = []) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

function truncateError(error) {
  return String(error?.message || error || 'Unknown importer error').slice(0, 1000);
}

function getSourceKeywords(source) {
  return uniqueStrings([...(source.requiredKeywords || []), ...(source.trustedKeywords || [])]);
}

function findMatchedKeywords(video, keywords) {
  const haystack = `${video.title || ''}\n${video.description || ''}`.toLowerCase();

  return keywords.filter((keyword) => haystack.includes(keyword.toLowerCase()));
}

function isOfficialSource(source, config) {
  return (
    source.isOfficialSource === true &&
    source.sourceType === 'official' &&
    config.officialChannelIds.includes(source.channelId)
  );
}

function resolveSourcePolicy(source, config) {
  const requiredKeywords = getSourceKeywords(source);
  const official = isOfficialSource(source, config);

  if (official) {
    return {
      type: 'official',
      description: 'official imports all uploads',
      importsAllUploads: true,
      requiredKeywords: [],
      autoPublish: true,
    };
  }

  return {
    type: 'external',
    description: 'external filters by requiredKeywords',
    importsAllUploads: false,
    requiredKeywords,
    autoPublish: source.autoPublish === true,
  };
}

function shouldBackfillSource(source, forceBackfill) {
  if (forceBackfill) {
    return true;
  }

  if (source.initialBackfillCompletedAt) {
    return false;
  }

  return source.initialBackfillStatus === 'pending' || !source.initialBackfillCompletedAt;
}

function resolveImportPolicy(sourcePolicy, video) {
  const matchedKeywords = sourcePolicy.importsAllUploads
    ? []
    : findMatchedKeywords(video, sourcePolicy.requiredKeywords);

  if (!sourcePolicy.importsAllUploads && matchedKeywords.length === 0) {
    return {
      shouldImport: false,
      matchedKeywords,
      skipReason: sourcePolicy.requiredKeywords.length ? 'keywords did not match' : 'no required keywords configured',
    };
  }

  if (sourcePolicy.importsAllUploads || sourcePolicy.autoPublish) {
    return {
      shouldImport: true,
      matchedKeywords,
      isVisible: true,
      reviewStatus: REVIEW_STATUS.autoPublished,
    };
  }

  return {
    shouldImport: true,
    matchedKeywords,
    isVisible: false,
    reviewStatus: REVIEW_STATUS.needsReview,
  };
}

function pickThumbnail(thumbnails = {}) {
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url
  );
}

function assertPublicYouTubeRequest(path, params) {
  const authOnlyParams = Object.keys(params || {}).filter((key) => YOUTUBE_AUTH_ONLY_PARAMS.has(key));

  if (authOnlyParams.length > 0) {
    throw new Error(
      `Refusing YouTube API ${path} request with auth-only/delegation parameter(s): ${authOnlyParams.join(', ')}.`
    );
  }
}

async function youtubeGet(path, params, apiKey) {
  assertPublicYouTubeRequest(path, params);
  const url = new URL(`${YOUTUBE_API_BASE_URL}/${path}`);

  for (const [key, value] of Object.entries({...params, key: apiKey})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {headers: {}});

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`YouTube API ${path} failed with ${response.status}: ${body}`);

    error.youtubeStatus = response.status;

    try {
      const parsedBody = JSON.parse(body);
      error.youtubeReason = parsedBody?.error?.errors?.[0]?.reason;
    } catch {
      error.youtubeReason = undefined;
    }

    throw error;
  }

  return response.json();
}

async function getUploadsPlaylistId(channelId, apiKey) {
  const data = await youtubeGet(
    'channels',
    {
      part: 'contentDetails',
      id: channelId,
      maxResults: 1,
    },
    apiKey
  );
  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!playlistId) {
    throw new Error(`Could not find uploads playlist for channel ${channelId}.`);
  }

  return playlistId;
}

async function fetchUploadVideoIds(playlistId, mode, config) {
  const maxPages = mode === 'backfill' ? config.backfillMaxPages : 1;
  const maxResults = mode === 'backfill' ? config.backfillMaxResults : config.recentSyncMaxResults;
  const videoIds = [];
  let pageToken;
  let pagesFetched = 0;
  let reachedEndOfUploads = false;
  let stoppedBecause = 'endOfPlaylist';

  for (let page = 0; page < maxPages && videoIds.length < maxResults; page += 1) {
    const data = await youtubeGet(
      'playlistItems',
      {
        part: 'contentDetails',
        playlistId,
        maxResults: Math.min(50, maxResults - videoIds.length),
        pageToken,
      },
      config.youtubeApiKey
    );
    pagesFetched += 1;

    for (const item of data.items || []) {
      const videoId = item.contentDetails?.videoId;

      if (videoId) {
        videoIds.push(videoId);
      }
    }

    pageToken = data.nextPageToken;

    if (!pageToken) {
      reachedEndOfUploads = true;
      stoppedBecause = 'endOfPlaylist';
      break;
    }
  }

  if (!reachedEndOfUploads) {
    stoppedBecause = videoIds.length >= maxResults ? 'maxResults' : 'maxPages';
  }

  return {
    videoIds: uniqueStrings(videoIds),
    pagesFetched,
    reachedEndOfUploads,
    stoppedBecause,
    maxPages,
    maxResults,
  };
}

async function fetchVideoDetails(videoIds, apiKey) {
  const videos = [];

  for (let index = 0; index < videoIds.length; index += 50) {
    const ids = videoIds.slice(index, index + 50);
    const data = await youtubeGet(
      'videos',
      {
        part: 'snippet',
        id: ids.join(','),
        maxResults: ids.length,
      },
      apiKey
    );

    for (const item of data.items || []) {
      const snippet = item.snippet || {};

      videos.push({
        youtubeVideoId: item.id,
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: pickThumbnail(snippet.thumbnails),
        publishedAt: snippet.publishedAt,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        youtubeCategoryId: snippet.categoryId,
        youtubeTags: uniqueStrings(snippet.tags || []),
      });
    }
  }

  return videos;
}

function logHistoricalSearchRequest(logger, {channelId, keyword, publishedAfter, publishedBefore, order, maxResults, pageToken}) {
  logger?.log(
    `YouTube search request: endpoint=search.list, channelId=${channelId || 'none'}, keyword="${keyword}", publishedAfter=${publishedAfter}, publishedBefore=${publishedBefore}, order=${order}, maxResults=${maxResults}, pageTokenPresent=${Boolean(pageToken)}.`
  );
}

function collectSearchVideoIds(data, channelId) {
  const videoIds = [];

  for (const item of data.items || []) {
    const videoId = item.id?.videoId;
    const resultChannelId = item.snippet?.channelId;

    if (videoId && (!resultChannelId || resultChannelId === channelId)) {
      videoIds.push(videoId);
    }
  }

  return videoIds;
}

async function searchChannelVideos({channelId, keyword, publishedAfter, publishedBefore, config, logger}) {
  const maxResults = config.historicalMaxResultsPerKeywordYear;
  const videoIds = [];
  let pageToken;
  let pagesFetched = 0;
  let reachedEndOfSearch = false;
  let stoppedBecause = 'endOfSearch';

  while (videoIds.length < maxResults) {
    const searchParams = {
      part: 'snippet',
      channelId,
      q: keyword,
      type: 'video',
      order: 'date',
      publishedAfter,
      publishedBefore,
      maxResults: Math.min(50, maxResults - videoIds.length),
      pageToken,
    };

    logHistoricalSearchRequest(logger, {
      channelId,
      keyword,
      publishedAfter,
      publishedBefore,
      order: searchParams.order,
      maxResults: searchParams.maxResults,
      pageToken,
    });

    let data;

    try {
      data = await youtubeGet('search', searchParams, config.youtubeApiKey);
    } catch (error) {
      if (error.youtubeReason !== 'accountDelegationForbidden') {
        throw error;
      }

      const fallbackParams = {...searchParams};
      delete fallbackParams.channelId;
      logger?.warn(
        `YouTube channel-scoped search returned accountDelegationForbidden for ${channelId}; retrying public keyword/date search and filtering results back to this channel.`
      );
      logHistoricalSearchRequest(logger, {
        channelId: fallbackParams.channelId,
        keyword,
        publishedAfter,
        publishedBefore,
        order: fallbackParams.order,
        maxResults: fallbackParams.maxResults,
        pageToken,
      });
      data = await youtubeGet('search', fallbackParams, config.youtubeApiKey);
    }

    pagesFetched += 1;

    videoIds.push(...collectSearchVideoIds(data, channelId));

    pageToken = data.nextPageToken;

    if (!pageToken) {
      reachedEndOfSearch = true;
      stoppedBecause = 'endOfSearch';
      break;
    }
  }

  if (!reachedEndOfSearch) {
    stoppedBecause = videoIds.length >= maxResults ? 'maxResults' : 'maxPages';
  }

  return {
    videoIds: uniqueStrings(videoIds),
    pagesFetched,
    reachedEndOfSearch,
    stoppedBecause,
  };
}

function buildHistoricalWindows(config) {
  const fromYear = Math.min(config.historicalFromYear, config.historicalToYear);
  const toYear = Math.max(config.historicalFromYear, config.historicalToYear);
  const windows = [];

  if (config.historicalWindow !== 'year') {
    throw new Error(`Unsupported YOUTUBE_HISTORICAL_WINDOW "${config.historicalWindow}". Supported value: year.`);
  }

  for (let year = fromYear; year <= toYear; year += 1) {
    windows.push({
      label: String(year),
      publishedAfter: `${year}-01-01T00:00:00Z`,
      publishedBefore: `${year + 1}-01-01T00:00:00Z`,
    });
  }

  return windows;
}

async function getCategoryTitles(categoryIds, apiKey) {
  const ids = uniqueStrings(categoryIds);

  if (!ids.length) {
    return new Map();
  }

  const data = await youtubeGet(
    'videoCategories',
    {
      part: 'snippet',
      id: ids.join(','),
    },
    apiKey
  );

  return new Map((data.items || []).map((item) => [item.id, item.snippet?.title]));
}

async function getExistingVideosById(client, videoIds) {
  if (!videoIds.length) {
    return new Map();
  }

  const existing = await client.fetch(
    `*[_type == "youtubeVideo" && youtubeVideoId in $videoIds]{
      _id,
      youtubeVideoId,
      isVisible,
      reviewStatus
    }`,
    {videoIds}
  );

  return new Map((existing || []).map((video) => [video.youtubeVideoId, video]));
}

function buildCreateDocument(source, video, categoryTitle, policy, now) {
  const title = video.title || `YouTube video ${video.youtubeVideoId}`;

  return {
    _type: 'youtubeVideo',
    title,
    slug: {
      _type: 'slug',
      current: `${slugify(title)}-${video.youtubeVideoId}`,
    },
    youtubeVideoId: video.youtubeVideoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeVideoId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    publishedAt: video.publishedAt,
    channelId: video.channelId,
    channelTitle: video.channelTitle,
    source: {
      _type: 'reference',
      _ref: source._id,
    },
    sourceType: source.sourceType || 'channel',
    youtubeCategoryId: video.youtubeCategoryId,
    youtubeCategoryTitle: categoryTitle,
    youtubeTags: video.youtubeTags,
    matchedKeywords: policy.matchedKeywords,
    categories: categoryTitle ? [categoryTitle] : [],
    tags: policy.matchedKeywords,
    isVisible: policy.isVisible,
    reviewStatus: policy.reviewStatus,
    importedAt: now,
    lastSyncedAt: now,
  };
}

function buildSafeMetadataPatch(video, categoryTitle, now) {
  return {
    title: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    youtubeCategoryId: video.youtubeCategoryId,
    youtubeCategoryTitle: categoryTitle,
    youtubeTags: video.youtubeTags,
    lastSyncedAt: now,
  };
}

async function importVideo(client, source, video, existingVideo, categoryTitle, policy, now, dryRun) {
  if (existingVideo) {
    if (dryRun) {
      return 'updated';
    }

    await client.patch(existingVideo._id).set(buildSafeMetadataPatch(video, categoryTitle, now)).commit();

    return 'updated';
  }

  if (dryRun) {
    return 'imported';
  }

  await client.create(buildCreateDocument(source, video, categoryTitle, policy, now));

  return 'imported';
}

async function updateSourceStatus(client, sourceId, patch) {
  await client.patch(sourceId).set(patch).commit();
}

async function runHistoricalSearchSource(client, source, config, logger) {
  const now = new Date().toISOString();
  const dryRun = config.dryRun === true;
  const sourcePolicy = resolveSourcePolicy(source, config);
  const counters = {
    sourceTitle: source.title || source.channelTitle || source.channelId,
    channelId: source.channelId,
    sourceType: source.sourceType,
    isOfficialSource: source.isOfficialSource === true,
    autoPublish: source.autoPublish === true,
    requiredKeywords: sourcePolicy.requiredKeywords,
    sourcePolicy: sourcePolicy.description,
    checked: 0,
    totalUploadVideosInspected: 0,
    imported: 0,
    skippedNoKeywordMatch: 0,
    duplicatesSkipped: 0,
    updated: 0,
    errors: 0,
    reachedEndOfUploads: false,
    stoppedBecause: 'historicalSearch',
    uploadPagesFetched: 0,
    historicalSearchCandidates: 0,
    historicalSearchAccepted: 0,
    historicalSearchRejected: 0,
    historicalWindowsSearched: 0,
  };

  logger.log(`Scanning ${source.title || source.channelTitle || source.channelId} (${source.channelId}) in historical-search mode.`);
  logger.log(
    `Source settings: sourceType=${source.sourceType || 'unset'}, isOfficialSource=${source.isOfficialSource === true}, autoPublish=${source.autoPublish === true}, requiredKeywords=${JSON.stringify(sourcePolicy.requiredKeywords)}.`
  );
  logger.log(`Source policy used: ${sourcePolicy.description}.`);

  if (sourcePolicy.importsAllUploads) {
    logger.warn('Historical search is intended for trusted external sources; official source will not run keyword search.');
    return counters;
  }

  if (sourcePolicy.requiredKeywords.length === 0) {
    logger.warn(`External source ${source.channelId} has no requiredKeywords; historical search will import nothing.`);
    return counters;
  }

  if (dryRun) {
    logger.log('DRY RUN: no Sanity source status or video documents will be written.');
  } else {
    await updateSourceStatus(client, source._id, {
      lastCheckedAt: now,
    });
  }

  try {
    const windows = buildHistoricalWindows(config);
    const processedVideoIds = new Set();

    for (const keyword of sourcePolicy.requiredKeywords) {
      for (const window of windows) {
        counters.historicalWindowsSearched += 1;
        const searchResult = await searchChannelVideos({
          channelId: source.channelId,
          keyword,
          publishedAfter: window.publishedAfter,
          publishedBefore: window.publishedBefore,
          config,
          logger,
        });
        const candidateIds = searchResult.videoIds.filter((videoId) => !processedVideoIds.has(videoId));
        counters.historicalSearchCandidates += searchResult.videoIds.length;
        logger.log(
          `Historical search: keyword "${keyword}", window ${window.label}, candidates ${searchResult.videoIds.length}, new candidates ${candidateIds.length}, pages ${searchResult.pagesFetched}, stoppedBecause ${searchResult.stoppedBecause}.`
        );

        if (!candidateIds.length) {
          continue;
        }

        const [videos, existingById] = await Promise.all([
          fetchVideoDetails(candidateIds, config.youtubeApiKey),
          getExistingVideosById(client, candidateIds),
        ]);
        const categoryTitles = await getCategoryTitles(
          videos.map((video) => video.youtubeCategoryId).filter(Boolean),
          config.youtubeApiKey
        );
        let acceptedInWindow = 0;
        let rejectedInWindow = 0;
        let importedInWindow = 0;
        let updatedInWindow = 0;
        let duplicatesInWindow = 0;

        for (const video of videos) {
          processedVideoIds.add(video.youtubeVideoId);
          counters.checked += 1;
          const existingVideo = existingById.get(video.youtubeVideoId);
          const policy = resolveImportPolicy(sourcePolicy, video);

          if (!policy.shouldImport) {
            counters.skippedNoKeywordMatch += 1;
            counters.historicalSearchRejected += 1;
            rejectedInWindow += 1;
            logger.log(`Rejected ${video.youtubeVideoId}: local keyword verification failed.`);
            continue;
          }

          counters.historicalSearchAccepted += 1;
          acceptedInWindow += 1;
          const result = await importVideo(
            client,
            source,
            video,
            existingVideo,
            categoryTitles.get(video.youtubeCategoryId),
            policy,
            now,
            dryRun
          );

          if (result === 'updated') {
            counters.updated += 1;
            counters.duplicatesSkipped += 1;
            updatedInWindow += 1;
            duplicatesInWindow += 1;
            logger.log(`${dryRun ? 'Would update' : 'Updated'} existing video ${video.youtubeVideoId}; visibility/review fields preserved.`);
          } else {
            counters.imported += 1;
            importedInWindow += 1;
            logger.log(`${dryRun ? 'Would import' : 'Imported'} ${video.youtubeVideoId} as ${policy.reviewStatus}.`);
          }
        }

        logger.log(
          `Historical window summary: keyword "${keyword}", window ${window.label}, accepted ${acceptedInWindow}, rejected ${rejectedInWindow}, imported ${importedInWindow}, updated ${updatedInWindow}, duplicates ${duplicatesInWindow}.`
        );
      }
    }

    if (!dryRun) {
      await updateSourceStatus(client, source._id, {
        lastSuccessfulSyncAt: now,
        lastCheckedAt: now,
      });
    }

    logger.log(
      `Finished ${source.title || source.channelId}: sourceType ${source.sourceType || 'unset'}, isOfficialSource ${source.isOfficialSource === true}, autoPublish ${source.autoPublish === true}, requiredKeywords ${JSON.stringify(sourcePolicy.requiredKeywords)}, source policy ${sourcePolicy.description}, historical candidates ${counters.historicalSearchCandidates}, accepted ${counters.historicalSearchAccepted}, rejected ${counters.historicalSearchRejected}, imported ${counters.imported}, updated ${counters.updated}, duplicates ${counters.duplicatesSkipped}, keyword skips ${counters.skippedNoKeywordMatch}.`
    );

    return counters;
  } catch (error) {
    counters.errors += 1;

    if (!dryRun) {
      await updateSourceStatus(client, source._id, {
        lastCheckedAt: now,
      });
    }

    logger.error(`Failed ${source.title || source.channelId}: ${truncateError(error)}`);
    return counters;
  }
}

async function runSource(client, source, mode, config, logger) {
  const now = new Date().toISOString();
  const dryRun = config.dryRun === true;
  const sourcePolicy = resolveSourcePolicy(source, config);
  const counters = {
    sourceTitle: source.title || source.channelTitle || source.channelId,
    channelId: source.channelId,
    sourceType: source.sourceType,
    isOfficialSource: source.isOfficialSource === true,
    autoPublish: source.autoPublish === true,
    requiredKeywords: sourcePolicy.requiredKeywords,
    sourcePolicy: sourcePolicy.description,
    checked: 0,
    totalUploadVideosInspected: 0,
    imported: 0,
    skippedNoKeywordMatch: 0,
    duplicatesSkipped: 0,
    updated: 0,
    errors: 0,
    reachedEndOfUploads: false,
    stoppedBecause: 'error',
    uploadPagesFetched: 0,
    historicalSearchCandidates: 0,
    historicalSearchAccepted: 0,
    historicalSearchRejected: 0,
    historicalWindowsSearched: 0,
  };

  logger.log(`Scanning ${source.title || source.channelTitle || source.channelId} (${source.channelId}) in ${mode} mode.`);
  logger.log(
    `Source settings: sourceType=${source.sourceType || 'unset'}, isOfficialSource=${source.isOfficialSource === true}, autoPublish=${source.autoPublish === true}, requiredKeywords=${JSON.stringify(sourcePolicy.requiredKeywords)}.`
  );
  logger.log(`Source policy used: ${sourcePolicy.description}.`);

  if (source.isOfficialSource === true && !sourcePolicy.importsAllUploads) {
    logger.warn(
      `Official import disabled for ${source.channelId}: sourceType must be "official" and channelId must be listed in OFFICIAL_ANIMAE_CARIBE_YOUTUBE_CHANNEL_IDS.`
    );
  }

  if (!sourcePolicy.importsAllUploads && sourcePolicy.requiredKeywords.length === 0) {
    logger.warn(`External source ${source.channelId} has no requiredKeywords; it will import nothing.`);
  }

  if (dryRun) {
    logger.log('DRY RUN: no Sanity source status or video documents will be written.');
  } else if (mode === 'backfill') {
    await updateSourceStatus(client, source._id, {
      initialBackfillStatus: 'running',
      lastCheckedAt: now,
    });
  } else {
    await updateSourceStatus(client, source._id, {
      lastCheckedAt: now,
    });
  }

  try {
    const uploadsPlaylistId = await getUploadsPlaylistId(source.channelId, config.youtubeApiKey);
    logger.log(`Uploads playlist: ${uploadsPlaylistId}.`);
    const uploadScan = await fetchUploadVideoIds(uploadsPlaylistId, mode, config);
    const videoIds = uploadScan.videoIds;
    counters.checked = videoIds.length;
    counters.totalUploadVideosInspected = videoIds.length;
    counters.reachedEndOfUploads = uploadScan.reachedEndOfUploads;
    counters.stoppedBecause = uploadScan.stoppedBecause;
    counters.uploadPagesFetched = uploadScan.pagesFetched;
    logger.log(
      `Uploads inspected: ${videoIds.length}; pages fetched: ${uploadScan.pagesFetched}/${uploadScan.maxPages}; stoppedBecause: ${uploadScan.stoppedBecause}; reachedEndOfUploads: ${uploadScan.reachedEndOfUploads}.`
    );

    const [videos, existingById] = await Promise.all([
      fetchVideoDetails(videoIds, config.youtubeApiKey),
      getExistingVideosById(client, videoIds),
    ]);
    const categoryTitles = await getCategoryTitles(
      videos.map((video) => video.youtubeCategoryId).filter(Boolean),
      config.youtubeApiKey
    );

    for (const video of videos) {
      const existingVideo = existingById.get(video.youtubeVideoId);
      const policy = resolveImportPolicy(sourcePolicy, video);

      if (!policy.shouldImport) {
        counters.skippedNoKeywordMatch += 1;
        logger.log(`Skipped ${video.youtubeVideoId}: ${policy.skipReason}.`);
        continue;
      }

      const result = await importVideo(
        client,
        source,
        video,
        existingVideo,
        categoryTitles.get(video.youtubeCategoryId),
        policy,
        now,
        dryRun
      );

      if (result === 'updated') {
        counters.updated += 1;
        counters.duplicatesSkipped += 1;
        logger.log(`${dryRun ? 'Would update' : 'Updated'} existing video ${video.youtubeVideoId}; visibility/review fields preserved.`);
      } else {
        counters.imported += 1;
        logger.log(`${dryRun ? 'Would import' : 'Imported'} ${video.youtubeVideoId} as ${policy.reviewStatus}.`);
      }
    }

    const successPatch =
      mode === 'backfill'
        ? {
            initialBackfillStatus: 'completed',
            initialBackfillCompletedAt: now,
            initialBackfillLastError: '',
            lastSuccessfulSyncAt: now,
            lastCheckedAt: now,
          }
        : {
            lastSuccessfulSyncAt: now,
            lastCheckedAt: now,
          };

    if (!dryRun) {
      await updateSourceStatus(client, source._id, successPatch);
    }
    logger.log(
      `Finished ${source.title || source.channelId}: sourceType ${source.sourceType || 'unset'}, isOfficialSource ${source.isOfficialSource === true}, autoPublish ${source.autoPublish === true}, requiredKeywords ${JSON.stringify(sourcePolicy.requiredKeywords)}, source policy ${sourcePolicy.description}, total upload videos inspected ${counters.totalUploadVideosInspected}, imported ${counters.imported}, updated ${counters.updated}, duplicates ${counters.duplicatesSkipped}, keyword skips ${counters.skippedNoKeywordMatch}, stoppedBecause ${counters.stoppedBecause}, reachedEndOfUploads ${counters.reachedEndOfUploads}.`
    );

    return counters;
  } catch (error) {
    counters.errors += 1;
    const failurePatch =
      mode === 'backfill'
        ? {
            initialBackfillStatus: 'failed',
            initialBackfillLastError: truncateError(error),
            lastCheckedAt: now,
          }
        : {
            lastCheckedAt: now,
          };

    if (!dryRun) {
      await updateSourceStatus(client, source._id, failurePatch);
    }
    logger.error(`Failed ${source.title || source.channelId}: ${truncateError(error)}`);
    return counters;
  }
}

function mergeCounters(total, next) {
  for (const key of Object.keys(total)) {
    if (typeof total[key] === 'number') {
      total[key] += next[key] || 0;
    }
  }

  total.sourceResults.push({
    sourceTitle: next.sourceTitle,
    channelId: next.channelId,
    sourceType: next.sourceType,
    isOfficialSource: next.isOfficialSource,
    autoPublish: next.autoPublish,
    requiredKeywords: next.requiredKeywords,
    sourcePolicy: next.sourcePolicy,
    checked: next.checked,
    totalUploadVideosInspected: next.totalUploadVideosInspected,
    imported: next.imported,
    updated: next.updated,
    duplicatesSkipped: next.duplicatesSkipped,
    skippedNoKeywordMatch: next.skippedNoKeywordMatch,
    stoppedBecause: next.stoppedBecause,
    reachedEndOfUploads: next.reachedEndOfUploads,
    uploadPagesFetched: next.uploadPagesFetched,
    historicalSearchCandidates: next.historicalSearchCandidates,
    historicalSearchAccepted: next.historicalSearchAccepted,
    historicalSearchRejected: next.historicalSearchRejected,
    historicalWindowsSearched: next.historicalWindowsSearched,
    errors: next.errors,
  });
}

export async function runTrustedYouTubeImporter(options = {}) {
  if (options.loadEnv !== false) {
    await loadLocalEnv(options.cwd || process.cwd());
  }

  const client = options.client || createSanityWriteClient();
  const config = getImporterConfig(options);
  config.dryRun = options.dryRun === true;
  const logger = options.logger || console;
  const forceBackfill = Boolean(options.forceBackfill);
  const historicalSearch = Boolean(options.historicalSearch);
  const sourceId = options.sourceId;
  const channelId = options.channelId;
  const total = {
    sourcesScanned: 0,
    sourcesBackfilled: 0,
    sourcesSynced: 0,
    checked: 0,
    totalUploadVideosInspected: 0,
    imported: 0,
    skippedNoKeywordMatch: 0,
    duplicatesSkipped: 0,
    updated: 0,
    errors: 0,
    historicalSearchCandidates: 0,
    historicalSearchAccepted: 0,
    historicalSearchRejected: 0,
    historicalWindowsSearched: 0,
    sourceResults: [],
  };
  const sources = await client.fetch(
    `*[
      _type == "youtubeSource" &&
      isActive == true &&
      defined(channelId) &&
      (!defined($sourceId) || _id == $sourceId || _id == $draftSourceId) &&
      (!defined($channelId) || channelId == $channelId)
    ] | order(title asc){
      _id,
      title,
      channelId,
      channelTitle,
      sourceType,
      sourceUrl,
      isOfficialSource,
      requiredKeywords,
      trustedKeywords,
      autoPublish,
      initialBackfillStatus,
      initialBackfillCompletedAt
    }`,
    {sourceId: sourceId || null, draftSourceId: sourceId ? `drafts.${sourceId}` : null, channelId: channelId || null}
  );

  logger.log(`Active YouTube sources found: ${sources.length}.`);

  for (const source of sources) {
    const mode = historicalSearch ? 'historicalSearch' : shouldBackfillSource(source, forceBackfill) ? 'backfill' : 'sync';

    total.sourcesScanned += 1;

    if (mode === 'backfill') {
      total.sourcesBackfilled += 1;
    } else {
      total.sourcesSynced += 1;
    }

    const counters =
      mode === 'historicalSearch'
        ? await runHistoricalSearchSource(client, source, config, logger)
        : await runSource(client, source, mode, config, logger);
    mergeCounters(total, counters);
  }

  logger.log(
    `YouTube import complete: sources ${total.sourcesScanned}, total upload videos inspected ${total.totalUploadVideosInspected}, historical candidates ${total.historicalSearchCandidates}, historical accepted ${total.historicalSearchAccepted}, historical rejected ${total.historicalSearchRejected}, imported ${total.imported}, updated ${total.updated}, duplicates ${total.duplicatesSkipped}, keyword skips ${total.skippedNoKeywordMatch}, errors ${total.errors}.`
  );

  return total;
}
