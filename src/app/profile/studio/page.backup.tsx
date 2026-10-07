'use client';

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Music2,
  Play,
  Save,
  Sparkles,
  Video
} from 'lucide-react';

import {
  DEFAULT_PROFILE_STUDIO_SETTINGS,
  PROFILE_STUDIO_PRESETS,
  getMyProfileDesign,
  saveMyProfileDesign,
  type ProfileStudioSettings
} from '@/lib/profile-studio';

type PresetKey =
  keyof typeof PROFILE_STUDIO_PRESETS;

const presetKeys = Object.keys(
  PROFILE_STUDIO_PRESETS
) as PresetKey[];

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

  root.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(
      attribute => {
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
      }
    );
  });

  return root.innerHTML;
}

export default function ProfileStudioPage() {
  const [preset, setPreset] =
    useState<PresetKey>('clean');

  const [settings, setSettings] =
    useState<ProfileStudioSettings>(
      DEFAULT_PROFILE_STUDIO_SETTINGS
    );

  const [customHtml, setCustomHtml] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [htmlOpen, setHtmlOpen] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function load() {
      const result =
        await getMyProfileDesign();

      if (result.error) {
        setError(
          result.error.message
        );
        setLoading(false);
        return;
      }

      if (result.design) {
        const savedPreset =
          result.design.preset as PresetKey;

        if (
          PROFILE_STUDIO_PRESETS[
            savedPreset
          ]
        ) {
          setPreset(savedPreset);
        }

        setSettings(
          result.design.settings
        );

        setCustomHtml(
          result.design.custom_html
        );

        if (
          result.design.custom_html
        ) {
          setHtmlOpen(true);
        }
      }

      setLoading(false);
    }

    void load();
  }, []);

  function choosePreset(key: PresetKey) {
    setPreset(key);

    setSettings({
      ...PROFILE_STUDIO_PRESETS[key]
        .settings
    });

    setMessage('');
    setError('');
  }

  const previewHtml = useMemo(
    () => sanitizeHtml(customHtml),
    [customHtml]
  );

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setError('');

    const safeHtml =
      sanitizeHtml(customHtml);

    const result =
      await saveMyProfileDesign(
        preset,
        settings,
        '',
        safeHtml
      );

    if (result.error) {
      setError(
        result.error.message
      );
      setSaving(false);
      return;
    }

    setCustomHtml(safeHtml);
    setMessage(
      'Your space is saved.'
    );
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="studio-shell">
        <div className="studio-loading">
          Loading Profile Studio...
        </div>
      </main>
    );
  }

  return (
    <main className="studio-shell">
      <header className="studio-nav">
        <Link
          href="/me"
          className="studio-back"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <Link
          href="/"
          className="studio-brand"
        >
          findafriend<span>.</span>
        </Link>

        <Link
          href="/profile"
          className="studio-profile-link"
        >
          Profile
        </Link>
      </header>

      <section className="studio-wrap">
        <div className="studio-intro">
          <div className="studio-eyebrow">
            <Sparkles size={14} />
            PROFILE STUDIO
          </div>

          <h1>
            Make your profile
            <br />
            <span>your space.</span>
          </h1>

          <p>
            So simple grandma could do it.
          </p>
        </div>

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
          <div className="studio-editor">
            <section className="studio-section">
              <div className="section-title">
                <div>
                  <span>01</span>
                  <h2>Pick your vibe</h2>
                </div>
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
                        <Check
                          size={14}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="studio-section">
              <div className="section-title">
                <div>
                  <span>02</span>
                  <h2>Make it yours</h2>
                </div>
              </div>

              <button
                type="button"
                className={
                  htmlOpen
                    ? 'big-option active'
                    : 'big-option'
                }
                onClick={() =>
                  setHtmlOpen(
                    current => !current
                  )
                }
              >
                <span className="option-icon">
                  <Code2 size={21} />
                </span>

                <span className="option-copy">
                  <strong>
                    Enter HTML
                  </strong>

                  <small>
                    Use your own old-school
                    profile code.
                  </small>
                </span>

                <span className="option-arrow">
                  {htmlOpen ? '−' : '+'}
                </span>
              </button>

              {htmlOpen && (
                <div className="html-editor">
                  <div className="html-editor-top">
                    <div>
                      <strong>
                        Your profile HTML
                      </strong>

                      <span>
                        Paste your old MySpace-style
                        profile code here.
                      </span>
                    </div>

                    <Code2 size={18} />
                  </div>

                  <textarea
                    value={customHtml}
                    onChange={event =>
                      setCustomHtml(
                        event.target.value
                      )
                    }
                    placeholder={`<div style="text-align:center;">
  <h1>Welcome to my space!</h1>
  <p>This is my profile.</p>
</div>`}
                    spellCheck={false}
                  />

                  <div className="html-note">
                    HTML and CSS are rendered
                    inside a sandbox. Scripts
                    cannot run.
                  </div>
                </div>
              )}
            </section>

            <section className="studio-section">
              <div className="section-title">
                <div>
                  <span>03</span>
                  <h2>Bring it to life</h2>
                </div>
              </div>

              <div className="media-grid">
                <Link
                  href="/profile/studio/music"
                  className="media-option"
                >
                  <span className="media-icon">
                    <Music2 size={19} />
                  </span>

                  <span>
                    <strong>
                      Profile Music
                    </strong>

                    <small>
                      Add one MP3
                    </small>
                  </span>

                  <span>→</span>
                </Link>

                <Link
                  href="/profile/studio/video"
                  className="media-option"
                >
                  <span className="media-icon">
                    <Video size={19} />
                  </span>

                  <span>
                    <strong>
                      Profile Video
                    </strong>

                    <small>
                      Add one MP4
                    </small>
                  </span>

                  <span>→</span>
                </Link>
              </div>
            </section>

            <button
              type="button"
              className="save-space"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? 'Saving...'
                : 'Save My Space'}
            </button>
          </div>

          <section className="preview-column">
            <div className="preview-heading">
              <span>
                <Eye size={15} />
                LIVE PREVIEW
              </span>

              {previewHtml && (
                <span className="custom-live">
                  Custom HTML
                </span>
              )}
            </div>

            <div
              className="profile-preview"
              style={{
                backgroundColor:
                  settings.backgroundColor,
                color:
                  settings.textColor,
                borderRadius:
                  settings.borderRadius,
                borderWidth:
                  settings.borderWidth,
                borderStyle: 'solid',
                borderColor:
                  settings.accentColor,
                fontFamily:
                  settings.fontFamily ===
                  'serif'
                    ? 'Georgia, serif'
                    : settings.fontFamily ===
                        'monospace'
                      ? 'ui-monospace, monospace'
                      : 'system-ui, sans-serif'
              }}
            >
              {previewHtml ? (
                <iframe
                  title="Custom profile preview"
                  className="html-preview-frame"
                  sandbox=""
                  srcDoc={`
                    <!doctype html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <base target="_blank">
                        <style>
                          html,body{
                            margin:0;
                            padding:0;
                            min-height:100%;
                          }
                          body{
                            box-sizing:border-box;
                            font-family:system-ui,sans-serif;
                            overflow:auto;
                          }
                          *,*::before,*::after{
                            box-sizing:border-box;
                          }
                          img{
                            max-width:100%;
                          }
                          a{
                            color:inherit;
                          }
                        </style>
                      </head>
                      <body>
                        ${previewHtml}
                      </body>
                    </html>
                  `}
                />
              ) : (
                <div className="preview-empty">
                  <div className="preview-avatar">
                    <span>T</span>
                  </div>

                  <div className="preview-name">
                    Your Name, 35
                  </div>

                  <div className="preview-online">
                    ● Online
                  </div>

                  <div
                    className="preview-card"
                    style={{
                      backgroundColor:
                        settings.panelColor
                    }}
                  >
                    <strong>
                      About Me
                    </strong>

                    <p>
                      This is your space.
                      Your profile,
                      your personality,
                      your rules.
                    </p>
                  </div>

                  <div className="preview-buttons">
                    <span
                      style={{
                        backgroundColor:
                          settings.accentColor
                      }}
                    >
                      Like
                    </span>

                    <span>
                      Message
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="preview-tagline">
              <strong>
                Find someone who matches
                your vibe. Enter their
                space. findafriend.
              </strong>

              <span>
                Your space is yours to make.
              </span>
            </div>

            <div className="preview-hint">
              <Play size={14} />
              Your finished profile will
              appear here exactly as visitors
              enter it.
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        .studio-shell {
          min-height: 100vh;
          background: #f7f7f8;
          color: #17191c;
        }

        .studio-nav {
          height: 68px;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          border-bottom: 1px solid #e9e9ec;
          background: rgba(255,255,255,.92);
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(12px);
        }

        .studio-back,
        .studio-profile-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666b73;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .studio-profile-link {
          justify-self: end;
        }

        .studio-brand {
          color: #17191c;
          text-decoration: none;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -.05em;
        }

        .studio-brand span {
          color: #e84d78;
        }

        .studio-wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 52px 0 72px;
        }

        .studio-intro {
          margin-bottom: 30px;
        }

        .studio-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #e84d78;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .13em;
          margin-bottom: 13px;
        }

        .studio-intro h1 {
          margin: 0;
          font-size: clamp(36px, 4vw, 56px);
          line-height: .98;
          letter-spacing: -.055em;
        }

        .studio-intro h1 span {
          color: #777c84;
        }

        .studio-intro p {
          margin: 14px 0 0;
          color: #8a8e96;
          font-size: 14px;
        }

        .studio-message {
          padding: 13px 15px;
          border-radius: 12px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .studio-message.error {
          background: #fff0f2;
          color: #a83252;
        }

        .studio-message.success {
          background: #ecfaf0;
          color: #287044;
        }

        .studio-grid {
          display: grid;
          grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
          gap: 34px;
          align-items: start;
        }

        .studio-editor,
        .preview-column {
          min-width: 0;
        }

        .studio-section {
          background: #fff;
          border: 1px solid #e7e7ea;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 14px;
          box-shadow: 0 8px 28px rgba(17,24,39,.045);
        }

        .section-title {
          margin-bottom: 17px;
        }

        .section-title > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .section-title span {
          color: #a3a7ae;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .section-title h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -.02em;
        }

        .vibe-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 8px;
        }

        .vibe {
          min-height: 62px;
          border: 1px solid #e5e5e8;
          background: #fff;
          border-radius: 12px;
          padding: 9px;
          display: grid;
          grid-template-columns: 22px 1fr auto;
          gap: 8px;
          align-items: center;
          text-align: left;
          color: #30343a;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .vibe:hover {
          border-color: #cfd2d8;
        }

        .vibe.active {
          border-color: #e84d78;
          box-shadow: 0 0 0 2px rgba(232,77,120,.10);
        }

        .vibe-swatch {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid;
        }

        .big-option {
          width: 100%;
          display: grid;
          grid-template-columns: 46px 1fr 24px;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid #e5e5e8;
          border-radius: 14px;
          background: #fff;
          text-align: left;
          cursor: pointer;
        }

        .big-option:hover,
        .big-option.active {
          border-color: #e84d78;
        }

        .option-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #fff0f5;
          color: #e84d78;
        }

        .option-copy {
          display: grid;
          gap: 3px;
        }

        .option-copy strong {
          font-size: 14px;
        }

        .option-copy small {
          color: #898d94;
          font-size: 12px;
        }

        .option-arrow {
          color: #8b8f96;
          font-size: 22px;
          text-align: center;
        }

        .html-editor {
          margin-top: 12px;
          border: 1px solid #dedfe4;
          border-radius: 14px;
          overflow: hidden;
          background: #111318;
        }

        .html-editor-top {
          padding: 13px 14px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #fff;
        }

        .html-editor-top > div {
          display: grid;
          gap: 3px;
        }

        .html-editor-top span {
          color: #aeb3bc;
          font-size: 11px;
        }

        .html-editor textarea {
          width: 100%;
          min-height: 250px;
          resize: vertical;
          border: 0;
          border-top: 1px solid #242730;
          border-bottom: 1px solid #242730;
          padding: 15px;
          outline: 0;
          background: #090a0d;
          color: #f2f4f8;
          font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .html-note {
          padding: 10px 14px;
          color: #9fa4ad;
          font-size: 11px;
        }

        .media-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .media-option {
          display: grid;
          grid-template-columns: 40px 1fr 18px;
          gap: 9px;
          align-items: center;
          min-width: 0;
          padding: 11px;
          border: 1px solid #e5e5e8;
          border-radius: 13px;
          color: #25282d;
          text-decoration: none;
        }

        .media-option:hover {
          border-color: #d0d2d7;
        }

        .media-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #f5f5f7;
        }

        .media-option > span:nth-child(2) {
          display: grid;
          gap: 2px;
          min-width: 0;
        }

        .media-option strong {
          font-size: 12px;
        }

        .media-option small {
          color: #898d94;
          font-size: 11px;
        }

        .media-option > span:last-child {
          color: #a0a4ab;
        }

        .save-space {
          width: 100%;
          min-height: 54px;
          border: 0;
          border-radius: 15px;
          background: #e84d78;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(232,77,120,.22);
        }

        .save-space:hover {
          filter: brightness(.97);
        }

        .save-space:disabled {
          opacity: .65;
          cursor: wait;
        }

        .preview-column {
          position: sticky;
          top: 92px;
        }

        .preview-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 4px;
        }

        .preview-heading > span:first-child {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #747981;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .11em;
        }

        .custom-live {
          padding: 5px 8px;
          border-radius: 999px;
          background: #fff0f5;
          color: #e84d78;
          font-size: 10px;
          font-weight: 900;
        }

        .profile-preview {
          min-height: 650px;
          overflow: hidden;
          box-shadow: 0 22px 60px rgba(17,24,39,.10);
          transition: .18s ease;
        }

        .preview-empty {
          min-height: 650px;
          padding: 70px 34px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
        }

        .preview-avatar {
          width: 86px;
          height: 86px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e84d78;
          color: #fff;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 13px;
        }

        .preview-name {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -.035em;
        }

        .preview-online {
          margin-top: 5px;
          color: #4f9a68;
          font-size: 12px;
          font-weight: 800;
        }

        .preview-card {
          width: min(100%, 520px);
          padding: 22px;
          border-radius: 16px;
          margin-top: 35px;
        }

        .preview-card strong {
          font-size: 16px;
        }

        .preview-card p {
          margin: 8px 0 0;
          color: inherit;
          opacity: .78;
          line-height: 1.65;
          font-size: 14px;
        }

        .preview-buttons {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }

        .preview-buttons span {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid currentColor;
          font-size: 12px;
          font-weight: 900;
        }

        .preview-buttons span:first-child {
          color: #fff;
          border-color: transparent;
        }

        .html-preview-frame {
          display: block;
          width: 100%;
          min-height: 650px;
          border: 0;
          background: transparent;
        }

        .preview-tagline {
          display: grid;
          gap: 5px;
          margin-top: 13px;
          padding: 0 5px;
        }

        .preview-tagline strong {
          font-size: 13px;
          line-height: 1.45;
        }

        .preview-tagline span {
          color: #8a8e96;
          font-size: 12px;
        }

        .preview-hint {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          color: #979ba2;
          font-size: 11px;
        }

        .studio-loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: #797d85;
          font-size: 14px;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr;
          }

          .preview-column {
            position: static;
          }

          .studio-nav {
            grid-template-columns: auto 1fr auto;
          }

          .studio-brand {
            justify-self: center;
          }
        }

        @media (max-width: 560px) {
          .studio-nav {
            height: 60px;
            padding: 0 16px;
          }

          .studio-back,
          .studio-profile-link {
            font-size: 12px;
          }

          .studio-wrap {
            width: min(100% - 20px, 1180px);
            padding-top: 32px;
          }

          .vibe-grid,
          .media-grid {
            grid-template-columns: 1fr 1fr;
          }

          .studio-section {
            padding: 16px;
            border-radius: 15px;
          }

          .preview-empty {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </main>
  );
}