import { getMDXComponents } from '@/components/docs/mdx-components';
import Container from '@/components/layout/container';
import type { PagesType } from '@/lib/source';

/**
 * Render a standalone MDX page (methodology, editorial policy) with a single
 * H1 and readable measure.
 */
export function MdxPage({ page }: { page: PagesType }) {
  const MDX = page.data.body;

  return (
    <Container className="px-4 py-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          {page.data.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {page.data.description}
        </p>
        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </Container>
  );
}
