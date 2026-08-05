import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Badge } from '@/components/ui/badge';
import { getDb } from '@/db';
import { payment, user, userCredit } from '@/db/schema';
import { findPlanByPriceId } from '@/lib/price-plan';
import { getSession } from '@/lib/server';
import { desc, eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function AdminAnalyticsPage() {
  const session = await getSession();
  if (session?.user.role !== 'admin') redirect('/dashboard');

  const db = await getDb();
  // Better Auth stores UTC in a timestamp-without-time-zone column.
  // China Standard Time is UTC+8 and does not observe daylight saving time.
  const beijingDay = sql<string>`to_char(${user.createdAt} + interval '8 hours', 'YYYY-MM-DD')`;
  const [dailyRows, userRows, paymentRows] = await Promise.all([
    db
      .select({
        day: beijingDay,
        registrations: sql<number>`count(*)::int`,
      })
      .from(user)
      .groupBy(beijingDay)
      .orderBy(desc(beijingDay))
      .limit(14),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        credits: userCredit.currentCredits,
      })
      .from(user)
      .leftJoin(userCredit, eq(user.id, userCredit.userId))
      .orderBy(desc(user.createdAt)),
    db
      .select({
        userId: payment.userId,
        priceId: payment.priceId,
        status: payment.status,
        createdAt: payment.createdAt,
      })
      .from(payment)
      .orderBy(desc(payment.createdAt)),
  ]);

  const latestPaymentByUser = new Map<string, (typeof paymentRows)[number]>();
  for (const row of paymentRows) {
    if (!latestPaymentByUser.has(row.userId)) {
      latestPaymentByUser.set(row.userId, row);
    }
  }

  const daily = dailyRows.reverse();
  const maxRegistrations = Math.max(
    1,
    ...daily.map((row) => row.registrations)
  );
  const totalCredits = userRows.reduce(
    (sum, row) => sum + (row.credits ?? 0),
    0
  );

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'User analytics', isCurrentPage: true }]}
      />
      <main className="space-y-6 p-4 lg:p-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Stat label="Registered users" value={userRows.length} />
          <Stat
            label="Registrations today (Beijing)"
            value={daily.at(-1)?.registrations ?? 0}
          />
          <Stat label="Credits held by users" value={totalCredits} />
        </section>

        <section className="rounded-[24px] border bg-card p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#CC346E]">
                Asia/Shanghai
              </p>
              <h1 className="mt-2 text-2xl font-semibold">
                Daily registrations
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Last 14 active days</p>
          </div>
          <div className="mt-8 grid min-h-56 grid-cols-7 items-end gap-2 sm:grid-cols-14">
            {daily.map((row) => (
              <div
                key={row.day}
                className="flex h-full flex-col justify-end gap-2"
              >
                <span className="text-center text-xs font-medium">
                  {row.registrations}
                </span>
                <div
                  className="min-h-2 rounded-t-lg bg-gradient-to-t from-[#583C50] via-[#CC346E] to-[#EC435B]"
                  style={{
                    height: `${Math.max(8, (row.registrations / maxRegistrations) * 170)}px`,
                  }}
                />
                <span className="truncate text-center text-[10px] text-muted-foreground">
                  {String(row.day).slice(5)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border bg-card">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Users and balances</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real account, credit and subscription data.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Joined (Beijing)</th>
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userRows.map((row) => {
                  const latestPayment = latestPaymentByUser.get(row.id);
                  const plan = latestPayment
                    ? findPlanByPriceId(latestPayment.priceId)
                    : null;
                  return (
                    <tr key={row.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{row.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {row.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatBeijing(row.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {(row.credits ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {plan?.id ? capitalize(plan.id) : 'Free'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">
                          {latestPayment?.status ?? 'active'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function formatBeijing(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
