import type {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic';

function isAllowedSanityFile(url: URL) {
  return (
    url.protocol === 'https:' &&
    url.hostname === 'cdn.sanity.io' &&
    url.pathname.startsWith('/files/') &&
    !url.username &&
    !url.password
  );
}

function sanitizeFilename(value: string | null) {
  const fallback = 'animae-caribe-business-development.pdf';
  const filename = (value || fallback)
    .replace(/[\\/:*?"<>|\u0000-\u001f\u007f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const safeFilename = filename || fallback;
  return safeFilename.toLowerCase().endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`;
}

function encodeContentDispositionFilename(filename: string) {
  const asciiFilename = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url');
  const filename = sanitizeFilename(request.nextUrl.searchParams.get('filename'));

  if (!source) {
    return Response.json({error: 'Missing PDF URL'}, {status: 400});
  }

  let sourceUrl: URL;

  try {
    sourceUrl = new URL(source);
  } catch {
    return Response.json({error: 'Invalid PDF URL'}, {status: 400});
  }

  if (!isAllowedSanityFile(sourceUrl)) {
    return Response.json({error: 'Unsupported PDF source'}, {status: 400});
  }

  try {
    const upstream = await fetch(sourceUrl, {cache: 'no-store'});

    if (!upstream.ok || !upstream.body) {
      return Response.json({error: 'PDF download failed'}, {status: upstream.status || 502});
    }

    const headers = new Headers({
      'Content-Disposition': encodeContentDispositionFilename(filename),
      'Content-Type': upstream.headers.get('content-type') || 'application/pdf',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    const contentLength = upstream.headers.get('content-length');

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(upstream.body, {headers});
  } catch {
    return Response.json({error: 'PDF download failed'}, {status: 502});
  }
}
