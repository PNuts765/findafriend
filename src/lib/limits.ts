import { supabase } from './supabase';

export const FREE_PHOTO_LIMIT = 3;
export const PRO_PHOTO_LIMIT = 30;
export const FREE_WEEKLY_MESSAGE_LIMIT = 10;

export type AccountPlan = 'free' | 'pro';

export async function getMyPlan(): Promise<AccountPlan> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return 'free';

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, is_lifetime')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!data) return 'free';

  if (data.is_lifetime) return 'pro';

  if (
    data.plan === 'monthly' ||
    data.plan === 'yearly'
  ) {
    return 'pro';
  }

  return 'free';
}

export async function getPhotoLimit() {
  const plan = await getMyPlan();

  return plan === 'pro'
    ? PRO_PHOTO_LIMIT
    : FREE_PHOTO_LIMIT;
}

export async function getWeeklyOutgoingMessageCount() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count } = await supabase
    .from('messages')
    .select('id', {
      count: 'exact',
      head: true
    })
    .eq('sender_id', user.id)
    .gte('created_at', weekAgo.toISOString());

  return count ?? 0;
}

export async function canSendMessage() {
  const plan = await getMyPlan();

  if (plan === 'pro') {
    return {
      allowed: true,
      remaining: null
    };
  }

  const count =
    await getWeeklyOutgoingMessageCount();

  return {
    allowed: count < FREE_WEEKLY_MESSAGE_LIMIT,
    remaining: Math.max(
      0,
      FREE_WEEKLY_MESSAGE_LIMIT - count
    )
  };
}

export async function canAddPhoto() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      allowed: false,
      remaining: 0
    };
  }

  const limit = await getPhotoLimit();

  const { count } = await supabase
    .from('photos')
    .select('id', {
      count: 'exact',
      head: true
    })
    .eq('user_id', user.id);

  const currentCount = count ?? 0;

  return {
    allowed: currentCount < limit,
    remaining: Math.max(
      0,
      limit - currentCount
    )
  };
}