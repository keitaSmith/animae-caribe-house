# Domain routing plan

The application now has explicit route entry points for the Animae Caribe ecosystem:

- `animaecaribe.com` should serve `/`, the umbrella Animae Caribe homepage.
- `animaecaribe.com/festival` should serve `/festival`, the Festival experience.
- `animaecaribe.com/house` can serve `/house` for internal preview/testing.
- `animaecaribehouse.com` should eventually rewrite its root request to `/house` so the public House domain still opens on the House experience.

No proxy/domain rewrite is active yet. When both domains are attached in Vercel, add a `src/proxy.ts` rewrite only for the House domain root, following the local Next.js 16 `proxy.ts` convention:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host.includes('animaecaribehouse.com') && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/house', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
```

Keep `animaecaribe.com` pointed at the same deployment without a root rewrite so `/` remains the umbrella homepage and `/festival` remains the Festival page.
