import { addCredits } from '@/credits/credits';
import { CREDIT_TRANSACTION_TYPE } from '@/credits/types';
import { getDb } from '@/db';
import { videoGeneration } from '@/db/schema';
import { auth } from '@/lib/auth';
import { getH3ActualCredits } from '@/lib/minimax-h3-pricing';
import {
  archiveGeneratedVideo,
  keepArchiveJobAlive,
} from '@/lib/r2-video-storage';
import { and, eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return Response.json(
      { error: 'Please sign in to view this task.' },
      { status: 401 }
    );

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey)
    return Response.json(
      { error: 'MiniMax API is not configured.' },
      { status: 500 }
    );

  const { taskId } = await context.params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(taskId))
    return Response.json({ error: 'Invalid task ID.' }, { status: 400 });

  const db = await getDb();
  const [generation] = await db
    .select({
      id: videoGeneration.id,
      storageKey: videoGeneration.storageKey,
      storageUrl: videoGeneration.storageUrl,
      resolution: videoGeneration.resolution,
      duration: videoGeneration.duration,
      creditsReserved: videoGeneration.creditsReserved,
      creditsSettledAt: videoGeneration.creditsSettledAt,
    })
    .from(videoGeneration)
    .where(
      and(
        eq(videoGeneration.taskId, taskId),
        eq(videoGeneration.userId, session.user.id)
      )
    )
    .limit(1);
  if (!generation) {
    return Response.json(
      { error: 'Generation task not found.' },
      { status: 404 }
    );
  }

  const response = await fetch(
    `https://api.minimaxi.com/v2/query/video_generation/${taskId}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    }
  );
  const result = (await response.json().catch(() => null)) as {
    task?: {
      status: string;
      content?: { url?: string };
      usage?: Record<string, unknown>;
      error?: { code?: string | number; message?: string };
    };
    error?: { message?: string };
  } | null;
  if (!response.ok) {
    const message =
      result?.error?.message ?? 'MiniMax could not query this task.';
    return Response.json({ error: message }, { status: response.status });
  }

  const task = result?.task;
  if (task) {
    console.info('MiniMax generation status', {
      taskId,
      userId: session.user.id,
      status: task.status,
      hasOutput: Boolean(task.content?.url),
    });
    const terminal = ['succeeded', 'failed', 'cancelled'].includes(task.status);
    await db
      .update(videoGeneration)
      .set({
        status: task.status ?? 'unknown',
        providerOutputUrl: task.content?.url ?? null,
        usage: task.usage ?? null,
        errorCode: task.error?.code ? String(task.error.code) : null,
        errorMessage: task.error?.message ?? null,
        updatedAt: new Date(),
        completedAt: terminal ? new Date() : null,
      })
      .where(eq(videoGeneration.id, generation.id));

    if (terminal && !generation.creditsSettledAt) {
      const creditsCharged =
        task.status === 'succeeded'
          ? getH3ActualCredits({
              resolution: generation.resolution as '768P' | '2K',
              duration: generation.duration,
              usage: task.usage,
            })
          : 0;
      const refund = Math.max(0, generation.creditsReserved - creditsCharged);
      if (refund > 0) {
        await addCredits({
          userId: session.user.id,
          amount: refund,
          type: CREDIT_TRANSACTION_TYPE.REFUND,
          description:
            task.status === 'succeeded'
              ? `MiniMax H3 generation reserve adjustment: ${refund} credits`
              : `Refund: MiniMax H3 generation ${task.status}`,
        });
      }
      await db
        .update(videoGeneration)
        .set({
          creditsCharged,
          creditsSettledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(videoGeneration.id, generation.id));
    }

    if (generation.storageUrl && task.content) {
      task.content.url = generation.storageUrl;
    } else if (
      task.status === 'succeeded' &&
      task.content?.url &&
      !generation.storageKey
    ) {
      const sourceUrl = task.content.url;
      const archiveJob = archiveGeneratedVideo({
        generationId: generation.id,
        userId: session.user.id,
        taskId,
        sourceUrl,
      })
        .then(async (archived) => {
          if (!archived) return;
          await db
            .update(videoGeneration)
            .set({
              storageKey: archived.key,
              storageUrl: archived.url,
              updatedAt: new Date(),
            })
            .where(eq(videoGeneration.id, generation.id));
        })
        .catch((error) => {
          console.error('Failed to archive generated video to R2', error);
        });
      await keepArchiveJobAlive(archiveJob);
    }
  }
  return Response.json(result);
}
