'use client';

import { HeaderSection } from '@/components/layout/header-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { IconName } from 'lucide-react/dynamic';

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FaqSection() {
  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      icon: 'calendar-clock',
      question: 'How are MiniMax H3 credits calculated?',
      answer: 'Credits depend on video duration, resolution, and the selected generation mode. The workspace shows the estimated credit cost before you generate.',
    },
    {
      id: 'item-2',
      icon: 'wallet',
      question: 'Do monthly credits roll over?',
      answer: 'Monthly plan credits refresh with each billing cycle. One-time credit packages remain available for 12 months after purchase.',
    },
    {
      id: 'item-3',
      icon: 'refresh-cw',
      question: 'Can I change or cancel my subscription?',
      answer: 'Yes. Open billing in your account to manage, upgrade, or cancel your subscription before the next renewal.',
    },
    {
      id: 'item-4',
      icon: 'hand-coins',
      question: 'Where can I find generated videos?',
      answer: 'Completed and processing generations appear in Video History, where you can view status and copy saved result links.',
    },
    {
      id: 'item-5',
      icon: 'mail',
      question: 'How can I get billing or generation support?',
      answer: 'Email support@minimaxh3.pro with your account email and relevant task or payment details.',
    },
  ];

  return (
    <section id="faqs" className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <HeaderSection
          title="MiniMax H3 pricing FAQ"
          titleAs="h2"
          subtitle="Credits, subscriptions, saved videos, and support"
          subtitleAs="p"
        />

        <div className="mx-auto max-w-4xl mt-12">
          <Accordion
            type="single"
            collapsible
            className="ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
