'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'weddings', label: 'Wedding Photography' },
  { value: 'portraits', label: 'Executive Portrait Session' },
  { value: 'content', label: 'Brand Content' },
  { value: 'other', label: 'Other enquiry' },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    message: '',
  });

  useEffect(() => {
    const svc = searchParams.get('service') || '';
    if (svc) setForm((f) => ({ ...f, service: svc }));
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Fotogracia Enquiry — ${form.service || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nDate/Timeframe: ${form.date || 'Not specified'}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info@fotogracia.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
      <div>
        <label className="label text-muted block mb-2" htmlFor="name">Your name</label>
        <input
          id="name" name="name" type="text" required
          value={form.name} onChange={handleChange}
          placeholder="First & last name"
          className="w-full border-b border-ink/20 bg-transparent pb-3 text-sm text-ink placeholder:text-muted/50 focus:border-ink transition-colors"
        />
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="email">Email address</label>
        <input
          id="email" name="email" type="email" required
          value={form.email} onChange={handleChange}
          placeholder="you@example.com"
          className="w-full border-b border-ink/20 bg-transparent pb-3 text-sm text-ink placeholder:text-muted/50 focus:border-ink transition-colors"
        />
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="service">I'm interested in</label>
        <select
          id="service" name="service"
          value={form.service} onChange={handleChange}
          className="w-full border-b border-ink/20 bg-transparent pb-3 text-sm text-ink focus:border-ink transition-colors appearance-none cursor-pointer"
        >
          {serviceOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="date">
          Celebration date or timeframe{' '}
          <span className="normal-case font-normal tracking-normal text-xs opacity-60">(optional)</span>
        </label>
        <input
          id="date" name="date" type="text"
          value={form.date} onChange={handleChange}
          placeholder="e.g. October 2026, or 'flexible'"
          className="w-full border-b border-ink/20 bg-transparent pb-3 text-sm text-ink placeholder:text-muted/50 focus:border-ink transition-colors"
        />
      </div>

      <div>
        <label className="label text-muted block mb-2" htmlFor="message">Tell us about your celebration or project</label>
        <textarea
          id="message" name="message" rows={4}
          value={form.message} onChange={handleChange}
          placeholder="The more you share, the better we can serve you — venue, vision, aesthetic preferences, and anything else that feels relevant."
          className="w-full border-b border-ink/20 bg-transparent pb-3 text-sm text-ink placeholder:text-muted/50 focus:border-ink transition-colors resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center border border-ink text-ink px-10 py-4 label hover:bg-ink hover:text-cream transition-colors"
        >
          Send Message
        </button>
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
              Tell me a little about your wedding, portrait session, or project. I\'ll get back to you within 48 hours.
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
            <div className="space-y-6">
              <div>
                <p className="label text-muted mb-1">Email</p>
                <a href="mailto:info@fotogracia.com" className="text-sm text-ink hover:opacity-50 transition-opacity link-underline">
                  info@fotogracia.com
                </a>
              </div>
              <div>
                <p className="label text-muted mb-1">Instagram</p>
                <a href="https://instagram.com/_fotogracia_" target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:opacity-50 transition-opacity link-underline">
                  @_fotogracia_
                </a>
              </div>
              <div>
                <p className="label text-muted mb-1">Based in</p>
                <p className="text-sm text-ink">Toronto — available worldwide</p>
              </div>
              <div>
                <p className="label text-muted mb-1">Response time</p>
                <p className="text-sm text-ink">Within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
