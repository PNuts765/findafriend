import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

if (!stripeSecretKey) {
  throw new Error(
    'STRIPE_SECRET_KEY is not configured.'
  );
}

const stripe =
  new Stripe(stripeSecretKey);

type CheckoutPlan =
  | 'monthly'
  | 'yearly';

export async function POST(
  request: Request
) {
  const supabase =
    await createServerSupabaseClient();

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

  let requestedPlan: CheckoutPlan =
    'monthly';

  try {
    const body =
      await request.json();

    if (
      body?.plan === 'yearly'
    ) {
      requestedPlan = 'yearly';
    }
  } catch {
    // No body means monthly.
  }

  const priceId =
    requestedPlan === 'yearly'
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          requestedPlan === 'yearly'
            ? 'Stripe yearly price is not configured yet.'
            : 'Stripe monthly price is not configured yet.'
      },
      {
        status: 503
      }
    );
  }

  const session =
    await stripe.checkout.sessions.create({
      managed_payments: {
        enabled: false
      },
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
          user.id,

        plan:
          requestedPlan
      },

      subscription_data: {
        metadata: {
          findafriend_user_id:
            user.id,

          plan:
            requestedPlan
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