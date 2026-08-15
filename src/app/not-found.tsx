'use client';

import Error from 'next/error';

/**
 * Catching non-localized requests
 *
 * This page renders when a route like `/unknown.txt` is requested.
 * In this case, the layout at `app/[locale]/layout.tsx` receives
 * an invalid value as the `[locale]` param and calls `notFound()`.
 *
 * https://next-intl.dev/docs/environments/error-files#catching-non-localized-requests
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon.svg?v=minimax-h3-4"
          type="image/svg+xml"
        />
        <link rel="shortcut icon" href="/favicon.svg?v=minimax-h3-4" />
      </head>
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
