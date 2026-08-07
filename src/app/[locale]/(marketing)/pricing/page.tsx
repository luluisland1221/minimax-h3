import FaqSection from '@/components/blocks/faqs/faqs';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { CreditPackages } from '@/components/settings/credits/credit-packages';
import { JsonLd } from '@/components/seo/json-ld';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema } from '@/lib/seo/schema';
import Link from 'next/link';
import { faqPageSchema } from '@/lib/seo/blog-faqs';
import { pricingFaqs } from '@/lib/seo/pricing-faqs';

export default async function PricingPage() {
  return (
    <Container className="mt-8 max-w-6xl px-4 flex flex-col gap-16">
      <JsonLd data={graphSchema([organizationSchema, {
        '@type': 'SoftwareApplication', '@id': `${baseUrl}/#software`, name: 'MiniMax H3 AI Video Generator', applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', url: baseUrl,
        offers: { '@type': 'OfferCatalog', name: 'MiniMax H3 plans and credit packages', itemListElement: [
          { '@type': 'Offer', name: 'Creator', price: 29, priceCurrency: 'USD', description: '2,500 monthly credits' },
          { '@type': 'Offer', name: 'Pro', price: 59, priceCurrency: 'USD', description: '5,500 monthly credits' },
          { '@type': 'Offer', name: 'Studio', price: 99, priceCurrency: 'USD', description: '10,000 monthly credits' },
          { '@type': 'Offer', name: 'Boost', price: 50, priceCurrency: 'USD', description: '4,200 one-time credits, valid for 12 months' },
          { '@type': 'Offer', name: 'Momentum', price: 70, priceCurrency: 'USD', description: '6,000 one-time credits, valid for 12 months' },
          { '@type': 'Offer', name: 'Scale', price: 100, priceCurrency: 'USD', description: '9,000 one-time credits, valid for 12 months' },
        ] },
      }, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]), faqPageSchema(pricingFaqs)])} />
      <PricingTable />

      <CreditPackages />

      <FaqSection />

      <p className="text-center text-sm text-muted-foreground">
        Need a plain-text reference? Read the{' '}
        <Link className="underline underline-offset-4 hover:text-foreground" href="/pricing.md">
          machine-readable pricing file
        </Link>.
      </p>
    </Container>
  );
}
