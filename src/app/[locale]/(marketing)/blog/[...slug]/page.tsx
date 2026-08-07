import AllPostsButton from '@/components/blog/all-posts-button';
import BlogGrid from '@/components/blog/blog-grid';
import { getMDXComponents } from '@/components/docs/mdx-components';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { websiteConfig } from '@/config/website';
import { LocaleLink } from '@/i18n/navigation';
import { formatDate } from '@/lib/formatter';
import { constructMetadata } from '@/lib/metadata';
import { type BlogType, blogSource, categorySource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { CalendarIcon, FileTextIcon } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema } from '@/lib/seo/schema';
import { getBlogModifiedDate } from '@/lib/seo/content-routes';
import { blogFaqs, faqPageSchema } from '@/lib/seo/blog-faqs';

import '@/styles/mdx.css';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';

export const dynamicParams = false;

const editorialRelatedPosts: Record<string, string[]> = {
  'what-is-minimax-h3': ['minimax-h3-prompt-guide', 'minimax-h3-real-world-test', 'minimax-h3-cost'],
  'minimax-h3-prompt-guide': ['minimax-h3-product-video-prompts', 'minimax-h3-ugc-video-prompts', 'minimax-h3-reference-to-video-guide'],
  'minimax-h3-real-world-test': ['minimax-h3-vs-seedance', 'minimax-h3-vs-kling-3', 'minimax-h3-vs-veo-3'],
  'minimax-h3-comfyui': ['minimax-h3-vram-requirements', 'minimax-h3-huggingface', 'minimax-h3-gguf'],
  'minimax-h3-cost': ['minimax-h3-product-video-prompts', 'minimax-h3-ugc-video-prompts', 'minimax-h3-prompt-guide'],
};

/**
 * Return stable, topic-relevant recommendations. Editorial choices come first,
 * followed by posts that share a category, then the remaining published posts.
 */
async function getRelatedPosts(post: BlogType) {
  const currentSlug = post.slugs.join('/');
  const preferredSlugs = editorialRelatedPosts[currentSlug] ?? [];
  const preferredRank = new Map(preferredSlugs.map((slug, index) => [slug, index]));

  return blogSource
    .getPages(post.locale)
    .filter((p) => p.data.published)
    .filter((p) => p.slugs.join('/') !== currentSlug)
    .sort((a, b) => {
      const aSlug = a.slugs.join('/');
      const bSlug = b.slugs.join('/');
      const aPreferred = preferredRank.get(aSlug);
      const bPreferred = preferredRank.get(bSlug);
      if (aPreferred !== undefined || bPreferred !== undefined) {
        if (aPreferred === undefined) return 1;
        if (bPreferred === undefined) return -1;
        return aPreferred - bPreferred;
      }

      const aSharedCategories = a.data.categories.filter((category) =>
        post.data.categories.includes(category)
      ).length;
      const bSharedCategories = b.data.categories.filter((category) =>
        post.data.categories.includes(category)
      ).length;
      if (aSharedCategories !== bSharedCategories) {
        return bSharedCategories - aSharedCategories;
      }

      return aSlug.localeCompare(bSlug);
    })
    .slice(0, websiteConfig.blog.relatedPostsSize);
}

