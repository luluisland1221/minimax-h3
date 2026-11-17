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
  const page = pagesSource.getPage(['methodology'], 'en');
  if (!page) return {};

  return constructMetadata({
    title: page.data.title,
    description: page.data.description,
    canonicalUrl: getUrlWithLocale('/methodology', locale),
  });
}

export default function MethodologyPage() {
  const page = pagesSource.getPage(['methodology'], 'en');
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={graphSchema([
          organizationSchema,
          {
            '@type': 'WebPage',
            '@id': `${baseUrl}/methodology#webpage`,
            url: `${baseUrl}/methodology`,
            name: page.data.title,
            description: page.data.description,
            isPartOf: { '@id': `${baseUrl}/#website` },
            inLanguage: 'en',
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'How we test', path: '/methodology' },
          ]),
        ])}
      />
      <MdxPage page={page} />
    </>
  );
}
