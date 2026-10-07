$files = @{}

$files["src/lib/auth.ts"] = @"
import { supabase } from './supabase';

export async function signUp(
  email: string,
  password: string,
  firstName: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName
      }
    }
  });
}

export async function signIn(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
}
"@

$files["src/app/create-account/page.tsx"] = @"
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
      router.push('/profile');
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
            <span>I confirm that I am 18 or older.</span>
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
"@

$files["src/app/login/page.tsx"] = @"
'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/discover');
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <Link href="/" className="form-brand">
          findafriend
        </Link>

        <h1>Log in</h1>

        <p className="form-subtitle">
          Welcome back.
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

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
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
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <Link href="/forgot-password" className="text-link">
          Forgot password?
        </Link>

        <div className="form-footer">
          Don't have an account?{' '}
          <Link href="/create-account">Create one</Link>
        </div>
      </div>
    </main>
  );
}
"@

$files["src/app/forgot-password/page.tsx"] = @"
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
          Enter your email and we'll send you a secure reset link.
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
"@

$files["src/app/reset-password/page.tsx"] = @"
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
"@

$files["src/app/logout/page.tsx"] = @"
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await signOut();
      router.push('/');
    }

    logout();
  }, [router]);

  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>
        <h1>Logging out...</h1>
      </div>
    </main>
  );
}
"@

$files["src/app/globals.css"] += @"

.form-error {
  padding: 11px 13px;
  border-radius: 8px;
  background: #fff0f0;
  border: 1px solid #f0caca;
  color: #9b0000;
  font-size: 13px;
  line-height: 1.4;
}

.form-success {
  padding: 11px 13px;
  border-radius: 8px;
  background: #f0fff5;
  border: 1px solid #c9ead5;
  color: #176b39;
  font-size: 13px;
  line-height: 1.4;
}

.primary-button:disabled {
  opacity: 0.55;
  cursor: wait;
}
"@

foreach ($path in $files.Keys) {
    $directory = Split-Path $path -Parent

    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force $directory | Out-Null
    }

    [IO.File]::WriteAllText(
        $path,
        $files[$path],
        (New-Object System.Text.UTF8Encoding($false))
    )
}

Write-Host ""
Write-Host "findafriend authentication foundation built successfully." -ForegroundColor Green
Write-Host "Created: signup, login, password reset, new password, logout, auth helpers." -ForegroundColor Green
Write-Host ""
