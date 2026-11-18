import blogPagination from './lib/seo/blog-pagination.json';
import { websiteConfig } from './config/website';
import { getSessionCookie } from 'better-auth/cookies';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_NAME,
  routing,
} from './i18n/routing';
import {
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  routesNotAllowedByLoggedInUsers,
} from './routes';
import {
  isPublicAuthorSlug,
  isPublicBlogSlug,
  isPublicCategorySlug,
  isPublicDocSlug,
  isPublicExampleSlug,
} from './lib/seo/content-routes';

const intlMiddleware = createMiddleware(routing);

/**
 * A server-rendered 404 must be returned before Next starts streaming,
 * otherwise the streaming notFound() response keeps a 200 status and is
 * classified as a soft 404 by search engines.
 */
const NOT_FOUND_HTML =
  '<!doctype html><html lang="en"><head><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg?v=minimax-h3-5" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=minimax-h3-5"><title>404 – Page not found | MiniMax H3</title></head><body><main style="font-family:system-ui,sans-serif;max-width:36rem;margin:12vh auto;padding:0 1.5rem;line-height:1.6"><h1>Page not found</h1><p>The requested page does not exist.</p><p><a href="/">MiniMax H3 AI Video Generator</a> · <a href="/blog">Guides</a> · <a href="/pricing">Pricing</a></p></main></body></html>';

/**
 * Every public path on the site. Exact matches are single pages, prefixes are
 * sections with their own routing. Anything else is a 404, which keeps typos,
 * guessed URLs and retired routes out of the index.
 */
const EXACT_PATHS = new Set([
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookie',
  '/methodology',
  '/editorial-policy',
  '/blog',
  '/docs',
  '/examples',
  '/authors',
]);

const PATH_PREFIXES = [
  '/blog/',
  '/docs/',
  '/examples/',
  '/authors/',
  '/auth/',
  '/dashboard/',
  '/settings/',
  '/admin/',
  '/api/',
  '/og',
];

