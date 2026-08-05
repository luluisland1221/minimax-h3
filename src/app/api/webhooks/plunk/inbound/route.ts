import { getDb } from '@/db';
import { inboundMail } from '@/db/schema';

export async function POST(request: Request) {
  const webhookSecret = process.env.PLUNK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json(
      { error: 'Webhook is not configured.' },
      { status: 503 }
    );
  }

  const authorization = request.headers.get('authorization');
  if (authorization !== `Bearer ${webhookSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const event = extractEvent(payload);
  const messageId = String(event.messageId ?? '');
  const fromEmail = String(event.from ?? '');
  const toEmail = String(event.to ?? 'support@minimaxh3.pro');
  if (!messageId || !fromEmail) {
    return Response.json(
      { error: 'Invalid inbound email payload.' },
      { status: 400 }
    );
  }

  const spamVerdict = String(event.spamVerdict ?? 'UNKNOWN');
  const virusVerdict = String(event.virusVerdict ?? 'UNKNOWN');
  if (spamVerdict === 'FAIL' || virusVerdict === 'FAIL') {
    return Response.json({ accepted: false, filtered: true });
  }

  const db = await getDb();
  await db
    .insert(inboundMail)
    .values({
      id: crypto.randomUUID(),
      messageId,
      fromEmail,
      toEmail,
      subject: String(event.subject ?? '(No subject)'),
      body: String(event.body ?? ''),
      spamVerdict,
      virusVerdict,
      receivedAt: event.timestamp
        ? new Date(String(event.timestamp))
        : new Date(),
    })
    .onConflictDoNothing({ target: inboundMail.messageId });

  return Response.json({ accepted: true });
}

function extractEvent(payload: Record<string, unknown>) {
  const data = payload.data;
  if (data && typeof data === 'object') return data as Record<string, unknown>;
  const event = payload.event;
  if (event && typeof event === 'object') {
    const eventData = (event as Record<string, unknown>).data;
    if (eventData && typeof eventData === 'object') {
      return eventData as Record<string, unknown>;
    }
  }
  return payload;
}
