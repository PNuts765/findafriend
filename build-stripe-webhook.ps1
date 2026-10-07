$files = @{}

$files["src/app/api/stripe/webhook/route.ts"] = @"
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

const stripeWebhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET;

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!stripeSecretKey) {
  throw new Error(
    'STRIPE_SECRET_KEY is not configured.'
  );
}

if (!stripeWebhookSecret) {
  throw new Error(
    'STRIPE_WEBHOOK_SECRET is not configured.'
  );
}

if (!supabaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL is not configured.'
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not configured.'
  );
}

const stripe = new Stripe(
  stripeSecretKey
);

const supabaseAdmin =
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

export async function POST(
  request: Request
) {
  const body =
    await request.text();

  const signature =
    request.headers.get(
      'stripe-signature'
    );

  if (!signature) {
    return NextResponse.json(
      {
        error:
          'Missing Stripe signature.'
      },
      {
        status: 400
      }
    );
  }

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
  } catch {
    return NextResponse.json(
      {
        error:
          'Invalid Stripe webhook signature.'
      },
      {
        status: 400
      }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session =
          event.data.object as Stripe.Checkout.Session;

        if (
          session.payment_status !==
          'paid'
        ) {
          break;
        }

        await activateProFromCheckout(
          session
        );

        break;
      }

      case 'customer.subscription.updated': {
        const subscription =
          event.data.object as Stripe.Subscription;

        await syncSubscription(
          subscription
        );

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription =
          event.data.object as Stripe.Subscription;

        await deactivateSubscription(
          subscription
        );

        break;
      }

      case 'invoice.paid': {
        const invoice =
          event.data.object as Stripe.Invoice;

        await handlePaidInvoice(
          invoice
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received: true
    });
  } catch (error) {
    console.error(
      'Stripe webhook processing error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Webhook processing failed.'
      },
      {
        status: 500
      }
    );
  }
}

async function activateProFromCheckout(
  session: Stripe.Checkout.Session
) {
  const email =
    session.customer_details?.email
      ?.trim()
      .toLowerCase();

  if (!email) {
    console.error(
      'Stripe checkout has no customer email.',
      session.id
    );

    return;
  }

  const {
    data: users,
    error: userError
  } =
    await supabaseAdmin.auth.admin
      .listUsers({
        page: 1,
        perPage: 1000
      });

  if (userError) {
    throw userError;
  }

  const user =
    users.users.find(
      (candidate) =>
        candidate.email
          ?.trim()
          .toLowerCase() === email
    );

  if (!user) {
    console.error(
      'No findafriend account matches Stripe email:',
      email
    );

    return;
  }

  const subscriptionId =
    typeof session.subscription ===
    'string'
      ? session.subscription
      : session.subscription?.id ??
        null;

  const customerId =
    typeof session.customer ===
    'string'
      ? session.customer
      : session.customer?.id ??
        null;

  const plan =
    subscriptionId
      ? 'monthly'
      : 'yearly';

  const {
    error
  } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        user_id: user.id,
        plan,
        status: 'active',
        is_lifetime: false,
        stripe_customer_id:
          customerId,
        stripe_subscription_id:
          subscriptionId
      },
      {
        onConflict:
          'user_id'
      }
    );

  if (error) {
    throw error;
  }
}

async function syncSubscription(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer ===
    'string'
      ? subscription.customer
      : subscription.customer.id;

  const status =
    subscription.status === 'active' ||
    subscription.status === 'trialing'
      ? 'active'
      : subscription.status;

  const price =
    subscription.items.data[0]?.price;

  const interval =
    price?.recurring?.interval;

  const plan =
    interval === 'year'
      ? 'yearly'
      : 'monthly';

  const {
    error
  } = await supabaseAdmin
    .from('subscriptions')
    .update({
      plan,
      status,
      is_lifetime: false,
      stripe_customer_id:
        customerId,
      stripe_subscription_id:
        subscription.id,
      current_period_end:
        new Date(
          subscription.items.data[0]
            ?.current_period_end
            ? subscription.items.data[0]
                .current_period_end * 1000
            : Date.now()
        ).toISOString()
    })
    .eq(
      'stripe_subscription_id',
      subscription.id
    );

  if (error) {
    throw error;
  }
}

async function deactivateSubscription(
  subscription: Stripe.Subscription
) {
  const {
    error
  } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled'
    })
    .eq(
      'stripe_subscription_id',
      subscription.id
    );

  if (error) {
    throw error;
  }
}

async function handlePaidInvoice(
  invoice: Stripe.Invoice
) {
  const subscriptionId =
    typeof invoice.subscription ===
    'string'
      ? invoice.subscription
      : invoice.subscription?.id ??
        null;

  if (!subscriptionId) {
    return;
  }

  const {
    error
  } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active'
    })
    .eq(
      'stripe_subscription_id',
      subscriptionId
    );

  if (error) {
    throw error;
  }
}
"@

$files[".env.example"] = @"
# Public Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=

# Public Supabase publishable key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# SERVER ONLY
# Never expose these in browser code.
SUPABASE_SERVICE_ROLE_KEY=

# SERVER ONLY
STRIPE_SECRET_KEY=

# SERVER ONLY
STRIPE_WEBHOOK_SECRET=
"@

$files["src/app/api/stripe/webhook/route.ts"] += @"

export const runtime = 'nodejs';
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
Write-Host "findafriend Stripe webhook foundation built successfully." -ForegroundColor Green
Write-Host "Created: secure Stripe webhook endpoint and server-only environment configuration." -ForegroundColor Green
Write-Host "Payment verification is NOT active yet; Stripe secrets still need to be configured." -ForegroundColor Yellow
Write-Host ""
