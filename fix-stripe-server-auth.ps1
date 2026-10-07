$files = @{}

$files["src/lib/supabase/server.ts"] = @"
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            );
          } catch {
            // Cookie writes can be ignored
            // when called from a Server Component.
          }
        }
      }
    }
  );
}
"@

$files["src/app/api/stripe/checkout/route.ts"] = @"
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

export async function POST() {
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
Write-Host "findafriend server-side Supabase authentication connected successfully." -ForegroundColor Green
Write-Host "Stripe checkout now reads the authenticated user from the server session." -ForegroundColor Green
Write-Host "Account ID is attached to Stripe checkout and subscription metadata." -ForegroundColor Green
Write-Host ""
