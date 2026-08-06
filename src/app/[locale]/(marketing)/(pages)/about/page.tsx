import Container from '@/components/layout/container';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/metadata';
import { baseUrl, breadcrumbSchema, graphSchema, organizationSchema } from '@/lib/seo/schema';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { MailIcon } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: 'About MiniMax H3 Video Generator',
    description: 'Learn about minimaxh3.pro, an independent third-party MiniMax H3 video generation workspace, including its purpose, billing model, support, and data responsibilities.',
    canonicalUrl: getUrlWithLocale('/about', locale),
  });
}

export default function AboutPage() {
  return (
    <Container className="px-4 py-16">
      <JsonLd data={graphSchema([organizationSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])])} />
      <article className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <img src="/logo-minimax-h3.svg" alt="MiniMax H3 logo" className="size-16 rounded-2xl" />
          <div><h1 className="text-4xl font-semibold">About MiniMax H3</h1><p className="mt-2 text-muted-foreground">A focused online workspace for AI video creation.</p></div>
        </div>
        <section className="space-y-3"><h2 className="text-2xl font-semibold">What we provide</h2><p className="text-muted-foreground leading-7">minimaxh3.pro helps creators generate videos with MiniMax H3 through text, first-and-last-frame, and multimodal reference workflows. The service combines generation controls, credit estimates, account history, payments, and persistent video links in one interface.</p></section>
        <section className="space-y-3"><h2 className="text-2xl font-semibold">Independent third-party service</h2><p className="text-muted-foreground leading-7"><strong className="text-foreground">Independent / Not affiliated with MiniMax.</strong> This website is independently operated and is not endorsed by, sponsored by, or operated by MiniMax. MiniMax names and model references are used only to identify compatibility and the model being accessed.</p></section>
        <section className="space-y-3"><h2 className="text-2xl font-semibold">Billing and data</h2><p className="text-muted-foreground leading-7">Plans and one-time credit packages fund video generation. The Playground displays a credit estimate before a request is submitted. Account records include credit transactions and generation history; completed files may be copied to managed object storage so users can revisit their results. Our legal pages explain retention, payment, and privacy responsibilities in detail.</p></section>
        <section className="space-y-3"><h2 className="text-2xl font-semibold">Support</h2><p className="text-muted-foreground leading-7">For billing, generation, or account questions, contact our support address. Include a generation ID when relevant, but never send passwords, API keys, or card details.</p><Button asChild><a href="mailto:support@minimaxh3.pro"><MailIcon className="mr-2 size-4" />support@minimaxh3.pro</a></Button></section>
      </article>
    </Container>
  );
}
