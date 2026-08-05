import { MinimaxH3Home } from '@/components/minimax-h3/minimax-h3-home';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

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
  return <MinimaxH3Home />;
}
