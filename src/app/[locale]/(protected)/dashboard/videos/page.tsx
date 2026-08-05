import { CopyVideoLink } from '@/components/dashboard/copy-video-link';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDb } from '@/db';
import { videoGeneration } from '@/db/schema';
import { getSession } from '@/lib/server';
import { desc, eq } from 'drizzle-orm';
import {
  Clock3,
  Download,
  Film,
  LoaderCircle,
  MonitorPlay,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MyVideosPage() {
  const session = await getSession();
  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/videos');

  const db = await getDb();
  const videos = await db
    .select()
    .from(videoGeneration)
    .where(eq(videoGeneration.userId, session.user.id))
    .orderBy(desc(videoGeneration.createdAt))
    .limit(100);

  const readyCount = videos.filter(
    (video) => video.status === 'succeeded'
  ).length;
  const activeCount = videos.filter((video) =>
    ['queued', 'running'].includes(video.status)
  ).length;

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'My videos', isCurrentPage: true }]}
      />
      <main className="space-y-7 p-4 lg:p-8">
        <section className="relative overflow-hidden rounded-[28px] border border-[#EC435B]/15 bg-[#120e12] p-6 text-white sm:p-8">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#EC435B]/20 blur-3xl" />
          <div className="absolute -bottom-32 right-40 size-72 rounded-full bg-[#583C50]/55 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ff8296]">
                Generation archive
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your moving image library
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Revisit every H3 render, recover its prompt, and access the
                stored video without searching through old sessions.
              </p>
            </div>
            <Button asChild className="bg-[#EC435B] hover:bg-[#d93a52]">
              <Link href="/#playground">
                <Sparkles className="mr-2 size-4" /> Create another video
              </Link>
            </Button>
          </div>
          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            <ArchiveMetric label="Total tasks" value={videos.length} />
            <ArchiveMetric label="Ready to watch" value={readyCount} />
            <ArchiveMetric label="In progress" value={activeCount} />
          </div>
        </section>

        {videos.length === 0 ? (
          <section className="rounded-[24px] border border-dashed bg-card px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EC435B]/10 text-[#EC435B]">
              <Film className="size-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">No generations yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your first video will appear here as soon as you submit it.
            </p>
            <Button asChild className="mt-6 bg-[#EC435B] hover:bg-[#d93a52]">
              <Link href="/#playground">Open playground</Link>
            </Button>
          </section>
        ) : (
          <section className="grid gap-5 xl:grid-cols-2">
            {videos.map((video) => {
              const playableUrl = video.storageUrl ?? video.providerOutputUrl;
              const permanent = Boolean(video.storageUrl);
              return (
                <article
                  key={video.id}
                  className="group overflow-hidden rounded-[24px] border bg-card shadow-sm transition hover:border-[#CC346E]/35 hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#100d10]">
                    {video.status === 'succeeded' && playableUrl ? (
                      // biome-ignore lint/a11y/useMediaCaption: generated videos do not contain a caption track.
                      <video
                        src={playableUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="size-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(236,67,91,.14),transparent_45%),#100d10] text-center">
                        {['queued', 'running'].includes(video.status) ? (
                          <LoaderCircle className="size-7 animate-spin text-[#EC435B]" />
                        ) : (
                          <MonitorPlay className="size-7 text-white/25" />
                        )}
                        <p className="mt-3 text-sm capitalize text-white/50">
                          {video.status}
                        </p>
                      </div>
                    )}
                    <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
                      <StatusBadge status={video.status} />
                      {video.status === 'succeeded' ? (
                        <Badge className="border-white/10 bg-black/55 text-white backdrop-blur">
                          {permanent ? 'R2 stored' : 'Temporary source'}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{video.resolution}</span>
                      <span>·</span>
                      <span>{video.duration}s</span>
                      <span>·</span>
                      <span>{video.ratio}</span>
                      <span>·</span>
                      <span className="capitalize">{video.mode}</span>
                    </div>
                    <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6">
                      {video.prompt}
                    </p>
                    <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        {formatBeijing(video.createdAt)} CST
                      </div>
                      {playableUrl ? (
                        <div className="flex flex-wrap gap-2">
                          <CopyVideoLink url={playableUrl} />
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={
                                permanent
                                  ? `${playableUrl}?download=1`
                                  : playableUrl
                              }
                              download
                            >
                              <Download className="mr-1.5 size-3.5" /> Download
                            </a>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}

function ArchiveMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === 'succeeded'
      ? 'border-emerald-400/20 bg-emerald-400/90 text-emerald-950'
      : status === 'failed' || status === 'cancelled'
        ? 'border-red-400/20 bg-red-500/90 text-white'
        : 'border-[#EC435B]/25 bg-[#EC435B]/90 text-white';
  return <Badge className={className}>{status}</Badge>;
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
