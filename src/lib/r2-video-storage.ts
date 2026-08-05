import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function getVideoBucket(): Promise<R2Bucket | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.MINIMAXH3_VIDEOS;
  } catch {
    return null;
  }
}

export async function archiveGeneratedVideo(input: {
  generationId: string;
  userId: string;
  taskId: string;
  sourceUrl: string;
}) {
  const bucket = await getVideoBucket();
  if (!bucket) return null;

  const source = await fetch(input.sourceUrl, { cache: 'no-store' });
  if (!source.ok || !source.body) {
    throw new Error(`Could not download generated video (${source.status}).`);
  }

  const contentType = source.headers.get('content-type') || 'video/mp4';
  if (!contentType.toLowerCase().startsWith('video/')) {
    throw new Error('MiniMax result did not return a video response.');
  }

  const extension = contentType.toLowerCase().includes('quicktime')
    ? 'mov'
    : 'mp4';
  const key = `generations/${input.userId}/${input.generationId}.${extension}`;

  const contentLength = Number(source.headers.get('content-length'));
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
    throw new Error('Generated video response did not include a valid size.');
  }

  const fixedLengthStream = new FixedLengthStream(contentLength);
  const piping = source.body.pipeTo(fixedLengthStream.writable);

  await Promise.all([
    bucket.put(key, fixedLengthStream.readable, {
      httpMetadata: {
        contentType,
        cacheControl: 'private, max-age=31536000, immutable',
      },
      customMetadata: {
        generationId: input.generationId,
        taskId: input.taskId,
        userId: input.userId,
      },
    }),
    piping,
  ]);

  return {
    key,
    url: `/api/videos/${input.generationId}`,
  };
}

export async function keepArchiveJobAlive(job: Promise<unknown>) {
  try {
    const { ctx } = await getCloudflareContext({ async: true });
    ctx.waitUntil(job);
  } catch {
    // In `next dev` there is no Worker execution context. The promise still
    // continues while the local Node process remains alive.
    void job;
  }
}
