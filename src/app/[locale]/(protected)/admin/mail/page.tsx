import { sendAdminEmailAction } from '@/actions/send-admin-email';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getDb } from '@/db';
import { outboundMail } from '@/db/schema';
import { getSession } from '@/lib/server';
import { desc } from 'drizzle-orm';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminMailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const session = await getSession();
  if (session?.user.role !== 'admin') redirect('/dashboard');

  const { sent } = await searchParams;
  const db = await getDb();
  const sentMessages = await db
    .select()
    .from(outboundMail)
    .orderBy(desc(outboundMail.sentAt))
    .limit(100);

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'Mail center', isCurrentPage: true }]}
      />
      <main className="space-y-6 p-4 lg:p-8">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(236,67,91,0.22),transparent_36%),linear-gradient(135deg,#120e12,#21131c)] p-6 text-white lg:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EC435B] via-[#CC346E] to-[#583C50] shadow-lg shadow-[#EC435B]/20">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EC435B]">
                Admin mail
              </p>
              <h1 className="mt-2 text-2xl font-semibold">Write a new email</h1>
              <p className="mt-1 text-sm text-white/55">
                Send directly from support@minimaxh3.pro via Plunk.
              </p>
            </div>
          </div>

          {sent === '1' && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              <CheckCircle2 className="size-4" /> Email sent successfully.
            </div>
          )}

          <form action={sendAdminEmailAction} className="mt-7 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <label
                htmlFor="mail-to"
                className="space-y-2 text-sm font-medium"
              >
                <span>To</span>
                <Input
                  type="email"
                  id="mail-to"
                  name="to"
                  required
                  autoComplete="email"
                  placeholder="customer@example.com"
                  className="h-11 border-white/10 bg-white/7 text-white placeholder:text-white/30 focus-visible:border-[#EC435B]"
                />
              </label>
              <label
                htmlFor="mail-subject"
                className="space-y-2 text-sm font-medium"
              >
                <span>Subject</span>
                <Input
                  id="mail-subject"
                  name="subject"
                  required
                  placeholder="How can we help?"
                  className="h-11 border-white/10 bg-white/7 text-white placeholder:text-white/30 focus-visible:border-[#EC435B]"
                />
              </label>
            </div>
            <label
              htmlFor="mail-body"
              className="block space-y-2 text-sm font-medium"
            >
              <span>Message</span>
              <Textarea
                id="mail-body"
                name="body"
                required
                rows={9}
                placeholder="Write your message..."
                className="resize-y border-white/10 bg-white/7 text-white placeholder:text-white/30 focus-visible:border-[#EC435B]"
              />
            </label>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-[#EC435B] to-[#CC346E] px-7 text-white shadow-lg shadow-[#EC435B]/20 hover:brightness-110"
              >
                <Send className="mr-2 size-4" /> Send email
              </Button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Sent emails</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest 100 outgoing messages
              </p>
            </div>
            <Badge variant="outline">{sentMessages.length} sent</Badge>
          </div>

          {sentMessages.length === 0 ? (
            <div className="rounded-[24px] border border-dashed bg-card p-10 text-center">
              <Send className="mx-auto size-7 text-muted-foreground" />
              <p className="mt-3 font-medium">No sent emails yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Messages sent with the form above will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sentMessages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-[20px] border bg-card p-5 transition-colors hover:border-[#CC346E]/35"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{message.subject}</h3>
                        <Badge variant="secondary">{message.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        To {message.toEmail} · {formatBeijing(message.sentAt)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {message.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
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
