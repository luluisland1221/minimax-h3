import { websiteConfig } from '@/config/website';
import { defineRouting } from 'next-intl/routing';

export const DEFAULT_LOCALE = websiteConfig.i18n.defaultLocale;
export const LOCALES = Object.keys(websiteConfig.i18n.locales);

// The name of the cookie that is used to determine the locale
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Next.js internationalized routing
 *
 * https://next-intl.dev/docs/routing
 * https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/i18n/routing.ts
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,
  // Default locale when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  // Auto detect locale
  // https://next-intl.dev/docs/routing/middleware#locale-detection
  localeDetection: false,
  // A single-locale site does not need to remember a preference. Skipping the
  // cookie keeps HTML responses cacheable at the CDN edge.
  localeCookie: false,
  // The prefix to use for the locale in the URL
  // https://next-intl.dev/docs/routing#locale-prefix
  localePrefix: 'as-needed',
});
