import { JsonLd } from '@/components/seo/json-ld';
import { EXAMPLES } from '@/lib/minimax-h3-examples';
import { constructMetadata } from '@/lib/metadata';
import {
  baseUrl,
  breadcrumbSchema,
  graphSchema,
  itemListSchema,
  organizationSchema,
} from '@/lib/seo/schema';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const description =
  'Browse 19 MiniMax H3 video examples with the exact prompt, generation mode, and resolution used for each clip, then copy a prompt into the playground.';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'MiniMax H3 Video Examples and Prompts',
    description,
    canonicalUrl: getUrlWithLocale('/examples', locale),
  });
}

export default async function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locale) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd
        data={graphSchema([
          organizationSchema,
          {
            '@type': 'CollectionPage',
            '@id': `${baseUrl}/examples#collection`,
            url: `${baseUrl}/examples`,
            name: 'MiniMax H3 video examples',
            description,
            isPartOf: { '@id': `${baseUrl}/#website` },
            inLanguage: 'en',
          },
          itemListSchema(
            EXAMPLES.map((clip) => ({
              name: `${clip.title} – MiniMax H3 example`,
              url: `${baseUrl}/examples/${clip.slug}`,
            })),
            `${baseUrl}/examples#clips`
          ),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Examples', path: '/examples' },
          ]),
        ])}
      />

      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">
          Example library
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          MiniMax H3 video examples
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Every clip below was generated with MiniMax H3, and each one links to
          the exact prompt, generation mode, and resolution behind it. Start
          with a clip that resembles your shot, copy the prompt, then adjust the
          subject, camera, and sound directions for your own project.
        </p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Want the method instead of a single prompt? Read the{' '}
          <Link
            href="/blog/minimax-h3-prompt-guide"
            className="font-medium text-foreground underline underline-offset-4"
          >
            MiniMax H3 prompt guide
          </Link>{' '}
          or the documentation for{' '}
          <Link
            href="/docs/text-to-video"
            className="font-medium text-foreground underline underline-offset-4"
          >
            text to video
          </Link>
          ,{' '}
          <Link
            href="/docs/first-last-frame"
            className="font-medium text-foreground underline underline-offset-4"
          >
            first and last frame
          </Link>
          , and{' '}
          <Link
            href="/docs/multimodal-reference"
            className="font-medium text-foreground underline underline-offset-4"
          >
            multimodal reference
          </Link>
          .
        </p>
      </header>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((clip) => (
          <li key={clip.slug}>
            <Link
              href={`/examples/${clip.slug}`}
              className="group block overflow-hidden rounded-2xl border bg-card transition hover:border-primary/50"
            >
              <img
                src={`/videos/minimax-h3/posters/${clip.slug}.jpg`}
                alt={`${clip.title} – MiniMax H3 generated video still`}
                width={960}
                height={540}
                loading="lazy"
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
                  {clip.mode} · {clip.resolution}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{clip.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {clip.summary}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
