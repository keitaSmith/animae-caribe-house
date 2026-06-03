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

    if (arg.startsWith('--source-id=')) {
      options.sourceId = arg.slice('--source-id='.length);
      continue;
    }

    if (arg.startsWith('--channel-id=')) {
      options.channelId = arg.slice('--channel-id='.length);
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
