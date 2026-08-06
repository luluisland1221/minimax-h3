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

export const PUBLIC_BLOG_SLUGS = [
  'minimax-h3-character-consistency',
  'minimax-h3-comfyui',
  'minimax-h3-cost',
  'minimax-h3-gguf',
  'minimax-h3-huggingface',
  'minimax-h3-lora',
  'minimax-h3-native-audio',
  'minimax-h3-open-source',
  'minimax-h3-prompt-guide',
  'minimax-h3-real-world-test',
  'minimax-h3-reference-to-video-guide',
  'minimax-h3-vram-requirements',
  'minimax-h3-vs-seedance',
  'what-is-minimax-h3',
] as const;

export function isPublicBlogSlug(slug: string) {
  return PUBLIC_BLOG_SLUGS.includes(
    slug as (typeof PUBLIC_BLOG_SLUGS)[number]
  );
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
