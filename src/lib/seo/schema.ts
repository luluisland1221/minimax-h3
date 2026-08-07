const baseUrl = 'https://minimaxh3.pro';

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'MiniMax H3',
  url: baseUrl,
  logo: `${baseUrl}/logo-minimax-h3.svg`,
  email: 'support@minimaxh3.pro',
  description: 'minimaxh3.pro is an independent third-party online workspace for generating AI videos with MiniMax H3. It is not affiliated with, endorsed by, or operated by MiniMax.',
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}

export function graphSchema(nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { baseUrl };
