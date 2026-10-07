import { supabase } from './supabase';

export type ProfileMedia = {
  user_id: string;
  music_url: string | null;
  music_path: string | null;
  music_title: string | null;
  video_url: string | null;
  video_path: string | null;
  video_title: string | null;
  created_at?: string;
  updated_at?: string;
};

export async function getMyProfileMedia() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      media: null,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('profile_media')
    .select(
      'user_id, music_url, music_path, music_title, video_url, video_path, video_title, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    media: data as ProfileMedia | null,
    error
  };
}

export async function getProfileMedia(userId: string) {
  const { data, error } = await supabase
    .from('profile_media')
    .select(
      'user_id, music_url, music_path, music_title, video_url, video_path, video_title, created_at, updated_at'
    )
    .eq('user_id', userId)
    .maybeSingle();

  return {
    media: data as ProfileMedia | null,
    error
  };
}
export async function saveProfileMusic(file: File) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      media: null,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  if (file.type !== 'audio/mpeg') {
    return {
      media: null,
      error: new Error('Please choose an MP3 file.')
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      media: null,
      error: new Error(
        'Your MP3 must be 50 MB or smaller.'
      )
    };
  }

  const { data: existing } = await supabase
    .from('profile_media')
    .select('music_path')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.music_path) {
    await supabase.storage
      .from('profile-media')
      .remove([existing.music_path]);
  }

  const path =
    `${user.id}/music-${crypto.randomUUID()}.mp3`;

  const { error: uploadError } =
    await supabase.storage
      .from('profile-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'audio/mpeg'
      });

  if (uploadError) {
    return {
      media: null,
      error: uploadError
    };
  }

  const { data: publicUrlData } =
    supabase.storage
      .from('profile-media')
      .getPublicUrl(path);

  const { data, error } = await supabase
    .from('profile_media')
    .upsert(
      {
        user_id: user.id,
        music_url: publicUrlData.publicUrl,
        music_path: path,
        music_title: file.name
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single();

  if (error) {
    await supabase.storage
      .from('profile-media')
      .remove([path]);

    return {
      media: null,
      error
    };
  }

  return {
    media: data as ProfileMedia,
    error: null
  };
}

export async function saveProfileVideo(file: File) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      media: null,
      error:
        userError ??
        new Error('You must be logged in.')
    };
  }

  if (file.type !== 'video/mp4') {
    return {
      media: null,
      error: new Error('Please choose an MP4 video.')
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      media: null,
      error: new Error(
        'Your MP4 must be 50 MB or smaller.'
      )
    };
  }

  const { data: existing } = await supabase
    .from('profile_media')
    .select('video_path')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.video_path) {
    await supabase.storage
      .from('profile-media')
      .remove([existing.video_path]);
  }

  const path =
    `${user.id}/video-${crypto.randomUUID()}.mp4`;

  const { error: uploadError } =
    await supabase.storage
      .from('profile-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'video/mp4'
      });

  if (uploadError) {
    return {
      media: null,
      error: uploadError
    };
  }

  const { data: publicUrlData } =
    supabase.storage
      .from('profile-media')
      .getPublicUrl(path);

  const { data, error } = await supabase
    .from('profile_media')
    .upsert(
      {
        user_id: user.id,
        video_url: publicUrlData.publicUrl,
        video_path: path,
        video_title: file.name
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single();

  if (error) {
    await supabase.storage
      .from('profile-media')
      .remove([path]);

    return {
      media: null,
      error
    };
  }

  return {
    media: data as ProfileMedia,
    error: null
  };
}

export async function removeProfileMusic() {
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

  const { data, error } = await supabase
    .from('profile_media')
    .select('music_path')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (data?.music_path) {
    await supabase.storage
      .from('profile-media')
      .remove([data.music_path]);
  }

  const { error: updateError } =
    await supabase
      .from('profile_media')
      .update({
        music_url: null,
        music_path: null,
        music_title: null
      })
      .eq('user_id', user.id);

  return {
    error: updateError
  };
}

export async function removeProfileVideo() {
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

  const { data, error } = await supabase
    .from('profile_media')
    .select('video_path')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (data?.video_path) {
    await supabase.storage
      .from('profile-media')
      .remove([data.video_path]);
  }

  const { error: updateError } =
    await supabase
      .from('profile_media')
      .update({
        video_url: null,
        video_path: null,
        video_title: null
      })
      .eq('user_id', user.id);

  return {
    error: updateError
  };
}