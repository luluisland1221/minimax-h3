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

// Generate all static params for SSG (locale + category)
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    const localeCategories = categorySource
      .getPages(locale)
      .filter((category) => category.locale === locale);
    for (const category of localeCategories) {
      params.push({ locale, slug: category.slugs[0] });
    }
  }
  return params;
}

// Generate metadata for each static category page (locale + category)
export async function generateMetadata({ params }: BlogCategoryPageProps) {
  const { locale, slug } = await params;
  const category = categorySource.getPage([slug], locale);
  if (!category) {
    notFound();
  }
  const canonicalPath = `/blog/category/${slug}`;

  return constructMetadata({
    title: `${category.data.name} Guides | MiniMax H3`,
    description: category.data.description,
    canonicalUrl: getUrlWithLocale(canonicalPath, locale),
  });
}

interface BlogCategoryPageProps {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { locale, slug } = await params;
  const category = categorySource.getPage([slug], locale);
  if (!category) {
    notFound();
  }

  const localePosts = blogSource.getPages(locale);
  const publishedPosts = localePosts.filter((post) => post.data.published);
  const filteredPosts = publishedPosts.filter((post) =>
    post.data.categories.some((cat) => cat === category.slugs[0])
  );
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
  const currentPage = 1;
  const blogPageSize = websiteConfig.blog.paginationSize;
  const paginatedLocalePosts = sortedPosts.slice(
    (currentPage - 1) * blogPageSize,
    currentPage * blogPageSize
  );
  const totalPages = Math.ceil(sortedPosts.length / blogPageSize);
  const categoryPath = `/blog/category/${slug}`;
  const introduction = categoryIntroductions[slug] ?? [category.data.description];

  return (
    <>
      <JsonLd data={graphSchema([
        organizationSchema,
        {
          '@type': 'CollectionPage',
          '@id': `${baseUrl}${categoryPath}#collection`,
          url: `${baseUrl}${categoryPath}`,
          name: `${category.data.name} MiniMax H3 guides`,
          description: category.data.description,
          isPartOf: { '@id': `${baseUrl}/blog#blog` },
          inLanguage: 'en',
        },
        itemListSchema(paginatedLocalePosts.map((post) => ({ name: post.data.title, url: `${baseUrl}/blog/${post.slugs.join('/')}` })), `${baseUrl}${categoryPath}#posts`),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: category.data.name, path: categoryPath },
        ]),
      ])} />
      <section className="mb-10 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="category-introduction">
        <h2 id="category-introduction" className="text-2xl font-semibold">{category.data.name} guides</h2>
        <div className="mt-4 space-y-3 text-muted-foreground">
          {introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
      <BlogGridWithPagination locale={locale} posts={paginatedLocalePosts} totalPages={totalPages} routePrefix={categoryPath} />
    </>
  );
}
