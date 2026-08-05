'use server';

import { getDb } from '@/db';
import { inboundMail } from '@/db/schema';
import { getSession } from '@/lib/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function replyInboundMailAction(formData: FormData) {
  const session = await getSession();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');

  const id = String(formData.get('id') ?? '');
  const reply = String(formData.get('reply') ?? '').trim();
  if (!id || !reply) throw new Error('A reply is required.');

  const db = await getDb();
  const [mail] = await db
    .select()
    .from(inboundMail)
    .where(eq(inboundMail.id, id))
    .limit(1);
  if (!mail) throw new Error('Message not found.');

  const apiKey = process.env.PLUNK_SECRET_KEY;
  if (!apiKey) throw new Error('PLUNK_SECRET_KEY is not configured.');

  const response = await fetch('https://next-api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `reply-${mail.id}-${Date.now()}`,
    },
    body: JSON.stringify({
      to: mail.fromEmail,
      from: {
        name: 'Minimax H3 Support',
        email: 'support@minimaxh3.pro',
      },
      reply: 'support@minimaxh3.pro',
      subject: mail.subject.toLowerCase().startsWith('re:')
        ? mail.subject
        : `Re: ${mail.subject}`,
      body: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#21151d">${escapeHtml(reply).replaceAll('\n', '<br>')}</div>`,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Plunk reply failed (${response.status}): ${message}`);
  }

  await db
    .update(inboundMail)
    .set({
      status: 'replied',
      replyBody: reply,
      repliedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(inboundMail.id, id));

  revalidatePath('/admin/mail');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
