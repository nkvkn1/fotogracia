import { z } from 'zod';

export const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'weddings', label: 'Wedding Photography' },
  { value: 'portraits', label: 'Executive Portrait Session' },
  { value: 'content', label: 'Brand Content' },
  { value: 'other', label: 'Other enquiry' },
];

export const serviceValues = serviceOptions
  .map((o) => o.value)
  .filter(Boolean);

export const serviceLabels = Object.fromEntries(
  serviceOptions.filter((o) => o.value).map((o) => [o.value, o.label])
);

export const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, i) => ({ value: String(i + 1), label }));

export const monthValues = monthOptions.map((m) => m.value);

export const monthLabels = Object.fromEntries(
  monthOptions.map((m) => [m.value, m.label])
);

/** How many years ahead the year dropdown offers, including the current one. */
export const YEAR_SPAN = 5;

/** A month is identified by year*12 + (month-1) so comparisons are simple. */
const monthIndex = (year, month) => Number(year) * 12 + (Number(month) - 1);

const currentMonthIndex = (now = new Date()) =>
  now.getFullYear() * 12 + now.getMonth();

/** Years offered by the dropdown, oldest first. */
export const yearOptions = (now = new Date()) =>
  Array.from({ length: YEAR_SPAN }, (_, i) => String(now.getFullYear() + i));

/** Months selectable for a given year — the past is trimmed off. */
export const monthsForYear = (year, now = new Date()) => {
  if (!year || Number(year) > now.getFullYear()) return monthOptions;
  if (Number(year) < now.getFullYear()) return [];
  return monthOptions.filter((m) => Number(m.value) - 1 >= now.getMonth());
};

/** The human-readable timeframe used in the email. */
export const formatTimeframe = ({ flexible, month, year }) => {
  if (flexible) return 'Flexible';
  if (month && year) return `${monthLabels[month]} ${year}`;
  return 'Not specified';
};

/**
 * Drop ASCII control characters. Newlines survive only when allowed —
 * that is what keeps CR/LF out of the email subject line.
 */
const stripControl = (value, keepNewlines, replacement = '') =>
  Array.from(String(value ?? ''))
    .map((ch) => {
      const code = ch.codePointAt(0);
      if (code === 10 && keepNewlines) return ch;
      return code > 31 && code !== 127 ? ch : replacement;
    })
    .join('');

/** Collapse a value that must stay on one line. */
const singleLine = (value) =>
  stripControl(value, false, ' ').replace(/\s+/g, ' ').trim();

/** Keep newlines — the message body is meant to be multi-line. */
const multiLine = (value) =>
  stripControl(String(value ?? '').replace(/\r\n?/g, '\n'), true)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const contactSchema = z.object({
  name: z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(1, 'Please enter your name.')
        .max(100, 'Please keep your name under 100 characters.')
    ),

  email: z
    .string()
    .transform((v) => singleLine(v).toLowerCase())
    .pipe(
      z
        .string()
        .min(1, 'Please enter your email address.')
        .max(200, 'That email address is too long.')
        .pipe(z.email('Please enter a valid email address.'))
    ),

  service: z
    .union([z.literal(''), z.enum(serviceValues)])
    .optional()
    .default(''),

  flexible: z.boolean().optional().default(false),

  month: z
    .union([z.literal(''), z.enum(monthValues)])
    .optional()
    .default(''),

  year: z
    .union([z.literal(''), z.string().regex(/^\d{4}$/)])
    .optional()
    .default(''),

  message: z
    .string()
    .transform(multiLine)
    .pipe(
      z
        .string()
        .min(10, 'Please tell us a little more — at least 10 characters.')
        .max(5000, 'Please keep your message under 5000 characters.')
    ),

  // Honeypot. Real people never see this field, so it must stay empty.
  company: z.string().optional().default(''),
})
  .superRefine((data, ctx) => {
    // "Flexible" wins outright — any month/year alongside it is ignored.
    if (data.flexible) return;

    // The timeframe stays optional: leaving both blank is fine.
    if (!data.month && !data.year) return;

    if (!data.month) {
      ctx.addIssue({
        code: 'custom',
        path: ['month'],
        message: 'Please pick a month, or tick “My date is flexible”.',
      });
      return;
    }
    if (!data.year) {
      ctx.addIssue({
        code: 'custom',
        path: ['year'],
        message: 'Please pick a year, or tick “My date is flexible”.',
      });
      return;
    }

    const now = new Date();
    if (Number(data.year) > now.getFullYear() + YEAR_SPAN - 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['year'],
        message: 'Please choose a year within the next few years.',
      });
      return;
    }
    if (monthIndex(data.year, data.month) < currentMonthIndex(now)) {
      ctx.addIssue({
        code: 'custom',
        path: ['month'],
        message: 'Please choose this month or later.',
      });
    }
  })
  // Normalise once validation has passed, so consumers get a clean shape.
  .transform((data) => ({
    ...data,
    month: data.flexible ? '' : data.month,
    year: data.flexible ? '' : data.year,
  }));

export const contactDefaults = {
  name: '',
  email: '',
  service: '',
  flexible: false,
  month: '',
  year: '',
  message: '',
  company: '',
};
