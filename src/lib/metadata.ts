import { websiteConfig } from '@/config/website';
import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getBaseUrl, getImageUrl, getUrlWithLocale } from './urls/urls';

type OpenGraphType = 'website' | 'article';

/**
 * Build the canonical and hreflang alternates for a localized path.
 * `canonicalUrl` is an absolute URL; the path is derived from it so existing
 * call sites keep working.
 */
function buildAlternates(canonicalUrl: string) {
  const base = getBaseUrl();
  const path = canonicalUrl.startsWith(base)
    ? canonicalUrl.slice(base.length) || '/'
    : undefined;

  if (!path) {
    return { canonical: canonicalUrl };
  }

  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = getUrlWithLocale(path, locale as Locale);
  }
  const defaultPath = getUrlWithLocale(path, routing.defaultLocale as Locale);
  languages['x-default'] = defaultPath;

  return {
    canonical: canonicalUrl,
    languages,
  };
}

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title,
  description,
  canonicalUrl,
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  authors,
  imageWidth = 1200,
  imageHeight = 630,
}: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
  type?: OpenGraphType;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  authors?: string[];
  imageWidth?: number;
  imageHeight?: number;
} = {}): Metadata {
  title = title || defaultMessages.Metadata.title;
  description = description || defaultMessages.Metadata.description;
  image = image || websiteConfig.metadata.images?.ogImage;
  const ogImageUrl = getImageUrl(image || '');
  return {
    title,
    description,
    alternates: canonicalUrl ? buildAlternates(canonicalUrl) : undefined,
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      title,
      description,
      siteName: defaultMessages.Metadata.name,
      images: [
        {
          url: ogImageUrl.toString(),
          width: imageWidth,
          height: imageHeight,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            section,
            authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl.toString()],
    },
    icons: {
      icon: [{ url: '/favicon.svg?v=minimax-h3-4', type: 'image/svg+xml' }],
      shortcut: '/favicon.svg?v=minimax-h3-4',
      apple: '/favicon.svg?v=minimax-h3-4',
    },
    metadataBase: new URL(getBaseUrl()),
    manifest: `${getBaseUrl()}/manifest.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
