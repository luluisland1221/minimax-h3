import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/urls/urls';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Bingbot',
        ],
        allow: '/',
        disallow: ['/api/*', '/_next/*', '/settings/*', '/dashboard/*'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/_next/*', '/settings/*', '/dashboard/*'],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
