'use client';

import {
  useEffect,
  useState
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Music2,
  Save,
  Sparkles,
  Upload,
  Video
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import {
  updateMyProfile
} from '@/lib/data';

import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  getSignedPhotoUrl
} from '@/lib/photo-upload';

import {
  DEFAULT_PROFILE_STUDIO_SETTINGS,
  PROFILE_STUDIO_PRESETS,
  getMyProfileDesign,
  saveMyProfileDesign,
  type ProfileStudioSettings
} from '@/lib/profile-studio';

import {
  getMyProfileMedia,
  saveProfileMusic,
  saveProfileVideo,
  type ProfileMedia
} from '@/lib/profile-media';

type PresetKey =
  keyof typeof PROFILE_STUDIO_PRESETS;

type Profile = {
  id: string;
  first_name: string;
  birth_date: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  about_me: string | null;
  interests_text: string | null;
};

type PhotoRow = {
  id: string;
  storage_path: string;
  display_order: number;
};

const presetKeys = Object.keys(
  PROFILE_STUDIO_PRESETS
) as PresetKey[];

function getAge(date: string | null) {
  if (!date) {
    return '';
  }

  const birth = new Date(date);
  const today = new Date();

  let age =
    today.getFullYear() -
    birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (
      today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate()
    )
  ) {
    age--;
  }

  return age > 0 ? age : '';
}

function sanitizeHtml(input: string) {
  if (
    typeof window === 'undefined' ||
    !input.trim()
  ) {
    return '';
  }

  const parser = new DOMParser();

  const doc = parser.parseFromString(
    `<div id="profile-html-root">${input}</div>`,
    'text/html'
  );

  const root = doc.querySelector(
    '#profile-html-root'
  );

  if (!root) {
    return '';
  }

  root
    .querySelectorAll(
      'script, iframe, object, embed, form, input, button, textarea, select, link, meta, base'
    )
    .forEach(element => {
      element.remove();
    });

  root.querySelectorAll('*').forEach(
    element => {
      Array.from(
        element.attributes
      ).forEach(attribute => {
        const name =
          attribute.name.toLowerCase();

        const value =
          attribute.value
            .trim()
            .toLowerCase();

        if (
          name.startsWith('on') ||
          name === 'srcdoc' ||
          (
            [
              'href',
              'src',
              'action',
              'formaction'
            ].includes(name) &&
            value.startsWith('javascript:')
          )
        ) {
          element.removeAttribute(
            attribute.name
          );
        }
      });
    }
  );

  return root.innerHTML;
}

