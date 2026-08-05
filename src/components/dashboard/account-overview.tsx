'use client';

import { UserAvatar } from '@/components/layout/user-avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getPricePlans } from '@/config/price-config';
import { useCreditBalance } from '@/hooks/use-credits';
import { useCurrentPlan } from '@/hooks/use-payment';
import { LocaleLink } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { Routes } from '@/routes';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Coins,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export function AccountOverview() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;
  const { data: credits = 0, isLoading: creditsPending } = useCreditBalance();
  const { data: planData, isLoading: planPending } = useCurrentPlan(user?.id);
  const translatedPlans = getPricePlans();
  const currentPlan = planData?.currentPlan
    ? translatedPlans[planData.currentPlan.id]
    : null;
  const subscription = planData?.subscription;
  const loading = sessionPending || creditsPending || planPending;

  if (loading || !user) {
    return <AccountOverviewSkeleton />;
  }

  const planName = currentPlan?.name ?? 'Free';
  const planCredits = currentPlan?.credits?.amount ?? 0;
  const renewalDate = subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(subscription.currentPeriodEnd))
    : null;

  return (
    <div className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <section className="relative overflow-hidden rounded-[28px] border border-[#EC435B]/15 bg-[#120e12] p-6 text-white shadow-[0_30px_80px_rgba(24,8,18,.18)] sm:p-8">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#EC435B]/20 blur-3xl" />
        <div className="absolute -bottom-28 right-28 size-72 rounded-full bg-[#583C50]/45 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-16 border border-white/15"
            />
            <div>
              <p className="text-sm text-white/45">Welcome back</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-white/45">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            <ShieldCheck className="size-4 text-[#EC435B]" /> Signed in with
            Google
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={<Coins className="size-5" />}
          eyebrow="Available credits"
          value={credits.toLocaleString()}
          detail={`${planCredits.toLocaleString()} credits included per billing cycle`}
          href={Routes.SettingsCredits}
          action="View activity"
        />
        <MetricCard
          icon={<BadgeCheck className="size-5" />}
          eyebrow="Current plan"
          value={planName}
          detail={
            subscription
              ? `${subscription.status.charAt(0).toUpperCase()}${subscription.status.slice(1)} subscription`
              : 'You are currently using the free plan'
          }
          href={Routes.SettingsBilling}
          action="Manage plan"
        />
        <MetricCard
          icon={<CalendarClock className="size-5" />}
          eyebrow={renewalDate ? 'Next billing date' : 'Billing status'}
          value={renewalDate ?? 'No renewal'}
          detail={
            subscription?.cancelAtPeriodEnd
              ? 'Your subscription will end after this period'
              : 'Manage billing securely from your account'
          }
          href={Routes.SettingsBilling}
          action="Billing details"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[24px] border bg-card p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#CC346E]">
                Your workspace
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                More generations, fewer limits.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Upgrade when you need a larger monthly credit allowance and
                continued access to premium generation options.
              </p>
            </div>
            <CreditCard className="hidden size-8 text-[#583C50] sm:block" />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="bg-[#EC435B] hover:bg-[#d93a52]">
              <LocaleLink href={Routes.Pricing}>
                {currentPlan?.isFree ? 'Upgrade plan' : 'Explore plans'}
                <ArrowUpRight className="ml-2 size-4" />
              </LocaleLink>
            </Button>
            <Button asChild variant="outline">
              <LocaleLink href={Routes.SettingsBilling}>
                Manage subscription
              </LocaleLink>
            </Button>
          </div>
        </div>
        <div className="rounded-[24px] border bg-gradient-to-br from-[#EC435B]/8 via-[#CC346E]/5 to-[#583C50]/12 p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#CC346E]">
            Account status
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,.65)]" />
            <span className="font-medium">Active</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Your Google identity is verified and your workspace is ready to
            generate.
          </p>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  eyebrow,
  value,
  detail,
  href,
  action,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  value: string;
  detail: string;
  href: string;
  action: string;
}) {
  return (
    <article className="group rounded-[24px] border bg-card p-6 transition hover:-translate-y-0.5 hover:border-[#EC435B]/30 hover:shadow-lg">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#EC435B]/10 text-[#EC435B]">
        {icon}
      </div>
      <p className="mt-5 text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">
        {eyebrow}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">
        {detail}
      </p>
      <LocaleLink
        href={href}
        className="mt-5 inline-flex items-center text-sm font-medium text-[#CC346E]"
      >
        {action}
        <ArrowUpRight className="ml-1 size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </LocaleLink>
    </article>
  );
}

function AccountOverviewSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-44 rounded-[28px]" />
      <div className="grid gap-5 md:grid-cols-3">
        <Skeleton className="h-64 rounded-[24px]" />
        <Skeleton className="h-64 rounded-[24px]" />
        <Skeleton className="h-64 rounded-[24px]" />
      </div>
    </div>
  );
}
