'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';

export default function CreateAccountPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isAdult, setIsAdult] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!isAdult) {
      setError('You must confirm that you are 18 or older.');
      return;
    }

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }

    if (!birthDate) {
      setError('Please enter your birthday.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await signUp(
      email,
      password,
      firstName.trim()
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push('/profile/studio');
      return;
    }

    setMessage(
      'Account created. Check your email to confirm your account, then log in.'
    );

    setLoading(false);
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link href="/" className="form-brand">
          findafriend
        </Link>

        <h1>Create account</h1>

        <p className="form-subtitle">
          Join people around you.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            First name
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
              required
            />
          </label>

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

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              minLength={6}
              required
            />
          </label>

          <label>
            Birthday
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(event) => setIsAdult(event.target.checked)}
              required
            />
            <span>I confirm that I am 18+ years old.</span>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{' '}
          <Link href="/login">Log in</Link>
        </div>
      </div>
    </main>
  );
}