/**
 * Editorial author used for every guide unless a post overrides it.
 * The author page lives at /authors/<slug> and exposes a Person entity.
 */
export const EDITORIAL_AUTHOR = {
  slug: 'minimax-h3',
  name: 'MiniMax H3 Editorial Team',
  url: '/authors/minimax-h3',
  description:
    'Independent writers and video engineers who test MiniMax H3 workflows, pricing, and local deployment options.',
  jobTitle: 'Editorial team',
  knowsAbout: [
    'MiniMax H3',
    'AI video generation',
    'Prompt engineering',
    'ComfyUI',
    'Local model deployment',
  ],
} as const;
