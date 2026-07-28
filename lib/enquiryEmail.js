// Extension included so plain `node` can import this too (see scripts/xss-check.mjs).
import { serviceLabels, formatTimeframe } from './contactSchema.js';

/**
 * Encode text so it can never be read as markup. This is the single control
 * that stops enquiry text becoming executable HTML in the inbox — validation
 * does not do it, and is not supposed to.
 */
export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Build the enquiry email from already-validated data.
 * Every interpolated value passes through escapeHtml first.
 */
export function buildEnquiryEmail(data) {
  const { name, email, service, message } = data;
  const serviceLabel = serviceLabels[service] || 'General enquiry';
  const timeframe = formatTimeframe(data);

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Service', serviceLabel],
    ['Date / timeframe', timeframe],
  ];

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a">
      <h2 style="font-weight:400;letter-spacing:.02em">New enquiry — ${escapeHtml(serviceLabel)}</h2>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:2px 16px 2px 0;color:#777">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
          )
          .join('')}
      </table>
      <p style="color:#777;margin:0 0 4px">Message</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
    </div>
  `;

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    message,
  ].join('\n');

  // Subject is a header, not markup — it needs no HTML escaping, but the
  // schema has already stripped CR/LF so it cannot inject extra headers.
  const subject = `Fotogracia Enquiry — ${serviceLabel} — ${name}`;

  return { subject, html, text, replyTo: email };
}
