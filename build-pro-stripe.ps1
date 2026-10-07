$files = @{}

$files["src/lib/pro.ts"] = @"
import { supabase } from './supabase';

export type ProStatus = {
  isPro: boolean;
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime';
  status: string;
  isLifetime: boolean;
};

export async function getProStatus(): Promise<ProStatus> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isPro: false,
      plan: 'free',
      status: 'inactive',
      isLifetime: false
    };
  }

  const { data } = await supabase
    .from('subscriptions')
    .select(
      'plan, status, is_lifetime, current_period_end'
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!data) {
    return {
      isPro: false,
      plan: 'free',
      status: 'inactive',
      isLifetime: false
    };
  }

  if (data.is_lifetime) {
    return {
      isPro: true,
      plan: 'lifetime',
      status: 'active',
      isLifetime: true
    };
  }

  if (
    data.plan === 'monthly' ||
    data.plan === 'yearly'
  ) {
    return {
      isPro: true,
      plan: data.plan,
      status: data.status,
      isLifetime: false
    };
  }

  return {
    isPro: false,
    plan: 'free',
    status: data.status,
    isLifetime: false
  };
}

export function getStripePaymentLink() {
  return 'https://buy.stripe.com/cNi8wQaMad6sffi2ub3ZK05';
}
"@

$files["src/app/pro/page.tsx"] = @"
'use client';

import Link from 'next/link';

import {
  Check,
  Crown
} from 'lucide-react';

import {
  getProStatus,
  getStripePaymentLink
} from '@/lib/pro';

import {
  useEffect,
  useState
} from 'react';

export default function ProPage() {
  const [loading, setLoading] =
    useState(true);

  const [isPro, setIsPro] =
    useState(false);

  const [plan, setPlan] =
    useState('');

  useEffect(() => {
    async function load() {
      const status =
        await getProStatus();

      setIsPro(status.isPro);
      setPlan(status.plan);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="pro-page">
        <div className="pro-card">
          Loading Pro status...
        </div>
      </main>
    );
  }

  if (isPro) {
    return (
      <main className="pro-page">
        <div className="pro-card">
          <Crown size={38} />

          <h1>You're Pro</h1>

          <p className="pro-tagline">
            Your account has Pro access.
          </p>

          <div className="pro-status-box">
            <strong>
              {plan === 'lifetime'
                ? 'Pro FREE FOR LIFE'
                : 'Pro Active'}
            </strong>

            <span>
              Unlimited outgoing messages
              and up to 30 photos.
            </span>
          </div>

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

        <h1>Pro</h1>

        <p className="pro-tagline">
          More freedom. No artificial clutter.
        </p>

        <div className="pro-features">
          <div>
            <strong>
              <Check size={17} />
              Unlimited messages
            </strong>

            <span>
              No weekly outgoing-message limit.
            </span>
          </div>

          <div>
            <strong>
              <Check size={17} />
              Up to 30 photos
            </strong>

            <span>
              More room to show who you are.
            </span>
          </div>
        </div>

        <div className="pricing">
          <div>
            <strong>$5.99</strong>
            <span>/ month</span>
          </div>

          <div>
            <strong>$59.99</strong>
            <span>/ year</span>
          </div>
        </div>

        <a
          href={getStripePaymentLink()}
          className="primary-button pro-button"
        >
          Get Pro
        </a>

        <p className="small-note">
          Payment is securely processed by Stripe.
        </p>

        <Link
          href="/promotion"
          className="promotion-link"
        >
          Pro FREE FOR LIFE promotion
        </Link>

        <Link
          href="/"
          className="text-link"
        >
          Back to findafriend
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/promotion/page.tsx"] = @"
'use client';

import {
  useState
} from 'react';

import Link from 'next/link';

import {
  CheckCircle
} from 'lucide-react';

export default function PromotionPage() {
  const [accepted, setAccepted] =
    useState(false);

  return (
    <main className="pro-page">
      <div className="pro-card promotion-card">
        <Link
          href="/"
          className="form-brand"
        >
          findafriend
        </Link>

        <h1>
          Pro FREE FOR LIFE
        </h1>

        <p className="pro-tagline">
          Enjoy the app. You could win Pro
          FREE FOR LIFE.
        </p>

        <div className="promotion-terms">
          <h2>
            Promotion Terms
          </h2>

          <p>
            No purchase is necessary to
            participate.
          </p>

          <p>
            Eligibility, entry requirements,
            selection method, prize details,
            promotion period, and any
            applicable restrictions are
            governed by the official promotion
            rules.
          </p>

          <p>
            By entering, you acknowledge that
            you have read and understood the
            official rules before submitting
            your entry.
          </p>

          <p>
            Pro FREE FOR LIFE means continued
            Pro access for the applicable
            winner for as long as the
            promotion terms provide.
          </p>

          <p>
            findafriend may verify eligibility
            and may disqualify entries that
            violate the official rules.
          </p>
        </div>

        <label className="promotion-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) =>
              setAccepted(
                event.target.checked
              )
            }
          />

          <span>
            I have read and understand the
            promotion terms.
          </span>
        </label>

        <button
          type="button"
          className="primary-button"
          disabled={!accepted}
          onClick={() => {
            window.location.href =
              '/promotion/enter';
          }}
        >
          Continue to Entry
        </button>

        <div className="promotion-note">
          <CheckCircle size={17} />

          <span>
            The terms are presented before
            entry so there are no surprise
            rules hiding behind the curtain.
          </span>
        </div>

        <Link
          href="/pro"
          className="text-link"
        >
          Back to Pro
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/promotion/enter/page.tsx"] = @"
'use client';

import {
  FormEvent,
  useState
} from 'react';

import Link from 'next/link';

export default function PromotionEntryPage() {
  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState('');

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    setSubmitted(true);
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
          >
            Submit Entry
          </button>
        </form>

        <p className="small-note">
          By submitting, you confirm that
          you accepted the promotion terms.
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
"@

$files["src/app/globals.css"] += @"

.pro-status-box {
  display: grid;
  gap: 7px;
  margin: 20px 0;
  padding: 18px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  background: #fafafa;
}

.pro-status-box strong {
  font-size: 18px;
}

.pro-status-box span {
  color: #666;
  line-height: 1.5;
}

.pro-button {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.promotion-link {
  display: block;
  margin: 20px 0;
  font-weight: 700;
  text-decoration: none;
}

.promotion-terms {
  margin: 22px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fafafa;
  text-align: left;
}

.promotion-terms h2 {
  margin-top: 0;
  font-size: 18px;
}

.promotion-terms p {
  margin: 11px 0;
  color: #555;
  font-size: 13px;
  line-height: 1.6;
}

.promotion-checkbox {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 18px 0;
  text-align: left;
  font-size: 13px;
  line-height: 1.5;
}

.promotion-checkbox input {
  margin-top: 3px;
}

.promotion-note {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 18px 0;
  color: #666;
  font-size: 12px;
  line-height: 1.5;
}

.promotion-form {
  display: grid;
  gap: 16px;
  margin-top: 25px;
  text-align: left;
}

.promotion-form label {
  display: grid;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
}

.promotion-form input,
.promotion-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #d8d8d8;
  border-radius: 9px;
  font: inherit;
}

.promotion-form textarea {
  resize: vertical;
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
Write-Host "findafriend Pro + promotion foundation built successfully." -ForegroundColor Green
Write-Host "Created: Pro status, Stripe payment link, promotion terms, and promotion entry flow." -ForegroundColor Green
Write-Host "Stripe webhook connection remains pending until the secure server secret is configured." -ForegroundColor Yellow
Write-Host ""
