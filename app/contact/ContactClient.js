'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactSchema,
  contactDefaults,
  serviceOptions,
  serviceValues,
  monthsForYear,
  yearOptions,
} from '@/lib/contactSchema';

const fieldClass =
  'w-full border-b bg-transparent pb-3 text-sm text-ink placeholder:text-muted/50 transition-colors';
const borderFor = (hasError) =>
  hasError ? 'border-red-400 focus:border-red-500' : 'border-ink/20 focus:border-ink';

const contactDetails = [
  {
    term: 'Email',
    value: 'info@fotogracia.com',
    href: 'mailto:info@fotogracia.com',
  },
  {
    term: 'Instagram',
    value: '@_fotogracia_',
    href: 'https://instagram.com/_fotogracia_',
    external: true,
  },
  { term: 'Based in', value: 'Toronto — available worldwide' },
  { term: 'Response time', value: 'Within 48 hours' },
];

function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-xs text-red-500 mt-2">{error.message}</p>;
}

function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('idle'); // idle | sent
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
    mode: 'onBlur',
  });

  const isFlexible = watch('flexible');
  const selectedYear = watch('year');
  const selectedMonth = watch('month');

  // Years are fixed for the life of the page; months depend on the chosen year.
  const years = useMemo(() => yearOptions(), []);
  const months = useMemo(() => monthsForYear(selectedYear), [selectedYear]);

  useEffect(() => {
    const svc = searchParams.get('service') || '';
    // Only honour a value the select actually offers.
    if (serviceValues.includes(svc)) setValue('service', svc);
  }, [searchParams, setValue]);

  // Switching to the current year can strip out an already-chosen past month.
  useEffect(() => {
    if (selectedMonth && !months.some((m) => m.value === selectedMonth)) {
      setValue('month', '', { shouldValidate: false });
    }
  }, [months, selectedMonth, setValue]);

  // Ticking "flexible" clears the date so the two can never disagree.
  useEffect(() => {
    if (isFlexible) {
      setValue('month', '', { shouldValidate: false });
      setValue('year', '', { shouldValidate: false });
    }
  }, [isFlexible, setValue]);

  const onSubmit = async (values) => {
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('sent');
      reset(contactDefaults);
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="max-w-lg border-t border-ink/20 pt-8">
        <p className="label text-muted mb-3">Message sent</p>
        <p className="text-sm text-ink-light leading-relaxed mb-8">
          Thank you — your enquiry is on its way. I&apos;ll be in touch within 48 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="label text-ink link-underline hover:opacity-50 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 max-w-lg">
      <div>
        <label className="label text-muted block mb-2" htmlFor="name">Your name</label>
        <input
          id="name" type="text" {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
          placeholder="First & last name"
          className={`${fieldClass} ${borderFor(errors.name)}`}
        />
        <FieldError error={errors.name} />
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="email">Email address</label>
        <input
          id="email" type="email" {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          placeholder="you@example.com"
          className={`${fieldClass} ${borderFor(errors.email)}`}
        />
        <FieldError error={errors.email} />
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="service">I&apos;m interested in</label>
        <select
          id="service" {...register('service')}
          aria-invalid={errors.service ? 'true' : 'false'}
          className={`${fieldClass} ${borderFor(errors.service)} appearance-none cursor-pointer`}
        >
          {serviceOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <FieldError error={errors.service} />
      </div>

      <fieldset>
        <legend className="label text-muted mb-2">
          Celebration date or timeframe{' '}
          <span className="normal-case font-normal tracking-normal text-xs opacity-60">(optional)</span>
        </legend>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="sr-only" htmlFor="month">Month</label>
            <select
              id="month" {...register('month')} disabled={isFlexible}
              aria-invalid={errors.month ? 'true' : 'false'}
              className={`${fieldClass} ${borderFor(errors.month)} appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="">Month</option>
              {months.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="year">Year</label>
            <select
              id="year" {...register('year')} disabled={isFlexible}
              aria-invalid={errors.year ? 'true' : 'false'}
              className={`${fieldClass} ${borderFor(errors.year)} appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <FieldError error={errors.month || errors.year} />

        <label htmlFor="flexible" className="flex items-center gap-3 mt-4 cursor-pointer group w-fit">
          <input
            id="flexible" type="checkbox" {...register('flexible')}
            className="h-4 w-4 shrink-0 accent-ink cursor-pointer"
          />
          <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
            My date is flexible
          </span>
        </label>
      </fieldset>

      <div>
        <label className="label text-muted block mb-2" htmlFor="message">Tell us about your celebration or project</label>
        <textarea
          id="message" rows={4} {...register('message')}
          aria-invalid={errors.message ? 'true' : 'false'}
          placeholder="The more you share, the better we can serve you — venue, vision, aesthetic preferences, and anything else that feels relevant."
          className={`${fieldClass} ${borderFor(errors.message)} resize-none`}
        />
        <FieldError error={errors.message} />
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company" type="text" tabIndex={-1} autoComplete="off"
          {...register('company')}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-500 mt-4">{error}</p>
        )}
      </div>
    </form>
  );
}

export default function ContactClient() {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <p className="label text-muted mb-3">Get in touch</p>
        <h1 className="heading-display text-5xl md:text-6xl text-ink">Let&apos;s talk.</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left: form */}
          <div>
            <p className="text-sm text-ink-light leading-relaxed mb-10 max-w-sm">
              Tell me a little about your wedding, portrait session, or project. I'll get back to you within 48 hours.
            </p>
            <Suspense fallback={<div className="label text-muted">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>

          {/* Right: contact info + image */}
          <div>
            <Image
              src="/images/weddings/w-27.jpg"
              alt="Contact"
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto mb-10"
            />
            <dl className="border-t border-ink/15">
              {contactDetails.map(({ term, value, href, external }) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-8 py-5 border-b border-ink/15"
                >
                  <dt className="label text-muted shrink-0">{term}</dt>
                  <dd className="text-sm text-ink text-right">
                    {href ? (
                      <a
                        href={href}
                        {...(external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="link-underline hover:opacity-60 transition-opacity"
                      >
                        {value}
                        {external && (
                          <span aria-hidden="true" className="ml-1 opacity-40">↗</span>
                        )}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
