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
  return PUBLIC_DOC_SLUGS.includes(
    (slug ?? []).join('/') as (typeof PUBLIC_DOC_SLUGS)[number]
  );
}

export const PUBLIC_BLOG_SLUGS = [
  'minimax-h3-api',
  'minimax-h3-free',
  'minimax-h3-turbo-and-max',
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
  'minimax-h3-vs-kling-3',
  'minimax-h3-vs-veo-3',
  'minimax-h3-vs-sora-2',
  'minimax-h3-vs-wan',
  'minimax-h3-vs-runway-gen-4-5',
  'minimax-h3-vs-ltx-2-3',
  'minimax-h3-vs-luma-ray3',
  'minimax-h3-vs-adobe-firefly-video',
  'minimax-h3-alternatives',
  'minimax-h3-product-video-prompts',
  'minimax-h3-ugc-video-prompts',
  'minimax-h3-music-video-workflow',
  'minimax-h3-game-cinematic-prompts',
  'minimax-h3-video-to-video',
  'minimax-h3-github',
  'minimax-h3-review',
] as const;

export function isPublicBlogSlug(slug: string) {
  return PUBLIC_BLOG_SLUGS.includes(slug as (typeof PUBLIC_BLOG_SLUGS)[number]);
}

export const PUBLIC_CATEGORY_SLUGS = [
  'local-deployment',
  'model-guides',
  'pricing-cost',
  'prompt-workflows',
  'tests-comparisons',
  'use-cases',
] as const;

export function isPublicCategorySlug(slug: string) {
  return PUBLIC_CATEGORY_SLUGS.includes(
    slug as (typeof PUBLIC_CATEGORY_SLUGS)[number]
  );
}

/**
 * Slugs of the published sample clips. Kept as plain strings so the edge
 * middleware does not bundle the prompt text.
 */
export const PUBLIC_EXAMPLE_SLUGS = [
  'showcase-film',
  'showcase-product',
  'showcase-context',
  'showcase-campaign',
  'showcase-world',
  'showcase-performance',
  'hero',
  'hf-first-last',
  'openart-portrait-1',
  'openart-portrait-3',
  'openart-portrait-4',
  'openart-community-1',
  'openart-feature-3',
  'h3-direct-2k',
  'r2va-direct-2k',
  'openart-h3-4x19',
  'openart-h3-community-2',
  'openart-h3-community-3',
  'openart-h3-community-4',
] as const;

export function isPublicExampleSlug(slug: string) {
  return PUBLIC_EXAMPLE_SLUGS.includes(
    slug as (typeof PUBLIC_EXAMPLE_SLUGS)[number]
  );
}

export const PUBLIC_AUTHOR_SLUGS = ['minimax-h3'] as const;

export function isPublicAuthorSlug(slug: string) {
  return PUBLIC_AUTHOR_SLUGS.includes(
    slug as (typeof PUBLIC_AUTHOR_SLUGS)[number]
  );
}
