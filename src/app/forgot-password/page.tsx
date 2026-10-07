'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { sendPasswordReset } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    const { error: resetError } = await sendPasswordReset(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setMessage(
      'If an account exists for that email, a password reset email has been sent.'
    );

    setLoading(false);
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link href="/" className="form-brand">
          findafriend
        </Link>

        <h1>Forgot password?</h1>

        <p className="form-subtitle">
          Enter your email and we&apos;ll send you a secure reset link.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {message && (
            <div className="form-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <Link href="/login" className="text-link">
          Back to Log In
        </Link>
      </div>
    </main>
  );
}