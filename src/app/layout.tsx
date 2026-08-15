import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/favicon.svg?v=minimax-h3-4', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg?v=minimax-h3-4',
    apple: '/favicon.svg?v=minimax-h3-4',
  },
  manifest: '/manifest.webmanifest',
};

interface Props {
  children: ReactNode;
}

/**
 * Since we have a `not-found.tsx` page on the root, a layout file
 * is required, even if it's just passing children through.
 *
 * https://next-intl.dev/docs/environments/error-files#catching-non-localized-requests
 */
export default function RootLayout({ children }: Props) {
  return children;
}
