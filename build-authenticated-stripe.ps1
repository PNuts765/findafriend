$files = @{}

$files["src/app/api/stripe/checkout/route.ts"] = @"
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

if (!stripeSecretKey) {
  throw new Error(
    'STRIPE_SECRET_KEY is not configured.'
  );
}

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration is missing.'
  );
}

const stripe =
  new Stripe(stripeSecretKey);

const supabase =
  createClient(
    supabaseUrl,
    supabasePublishableKey
  );

export async function POST() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        error:
          'You must be logged in to purchase Pro.'
      },
      {
        status: 401
      }
    );
  }

  const priceId =
    process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          'Stripe monthly price is not configured yet.'
      },
      {
        status: 503
      }
    );
  }

  const session =
    await stripe.checkout.sessions.create({
      mode: 'subscription',

      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],

      customer_email:
        user.email ?? undefined,

      client_reference_id:
        user.id,

      metadata: {
        findafriend_user_id:
          user.id
      },

      subscription_data: {
        metadata: {
          findafriend_user_id:
            user.id
        }
      },

      success_url:
        `${appUrl}/pro?checkout=success`,

      cancel_url:
        `${appUrl}/pro?checkout=canceled`,

      allow_promotion_codes: true
    });

  return NextResponse.json({
    url: session.url
  });
}

export const runtime = 'nodejs';
"@

$files["src/components/StripeCheckoutButton.tsx"] = @"
'use client';

import {
  useState
} from 'react';

import {
  CreditCard
} from 'lucide-react';

export default function StripeCheckoutButton() {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function startCheckout() {
    setLoading(true);
    setError('');

    try {
      const response =
        await fetch(
          '/api/stripe/checkout',
          {
            method: 'POST'
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
          'Unable to start checkout.'
        );

        setLoading(false);
        return;
      }

      if (!data.url) {
        setError(
          'Stripe did not return a checkout URL.'
        );

        setLoading(false);
        return;
      }

      window.location.href =
        data.url;
    } catch {
      setError(
        'Unable to connect to Stripe.'
      );

      setLoading(false);
    }
  }

  return (
    <div className="stripe-checkout-wrapper">
      <button
        type="button"
        className="primary-button pro-button"
        onClick={startCheckout}
        disabled={loading}
      >
        <CreditCard size={18} />

        {loading
          ? 'Opening secure checkout...'
          : 'Get Pro'}
      </button>

      {error && (
        <div className="form-error stripe-error">
          {error}
        </div>
      )}
    </div>
  );
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
  getProStatus
} from '@/lib/pro';

import {
  useEffect,
  useState
} from 'react';

import StripeCheckoutButton from '@/components/StripeCheckoutButton';

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
        </div>

        <StripeCheckoutButton />

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

$files[".env.example"] += @"

# Public application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Price ID for the $5.99/month Pro plan
STRIPE_MONTHLY_PRICE_ID=
"@

$files["src/app/globals.css"] += @"

.stripe-checkout-wrapper {
  display: grid;
  gap: 10px;
}

.stripe-error {
  margin: 0;
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
Write-Host "findafriend authenticated Stripe checkout built successfully." -ForegroundColor Green
Write-Host "Created: authenticated checkout session with account ID metadata." -ForegroundColor Green
Write-Host "Created: secure server checkout endpoint." -ForegroundColor Green
Write-Host "Created: Stripe checkout button." -ForegroundColor Green
Write-Host "Stripe Price ID still needs to be configured." -ForegroundColor Yellow
Write-Host ""
