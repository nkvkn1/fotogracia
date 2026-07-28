import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contactSchema';
import { buildEnquiryEmail } from '@/lib/enquiryEmail';

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'info@fotogracia.com';
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_FROM_EMAIL is not set.');
    return NextResponse.json(
      { error: 'Email is not configured on the server.' },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // The client validates with this same schema, but that is only a courtesy —
  // this parse is the one that actually counts. It both validates and returns
  // the sanitised values (control characters stripped, whitespace collapsed).
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Please check the form and try again.' },
      { status: 400 }
    );
  }

  const { company } = parsed.data;

  // Honeypot: real people leave this hidden field empty. Answer as though it
  // succeeded so bots get no signal.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const { subject, html, text, replyTo } = buildEnquiryEmail(parsed.data);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error:', res.status, detail);
      return NextResponse.json({ error: 'Could not send your message.' }, { status: 502 });
    }
  } catch (err) {
    console.error('Resend request failed:', err);
    return NextResponse.json({ error: 'Could not send your message.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
