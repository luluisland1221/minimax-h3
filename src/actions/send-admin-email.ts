'use server';

import { getDb } from '@/db';
import { outboundMail } from '@/db/schema';
import { getSession } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function sendAdminEmailAction(formData: FormData) {
  const session = await getSession();
  if (session?.user.role !== 'admin') throw new Error('Unauthorized');

  const to = String(formData.get('to') ?? '')
    .trim()
    .toLowerCase();
  const subject = String(formData.get('subject') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!isEmail(to) || !subject || !body) {
    throw new Error('Recipient, subject and message are required.');
  }

  const apiKey = process.env.PLUNK_SECRET_KEY;
  if (!apiKey) throw new Error('PLUNK_SECRET_KEY is not configured.');

  const id = crypto.randomUUID();
  const response = await fetch('https://next-api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `admin-compose-${id}`,
    },
    body: JSON.stringify({
      to,
      from: {
        name: 'MiniMax H3 Support',
        email: 'support@minimaxh3.pro',
      },
      reply: 'support@minimaxh3.pro',
      subject,
      body: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#21151d">${escapeHtml(body).replaceAll('\n', '<br>')}</div>`,
    }),
  });

  const responseBody = (await response.json().catch(() => null)) as {
    data?: { emails?: Array<{ email?: string }> };
    error?: { message?: string };
  } | null;
  if (!response.ok) {
    throw new Error(
      responseBody?.error?.message ?? `Plunk send failed (${response.status}).`
    );
  }

  const db = await getDb();
  await db.insert(outboundMail).values({
    id,
    plunkEmailId: responseBody?.data?.emails?.[0]?.email,
    toEmail: to,
    fromEmail: 'support@minimaxh3.pro',
    subject,
    body,
    sentByUserId: session.user.id,
  });

  revalidatePath('/admin/mail');
  redirect('/admin/mail?sent=1');
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
