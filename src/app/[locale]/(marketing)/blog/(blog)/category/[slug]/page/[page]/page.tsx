import BlogGridWithPagination from '@/components/blog/blog-grid-with-pagination';
import { websiteConfig } from '@/config/website';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { blogSource, categorySource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { categoryIntroductions } from '@/lib/seo/category-content';
import { baseUrl, breadcrumbSchema, graphSchema, itemListSchema, organizationSchema } from '@/lib/seo/schema';

// Generate all static params for SSG (locale + category + pagination)
export function generateStaticParams() {
  const params: { locale: string; slug: string; page: string }[] = [];
  for (const locale of LOCALES) {
    const localeCategories = categorySource.getPages(locale);
    for (const category of localeCategories) {
      const totalPages = Math.ceil(
        blogSource
          .getPages(locale)
          .filter(
            (post) =>
              post.data.published &&
              post.data.categories.some((cat) => cat === category.slugs[0])
          ).length / websiteConfig.blog.paginationSize
      );
      for (let page = 2; page <= totalPages; page++) {
        params.push({ locale, slug: category.slugs[0], page: String(page) });
      }
    }
  }
  return params;
}

// Generate metadata for each static category page (locale + category + pagination)
export async function generateMetadata({ params }: BlogCategoryPageProps) {
  const { locale, slug, page } = await params;
  const category = categorySource.getPage([slug], locale);
  if (!category) {
    notFound();
  }
  const canonicalPath = `/blog/category/${slug}/page/${page}`;

  return constructMetadata({
    title: `${category.data.name} – Page ${page} | MiniMax H3`,
    description: `Browse page ${page} of ${category.data.name.toLowerCase()} articles with practical MiniMax H3 guidance, examples, tests, and production workflows.`,
    canonicalUrl: getUrlWithLocale(canonicalPath, locale),
  });
}

interface BlogCategoryPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
    page: string;
  }>;
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { locale, slug, page } = await params;
  const category = categorySource.getPage([slug], locale);
  if (!category) notFound();
  const localePosts = blogSource.getPages(locale);
  const publishedPosts = localePosts.filter((post) => post.data.published);
  const filteredPosts = publishedPosts.filter((post) =>
    post.data.categories.some((cat) => cat === slug)
  );
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
  const currentPage = Number(page);
  const blogPageSize = websiteConfig.blog.paginationSize;
  const paginatedLocalePosts = sortedPosts.slice(
    (currentPage - 1) * blogPageSize,
    currentPage * blogPageSize
  );
  const totalPages = Math.ceil(sortedPosts.length / blogPageSize);
  const categoryPath = `/blog/category/${slug}`;
  const pagePath = `${categoryPath}/page/${page}`;
  const introduction = categoryIntroductions[slug] ?? [category.data.description];

  return (
    <>
      <JsonLd data={graphSchema([
        organizationSchema,
        { '@type': 'CollectionPage', '@id': `${baseUrl}${pagePath}#collection`, url: `${baseUrl}${pagePath}`, name: `${category.data.name} guides – page ${page}`, description: category.data.description, isPartOf: { '@id': `${baseUrl}${categoryPath}#collection` } },
        itemListSchema(paginatedLocalePosts.map((post) => ({ name: post.data.title, url: `${baseUrl}/blog/${post.slugs.join('/')}` })), `${baseUrl}${pagePath}#posts`),
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: category.data.name, path: categoryPath }, { name: `Page ${page}`, path: pagePath }]),
      ])} />
      <section className="mb-10 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="category-page-introduction">
        <h2 id="category-page-introduction" className="text-2xl font-semibold">{category.data.name}: page {page}</h2>
        <p className="mt-4 text-muted-foreground">{introduction[0]} Continue through this collection for more focused MiniMax H3 resources.</p>
      </section>
      <BlogGridWithPagination locale={locale} posts={paginatedLocalePosts} totalPages={totalPages} routePrefix={categoryPath} />
    </>
  );
}
