import {runTrustedYouTubeImporter} from '../../../../scripts/youtube/trustedYouTubeImporter.mjs';

export const dynamic = 'force-dynamic';

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get('authorization') || '';
  const headerSecret = request.headers.get('x-cron-secret') || '';
  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret') || '';

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

async function handleImport(request) {
  if (!isAuthorized(request)) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }

  const url = new URL(request.url);
  const result = await runTrustedYouTubeImporter({
    loadEnv: false,
    forceBackfill: url.searchParams.get('backfill') === '1',
    historicalSearch: url.searchParams.get('historicalSearch') === '1',
    dryRun: url.searchParams.get('dryRun') === '1',
    historicalFromYear: url.searchParams.get('fromYear') ? Number(url.searchParams.get('fromYear')) : undefined,
    historicalToYear: url.searchParams.get('toYear') ? Number(url.searchParams.get('toYear')) : undefined,
    sourceId: url.searchParams.get('sourceId') || undefined,
    channelId: url.searchParams.get('channelId') || undefined,
  });

  return Response.json(result, {status: result.errors > 0 ? 500 : 200});
}

export async function GET(request) {
  return handleImport(request);
}

export async function POST(request) {
  return handleImport(request);
}