/**
 * 1. Next.js middleware
 * https://nextjs.org/docs/app/building-your-application/routing/middleware
 *
 * 2. Better Auth middleware
 * https://www.better-auth.com/docs/integrations/next#middleware
 *
 * In Next.js middleware, it's recommended to only check for the existence of a session cookie
 * to handle redirection. To avoid blocking requests by making API or database calls.
 */
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Keep one canonical, encrypted origin even if a request reaches the Worker
  // before the zone-level Always Use HTTPS redirect is applied.
  const forwardedProtocol = req.headers.get('x-forwarded-proto');
  const isHttp = (forwardedProtocol ?? nextUrl.protocol.replace(':', '')) === 'http';
  const isWww = nextUrl.hostname === 'www.minimaxh3.pro';
  const isProductionHost = ['minimaxh3.pro', 'www.minimaxh3.pro'].includes(nextUrl.hostname);
  if (isProductionHost && (isHttp || isWww)) {
    const canonicalUrl = nextUrl.clone();
    canonicalUrl.protocol = 'https:';
    canonicalUrl.hostname = 'minimaxh3.pro';
    canonicalUrl.port = '';
    return NextResponse.redirect(canonicalUrl, 308);
  }
  const pathnameWithoutLocale = getPathnameWithoutLocale(
    nextUrl.pathname,
    LOCALES
  );

  // The dynamic social image is not a localized page.
  if (pathnameWithoutLocale === '/og') {
    return NextResponse.next();
  }

  // Return a real 404 status for retired and unknown public content URLs.
  // This avoids Next.js streaming notFound() responses being classified as soft 404s.
  const docMatch = pathnameWithoutLocale.match(/^\/docs\/(.+)$/);
  const blogMatch = pathnameWithoutLocale.match(/^\/blog\/([^/]+)$/);
  const categoryMatch = pathnameWithoutLocale.match(
    /^\/blog\/category\/([^/]+)$/
  );
  const exampleMatch = pathnameWithoutLocale.match(/^\/examples\/([^/]+)$/);
  const authorMatch = pathnameWithoutLocale.match(/^\/authors\/([^/]+)$/);
  const isUnknownDoc =
    !!docMatch && !isPublicDocSlug(docMatch[1].split('/'));
  const isUnknownBlog =
    !!blogMatch &&
    !['page', 'category'].includes(blogMatch[1]) &&
    !isPublicBlogSlug(blogMatch[1]);
  const isUnknownCategory =
    !!categoryMatch && !isPublicCategorySlug(categoryMatch[1]);
  const isUnknownExample =
    !!exampleMatch && !isPublicExampleSlug(exampleMatch[1]);
  const isUnknownAuthor = !!authorMatch && !isPublicAuthorSlug(authorMatch[1]);
  const paginationMatch = pathnameWithoutLocale.match(/^\/blog\/(?:category\/([^/]+)\/)?page\/([^/]+)\/?$/);
  const locale = nextUrl.pathname.match(new RegExp('^/(' + LOCALES.join('|') + ')(?:/|$)'))?.[1] || DEFAULT_LOCALE;
  const counts = (blogPagination as Record<string, { total: number; categories: Record<string, number> }>)[locale];
  const count = paginationMatch?.[1] ? counts?.categories[paginationMatch[1]] : counts?.total;
  const pageNumber = Number(paginationMatch?.[2]);
  const isInvalidPagination = !!paginationMatch && (
    !/^[1-9]\d*$/.test(paginationMatch[2]) || pageNumber < 2 ||
    pageNumber > Math.ceil((count || 0) / websiteConfig.blog.paginationSize)
  );
  const isRetiredRoute = pathnameWithoutLocale === '/ai/video';
  const normalizedPath = pathnameWithoutLocale.replace(/\/+$/, '') || '/';
  const isKnownPath =
    EXACT_PATHS.has(normalizedPath) ||
    protectedRoutes.includes(normalizedPath as (typeof protectedRoutes)[number]) ||
    PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));

  if (
    isInvalidPagination ||
    isUnknownDoc ||
    isUnknownBlog ||
    isUnknownCategory ||
    isUnknownExample ||
    isUnknownAuthor ||
    !isKnownPath ||
    isRetiredRoute
  ) {
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  // Handle internal docs link redirection for internationalization
  // Check if this is a docs page without locale prefix
  if (nextUrl.pathname.startsWith('/docs/') || nextUrl.pathname === '/docs') {
    // Get the user's preferred locale from cookie
    const localeCookie = req.cookies.get(LOCALE_COOKIE_NAME);
    const preferredLocale = localeCookie?.value;

    // If user has a non-default locale preference, redirect to localized version
    if (
      preferredLocale &&
      preferredLocale !== DEFAULT_LOCALE &&
      LOCALES.includes(preferredLocale)
    ) {
      const localizedPath = `/${preferredLocale}${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      return NextResponse.redirect(new URL(localizedPath, nextUrl));
    }
  }

  // Middleware only needs a fast presence check. Validating the full session
  // here would perform a self-request and can deadlock local dev/Workers.
  const isLoggedIn = !!getSessionCookie(req);

  // Get the pathname of the request (e.g. /zh/dashboard to /dashboard)
  // If the route can not be accessed by logged in users, redirect if the user is logged in
  if (isLoggedIn) {
    const isNotAllowedRoute = routesNotAllowedByLoggedInUsers.some((route) =>
      new RegExp(`^${route}$`).test(pathnameWithoutLocale)
    );
    if (isNotAllowedRoute) {
      const requestedCallback = nextUrl.searchParams.get('callbackUrl');
      const safeCallback =
        requestedCallback?.startsWith('/') &&
        !requestedCallback.startsWith('//')
          ? requestedCallback
          : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(safeCallback, nextUrl));
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    new RegExp(`^${route}$`).test(pathnameWithoutLocale)
  );

  // If the route is a protected route, redirect to login if the user is not logged in
  if (!isLoggedIn && isProtectedRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Apply intlMiddleware for all routes
  return intlMiddleware(req);
}

/**
 * Get the pathname of the request (e.g. /zh/dashboard to /dashboard)
 */
function getPathnameWithoutLocale(pathname: string, locales: string[]): string {
  const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
  return pathname.replace(localePattern, '/');
}

/**
 * Next.js internationalized routing
 * specify the routes the middleware applies to
 *
 * https://next-intl.dev/docs/routing#base-path
 */
export const config = {
  // The `matcher` is relative to the `basePath`
  matcher: [
    // Match all pathnames except for
    // - if they start with `/api`, `/_next` or `/_vercel`
    // - if they contain a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