export function generateStaticParams() {
  return blogSource
    .getPages()
    .filter((post) => post.data.published)
    .flatMap((post) => {
      return {
        locale: post.locale,
        slug: post.slugs,
      };
    });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata | undefined> {
  const { locale, slug } = await params;
  const post = blogSource.getPage(slug, locale);
  if (!post || !post.data.published) {
    notFound();
  }

  return constructMetadata({
    title: post.data.title,
    description: post.data.description,
    canonicalUrl: getUrlWithLocale(`/blog/${slug}`, locale),
  });
}

interface BlogPostPageProps {
  params: Promise<{
    locale: Locale;
    slug: string[];
  }>;
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { locale, slug } = await props.params;
  const post = blogSource.getPage(slug, locale);
  if (!post || !post.data.published) {
    notFound();
  }

  const { date, title, description, categories } = post.data;
  const publishDate = formatDate(new Date(date));

  const blogCategories = categorySource
    .getPages(locale)
    .filter((category) => categories.includes(category.slugs[0] ?? ''));
  const primaryCategory = blogCategories[0];
  const primaryCategorySlug = primaryCategory?.slugs[0];
  const primaryCategoryPath = primaryCategorySlug
    ? `/blog/category/${primaryCategorySlug}`
    : undefined;

  const MDX = post.data.body;
  const postPath = `/blog/${slug.join('/')}`;
  const postFaqs = blogFaqs[slug.join('/')];

  // getTranslations may cause error DYNAMIC_SERVER_USAGE, so we set dynamic to force-static
  const t = await getTranslations('BlogPage');

  // get related posts
  const relatedPosts = await getRelatedPosts(post);

  return (
    <div className="flex flex-col gap-8">
      <JsonLd data={graphSchema([
        organizationSchema,
        {
          '@type': 'BlogPosting',
          '@id': `${baseUrl}${postPath}#article`,
          headline: title,
          description,
          url: `${baseUrl}${postPath}`,
          datePublished: date,
          dateModified: getBlogModifiedDate(slug.join('/')),
          author: { '@id': `${baseUrl}/#organization` },
          publisher: { '@id': `${baseUrl}/#organization` },
          mainEntityOfPage: `${baseUrl}${postPath}`,
        },
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          ...(primaryCategory && primaryCategoryPath
            ? [{ name: primaryCategory.data.name, path: primaryCategoryPath }]
            : []),
          { name: title, path: postPath },
        ]),
        ...(postFaqs ? [faqPageSchema(postFaqs)] : []),
      ])} />
      {/* content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left column (blog post content) */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Basic information */}
          <div className="space-y-8">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li><LocaleLink href="/" className="hover:text-primary">Home</LocaleLink></li>
                <li aria-hidden="true">/</li>
                <li><LocaleLink href="/blog" className="hover:text-primary">Blog</LocaleLink></li>
                {primaryCategory && primaryCategoryPath && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <LocaleLink href={primaryCategoryPath} className="hover:text-primary">
                        {primaryCategory.data.name}
                      </LocaleLink>
                    </li>
                  </>
                )}
              </ol>
            </nav>
            {/* blog post date */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground leading-none my-auto">
                  {publishDate}
                </span>
                <span className="text-sm text-muted-foreground" aria-label="Last verified date">
                  · Last verified {formatDate(new Date(getBlogModifiedDate(slug.join('/'))))}
                </span>
              </div>
            </div>

            {/* blog post title */}
            <h1 className="text-3xl font-bold">{title}</h1>

            {/* blog post description */}
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>

          {/* blog post content */}
          {/* in order to make the mdx.css work, we need to add the className prose to the div */}
          {/* https://github.com/tailwindlabs/tailwindcss-typography */}
          <div className="mt-8 max-w-none prose prose-neutral dark:prose-invert prose-img:rounded-lg">
            <MDX components={getMDXComponents()} />
          </div>

          <div className="flex items-center justify-start my-16">
            <AllPostsButton />
          </div>
        </div>

        {/* right column (sidebar) */}
        <div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* categories */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">{t('categories')}</h2>
              <ul className="flex flex-wrap gap-4">
                {blogCategories.map(
                  (category) =>
                    category && (
                      <li key={category.slugs[0]}>
                        <LocaleLink
                          href={`/blog/category/${category.slugs[0]}`}
                          className="text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                          {category.data.name}
                        </LocaleLink>
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* table of contents */}
            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
              {post.data.toc && (
                <InlineTOC
                  items={post.data.toc}
                  open={true}
                  defaultOpen={true}
                  className="bg-muted/50 border-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-4 text-primary" />
            <h2 className="text-lg tracking-wider font-semibold text-primary">
              {t('morePosts')}
            </h2>
          </div>

          <BlogGrid posts={relatedPosts} locale={locale} />
        </div>
      )}

      {/* newsletter */}
      <div className="flex items-center justify-start my-8">
        <NewsletterCard />
      </div>
    </div>
  );
}
