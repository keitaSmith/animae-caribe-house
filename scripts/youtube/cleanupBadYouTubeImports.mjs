#!/usr/bin/env node
import {createClient} from 'next-sanity';
import {loadLocalEnv} from './trustedYouTubeImporter.mjs';

function readArgs(argv) {
  const options = {
    apply: false,
    delete: false,
  };

  for (const arg of argv) {
    if (arg === '--apply') {
      options.apply = true;
      continue;
    }

    if (arg === '--delete') {
      options.delete = true;
      continue;
    }

    if (arg === '--confirm-delete') {
      options.confirmDelete = true;
      continue;
    }

    if (arg.startsWith('--channel-id=')) {
      options.channelId = arg.slice('--channel-id='.length);
      continue;
    }

    if (arg.startsWith('--source-id=')) {
      options.sourceId = arg.slice('--source-id='.length);
      continue;
    }

    if (arg.startsWith('--imported-after=')) {
      options.importedAfter = arg.slice('--imported-after='.length);
      continue;
    }

    if (arg.startsWith('--imported-before=')) {
      options.importedBefore = arg.slice('--imported-before='.length);
      continue;
    }
  }

  return options;
}

function createSanityClient() {
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

function assertValidOptions(options) {
  if (!options.channelId) {
    throw new Error('Missing required --channel-id=...');
  }

  if (options.delete && (!options.apply || !options.confirmDelete)) {
    throw new Error('Delete requires --delete --apply --confirm-delete.');
  }
}

async function findCandidates(client, options) {
  return client.fetch(
    `*[
      _type == "youtubeVideo" &&
      channelId == $channelId &&
      reviewStatus == "autoPublished" &&
      (!defined(matchedKeywords) || length(matchedKeywords) == 0) &&
      (!defined($sourceId) || source._ref == $sourceId || source._ref == $draftSourceId) &&
      (!defined($importedAfter) || importedAt >= $importedAfter) &&
      (!defined($importedBefore) || importedAt <= $importedBefore)
    ] | order(importedAt desc){
      _id,
      title,
      youtubeVideoId,
      channelId,
      channelTitle,
      importedAt,
      lastSyncedAt,
      isVisible,
      reviewStatus,
      matchedKeywords,
      "sourceId": source._ref
    }`,
    {
      channelId: options.channelId,
      sourceId: options.sourceId || null,
      draftSourceId: options.sourceId ? `drafts.${options.sourceId}` : null,
      importedAfter: options.importedAfter || null,
      importedBefore: options.importedBefore || null,
    }
  );
}

function logCandidates(candidates) {
  console.log(`Cleanup candidates: ${candidates.length}`);

  for (const candidate of candidates) {
    console.log(
      [
        candidate._id,
        candidate.youtubeVideoId,
        candidate.importedAt || 'no importedAt',
        candidate.sourceId || 'no source',
        candidate.title || 'Untitled',
      ].join(' | ')
    );
  }
}

async function applyHide(client, candidates) {
  for (const candidate of candidates) {
    await client.patch(candidate._id).set({isVisible: false, reviewStatus: 'hidden'}).commit();
    console.log(`Hidden ${candidate._id} (${candidate.youtubeVideoId}).`);
  }
}

async function applyDelete(client, candidates) {
  for (const candidate of candidates) {
    await client.delete(candidate._id);
    console.log(`Deleted ${candidate._id} (${candidate.youtubeVideoId}).`);
  }
}

try {
  const options = readArgs(process.argv.slice(2));
  assertValidOptions(options);
  await loadLocalEnv(process.cwd());
  const client = createSanityClient();
  const candidates = await findCandidates(client, options);

  logCandidates(candidates);

  if (!options.apply) {
    console.log('DRY RUN: no Sanity documents were changed.');
    console.log('Apply safe hide with --apply. Delete requires --delete --apply --confirm-delete.');
  } else if (options.delete) {
    await applyDelete(client, candidates);
  } else {
    await applyHide(client, candidates);
  }
} catch (error) {
  console.error(error?.message || error);
  process.exitCode = 1;
}
