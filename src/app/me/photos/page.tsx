'use client';

import {
  ChangeEvent,
  useEffect,
  useState
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Trash2,
  Upload,
  ArrowLeft
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  getSignedPhotoUrl
} from '@/lib/photo-upload';

import {
  getPhotoLimit,
  getMyPlan
} from '@/lib/limits';

type Photo = {
  id: string;
  storage_path: string;
  display_order: number;
  signed_url?: string | null;
};

export default function MyPhotosPage() {
  const router = useRouter();
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
      router.replace('/login');
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
      setLoading(false);
      return;
    }

    const databasePhotos =
      (photoResult.data ?? []) as Photo[];

    const photosWithUrls =
      await Promise.all(
        databasePhotos.map(
          async (photo) => {
            const result =
              await getSignedPhotoUrl(
                photo.storage_path
              );

            return {
              ...photo,
              signed_url: result.url
            };
          }
        )
      );

    setPhotos(photosWithUrls);
    setLimit(photoLimit);
    setPlan(accountPlan);
    setLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await loadPhotos();
    })();
  }, [router]);

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
                  {photo.signed_url ? (
                    <img
                      src={photo.signed_url}
                      alt="Profile photo"
                    />
                  ) : (
                    <div className="photo-unavailable">
                      Photo unavailable
                    </div>
                  )}

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