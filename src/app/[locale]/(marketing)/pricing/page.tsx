import FaqSection from '@/components/blocks/faqs/faqs';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { CreditPackages } from '@/components/settings/credits/credit-packages';
import { JsonLd } from '@/components/seo/json-ld';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema, softwareApplicationSchema } from '@/lib/seo/schema';
import Link from 'next/link';
import { faqPageSchema } from '@/lib/seo/blog-faqs';
import { pricingFaqs } from '@/lib/seo/pricing-faqs';

export default async function PricingPage() {
  return (
    <Container className="mt-8 max-w-6xl px-4 flex flex-col gap-16">
      <JsonLd data={graphSchema([organizationSchema, softwareApplicationSchema('Create MiniMax H3 videos online with subscription plans or one-time credit packages.'), { '@type': 'WebPage', '@id': `${baseUrl}/pricing#webpage`, url: `${baseUrl}/pricing`, name: 'MiniMax H3 Pricing', about: { '@id': `${baseUrl}/#software` }, isPartOf: { '@id': `${baseUrl}/#website` }, inLanguage: 'en' }, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]), faqPageSchema(pricingFaqs)])} />
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
