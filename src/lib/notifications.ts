import { supabase } from './supabase';

export type Notification = {
  id: string;
  recipient_user_id: string;
  actor_user_id: string;
  type: string;
  like_id: string | null;
  read_at: string | null;
  created_at: string;
  actor?: {
    id: string;
    first_name: string;
  } | null;
};

export async function getNotifications() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      notifications: [] as Notification[],
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const {
    data,
    error
  } = await supabase
    .from('notifications')
    .select(`
      id,
      recipient_user_id,
      actor_user_id,
      type,
      like_id,
      read_at,
      created_at,
      actor:actor_user_id (
        id,
        first_name
      )
    `)
    .eq(
      'recipient_user_id',
      user.id
    )
    .order(
      'created_at',
      { ascending: false }
    );

  return {
    notifications:
      (data ?? []) as unknown as Notification[],
    error
  };
}

export async function getUnreadNotificationCount() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      count: 0,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const {
    count,
    error
  } = await supabase
    .from('notifications')
    .select(
      'id',
      {
        count: 'exact',
        head: true
      }
    )
    .eq(
      'recipient_user_id',
      user.id
    )
    .is(
      'read_at',
      null
    );

  return {
    count: count ?? 0,
    error
  };
}

export async function markNotificationRead(
  id: string
) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const { error } =
    await supabase
      .from('notifications')
      .update({
        read_at:
          new Date().toISOString()
      })
      .eq('id', id)
      .eq(
        'recipient_user_id',
        user.id
      );

  return { error };
}