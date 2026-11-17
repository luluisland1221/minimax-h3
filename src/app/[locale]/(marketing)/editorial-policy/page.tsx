import { MdxPage } from '@/components/page/mdx-page';
import { JsonLd } from '@/components/seo/json-ld';
import { constructMetadata } from '@/lib/metadata';
import {
  baseUrl,
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
} from '@/lib/seo/schema';
import { pagesSource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = pagesSource.getPage(['editorial-policy'], 'en');
  if (!page) return {};

  return constructMetadata({
    title: page.data.title,
    description: page.data.description,
    canonicalUrl: getUrlWithLocale('/editorial-policy', locale),
  });
}

export default function EditorialPolicyPage() {
  const page = pagesSource.getPage(['editorial-policy'], 'en');
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema,
          {
            '@type': 'WebPage',
            '@id': `${baseUrl}/editorial-policy#webpage`,
            url: `${baseUrl}/editorial-policy`,
            name: page.data.title,
            description: page.data.description,
            isPartOf: { '@id': `${baseUrl}/#website` },
            inLanguage: 'en',
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Editorial policy', path: '/editorial-policy' },
          ]),
        ])}
      />
      <MdxPage page={page} />
    </>
  );
}
