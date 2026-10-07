'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Upload, Video } from 'lucide-react';

import {
  getMyProfileMedia,
  removeProfileVideo,
  saveProfileVideo,
  type ProfileMedia
} from '@/lib/profile-media';

export default function YourSpaceVideoPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<ProfileMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await getMyProfileMedia();

      if (result.error) {
        setError(result.error.message);
      }

      setMedia(result.media);
      setLoading(false);
    }

    void load();
  }, []);

  async function handleUpload(file?: File) {
    if (!file) {
      return;
    }

    setBusy(true);
    setMessage('');
    setError('');

    const result = await saveProfileVideo(file);

    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    setMedia(result.media);
    setMessage('Your YourSpace video is saved.');
    setBusy(false);
  }

  async function handleRemove() {
    setBusy(true);
    setMessage('');
    setError('');

    const result = await removeProfileVideo();

    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    setMedia(current =>
      current
        ? {
            ...current,
            video_url: null,
            video_path: null,
            video_title: null
          }
        : current
    );

    setMessage('Your YourSpace video was removed.');
    setBusy(false);
  }

  if (loading) {
    return (
      <main className="media-shell">
        <div className="loading">Loading...</div>
      </main>
    );
  }

  return (
    <main className="media-shell">
      <header className="media-nav">
        <Link href="/profile/studio" className="back-link">
          <ArrowLeft size={17} />
          YourSpace Studio
        </Link>

        <Link href="/" className="brand">
          findafriend<span>.</span>
        </Link>
      </header>

      <section className="media-wrap">
        <div className="media-icon">
          <Video size={28} />
        </div>

        <h1>YourSpace Video</h1>

        <p className="subtitle">
          Add one MP4 to your YourSpace.
        </p>

        {error && (
          <div className="message error">{error}</div>
        )}

        {message && (
          <div className="message success">{message}</div>
        )}

        {media?.video_url ? (
          <section className="media-card">
            <div className="media-heading">
              <div>
                <strong>{media.video_title}</strong>
                <span>Your current YourSpace video</span>
              </div>
              <Video size={20} />
            </div>

            <video
              controls
              autoPlay
              loop
              muted
              playsInline
              src={media.video_url}
              className="video"
            />

            <button
              type="button"
              className="remove"
              onClick={() => void handleRemove()}
              disabled={busy}
            >
              <Trash2 size={16} />
              Remove video
            </button>
          </section>
        ) : (
          <section className="media-card empty">
            <button
              type="button"
              className="upload"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <Upload size={20} />
              {busy ? 'Uploading...' : 'Choose MP4'}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,.mp4"
              hidden
              onChange={event =>
                void handleUpload(event.target.files?.[0])
              }
            />

            <p>One MP4 • Maximum 50 MB</p>
          </section>
        )}
      </section>

      <style jsx>{`
        .media-shell {
          min-height: 100vh;
          background: #f7f7f8;
          color: #17191c;
        }

        .media-nav {
          height: 68px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border-bottom: 1px solid #e8e8eb;
        }

        .back-link,
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666b73;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .brand {
          color: #17191c;
          font-size: 18px;
          font-weight: 900;
        }

        .brand span {
          color: #e84d78;
        }

        .media-wrap {
          width: min(700px, calc(100% - 32px));
          margin: 0 auto;
          padding: 72px 0;
        }

        .media-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #f1edff;
          color: #7557c7;
          margin-bottom: 20px;
        }

        h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 52px);
          letter-spacing: -.055em;
        }

        .subtitle {
          margin: 10px 0 28px;
          color: #858991;
        }

        .media-card {
          padding: 28px;
          background: #fff;
          border: 1px solid #e5e5e8;
          border-radius: 20px;
        }

        .media-card.empty {
          text-align: center;
        }

        .upload {
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 14px;
          background: #17191c;
          color: #fff;
          font-weight: 900;
          cursor: pointer;
        }

        .media-card.empty p {
          margin: 13px 0 0;
          color: #92969d;
          font-size: 12px;
        }

        .media-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .media-heading > div {
          display: grid;
          gap: 5px;
        }

        .media-heading span {
          color: #92969d;
          font-size: 12px;
        }

        .video {
          width: 100%;
          display: block;
          max-height: 520px;
          border-radius: 14px;
          background: #090a0d;
        }

        .remove {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border: 1px solid #e1e1e5;
          border-radius: 10px;
          background: #fff;
          color: #666b73;
          font-weight: 800;
          cursor: pointer;
        }

        .message {
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 13px;
        }

        .message.error {
          background: #fff0f2;
          color: #a83252;
        }

        .message.success {
          background: #ecfaf0;
          color: #287044;
        }

        .loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
        }

        @media (max-width: 600px) {
          .media-nav {
            padding: 0 16px;
          }

          .media-wrap {
            width: min(100% - 20px, 700px);
            padding-top: 42px;
          }

          .media-card {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}