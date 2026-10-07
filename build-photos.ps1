$files = @{}

$files["src/lib/photo-upload.ts"] = @"
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

export function getPhotoUrl(
  storagePath: string
) {
  const {
    data
  } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}
"@

$files["src/app/me/photos/page.tsx"] = @"
'use client';

import {
  ChangeEvent,
  useEffect,
  useState
} from 'react';

import Link from 'next/link';

import {
  Trash2,
  Upload,
  ArrowLeft
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  getPhotoUrl
} from '@/lib/photo-upload';

import {
  getPhotoLimit,
  getMyPlan
} from '@/lib/limits';

type Photo = {
  id: string;
  storage_path: string;
  display_order: number;
};

export default function MyPhotosPage() {
  const [photos, setPhotos] =
    useState<Photo[]>([]);

  const [limit, setLimit] =
    useState(3);

  const [plan, setPlan] =
    useState<'free' | 'pro'>('free');

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  async function loadPhotos() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const [
      photoResult,
      photoLimit,
      accountPlan
    ] = await Promise.all([
      supabase
        .from('photos')
        .select(
          'id, storage_path, display_order'
        )
        .eq('user_id', user.id)
        .order('display_order', {
          ascending: true
        }),
      getPhotoLimit(),
      getMyPlan()
    ]);

    if (photoResult.error) {
      setError(
        photoResult.error.message
      );
    } else {
      setPhotos(
        (photoResult.data ?? []) as Photo[]
      );
    }

    setLimit(photoLimit);
    setPlan(accountPlan);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    setError('');
    setMessage('');

    if (photos.length >= limit) {
      setError(
        plan === 'free'
          ? 'Free accounts can have 3 photos. Upgrade to Pro for up to 30.'
          : 'You have reached your 30-photo limit.'
      );
      return;
    }

    setUploading(true);

    const result =
      await uploadProfilePhoto(
        file,
        photos.length
      );

    if (result.error) {
      setError(
        result.error.message
      );
      setUploading(false);
      return;
    }

    setMessage(
      'Photo uploaded successfully.'
    );

    await loadPhotos();

    setUploading(false);
  }

  async function handleDelete(
    photo: Photo
  ) {
    setError('');
    setMessage('');

    const result =
      await deleteProfilePhoto(
        photo.id,
        photo.storage_path
      );

    if (result.error) {
      setError(
        result.error.message
      );
      return;
    }

    setMessage(
      'Photo removed.'
    );

    await loadPhotos();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link
          href="/me"
          className="header-link"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <Link
          href="/"
          className="brand"
        >
          findafriend
        </Link>

        <div />
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>My Photos</h1>

          <p>
            {photos.length} of {limit} photos
          </p>
        </div>

        <div className="photo-limit-card">
          <strong>
            {plan === 'pro'
              ? 'Pro: up to 30 photos'
              : 'Free: up to 3 photos'}
          </strong>

          {plan === 'free' && (
            <Link href="/pro">
              Upgrade to Pro
            </Link>
          )}
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {message && (
          <div className="form-success">
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            Loading photos...
          </div>
        ) : (
          <>
            <div className="photo-grid">
              {photos.map((photo) => (
                <div
                  className="photo-management-card"
                  key={photo.id}
                >
                  <img
                    src={getPhotoUrl(
                      photo.storage_path
                    )}
                    alt="Profile photo"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(photo)
                    }
                    aria-label="Delete photo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {photos.length < limit && (
                <label className="photo-upload-card">
                  <Upload size={28} />

                  <span>
                    {uploading
                      ? 'Uploading...'
                      : 'Add photo'}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    hidden
                  />
                </label>
              )}
            </div>

            {photos.length >= limit &&
              plan === 'free' && (
                <div className="photo-upgrade">
                  <h2>Want more photos?</h2>

                  <p>
                    Pro gives you room for up to
                    30 photos.
                  </p>

                  <Link
                    href="/pro"
                    className="primary-button"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              )}
          </>
        )}
      </section>
    </main>
  );
}
"@

$files["src/app/me/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function MePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link
          href="/"
          className="brand"
        >
          findafriend
        </Link>

        <Link
          href="/settings"
          className="header-link"
        >
          Settings
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Me</h1>
          <p>Your findafriend profile.</p>
        </div>

        <div className="me-menu">
          <Link href="/profile">
            Edit Profile
          </Link>

          <Link href="/me/photos">
            My Photos
          </Link>

          <Link href="/likes">
            Likes
          </Link>

          <Link href="/messages">
            Messages
          </Link>

          <Link href="/pro">
            Pro
          </Link>

          <Link href="/settings">
            Settings
          </Link>

          <Link href="/logout">
            Log Out
          </Link>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/globals.css"] += @"

.photo-limit-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: min(100%, 760px);
  margin: 0 auto 20px;
  padding: 16px 18px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
}

.photo-limit-card a {
  font-weight: 700;
}

.photo-grid {
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.photo-management-card,
.photo-upload-card {
  position: relative;
  min-height: 220px;
  border: 1px solid #e3e3e3;
  border-radius: 14px;
  overflow: hidden;
  background: #f8f8f8;
}

.photo-management-card img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
}

.photo-management-card button {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.94);
  cursor: pointer;
}

.photo-upload-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #666;
}

.photo-upload-card:hover {
  background: #f1f1f1;
}

.photo-upgrade {
  width: min(100%, 760px);
  margin: 25px auto 0;
  padding: 25px;
  text-align: center;
  border-radius: 14px;
  background: #f7f7f7;
}

.photo-upgrade h2 {
  margin: 0 0 8px;
}

.photo-upgrade p {
  margin: 0 0 18px;
  color: #666;
}

.photo-upgrade .primary-button {
  display: inline-flex;
  text-decoration: none;
}

.me-menu {
  width: min(100%, 600px);
  margin: 20px auto;
  display: grid;
  gap: 10px;
}

.me-menu a {
  padding: 17px 18px;
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  background: #fff;
  color: inherit;
  text-decoration: none;
}

.me-menu a:hover {
  background: #f7f7f7;
}

@media (max-width: 650px) {
  .photo-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 430px) {
  .photo-grid {
    grid-template-columns:
      1fr;
  }
}
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
Write-Host "findafriend photo system built successfully." -ForegroundColor Green
Write-Host "Free: 3 photos." -ForegroundColor Green
Write-Host "Pro: 30 photos." -ForegroundColor Green
Write-Host "Created: photo upload, photo deletion, photo management, and My Photos." -ForegroundColor Green
Write-Host ""
