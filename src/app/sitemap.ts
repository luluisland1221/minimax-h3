import { websiteConfig } from '@/config/website';
import { getLocalePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { PUBLIC_DOC_SLUGS } from '@/lib/seo/content-routes';
import { blogSource, categorySource, source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import type { Locale } from 'next-intl';
import { getBaseUrl } from '../lib/urls/urls';

type Href = Parameters<typeof getLocalePathname>[0]['href'];

/**
 * static routes for sitemap, you may change the routes for your own
 */
const staticRoutes = [
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookie',
  '/llms.txt',
  '/pricing.md',
];

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function getPostModifiedDate(
  post: ReturnType<typeof blogSource.getPages>[number]
) {
  return toDate(post.data.updated ?? post.data.date);
}

function getLatestDate(dates: Date[]): Date | undefined {
  if (dates.length === 0) return undefined;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

/**
 * Generate a sitemap for the website
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://github.com/javayhu/cnblocks/blob/main/app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = []; // final result

  // add static routes
  sitemapList.push(
    ...staticRoutes.flatMap((route) => {
      return routing.locales.map((locale) => ({
        url: getUrl(route, locale),
      }));
    })
  );

  // add blog related routes if enabled
  if (websiteConfig.blog.enable) {
    // add paginated blog list pages
    routing.locales.forEach((locale) => {
      const posts = blogSource
        .getPages(locale)
        .filter((post) => post.data.published);
      const totalPages = Math.max(
        1,
        Math.ceil(posts.length / websiteConfig.blog.paginationSize)
      );
      sitemapList.push({
        url: getUrl('/blog', locale),
        lastModified: getLatestDate(posts.map(getPostModifiedDate)),
      });
      // /blog/page/[page] (from 2)
      for (let page = 2; page <= totalPages; page++) {
        const pagePosts = posts.slice(
          (page - 1) * websiteConfig.blog.paginationSize,
          page * websiteConfig.blog.paginationSize
        );
        sitemapList.push({
          url: getUrl(`/blog/page/${page}`, locale),
          lastModified: getLatestDate(pagePosts.map(getPostModifiedDate)),
        });
      }
    });

    // add paginated category pages
    routing.locales.forEach((locale) => {
      const localeCategories = categorySource.getPages(locale);
      localeCategories.forEach((category) => {
        // posts in this category and locale
        const postsInCategory = blogSource
          .getPages(locale)
          .filter((post) => post.data.published)
          .filter((post) =>
            post.data.categories.some((cat) => cat === category.slugs[0])
          );
        const totalPages = Math.max(
          1,
          Math.ceil(postsInCategory.length / websiteConfig.blog.paginationSize)
        );
        // /blog/category/[slug] (first page)
        sitemapList.push({
          url: getUrl(`/blog/category/${category.slugs[0]}`, locale),
          lastModified: getLatestDate(postsInCategory.map(getPostModifiedDate)),
        });
        // /blog/category/[slug]/page/[page] (from 2)
        for (let page = 2; page <= totalPages; page++) {
          const pagePosts = postsInCategory.slice(
            (page - 1) * websiteConfig.blog.paginationSize,
            page * websiteConfig.blog.paginationSize
          );
          sitemapList.push({
            url: getUrl(
              `/blog/category/${category.slugs[0]}/page/${page}`,
              locale
            ),
            lastModified: getLatestDate(pagePosts.map(getPostModifiedDate)),
          });
        }
      });
    });

    // add posts (single post pages)
    sitemapList.push(
      ...blogSource
        .getPages()
        .filter((post) => post.data.published)
        .flatMap((post) =>
          routing.locales
            .filter((locale) => post.locale === locale)
            .map((locale) => ({
              url: getUrl(`/blog/${post.slugs.join('/')}`, locale),
              lastModified: getPostModifiedDate(post),
            }))
        )
    );
  }

  // add docs related routes if enabled
  if (websiteConfig.docs.enable) {
    const docsParams = source
      .generateParams()
      .filter((param) => param.slug.length > 0)
      .filter((param) =>
        PUBLIC_DOC_SLUGS.includes(
          param.slug.join('/') as (typeof PUBLIC_DOC_SLUGS)[number]
        )
      );
    routing.locales.forEach((locale) => {
      const docs = PUBLIC_DOC_SLUGS.map((slug) =>
        source.getPage(slug ? slug.split('/') : [], locale)
      )
        .filter((page) => page?.data.updated)
        .map((page) => toDate(page!.data.updated!));
      sitemapList.push({
        url: getUrl('/docs', locale),
        lastModified: getLatestDate(docs),
      });
    });
    sitemapList.push(
      ...docsParams.flatMap((param) =>
        routing.locales.flatMap((locale) => {
          const page = source.getPage(param.slug, locale);
          return page
            ? [
                {
                  url: getUrl(`/docs/${param.slug.join('/')}`, locale),
                  lastModified: page.data.updated
                    ? toDate(page.data.updated)
                    : undefined,
                },
              ]
            : [];
        })
      )
    );
  }

  return sitemapList;
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getLocalePathname({ locale, href });
  return getBaseUrl() + pathname;
}

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#sitemap
 * https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/sitemap.ts
 */
function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  }));
}
