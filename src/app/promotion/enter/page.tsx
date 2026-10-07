'use client';

import {
  FormEvent,
  useState
} from 'react';

import Link from 'next/link';

import {
  createPromotionEntry
} from '@/lib/data';

export default function PromotionEntryPage() {
  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const result =
        await createPromotionEntry();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your entry right now.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="pro-page">
        <div className="pro-card">
          <h1>
            Entry received
          </h1>

          <p className="pro-tagline">
            Your promotion entry has been
            recorded for the current
            promotion period.
          </p>

          <Link
            href="/"
            className="primary-button"
          >
            Back to findafriend
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pro-page">
      <div className="pro-card">
        <Link
          href="/"
          className="form-brand"
        >
          findafriend
        </Link>

        <h1>
          Enter Promotion
        </h1>

        <p className="pro-tagline">
          One entry per account. Pro FREE
          FOR LIFE is awarded according to
          the official promotion rules.
        </p>

        <form
          className="promotion-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Why do you enjoy findafriend?

            <textarea
              required
              maxLength={500}
              rows={5}
              placeholder="Tell us..."
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? 'Submitting...'
              : 'Submit Entry'}
          </button>
        </form>

        <p className="small-note">
          Your entry is tied to your
          findafriend account. Submitting
          again does not create duplicate
          entries.
        </p>

        <Link
          href="/promotion"
          className="text-link"
        >
          Back to Promotion Terms
        </Link>
      </div>
    </main>
  );
}