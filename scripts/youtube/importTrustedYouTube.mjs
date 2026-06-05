#!/usr/bin/env node
import {runTrustedYouTubeImporter} from './trustedYouTubeImporter.mjs';

function readArgs(argv) {
  const options = {};

  for (const arg of argv) {
    if (arg === '--backfill') {
      options.forceBackfill = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--historical-search') {
      options.historicalSearch = true;
      continue;
    }

    if (arg === '--fallback-search') {
      options.searchMode = true;
      continue;
    }

    if (arg.startsWith('--mode=')) {
      options.mode = arg.slice('--mode='.length);
      continue;
    }

    if (arg.startsWith('--source-id=')) {
      options.sourceId = arg.slice('--source-id='.length);
      continue;
    }

    if (arg.startsWith('--channel-id=')) {
      options.channelId = arg.slice('--channel-id='.length);
      continue;
    }

    if (arg.startsWith('--official-channel-id=')) {
      options.officialChannelIds = [...(options.officialChannelIds || []), arg.slice('--official-channel-id='.length)];
      continue;
    }

    if (arg.startsWith('--official-channel-ids=')) {
      options.officialChannelIds = [
        ...(options.officialChannelIds || []),
        ...arg
          .slice('--official-channel-ids='.length)
          .split(',')
          .map((value) => value.trim()),
      ];
      continue;
    }

    if (arg.startsWith('--from-year=')) {
      options.historicalFromYear = Number(arg.slice('--from-year='.length));
      continue;
    }

    if (arg.startsWith('--to-year=')) {
      options.historicalToYear = Number(arg.slice('--to-year='.length));
      continue;
    }

    if (arg.startsWith('--from=')) {
      options.from = arg.slice('--from='.length);
      continue;
    }

    if (arg.startsWith('--to=')) {
      options.to = arg.slice('--to='.length);
      continue;
    }

    if (arg.startsWith('--page-token=')) {
      options.pageToken = arg.slice('--page-token='.length);
      continue;
    }

    if (arg.startsWith('--max-pages=')) {
      options.dateRangeMaxPages = Number(arg.slice('--max-pages='.length));
      continue;
    }

    if (arg.startsWith('--q=')) {
      options.searchQueries = [...(options.searchQueries || []), arg.slice('--q='.length)];
      continue;
    }

    if (arg.startsWith('--queries=')) {
      options.searchQueries = [
        ...(options.searchQueries || []),
        ...arg
          .slice('--queries='.length)
          .split(/[|,]/)
          .map((value) => value.trim()),
      ];
      continue;
    }
  }

  return options;
}

try {
  const result = await runTrustedYouTubeImporter(readArgs(process.argv.slice(2)));

  if (result.errors > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error?.message || error);
  process.exitCode = 1;
}
