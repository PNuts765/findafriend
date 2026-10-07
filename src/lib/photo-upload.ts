import { supabase } from './supabase';
import { canAddPhoto } from './limits';

export async function uploadProfilePhoto(
  file: File,
  displayOrder: number
) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      photo: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const limit = await canAddPhoto();

  if (!limit.allowed) {
    return {
      photo: null,
      error: new Error(
        'You have reached your photo limit.'
      )
    };
  }

  if (!file.type.startsWith('image/')) {
    return {
      photo: null,
      error: new Error(
        'Please choose an image file.'
      )
    };
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    return {
      photo: null,
      error: new Error(
        'Images must be 10 MB or smaller.'
      )
    };
  }

  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'jpg';

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const storagePath =
    `${user.id}/${fileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from('profile-photos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

  if (uploadError) {
    return {
      photo: null,
      error: uploadError
    };
  }

  const { data: photo, error: databaseError } =
    await supabase
      .from('photos')
      .insert({
        user_id: user.id,
        storage_path: storagePath,
        display_order: displayOrder
      })
      .select()
      .single();

  if (databaseError) {
    await supabase.storage
      .from('profile-photos')
      .remove([storagePath]);

    return {
      photo: null,
      error: databaseError
    };
  }

  return {
    photo,
    error: null
  };
}

export async function deleteProfilePhoto(
  photoId: string,
  storagePath: string
) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { error: databaseError } =
    await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
      .eq('user_id', user.id);

  if (databaseError) {
    return {
      error: databaseError
    };
  }

  const { error: storageError } =
    await supabase.storage
      .from('profile-photos')
      .remove([storagePath]);

  return {
    error: storageError
  };
}

export async function getSignedPhotoUrl(
  storagePath: string
) {
  const { data, error } =
    await supabase.storage
      .from('profile-photos')
      .createSignedUrl(
        storagePath,
        60 * 60
      );

  return {
    url: data?.signedUrl ?? null,
    error
  };
}
