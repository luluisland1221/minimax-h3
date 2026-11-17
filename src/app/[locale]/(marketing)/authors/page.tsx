import { constructMetadata } from '@/lib/metadata';
import { authorSource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'Who Writes the MiniMax H3 Guides',
    description:
      'The editorial team behind minimaxh3.pro: how the guides are researched, what is tested first-hand, and how corrections are handled.',
    canonicalUrl: getUrlWithLocale('/authors', locale),
  });
}

export default function AuthorsIndexPage() {
  const authors = authorSource
    .getPages('en')
    .filter((author) => author.slugs[0] !== 'foo');

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Who writes these guides
      </h1>
      <p className="mt-4 text-muted-foreground">
        minimaxh3.pro publishes independent, hands-on MiniMax H3 guides. Every
        article is written by the editorial team below and checked against the
        public MiniMax documentation before it ships.
      </p>
      <ul className="mt-8 divide-y">
        {authors.map((author) => (
          <li key={author.slugs[0]} className="py-5">
            <Link
              href={`/authors/${author.slugs[0]}`}
              className="text-lg font-medium hover:text-primary"
            >
              {author.data.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {author.data.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
