import BlogGridWithPagination from '@/components/blog/blog-grid-with-pagination';
import { websiteConfig } from '@/config/website';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { blogSource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/seo/json-ld';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const pt = await getTranslations({ locale, namespace: 'BlogPage' });

  return constructMetadata({
    title: 'MiniMax H3 Blog — Guides, Tests & Research',
    description: pt('description'),
    canonicalUrl: getUrlWithLocale('/blog', locale),
  });
}

interface BlogPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const localePosts = blogSource.getPages(locale);
  const publishedPosts = localePosts.filter((post) => post.data.published);
  const sortedPosts = publishedPosts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
  const currentPage = 1;
  const blogPageSize = websiteConfig.blog.paginationSize;
  const paginatedLocalePosts = sortedPosts.slice(
    (currentPage - 1) * blogPageSize,
    currentPage * blogPageSize
  );
  const totalPages = Math.ceil(sortedPosts.length / blogPageSize);

  return (
    <>
      <JsonLd data={graphSchema([organizationSchema, { '@type': 'Blog', '@id': `${baseUrl}/blog#blog`, url: `${baseUrl}/blog`, name: 'MiniMax H3 Blog', description: 'MiniMax H3 guides, prompts, local deployment research, comparisons, pricing analysis, and production tests.', publisher: { '@id': `${baseUrl}/#organization` } }, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])])} />
      <BlogGridWithPagination
      locale={locale}
      posts={paginatedLocalePosts}
      totalPages={totalPages}
      routePrefix={'/blog'}
      />
    </>
  );
}
