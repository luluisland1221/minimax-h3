'use client';

import type { PricePlan } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 *
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * docs:
 * https://mksaas.com/docs/config/price
 *
 * @returns The price plans with translated content
 */
export function getPricePlans(): Record<string, PricePlan> {
  const t = useTranslations('PricePlans');
  const priceConfig = websiteConfig.price;
  const plans: Record<string, PricePlan> = {};

  // Add translated content to each plan
  if (priceConfig.plans.free) {
    plans.free = {
      ...priceConfig.plans.free,
      name: t('free.name'),
      description: t('free.description'),
      features: [
        t('free.features.feature-1'),
        t('free.features.feature-2'),
        t('free.features.feature-3'),
        t('free.features.feature-4'),
      ],
      limits: [
        t('free.limits.limit-1'),
        t('free.limits.limit-2'),
        t('free.limits.limit-3'),
      ],
    };
  }

  if (priceConfig.plans.creator) {
    plans.creator = {
      ...priceConfig.plans.creator,
      name: t('creator.name'),
      description: t('creator.description'),
      features: [
        t('creator.features.feature-1'),
        t('creator.features.feature-2'),
        t('creator.features.feature-3'),
        t('creator.features.feature-4'),
        t('creator.features.feature-5'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.pro) {
    plans.pro = {
      ...priceConfig.plans.pro,
      name: t('pro.name'),
      description: t('pro.description'),
      features: [
        t('pro.features.feature-1'),
        t('pro.features.feature-2'),
        t('pro.features.feature-3'),
        t('pro.features.feature-4'),
        t('pro.features.feature-5'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.studio) {
    plans.studio = {
      ...priceConfig.plans.studio,
      name: t('studio.name'),
      description: t('studio.description'),
      features: [
        t('studio.features.feature-1'),
        t('studio.features.feature-2'),
        t('studio.features.feature-3'),
        t('studio.features.feature-4'),
        t('studio.features.feature-5'),
        t('studio.features.feature-6'),
        t('studio.features.feature-7'),
      ],
      limits: [],
    };
  }

  return plans;
}
