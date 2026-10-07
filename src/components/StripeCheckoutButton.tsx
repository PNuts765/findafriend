'use client';

import {
  useState
} from 'react';

type CheckoutPlan =
  | 'monthly'
  | 'yearly';

type Props = {
  plan?: CheckoutPlan;
  label?: string;
};

export default function StripeCheckoutButton({
  plan = 'monthly',
  label = 'Get Pro'
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function startCheckout() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response =
        await fetch(
          '/api/stripe/checkout',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              plan
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.error ??
            'Unable to start checkout.'
        );
        return;
      }

      if (!data?.url) {
        setError(
          'Stripe did not return a checkout URL.'
        );
        return;
      }

      window.location.href =
        data.url;
    } catch {
      setError(
        'Unable to connect to Stripe checkout.'
      );
    } finally {
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
        {loading
          ? 'Opening secure checkout...'
          : label}
      </button>

      {error && (
        <div className="form-error stripe-error">
          {error}
        </div>
      )}
    </div>
  );
}