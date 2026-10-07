'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Your new password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password
      });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage('Your password has been changed.');

    setTimeout(() => {
      router.push('/login');
    }, 1200);
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link href="/" className="form-brand">
          findafriend
        </Link>

        <h1>Create new password</h1>

        <p className="form-subtitle">
          Choose a new password for your account.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={6}
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
            {loading ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      </div>
    </main>
  );
}