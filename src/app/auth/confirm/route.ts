import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const tokenHash =
    url.searchParams.get('token_hash');

  const type =
    url.searchParams.get('type');

  const next =
    url.searchParams.get('next') || '/profile';

  if (!tokenHash || type !== 'email') {
    return NextResponse.redirect(
      new URL('/login?error=confirmation', url.origin)
    );
  }

  const supabase =
    await createServerSupabaseClient();

  const { error } =
    await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email'
    });

  if (error) {
    return NextResponse.redirect(
      new URL(
        '/login?error=confirmation',
        url.origin
      )
    );
  }

  return NextResponse.redirect(
    new URL(next, url.origin)
  );
}