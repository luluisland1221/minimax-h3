import { getDb } from '@/db';
import { videoGeneration } from '@/db/schema';
import { auth } from '@/lib/auth';
import { getVideoBucket } from '@/lib/r2-video-storage';
import { and, eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ generationId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Please sign in.' }, { status: 401 });
  }

  const { generationId } = await context.params;
  const db = await getDb();
  const ownerFilter =
    session.user.role === 'admin'
      ? eq(videoGeneration.id, generationId)
      : and(
          eq(videoGeneration.id, generationId),
          eq(videoGeneration.userId, session.user.id)
        );
  const [generation] = await db
    .select({ storageKey: videoGeneration.storageKey })
    .from(videoGeneration)
    .where(ownerFilter)
    .limit(1);

  if (!generation?.storageKey) {
    return Response.json({ error: 'Video not found.' }, { status: 404 });
  }

  const bucket = await getVideoBucket();
  if (!bucket) {
    return Response.json(
      { error: 'Video storage is unavailable.' },
      { status: 503 }
    );
  }

  const metadata = await bucket.head(generation.storageKey);
  if (!metadata) {
    return Response.json({ error: 'Video not found.' }, { status: 404 });
  }

  const range = parseRange(request.headers.get('range'), metadata.size);
  if (range === false) {
    return new Response(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${metadata.size}` },
    });
  }

  const object = await bucket.get(
    generation.storageKey,
    range ? { range: { offset: range.start, length: range.length } } : undefined
  );
  if (!object || !('body' in object)) {
    return Response.json({ error: 'Video not found.' }, { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'private, max-age=3600');
  headers.set('ETag', object.httpEtag);
  const disposition = new URL(request.url).searchParams.has('download')
    ? 'attachment'
    : 'inline';
  headers.set(
    'Content-Disposition',
    `${disposition}; filename="minimax-h3-${generationId}.mp4"`
  );

  if (range) {
    headers.set('Content-Length', String(range.length));
    headers.set(
      'Content-Range',
      `bytes ${range.start}-${range.end}/${metadata.size}`
    );
  } else {
    headers.set('Content-Length', String(metadata.size));
  }

  return new Response(object.body, { status: range ? 206 : 200, headers });
}

function parseRange(value: string | null, size: number) {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return false;

  let start: number;
  let end: number;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isInteger(suffix) || suffix <= 0) return false;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (start < 0 || start >= size || end < start) return false;
  end = Math.min(end, size - 1);
  return { start, end, length: end - start + 1 };
}
