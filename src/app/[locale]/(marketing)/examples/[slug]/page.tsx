import { JsonLd } from '@/components/seo/json-ld';
import {
  EXAMPLES,
  EXAMPLES_BY_SLUG,
  EXAMPLES_PUBLISHED,
} from '@/lib/minimax-h3-examples';
import { constructMetadata } from '@/lib/metadata';
import {
  baseUrl,
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
  videoObjectSchema,
} from '@/lib/seo/schema';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

const modeDoc: Record<string, { href: string; label: string }> = {
  'Text to video': { href: '/docs/text-to-video', label: 'text to video' },
  'First & last frame': {
    href: '/docs/first-last-frame',
    label: 'first and last frame',
  },
  'Multimodal reference': {
    href: '/docs/multimodal-reference',
    label: 'multimodal reference',
  },
};

export function generateStaticParams() {
  return EXAMPLES.map((clip) => ({ slug: clip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const clip = EXAMPLES_BY_SLUG.get(slug);
  if (!clip) notFound();

  return constructMetadata({
    title: `${clip.title} – MiniMax H3 Example`,
    description: `${clip.summary} Prompt, mode, and resolution included.`,
    canonicalUrl: getUrlWithLocale(`/examples/${clip.slug}`, locale),
    image: `/videos/minimax-h3/posters/${clip.slug}.jpg`,
    imageWidth: 960,
    imageHeight: 540,
  });
}

export default async function ExampleClipPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  const clip = EXAMPLES_BY_SLUG.get(slug);
  if (!clip) notFound();

  const doc = modeDoc[clip.mode];
  const related = EXAMPLES.filter((item) => item.slug !== clip.slug).slice(
    0,
    3
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JsonLd
        data={graphSchema([
          organizationSchema,
          {
            '@type': 'WebPage',
            '@id': `${baseUrl}/examples/${clip.slug}#webpage`,
            url: `${baseUrl}/examples/${clip.slug}`,
            name: `${clip.title} – MiniMax H3 example`,
            description: clip.summary,
            isPartOf: { '@id': `${baseUrl}/#website` },
            inLanguage: 'en',
          },
          videoObjectSchema({
            name: `${clip.title} – MiniMax H3 example`,
            description: clip.summary,
            thumbnailUrl: `/videos/minimax-h3/posters/${clip.slug}.jpg`,
            contentUrl: `/videos/minimax-h3/${clip.file}`,
            uploadDate: EXAMPLES_PUBLISHED,
            width: 960,
            height: 540,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Examples', path: '/examples' },
            { name: clip.title, path: `/examples/${clip.slug}` },
          ]),
        ])}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/examples" className="hover:text-primary">
              Examples
            </Link>
          </li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">
          {clip.mode} · {clip.resolution} · {clip.aspect}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">{clip.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {clip.summary}
        </p>
      </header>

      <video
        controls
        playsInline
        preload="metadata"
        poster={`/videos/minimax-h3/posters/${clip.slug}.jpg`}
        width={960}
        height={540}
        className="mt-8 w-full rounded-2xl border bg-black"
        aria-label={`${clip.title} generated with MiniMax H3`}
      >
        <source src={`/videos/minimax-h3/${clip.file}`} type="video/mp4" />
      </video>

      <section className="mt-10" aria-labelledby="prompt-heading">
        <h2 id="prompt-heading" className="text-xl font-semibold">
          The prompt used for this clip
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Copy it into the playground, then change the subject, lens, and sound
          directions. The prompt describes the intended shot; results vary by
          seed and settings.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border bg-muted/40 p-5 text-sm leading-7 whitespace-pre-wrap">
          {clip.prompt}
        </pre>
      </section>

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold">
          What to look for
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
          <li>
            Mode: <strong className="text-foreground">{clip.mode}</strong>, so
            this clip follows the{' '}
            <Link
              href={doc.href}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {doc.label}
            </Link>{' '}
            workflow.
          </li>
          <li>
            Output tier:{' '}
            <strong className="text-foreground">{clip.resolution}</strong>. Same
            prompt at 2K costs more credits per second than 768P.
          </li>
          <li>
            Aspect ratio:{' '}
            <strong className="text-foreground">{clip.aspect}</strong>. Choose it
            before generating; it cannot be changed after the fact.
          </li>
          <li>
            For reusable prompt structures rather than a single example, read
            the{' '}
            <Link
              href="/blog/minimax-h3-prompt-guide"
              className="font-medium text-foreground underline underline-offset-4"
            >
              MiniMax H3 prompt guide
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="more-examples">
        <h2 id="more-examples" className="text-xl font-semibold">
          More MiniMax H3 examples
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/examples/${item.slug}`}
                className="group block overflow-hidden rounded-xl border"
              >
                <img
                  src={`/videos/minimax-h3/posters/${item.slug}.jpg`}
                  alt={`${item.title} – MiniMax H3 generated video still`}
                  width={960}
                  height={540}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <p className="p-4 text-sm font-medium">{item.title}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/examples" className="font-medium text-foreground underline underline-offset-4">
            See all MiniMax H3 examples
          </Link>{' '}
          or{' '}
          <Link href="/#playground" className="font-medium text-foreground underline underline-offset-4">
            generate your own clip
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
