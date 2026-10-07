import { supabase } from './supabase';

export async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error };
  }

  return { user, error: null };
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, birth_date, gender, city, state, about_me, interests_text, photos (id, storage_path, display_order)')
    .eq('is_active', true)
    .eq('is_banned', false)
    .order('created_at', { ascending: false });

  return {
    profiles: data ?? [],
    error
  };
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, birth_date, gender, city, state, about_me, interests_text, photos (id, storage_path, display_order)')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_banned', false)
    .single();

  return {
    profile: data,
    error
  };
}

export async function updateMyProfile(profile: {
  first_name?: string;
  birth_date?: string;
  gender?: string;
  city?: string;
  state?: string;
  about_me?: string;
  interests_text?: string;
}) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      profile: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();

  return {
    profile: data,
    error
  };
}

export async function likeProfile(toUserId: string) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      like: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('likes')
    .upsert(
      {
        from_user_id: user.id,
        to_user_id: toUserId
      },
      {
        onConflict: 'from_user_id,to_user_id',
        ignoreDuplicates: true
      }
    )
    .select()
    .maybeSingle();

  return {
    like: data,
    error
  };
}

export async function getMyLikes() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      likes: [],
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('likes')
    .select('id, to_user_id, created_at, profiles:to_user_id (id, first_name, birth_date, city, state)')
    .eq('from_user_id', user.id)
    .order('created_at', { ascending: false });

  return {
    likes: data ?? [],
    error
  };
}

export async function createConversation(otherUserId: string) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      conversation: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const first =
    user.id < otherUserId ? user.id : otherUserId;

  const second =
    user.id < otherUserId ? otherUserId : user.id;

  const { data, error } = await supabase
    .from('conversations')
    .upsert(
      {
        user_one_id: first,
        user_two_id: second
      },
      {
        onConflict: 'user_one_id,user_two_id'
      }
    )
    .select()
    .single();

  return {
    conversation: data,
    error
  };
}

export async function getConversations() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      conversations: [],
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
    .order('updated_at', { ascending: false });

  return {
    conversations: data ?? [],
    error
  };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at')
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  return {
    messages: data ?? [],
    error
  };
}

export async function sendMessage(
  conversationId: string,
  body: string
) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      message: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const cleanBody = body.trim();

  if (!cleanBody) {
    return {
      message: null,
      error: new Error('Message cannot be empty.')
    };
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: cleanBody
    })
    .select()
    .single();

  return {
    message: data,
    error
  };
}

export async function createPromotionEntry() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      entry: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('promotion_entries')
    .upsert(
      {
        user_id: user.id
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single();

  return {
    entry: data,
    error
  };
}

