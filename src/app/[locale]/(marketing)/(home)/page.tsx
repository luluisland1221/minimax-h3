import { MinimaxH3Home } from '@/components/minimax-h3/minimax-h3-home';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { JsonLd } from '@/components/seo/json-ld';
import { baseUrl, graphSchema, organizationSchema } from '@/lib/seo/schema';

const description =
  'Create cinematic videos with MiniMax H3 using text, images, video, and audio references. Generate synchronized stereo audio and videos up to 2K online.';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'MiniMax H3 AI Video Generator – Create Videos Online',
    description,
    canonicalUrl: getUrlWithLocale('', locale),
  });
}

export default function HomePage() {
  return <>
    <JsonLd data={graphSchema([
      organizationSchema,
      { '@type': 'WebSite', '@id': `${baseUrl}/#website`, url: baseUrl, name: 'MiniMax H3', publisher: { '@id': `${baseUrl}/#organization` }, inLanguage: 'en' },
      { '@type': 'WebPage', '@id': `${baseUrl}/#webpage`, url: baseUrl, name: 'MiniMax H3 AI Video Generator', description, isPartOf: { '@id': `${baseUrl}/#website` }, about: { '@id': `${baseUrl}/#software` } },
      { '@type': 'SoftwareApplication', '@id': `${baseUrl}/#software`, name: 'MiniMax H3 AI Video Generator', applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', url: baseUrl, description, offers: { '@type': 'AggregateOffer', lowPrice: 29, highPrice: 99, priceCurrency: 'USD', offerCount: 3 } },
    ])} />
    <MinimaxH3Home />
  </>;
}
