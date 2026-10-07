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

import StripeCheckoutButton
  from '@/components/StripeCheckoutButton';

type BillingPlan =
  | 'monthly'
  | 'yearly';

export default function ProPage() {
  const [loading, setLoading] =
    useState(true);

  const [isPro, setIsPro] =
    useState(false);

  const [billing, setBilling] =
    useState<BillingPlan>('yearly');

  useEffect(() => {
    async function load() {
      try {
        const status =
          await getProStatus();

        setIsPro(status.isPro);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <main className="pro-page">
        <div className="pro-card">
          Loading membership...
        </div>
      </main>
    );
  }

  if (isPro) {
    return (
      <main className="pro-page">
        <div className="pro-card">
          <Crown size={38} />

          <h1>
            You&apos;re in
          </h1>

          <p className="pro-tagline">
            You have Go Bachelor/Bachelorette
            membership.
          </p>

          <div className="pro-status-box">
            <strong>
              Go Bachelor/Bachelorette
            </strong>

            <span>
              Your premium features are unlocked.
            </span>
          </div>

          <ul
            style={{
              textAlign: 'left',
              display: 'grid',
              gap: '10px',
              margin: '24px 0',
              padding: 0,
              listStyle: 'none'
            }}
          >
            <li>
              <Check size={17} />
              Unlimited outgoing messages
            </li>

            <li>
              <Check size={17} />
              Up to 30 photos
            </li>

            <li>
              <Check size={17} />
              Enter HTML for your YourSpace
            </li>
          </ul>

          <Link
            href="/profile/studio"
            className="primary-button"
          >
            Open YourSpace Studio
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

  return (
    <main className="pro-page">
      <div
        className="pro-card"
        style={{
          width: 'min(920px, 100%)'
        }}
      >
        <Link
          href="/"
          className="form-brand"
        >
          findafriend
        </Link>

        <h1>
          Go Bachelor/Bachelorette
        </h1>

        <p className="pro-tagline">
          Unlock the full FindAFriend
          experience.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px',
            marginTop: '28px'
          }}
        >
          <button
            type="button"
            onClick={() =>
              setBilling('monthly')
            }
            aria-pressed={
              billing === 'monthly'
            }
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              padding: '24px',
              borderRadius: '20px',
              border:
                billing === 'monthly'
                  ? '2px solid currentColor'
                  : '1px solid rgba(0,0,0,.14)',
              background: '#ffffff',
              minHeight: '250px'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}
            >
              Monthly
            </div>

            <div
              style={{
                fontSize: '38px',
                fontWeight: 800,
                lineHeight: 1
              }}
            >
              $11.99
            </div>

            <div
              style={{
                marginTop: '8px',
                opacity: .7
              }}
            >
              /month
            </div>

            <div
              style={{
                marginTop: '28px',
                fontWeight: 700
              }}
            >
              Flexible monthly billing
            </div>

            <div
              style={{
                marginTop: '8px',
                opacity: .7
              }}
            >
              Cancel when you choose.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setBilling('yearly')
            }
            aria-pressed={
              billing === 'yearly'
            }
            style={{
              position: 'relative',
              textAlign: 'left',
              cursor: 'pointer',
              padding: '28px',
              borderRadius: '24px',
              border: '3px solid currentColor',
              background:
                'linear-gradient(145deg, #fff, #fff7fa)',
              minHeight: '290px',
              transform: 'scale(1.02)',
              boxShadow:
                '0 16px 40px rgba(0,0,0,.12)'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                border: '1px solid currentColor',
                marginBottom: '16px'
              }}
            >
              Best Value
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '.08em',
                textTransform: 'uppercase'
              }}
            >
              Yearly
            </div>

            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                lineHeight: 1,
                marginTop: '8px'
              }}
            >
              $49.99
            </div>

            <div
              style={{
                marginTop: '8px',
                fontWeight: 700
              }}
            >
              /year
            </div>

            <div
              style={{
                marginTop: '22px',
                fontSize: '18px',
                fontWeight: 900
              }}
            >
              Save $93.89/year
            </div>

            <div
              style={{
                marginTop: '8px',
                opacity: .7
              }}
            >
              Best value for full-year access.
            </div>
          </button>
        </div>

        <section
          style={{
            marginTop: '34px',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}
        >
          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background:
                'linear-gradient(145deg, #fff0f6, #ffffff)',
              border: '1px solid #ffd0df'
            }}
          >
            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px'
              }}
            >
              💬
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              Unlimited messages
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: '7px',
                color: '#70747c',
                lineHeight: 1.5
              }}
            >
              Keep the conversation going. No weekly
              outgoing-message ceiling.
            </span>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background:
                'linear-gradient(145deg, #fff8e8, #ffffff)',
              border: '1px solid #f5dfac'
            }}
          >
            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px'
              }}
            >
              📸
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              Up to 30 photos
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: '7px',
                color: '#70747c',
                lineHeight: 1.5
              }}
            >
              More room for your face, your style,
              your world, and your best shots.
            </span>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background:
                'linear-gradient(145deg, #f1ecff, #ffffff)',
              border: '1px solid #ddd2ff'
            }}
          >
            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px'
              }}
            >
              🎨
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              Enter HTML
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: '7px',
                color: '#70747c',
                lineHeight: 1.5
              }}
            >
              Build your YourSpace with profile code
              and make it completely yours.
            </span>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background:
                'linear-gradient(145deg, #eaf8ff, #ffffff)',
              border: '1px solid #c9e9f8'
            }}
          >
            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px'
              }}
            >
              🎵
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              YourSpace Music
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: '7px',
                color: '#70747c',
                lineHeight: 1.5
              }}
            >
              Give your space a soundtrack with
              your own MP3.
            </span>
          </div>

          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background:
                'linear-gradient(145deg, #eefbed, #ffffff)',
              border: '1px solid #cfe8ca'
            }}
          >
            <div
              style={{
                fontSize: '30px',
                marginBottom: '10px'
              }}
            >
              🎬
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              YourSpace Video
            </strong>
            <span
              style={{
                display: 'block',
                marginTop: '7px',
                color: '#70747c',
                lineHeight: 1.5
              }}
            >
              Add an MP4 and put something moving
              inside your space.
            </span>
          </div>
        </section>

        <div
          style={{
            marginTop: '28px'
          }}
        >
          <StripeCheckoutButton
            plan={billing}
            label={
              billing === 'yearly'
                ? 'Go Bachelor/Bachelorette • $49.99/year'
                : 'Go Bachelor/Bachelorette • $11.99/month'
            }
          />
        </div>

        <p className="small-note">
          Secure billing is processed by Stripe.
        </p>

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