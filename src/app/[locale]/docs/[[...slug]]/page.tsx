import * as Preview from '@/components/docs';
import { getMDXComponents } from '@/components/docs/mdx-components';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { getDocModifiedDate, isPublicDocSlug } from '@/lib/seo/content-routes';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/json-ld';
import { getUrlWithLocale } from '@/lib/urls/urls';
import Link from 'fumadocs-core/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export function generateStaticParams() {
  const slugParams = source.generateParams().filter((param) => isPublicDocSlug(param.slug));
  const params = LOCALES.flatMap((locale) =>
    slugParams.map((param) => ({
      locale,
      slug: param.slug,
    }))
  );

  return params;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);
  if (!page || !isPublicDocSlug(slug)) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  return constructMetadata({
    title: `${page.data.title} | MiniMax H3`,
    description: page.data.description,
    canonicalUrl: getUrlWithLocale(
      page.slugs.length ? `/docs/${page.slugs.join('/')}` : '/docs',
      locale
    ),
  });
}

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;
export const dynamicParams = false;

interface DocPageProps {
  params: Promise<{
    slug?: string[];
    locale: Locale;
  }>;
}

/**
 * Doc Page
 *
 * ref:
 * https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/docs/%5B...slug%5D/page.tsx
 */
export default async function DocPage({ params }: DocPageProps) {
  const { slug, locale } = await params;
  const language = locale as string;
  const page = source.getPage(slug, language);

  if (!page || !isPublicDocSlug(slug)) {
    console.warn('docs page not found', slug, language);
    notFound();
  }

  const preview = page.data.preview;

  const MDX = page.data.body;
  const path = `/docs${page.slugs.length ? `/${page.slugs.join('/')}` : ''}`;

  return (
    <>
      <JsonLd data={graphSchema([
        organizationSchema,
        {
          '@type': 'TechArticle',
          '@id': `${baseUrl}${path}#article`,
          headline: page.data.title,
          description: page.data.description,
          url: `${baseUrl}${path}`,
          datePublished: '2026-08-05',
          dateModified: getDocModifiedDate(page.slugs),
          author: { '@id': `${baseUrl}/#organization` },
          publisher: { '@id': `${baseUrl}/#organization` },
        },
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Docs', path: '/docs' },
          ...(page.slugs.length ? [{ name: page.data.title, path }] : []),
        ]),
      ])} />
      <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {/* Preview Rendered Component */}
        {preview ? <PreviewRenderer preview={preview} /> : null}

        {/* MDX Content */}
        <MDX
          components={getMDXComponents({
            a: ({ href, ...props }: { href?: string; [key: string]: any }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: page.file.dirname,
              });

              if (!found) return <Link href={href} {...props} />;

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    <p className="font-medium">{found.page.data.title}</p>
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              );
            },
          })}
        />
      </DocsBody>
      </DocsPage>
    </>
  );
}