export default function ProfileStudioPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [userId, setUserId] =
    useState('');

  const [firstName, setFirstName] =
    useState('');

  const [aboutMe, setAboutMe] =
    useState('');

  const [photo, setPhoto] =
    useState<PhotoRow | null>(null);

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null);

  const [preset, setPreset] =
    useState<PresetKey>('clean');

  const [settings, setSettings] =
    useState<ProfileStudioSettings>(
      DEFAULT_PROFILE_STUDIO_SETTINGS
    );

  const [customHtml, setCustomHtml] =
    useState('');

  const [media, setMedia] =
    useState<ProfileMedia | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [photoUploading, setPhotoUploading] =
    useState(false);

  const [mediaUploading, setMediaUploading] =
    useState<'music' | 'video' | null>(null);

  const [htmlOpen, setHtmlOpen] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    async function load() {
      setError('');

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      setUserId(user.id);

      const [
        profileResult,
        photosResult,
        designResult,
        mediaResult
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select(
            'id, first_name, birth_date, gender, city, state, about_me, interests_text'
          )
          .eq('id', user.id)
          .single(),

        supabase
          .from('photos')
          .select(
            'id, storage_path, display_order'
          )
          .eq('user_id', user.id)
          .order('display_order', {
            ascending: true
          }),

        getMyProfileDesign(),
        getMyProfileMedia()
      ]);

      if (profileResult.error) {
        setError(
          profileResult.error.message
        );
        setLoading(false);
        return;
      }

      const loadedProfile =
        profileResult.data as Profile;

      setProfile(loadedProfile);
      setFirstName(
        loadedProfile.first_name ?? ''
      );
      setAboutMe(
        loadedProfile.about_me ?? ''
      );

      const firstPhoto =
        ((photosResult.data ?? []) as PhotoRow[])[0] ??
        null;

      setPhoto(firstPhoto);

      if (firstPhoto) {
        const signed =
          await getSignedPhotoUrl(
            firstPhoto.storage_path
          );

        setPhotoUrl(
          signed.url
        );
      }

      if (designResult.design) {
        const savedPreset =
          designResult.design.preset as PresetKey;

        if (
          PROFILE_STUDIO_PRESETS[
            savedPreset
          ]
        ) {
          setPreset(savedPreset);
        }

        setSettings(
          designResult.design.settings
        );

        setCustomHtml(
          designResult.design.custom_html
        );

        if (
          designResult.design.custom_html
        ) {
          setHtmlOpen(true);
        }
      }

      setMedia(
        mediaResult.media
      );

      if (mediaResult.error) {
        setError(
          mediaResult.error.message
        );
      }

      setLoading(false);
    }

    void load();
  }, [router]);

  function choosePreset(
    key: PresetKey
  ) {
    setPreset(key);

    setSettings({
      ...PROFILE_STUDIO_PRESETS[key]
        .settings
    });

    setMessage('');
    setError('');
  }

  async function handlePhoto(
    file?: File
  ) {
    if (!file) {
      return;
    }

    setPhotoUploading(true);
    setError('');
    setMessage('');

    const oldPhoto = photo;

    const result =
      await uploadProfilePhoto(
        file,
        0
      );

    if (result.error) {
      setError(
        result.error.message
      );
      setPhotoUploading(false);
      return;
    }

    if (
      oldPhoto &&
      result.photo &&
      oldPhoto.id !== result.photo.id
    ) {
      await deleteProfilePhoto(
        oldPhoto.id,
        oldPhoto.storage_path
      );
    }

    setPhoto(
      result.photo as PhotoRow
    );

    if (result.photo) {
      const signed =
        await getSignedPhotoUrl(
          result.photo.storage_path
        );

      setPhotoUrl(
        signed.url
      );
    }

    setMessage(
      'Profile photo updated.'
    );

    setPhotoUploading(false);
  }

  async function handleMusic(
    file?: File
  ) {
    if (!file) {
      return;
    }

    setMediaUploading('music');
    setError('');
    setMessage('');

    const result =
      await saveProfileMusic(file);

    if (result.error) {
      setError(
        result.error.message
      );
      setMediaUploading(null);
      return;
    }

    setMedia(result.media);
    setMessage(
      'YourSpace music updated.'
    );
    setMediaUploading(null);
  }

  async function handleVideo(
    file?: File
  ) {
    if (!file) {
      return;
    }

    setMediaUploading('video');
    setError('');
    setMessage('');

    const result =
      await saveProfileVideo(file);

    if (result.error) {
      setError(
        result.error.message
      );
      setMediaUploading(null);
      return;
    }

    setMedia(result.media);
    setMessage(
      'YourSpace video updated.'
    );
    setMediaUploading(null);
  }

  async function handleSave() {
    if (!userId) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const profileResult =
      await updateMyProfile({
        first_name: firstName.trim(),
        about_me: aboutMe.trim()
      });

    if (profileResult.error) {
      setError(
        profileResult.error.message
      );
      setSaving(false);
      return;
    }

    const safeHtml =
      sanitizeHtml(customHtml);

    const spaceResult =
      await saveMyProfileDesign(
        preset,
        settings,
        '',
        safeHtml
      );

    if (spaceResult.error) {
      setError(
        spaceResult.error.message
      );
      setSaving(false);
      return;
    }

    setMessage(
      'Your profile and YourSpace are saved.'
    );

    setSaving(false);

    router.push(
      `/profile/${userId}`
    );
  }

  if (loading) {
    return (
      <main className="unified-studio">
        <div className="studio-loading">
          Loading YourSpace Studio...
        </div>
      </main>
    );
  }

  const previewName =
    firstName.trim() ||
    profile?.first_name ||
    'Your Name';

  const age =
    getAge(
      profile?.birth_date ?? null
    );

  const previewHtml =
    sanitizeHtml(customHtml);

  return (
    <main className="unified-studio">
      <header className="studio-header">
        <Link
          href="/me"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <div className="studio-logo">
          findafriend<span>.</span>
        </div>

        <Link
          href={`/profile/${userId}`}
          className="view-link"
        >
          View Profile
        </Link>
      </header>

      <section className="studio-intro">
        <div className="eyebrow">
          <Sparkles size={14} />
          YOURSPACE STUDIO
        </div>

        <h1>
          It&apos;s your space.
          <br />
          <span>
            Make it how you like.
          </span>
        </h1>
      </section>

      {error && (
        <div className="studio-message error">
          {error}
        </div>
      )}

      {message && (
        <div className="studio-message success">
          {message}
        </div>
      )}

      <div className="studio-grid">
        <section className="editor-column">

          <div className="editor-card">
            <div className="card-heading">
              <span>01</span>
              <h2>Your Profile</h2>
            </div>

            <div className="profile-editor">
              <div className="photo-picker">
                <div className="photo-circle">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Your profile"
                    />
                  ) : (
                    <span>
                      {previewName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <label className="photo-button">
                  <Upload size={16} />
                  {photoUploading
                    ? 'Uploading...'
                    : 'Add Profile Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={photoUploading}
                    onChange={event =>
                      void handlePhoto(
                        event.target.files?.[0]
                      )
                    }
                  />
                </label>
              </div>

              <label className="field">
                <span>About Me</span>
                <textarea
                  value={aboutMe}
                  onChange={event =>
                    setAboutMe(
                      event.target.value
                    )
                  }
                  maxLength={1000}
                  rows={6}
                  placeholder="Tell people something about yourself..."
                />
                <small>
                  {aboutMe.length}/1000
                </small>
              </label>
            </div>
          </div>

          <div className="editor-card">
            <div className="card-heading">
              <span>02</span>
              <h2>Pick your vibe</h2>
            </div>

            <div className="vibe-grid">
              {presetKeys.map(key => {
                const item =
                  PROFILE_STUDIO_PRESETS[
                    key
                  ];

                const active =
                  preset === key;

                return (
                  <button
                    key={key}
                    type="button"
                    className={
                      active
                        ? 'vibe active'
                        : 'vibe'
                    }
                    onClick={() =>
                      choosePreset(key)
                    }
                  >
                    <span
                      className="vibe-swatch"
                      style={{
                        background:
                          item.settings
                            .backgroundColor,
                        borderColor:
                          item.settings
                            .accentColor
                      }}
                    />

                    <span>
                      {item.name}
                    </span>

                    {active && (
                      <Check size={14} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="editor-card">
            <div className="card-heading">
              <span>03</span>
              <h2>Make it yours</h2>
            </div>

            <button
              type="button"
              className={
                htmlOpen
                  ? 'feature-button active'
                  : 'feature-button'
              }
              onClick={() =>
                setHtmlOpen(
                  current => !current
                )
              }
            >
              <span className="feature-icon">
                <Code2 size={21} />
              </span>

              <span>
                <strong>
                  Enter HTML
                </strong>
                <small>
                  Build your YourSpace
                  with profile code.
                </small>
              </span>

              <span className="feature-arrow">
                {htmlOpen ? '−' : '+'}
              </span>
            </button>

            {htmlOpen && (
              <textarea
                className="html-editor"
                value={customHtml}
                onChange={event =>
                  setCustomHtml(
                    event.target.value
                  )
                }
                placeholder="<div>Your YourSpace...</div>"
                rows={10}
              />
            )}
          </div>

          <div className="editor-card">
            <div className="card-heading">
              <span>04</span>
              <h2>Bring it to life</h2>
            </div>

            <div className="media-actions">

              <label className="media-button">
                <span className="media-icon">
                  <Music2 size={21} />
                </span>

                <span>
                  <strong>
                    YourSpace Music
                  </strong>
                  <small>
                    {media?.music_title ||
                      'Add one MP3'}
                  </small>
                </span>

                <input
                  type="file"
                  accept="audio/mpeg,.mp3"
                  hidden
                  disabled={
                    mediaUploading !== null
                  }
                  onChange={event =>
                    void handleMusic(
                      event.target.files?.[0]
                    )
                  }
                />
              </label>

              <label className="media-button">
                <span className="media-icon">
                  <Video size={21} />
                </span>

                <span>
                  <strong>
                    YourSpace Video
                  </strong>
                  <small>
                    {media?.video_title ||
                      'Add one MP4'}
                  </small>
                </span>

                <input
                  type="file"
                  accept="video/mp4,.mp4"
                  hidden
                  disabled={
                    mediaUploading !== null
                  }
                  onChange={event =>
                    void handleVideo(
                      event.target.files?.[0]
                    )
                  }
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            className="save-button"
            onClick={() =>
              void handleSave()
            }
            disabled={saving}
          >
            <Save size={19} />
            {saving
              ? 'Saving...'
              : 'Save Your Space'}
          </button>

        </section>

        <section className="preview-column">
          <div className="preview-label">
            <Eye size={15} />
            LIVE PREVIEW
          </div>

          <div
            className="preview-card"
            style={{
              backgroundColor:
                settings.backgroundColor,
              color:
                settings.textColor,
              borderColor:
                settings.accentColor,
              borderRadius:
                settings.borderRadius
            }}
          >
            <div className="preview-profile">

              <div className="preview-avatar">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                  />
                ) : (
                  <span>
                    {previewName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="preview-name">
                {previewName}
                {age
                  ? `, ${age}`
                  : ''}
              </div>

              <div
                className="preview-online"
                style={{
                  color:
                    settings.accentColor
                }}
              >
                ● Online
              </div>

              <div className="preview-about">
                <h3>
                  About Me
                </h3>

                <p>
                  {aboutMe.trim() ||
                    'Tell people something about yourself...'}
                </p>
              </div>

              <div className="preview-pills">
                {media?.music_url && (
                  <span>
                    Music
                  </span>
                )}

                {media?.video_url && (
                  <span>
                    Video
                  </span>
                )}
              </div>
            </div>

            {previewHtml ? (
              <div className="preview-html">
                <iframe
                  title="YourSpace preview"
                  sandbox=""
                  srcDoc={`
                    <!doctype html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <style>
                          html,body {
                            margin:0;
                            padding:0;
                            background:transparent;
                          }
                          body {
                            box-sizing:border-box;
                            padding:20px;
                            font-family:system-ui,sans-serif;
                            overflow:hidden;
                            max-width:100%;
                          }
                          *,*::before,*::after {
                            box-sizing:border-box;
                            max-width:100%;
                          }
                          img,video {
                            max-width:100%;
                            height:auto;
                          }
                        </style>
                      </head>
                      <body>
                        ${previewHtml}
                      </body>
                    </html>
                  `}
                />
              </div>
            ) : null}

          </div>
        </section>
      </div>

      <style jsx>{`
        .unified-studio {
          min-height: 100vh;
          background: #f7f7f9;
          color: #17191c;
          padding-bottom: 80px;
        }

        .studio-header {
          height: 68px;
          padding: 0 32px;
          background: #ffffff;
          border-bottom: 1px solid #e5e5e8;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }

        .back-link,
        .view-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #5f6670;
          text-decoration: none;
          font-weight: 750;
          font-size: 14px;
        }

        .view-link {
          justify-self: end;
        }

        .studio-logo {
          font-weight: 950;
          letter-spacing: -0.05em;
          font-size: 18px;
        }

        .studio-logo span {
          color: #e84d78;
        }

        .studio-intro {
          width: min(1120px, calc(100% - 40px));
          margin: 42px auto 24px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #e84d78;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: .08em;
        }

        .studio-intro h1 {
          margin: 12px 0 0;
          font-size: clamp(2.3rem, 5vw, 4.4rem);
          line-height: .94;
          letter-spacing: -.055em;
        }

        .studio-intro h1 span {
          color: #e84d78;
        }

        .studio-message {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto 18px;
          padding: 14px 18px;
          border-radius: 14px;
          font-weight: 700;
        }

        .studio-message.error {
          background: #fff0f2;
          color: #b42348;
          border: 1px solid #f1bcc9;
        }

        .studio-message.success {
          background: #edf9f2;
          color: #287044;
          border: 1px solid #b9dec7;
        }

        .studio-grid {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 420px minmax(0, 1fr);
          gap: 34px;
          align-items: start;
        }

        .editor-column {
          display: grid;
          gap: 16px;
        }

        .editor-card {
          background: #ffffff;
          border: 1px solid #e3e3e7;
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 10px 28px rgba(20,20,30,.04);
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .card-heading > span {
          color: #9ba1aa;
          font-size: 11px;
          font-weight: 900;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -.02em;
        }

        .profile-editor {
          display: grid;
          gap: 18px;
        }

        .photo-picker {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .photo-circle {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          overflow: hidden;
          background: #f2f3f5;
          border: 1px solid #e3e3e7;
          display: grid;
          place-items: center;
          font-size: 30px;
          font-weight: 950;
          color: #e84d78;
          flex: 0 0 auto;
        }

        .photo-circle img,
        .preview-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-button {
          min-height: 44px;
          padding: 0 15px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #dfdfe4;
          background: #ffffff;
          font-weight: 800;
          cursor: pointer;
        }

        .field {
          display: grid;
          gap: 8px;
        }

        .field > span {
          font-size: 13px;
          font-weight: 850;
        }

        .field textarea,
        .html-editor {
          width: 100%;
          resize: vertical;
          border: 1px solid #dadce2;
          border-radius: 13px;
          padding: 13px;
          font: inherit;
          outline: none;
          background: #ffffff;
        }

        .field textarea:focus,
        .html-editor:focus {
          border-color: #e84d78;
        }

        .field small {
          color: #8b919b;
          justify-self: end;
          font-size: 11px;
        }

        .vibe-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .vibe {
          min-height: 52px;
          border: 1px solid #dfdfe4;
          background: #ffffff;
          border-radius: 12px;
          padding: 8px 9px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          text-align: left;
        }

        .vibe.active {
          border-color: #e84d78;
          box-shadow: inset 0 0 0 1px #e84d78;
        }

        .vibe-swatch {
          width: 18px;
          height: 18px;
          border: 2px solid;
          border-radius: 6px;
          flex: 0 0 auto;
        }

        .feature-button {
          width: 100%;
          border: 1px solid #e3e3e7;
          background: #ffffff;
          border-radius: 14px;
          padding: 12px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          text-align: left;
          cursor: pointer;
        }

        .feature-button.active {
          border-color: #e84d78;
        }

        .feature-icon,
        .media-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #fff0f5;
          color: #e84d78;
        }

        .feature-button strong,
        .media-button strong {
          display: block;
          font-size: 13px;
        }

        .feature-button small,
        .media-button small {
          display: block;
          margin-top: 3px;
          color: #777e89;
          line-height: 1.35;
        }

        .feature-arrow {
          font-size: 24px;
          color: #9a9fa8;
        }

        .html-editor {
          margin-top: 12px;
          font-family: ui-monospace, monospace;
          font-size: 12px;
        }

        .media-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .media-button {
          border: 1px solid #e3e3e7;
          border-radius: 14px;
          background: #ffffff;
          padding: 11px;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .media-button:first-child .media-icon {
          background: #eff8ff;
          color: #3c78a8;
        }

        .media-button:last-child .media-icon {
          background: #eff9f0;
          color: #287044;
        }

        .save-button {
          min-height: 56px;
          border: 0;
          border-radius: 15px;
          background: #e84d78;
          color: #ffffff;
          font: inherit;
          font-weight: 950;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(232,77,120,.18);
        }

        .save-button:disabled {
          opacity: .6;
          cursor: wait;
        }

        .preview-column {
          position: sticky;
          top: 20px;
        }

        .preview-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 900;
          color: #7b818b;
          margin: 0 0 10px 4px;
          letter-spacing: .08em;
        }

        .preview-card {
          min-height: 650px;
          overflow: hidden;
          border: 1px solid;
          padding: 34px;
          box-shadow: 0 24px 55px rgba(20,20,30,.08);
        }

        .preview-profile {
          text-align: center;
          max-width: 620px;
          margin: 0 auto;
        }

        .preview-avatar {
          width: 104px;
          height: 104px;
          overflow: hidden;
          border-radius: 50%;
          margin: 0 auto 14px;
          display: grid;
          place-items: center;
          background: #e84d78;
          color: #ffffff;
          font-weight: 950;
          font-size: 34px;
        }

        .preview-name {
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -.035em;
        }

        .preview-online {
          margin-top: 6px;
          font-size: 12px;
          font-weight: 850;
        }

        .preview-about {
          margin-top: 28px;
          padding: 22px;
          background: rgba(255,255,255,.84);
          border-radius: 18px;
          text-align: left;
        }

        .preview-about h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }

        .preview-about p {
          margin: 0;
          color: #5f6670;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .preview-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .preview-pills span {
          padding: 7px 11px;
          background: rgba(255,255,255,.8);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 850;
        }

        .preview-html {
          margin-top: 24px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,.7);
        }

        .preview-html iframe {
          display: block;
          width: 100%;
          height: 420px;
          border: 0;
          overflow: hidden;
        }

        .studio-loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr;
          }

          .preview-column {
            position: static;
          }

          .preview-card {
            min-height: 560px;
          }
        }

        @media (max-width: 600px) {
          .studio-header {
            padding: 0 16px;
          }

          .studio-intro,
          .studio-message,
          .studio-grid {
            width: min(100% - 24px, 1120px);
          }

          .media-actions {
            grid-template-columns: 1fr;
          }

          .vibe-grid {
            grid-template-columns: 1fr 1fr;
          }

          .preview-card {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}