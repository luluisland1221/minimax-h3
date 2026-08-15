'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCreditPackages } from '@/config/credits-config';
import { websiteConfig } from '@/config/website';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMounted } from '@/hooks/use-mounted';
import { useCurrentPlan } from '@/hooks/use-payment';
import { useLocalePathname } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { CircleCheckBigIcon, CoinsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CreditCheckoutButton } from './credit-checkout-button';

/**
 * Credit packages component
 */
export function CreditPackages() {
  // Check if credits are enabled - move this check before any hooks
  if (!websiteConfig.credits.enableCredits) {
    return null;
  }

  const t = useTranslations('Dashboard.settings.credits.packages');

  // Get current user and payment info
  const currentUser = useCurrentUser();
  const mounted = useMounted();
  const currentPath = useLocalePathname();
  const { data: session } = authClient.useSession();
  const { data: paymentData } = useCurrentPlan(session?.user?.id);
  const currentPlan = paymentData?.currentPlan;

  // Get credit packages with translations - must be called here to maintain hook order
  const creditPackages = Object.values(getCreditPackages()).filter(
    (pkg) => !pkg.disabled
  );

  // Check if user is on free plan and enablePackagesForFreePlan is false
  const isFreePlan = currentPlan?.isFree === true;

  // Check if user is on free plan and enablePackagesForFreePlan is false
  if (isFreePlan && !websiteConfig.credits.enablePackagesForFreePlan) {
    return null;
  }

  return (
    <Card id="credit-packages" className="w-full scroll-mt-24">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {creditPackages.map((creditPackage) => (
            <Card
              key={creditPackage.id}
              className={cn(
                `relative ${creditPackage.popular ? 'border-primary' : ''}`,
                'shadow-none border-1 border-border'
              )}
            >
              {creditPackage.popular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                  <Badge
                    variant="default"
                    className="bg-primary text-primary-foreground"
                  >
                    {t('popular')}
                  </Badge>
                </div>
              )}

              <CardContent className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">
                  {creditPackage.name}
                </p>
                {/* Price and Credits - Left/Right Layout */}
                <div className="flex items-center justify-between py-2">
                  <div className="text-left">
                    <div className="text-2xl font-semibold flex items-center gap-2">
                      <CoinsIcon className="h-4 w-4 text-muted-foreground" />
                      {creditPackage.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(
                        creditPackage.price.amount,
                        creditPackage.price.currency
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground text-left py-2 flex items-center gap-2">
                  <CircleCheckBigIcon className="h-4 w-4 text-green-500" />
                  {creditPackage.description}
                </div>

                {/* purchase button using checkout */}
                {mounted && currentUser ? (
                  creditPackage.price.priceId ? (
                    <CreditCheckoutButton
                      userId={currentUser.id}
                      packageId={creditPackage.id}
                      priceId={creditPackage.price.priceId}
                      className="mt-2 w-full cursor-pointer"
                      variant={creditPackage.popular ? 'default' : 'outline'}
                    >
                      {t('purchase')}
                    </CreditCheckoutButton>
                  ) : (
                    <Button
                      type="button"
                      className="mt-2 w-full cursor-pointer"
                      variant={creditPackage.popular ? 'default' : 'outline'}
                      onClick={() =>
                        toast.error(
                          'Payment setup pending. Add this package’s Stripe Price ID to .env.local.'
                        )
                      }
                    >
                      {t('purchase')}
                    </Button>
                  )
                ) : (
                  <LoginWrapper mode="modal" asChild callbackUrl={currentPath}>
                    <Button
                      type="button"
                      className="mt-2 w-full cursor-pointer"
                      variant={creditPackage.popular ? 'default' : 'outline'}
                    >
                      {t('purchase')}
                    </Button>
                  </LoginWrapper>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
