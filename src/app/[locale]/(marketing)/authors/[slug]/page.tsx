import { getMDXComponents } from '@/components/docs/mdx-components';
import { JsonLd } from '@/components/seo/json-ld';
import { constructMetadata } from '@/lib/metadata';
import { EDITORIAL_AUTHOR } from '@/lib/seo/author';
import {
  baseUrl,
  breadcrumbSchema,
  graphSchema,
  organizationSchema,
  personSchema,
} from '@/lib/seo/schema';
import { authorSource, blogSource } from '@/lib/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';


export function generateStaticParams() {
  return authorSource.getPages('en').map((author) => ({
    slug: author.slugs[0],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = authorSource.getPage([slug], 'en');
  if (!author) notFound();

  return constructMetadata({
    title: `${author.data.name} 鈥?MiniMax H3 Guides`,
    description:
      author.data.description ??
      'Editorial team behind the MiniMax H3 guides on minimaxh3.pro.',
    canonicalUrl: getUrlWithLocale(`/authors/${slug}`, locale),
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  const author = authorSource.getPage([slug], 'en');
  if (!author) notFound();

  const MDX = author.data.body;
  const authorUrl = `${baseUrl}/authors/${slug}`;
  const posts = blogSource
    .getPages('en')
    .filter((post) => post.data.published)
    .sort(
      (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <JsonLd
        data={graphSchema([
          organizationSchema,
          personSchema({
            name: author.data.name,
            url: authorUrl,
            description: author.data.description,
            jobTitle: EDITORIAL_AUTHOR.jobTitle,
            knowsAbout: [...EDITORIAL_AUTHOR.knowsAbout],
          }),
          {
            '@type': 'ProfilePage',
            '@id': `${authorUrl}#webpage`,
            url: authorUrl,
            name: author.data.name,
            isPartOf: { '@id': `${baseUrl}/#website` },
            mainEntity: { '@id': `${authorUrl}#person` },
            inLanguage: 'en',
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: author.data.name, path: `/authors/${slug}` },
          ]),
        ])}
      />

      <div className="flex items-start gap-5">
        <img
          src={author.data.avatar}
          alt={author.data.name}
          width={72}
          height={72}
          className="size-18 rounded-2xl border"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {author.data.name}
          </h1>
          <p className="mt-2 text-muted-foreground">{author.data.description}</p>
        </div>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        {MDX ? <MDX components={getMDXComponents()} /> : null}
      </div>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        Every guide is written by this team and reviewed against the public
        MiniMax documentation. Read the{' '}
        <Link
          href="/methodology"
          className="font-medium text-foreground underline underline-offset-4"
        >
          testing methodology
        </Link>{' '}
        and the{' '}
        <Link
          href="/editorial-policy"
          className="font-medium text-foreground underline underline-offset-4"
        >
          editorial policy
        </Link>{' '}
        for how claims, pricing, and comparisons are checked.
      </p>

      <section className="mt-12" aria-labelledby="author-posts">
        <h2 id="author-posts" className="text-xl font-semibold">
          Guides by this team
        </h2>
        <ul className="mt-4 divide-y">
          {posts.map((post) => (
            <li key={post.slugs.join('/')} className="py-4">
              <Link
                href={`/blog/${post.slugs.join('/')}`}
                className="font-medium hover:text-primary"
              >
                {post.data.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {post.data.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
