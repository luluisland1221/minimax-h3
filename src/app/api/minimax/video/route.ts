import { addCredits, consumeCredits } from '@/credits/credits';
import { CREDIT_TRANSACTION_TYPE } from '@/credits/types';
import { getDb } from '@/db';
import { videoGeneration } from '@/db/schema';
import { auth } from '@/lib/auth';
import { getH3ReservedCredits } from '@/lib/minimax-h3-pricing';
import { z } from 'zod';

const requestSchema = z
  .object({
    mode: z.enum(['text', 'frames', 'reference']),
    prompt: z.string().trim().min(1).max(40000),
    resolution: z.enum(['768P', '2K']),
    duration: z.number().int().min(4).max(15),
    ratio: z.enum(['adaptive', '21:9', '16:9', '4:3', '1:1', '3:4', '9:16']),
    firstFrameUrl: z.string().url().optional().or(z.literal('')),
    lastFrameUrl: z.string().url().optional().or(z.literal('')),
    referenceImageUrls: z.array(z.string().url()).max(9).default([]),
    referenceVideoUrls: z.array(z.string().url()).max(3).default([]),
    referenceAudioUrls: z.array(z.string().url()).max(3).default([]),
    aigcWatermark: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'frames' && !data.firstFrameUrl && !data.lastFrameUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['firstFrameUrl'],
        message: 'Add a first or last frame URL.',
      });
    }
    if (
      data.mode === 'reference' &&
      data.referenceImageUrls.length + data.referenceVideoUrls.length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['referenceImageUrls'],
        message: 'Add at least one reference URL.',
      });
    }
  });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return Response.json(
      { error: 'Please sign in to generate a video.' },
      { status: 401 }
    );

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey)
    return Response.json(
      { error: 'MiniMax API is not configured.' },
      { status: 500 }
    );

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null)
  );
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const reservedCredits = getH3ReservedCredits({
    resolution: input.resolution,
    duration: input.duration,
    referenceVideoCount: input.referenceVideoUrls.length,
    referenceImageCount: input.referenceImageUrls.length,
  });

  try {
    await consumeCredits({
      userId: session.user.id,
      amount: reservedCredits,
      description: `MiniMax H3 ${input.resolution} ${input.duration}s generation (reserved)`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Insufficient credits') {
      return Response.json(
        {
          error: `Insufficient credits. This generation requires ${reservedCredits} credits.`,
          requiredCredits: reservedCredits,
        },
        { status: 402 }
      );
    }
    throw error;
  }
  const content: Array<Record<string, unknown>> = [
    { type: 'text', text: input.prompt },
  ];
  if (input.mode === 'frames') {
    if (input.firstFrameUrl)
      content.push({
        type: 'image_url',
        image_url: { url: input.firstFrameUrl },
        role: 'first_frame',
      });
    if (input.lastFrameUrl)
      content.push({
        type: 'image_url',
        image_url: { url: input.lastFrameUrl },
        role: 'last_frame',
      });
  }
  if (input.mode === 'reference') {
    for (const url of input.referenceImageUrls)
      content.push({
        type: 'image_url',
        image_url: { url },
        role: 'reference_image',
      });
    for (const url of input.referenceVideoUrls)
      content.push({
        type: 'video_url',
        video_url: { url },
        role: 'reference_video',
      });
    for (const url of input.referenceAudioUrls)
      content.push({
        type: 'audio_url',
        audio_url: { url },
        role: 'reference_audio',
      });
  }

  let response: Response;
  try {
    response = await fetch('https://api.minimaxi.com/v2/video_generation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-H3',
        content,
        resolution: input.resolution,
        duration: input.duration,
        ratio: input.mode === 'frames' ? 'adaptive' : input.ratio,
        aigc_watermark: input.aigcWatermark,
      }),
    });
  } catch (error) {
    await addCredits({
      userId: session.user.id,
      amount: reservedCredits,
      type: CREDIT_TRANSACTION_TYPE.REFUND,
      description: 'Refund: MiniMax request could not be sent',
    });
    throw error;
  }
  const result = (await response.json().catch(() => null)) as {
    task_id?: string;
    error?: { message?: string };
  } | null;
  if (!response.ok) {
    await addCredits({
      userId: session.user.id,
      amount: reservedCredits,
      type: CREDIT_TRANSACTION_TYPE.REFUND,
      description: 'Refund: MiniMax did not create the generation task',
    });
    const message =
      result?.error?.message ?? 'MiniMax could not create the generation task.';
    return Response.json({ error: message }, { status: response.status });
  }
  if (!result?.task_id) {
    await addCredits({
      userId: session.user.id,
      amount: reservedCredits,
      type: CREDIT_TRANSACTION_TYPE.REFUND,
      description: 'Refund: MiniMax returned an invalid task response',
    });
    return Response.json(
      { error: 'MiniMax returned an invalid task response.' },
      { status: 502 }
    );
  }

  const db = await getDb();
  await db.insert(videoGeneration).values({
    id: crypto.randomUUID(),
    taskId: String(result.task_id),
    userId: session.user.id,
    mode: input.mode,
    prompt: input.prompt,
    resolution: input.resolution,
    duration: input.duration,
    ratio: input.mode === 'frames' ? 'adaptive' : input.ratio,
    aigcWatermark: input.aigcWatermark,
    inputAssets: {
      firstFrameUrl: input.firstFrameUrl || undefined,
      lastFrameUrl: input.lastFrameUrl || undefined,
      referenceImageUrls: input.referenceImageUrls,
      referenceVideoUrls: input.referenceVideoUrls,
      referenceAudioUrls: input.referenceAudioUrls,
    },
    creditsReserved: reservedCredits,
  });
  console.info('MiniMax generation created', {
    taskId: result.task_id,
    userId: session.user.id,
    mode: input.mode,
    resolution: input.resolution,
    duration: input.duration,
    creditsReserved: reservedCredits,
  });
  return Response.json({ ...result, credits_reserved: reservedCredits });
}
