export const PUBLIC_DOC_SLUGS = [
  '',
  'getting-started',
  'text-to-video',
  'first-last-frame',
  'multimodal-reference',
  'prompting',
  'credits-and-pricing',
  'video-history',
] as const;

export function isPublicDocSlug(slug?: string[]) {
  return PUBLIC_DOC_SLUGS.includes((slug ?? []).join('/') as (typeof PUBLIC_DOC_SLUGS)[number]);
}

const UPDATED_BLOG_SLUGS = new Set([
  'minimax-h3-cost',
  'minimax-h3-prompt-guide',
  'minimax-h3-real-world-test',
  'minimax-h3-vs-seedance',
]);

export function getBlogModifiedDate(slug: string) {
  return UPDATED_BLOG_SLUGS.has(slug) ? '2026-08-06' : '2026-08-05';
}

export function getDocModifiedDate(slug?: string[]) {
  return (slug ?? []).length === 0 ? '2026-08-06' : '2026-08-05';
}
