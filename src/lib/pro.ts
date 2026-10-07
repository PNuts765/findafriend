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