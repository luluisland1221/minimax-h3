const baseUrl = 'https://minimaxh3.pro';

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'minimaxh3.pro',
  alternateName: 'MiniMax H3 Independent Workspace',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo-minimax-h3.svg`,
  },
  email: 'support@minimaxh3.pro',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@minimaxh3.pro',
    availableLanguage: 'English',
  },
  description: 'minimaxh3.pro is an independent third-party online workspace for generating AI videos with MiniMax H3. It is not affiliated with, endorsed by, or operated by MiniMax.',
};

const monthlyOffer = (name: string, price: number, credits: string) => ({
  '@type': 'Offer',
  name,
  price,
  priceCurrency: 'USD',
  availability: 'https://schema.org/InStock',
  url: `${baseUrl}/pricing`,
  category: 'Subscription',
  description: `${credits} monthly credits`,
  seller: { '@id': `${baseUrl}/#organization` },
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price,
    priceCurrency: 'USD',
    billingDuration: 'P1M',
    unitText: 'MONTH',
  },
});

const creditOffer = (name: string, price: number, credits: string) => ({
  '@type': 'Offer',
  name,
  price,
  priceCurrency: 'USD',
  availability: 'https://schema.org/InStock',
  url: `${baseUrl}/pricing`,
  category: 'Credit package',
  description: `${credits} one-time credits, valid for 12 months`,
  seller: { '@id': `${baseUrl}/#organization` },
});

export const softwareOffers = [
  monthlyOffer('Creator', 29, '2,500'),
  monthlyOffer('Pro', 59, '5,500'),
  monthlyOffer('Studio', 99, '10,000'),
  creditOffer('Boost', 50, '4,200'),
  creditOffer('Momentum', 70, '6,000'),
  creditOffer('Scale', 100, '9,000'),
];

export function softwareApplicationSchema(description?: string) {
  return {
    '@type': 'WebApplication',
    '@id': `${baseUrl}/#software`,
    name: 'MiniMax H3 AI Video Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser and JavaScript',
    url: baseUrl,
    description,
    featureList: [
      'Text to video generation',
      'First and last frame guidance',
      'Multimodal reference to video',
      'Synchronized stereo audio',
      '768P and native 2K output',
      '4 to 15 second clips',
      'Saved generation history',
    ],
    provider: { '@id': `${baseUrl}/#organization` },
    offers: softwareOffers,
  };
}

/**
 * VideoObject for a generated clip that is published on this site.
 * Google requires name, thumbnailUrl, uploadDate and contentUrl/embedUrl.
 */
export function videoObjectSchema({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  uploadDate,
  duration,
  width,
  height,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration?: string;
  width?: number;
  height?: number;
}) {
  return {
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: `${baseUrl}${thumbnailUrl}`,
    contentUrl: `${baseUrl}${contentUrl}`,
    uploadDate,
    ...(duration ? { duration } : {}),
    ...(width && height ? { width, height } : {}),
    publisher: { '@id': `${baseUrl}/#organization` },
    inLanguage: 'en',
    isFamilyFriendly: true,
  };
}

/**
 * Person entity for an editorial author. Only facts that are visible on the
 * author page should be published here.
 */
export function personSchema({
  name,
  url,
  description,
  jobTitle,
  knowsAbout,
}: {
  name: string;
  url: string;
  description?: string;
  jobTitle?: string;
  knowsAbout?: string[];
}) {
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name,
    url,
    ...(description ? { description } : {}),
    ...(jobTitle ? { jobTitle } : {}),
    ...(knowsAbout ? { knowsAbout } : {}),
    worksFor: { '@id': `${baseUrl}/#organization` },
  };
}

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

export function itemListSchema(
  items: Array<{ name: string; url: string }>,
  id: string
) {
  return {
    '@type': 'ItemList',
    '@id': id,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export { baseUrl };
