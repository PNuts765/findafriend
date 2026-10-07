$files = @{}

$files["src/app/profile/page.tsx"] = @"
'use client';

import {
  FormEvent,
  useEffect,
  useState
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Save
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

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

export default function MyProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [firstName, setFirstName] =
    useState('');

  const [birthDate, setBirthDate] =
    useState('');

  const [gender, setGender] =
    useState('');

  const [city, setCity] =
    useState('');

  const [state, setState] =
    useState('');

  const [aboutMe, setAboutMe] =
    useState('');

  const [interests, setInterests] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    async function loadProfile() {
      setError('');

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          'You must be logged in to edit your profile.'
        );

        setLoading(false);
        return;
      }

      const {
        data,
        error: profileError
      } = await supabase
        .from('profiles')
        .select(
          'id, first_name, birth_date, gender, city, state, about_me, interests_text'
        )
        .eq('id', user.id)
        .single();

      if (profileError) {
        setError(
          profileError.message
        );

        setLoading(false);
        return;
      }

      const loaded =
        data as Profile;

      setProfile(loaded);

      setFirstName(
        loaded.first_name ?? ''
      );

      setBirthDate(
        loaded.birth_date ?? ''
      );

      setGender(
        loaded.gender ?? ''
      );

      setCity(
        loaded.city ?? ''
      );

      setState(
        loaded.state ?? ''
      );

      setAboutMe(
        loaded.about_me ?? ''
      );

      setInterests(
        loaded.interests_text ?? ''
      );

      setLoading(false);
    }

    loadProfile();
  }, []);

  function calculateAge(
    dateString: string
  ) {
    if (!dateString) {
      return 0;
    }

    const birth =
      new Date(dateString);

    const today =
      new Date();

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() -
      birth.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setMessage('');

    const cleanName =
      firstName.trim();

    if (!cleanName) {
      setError(
        'Please enter your first name.'
      );
      return;
    }

    if (!birthDate) {
      setError(
        'Please enter your birthday.'
      );
      return;
    }

    if (calculateAge(birthDate) < 18) {
      setError(
        'findafriend is for adults 18 and older.'
      );
      return;
    }

    setSaving(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        'Your session has expired. Please log in again.'
      );

      setSaving(false);
      return;
    }

    const {
      data,
      error: updateError
    } = await supabase
      .from('profiles')
      .update({
        first_name: cleanName,
        birth_date: birthDate,
        gender: gender || null,
        city: city.trim() || null,
        state: state.trim() || null,
        about_me: aboutMe.trim() || null,
        interests_text:
          interests.trim() || null
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      setError(
        updateError.message
      );

      setSaving(false);
      return;
    }

    setProfile(
      data as Profile
    );

    setMessage(
      'Profile saved successfully.'
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="app-shell">
        <div className="loading-state">
          Loading your profile...
        </div>
      </main>
    );
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

        <Link
          href="/me/photos"
          className="header-link"
        >
          Photos
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Edit Profile</h1>

          <p>
            Tell people a little about yourself.
          </p>
        </div>

        {error && (
          <div className="form-error profile-message">
            {error}
          </div>
        )}

        {message && (
          <div className="form-success profile-message">
            {message}
          </div>
        )}

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-section">
            <h2>Basics</h2>

            <label>
              First name
              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value
                  )
                }
                maxLength={50}
                required
              />
            </label>

            <label>
              Birthday
              <input
                type="date"
                value={birthDate}
                onChange={(event) =>
                  setBirthDate(
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Gender
              <select
                value={gender}
                onChange={(event) =>
                  setGender(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Prefer not to say
                </option>

                <option value="woman">
                  Woman
                </option>

                <option value="man">
                  Man
                </option>

                <option value="nonbinary">
                  Nonbinary
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </label>
          </div>

          <div className="profile-form-section">
            <h2>Location</h2>

            <div className="two-column-fields">
              <label>
                City
                <input
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  maxLength={80}
                />
              </label>

              <label>
                State
                <input
                  type="text"
                  value={state}
                  onChange={(event) =>
                    setState(
                      event.target.value
                    )
                  }
                  maxLength={80}
                />
              </label>
            </div>
          </div>

          <div className="profile-form-section">
            <h2>About Me</h2>

            <label>
              Introduction

              <textarea
                value={aboutMe}
                onChange={(event) =>
                  setAboutMe(
                    event.target.value
                  )
                }
                maxLength={1000}
                rows={7}
                placeholder="Tell people something about yourself..."
              />
            </label>

            <div className="character-count">
              {aboutMe.length}/1000
            </div>
          </div>

          <div className="profile-form-section">
            <h2>Interests</h2>

            <label>
              Interests

              <input
                type="text"
                value={interests}
                onChange={(event) =>
                  setInterests(
                    event.target.value
                  )
                }
                maxLength={500}
                placeholder="Music, books, hiking, gaming..."
              />
            </label>

            <p className="field-help">
              Separate interests with commas.
            </p>
          </div>

          <div className="profile-save-area">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? 'Saving...'
                : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
"@

$files["src/app/globals.css"] += @"

.profile-form {
  width: min(100%, 760px);
  margin: 0 auto;
}

.profile-form-section {
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #e4e4e4;
  border-radius: 14px;
  background: #fff;
}

.profile-form-section h2 {
  margin: 0 0 20px;
  font-size: 18px;
}

.profile-form-section label {
  display: block;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
}

.profile-form-section label:last-child {
  margin-bottom: 0;
}

.profile-form-section input,
.profile-form-section select,
.profile-form-section textarea {
  display: block;
  width: 100%;
  margin-top: 7px;
  padding: 12px 13px;
  border: 1px solid #d8d8d8;
  border-radius: 9px;
  background: #fff;
  color: #222;
  font: inherit;
  box-sizing: border-box;
}

.profile-form-section textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.5;
}

.profile-form-section input:focus,
.profile-form-section select:focus,
.profile-form-section textarea:focus {
  outline: 2px solid #ddd;
  outline-offset: 1px;
}

.two-column-fields {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field-help {
  margin: 7px 0 0;
  color: #777;
  font-size: 12px;
}

.character-count {
  margin-top: -9px;
  margin-bottom: 0;
  text-align: right;
  color: #888;
  font-size: 12px;
}

.profile-message {
  width: min(100%, 760px);
  margin: 0 auto 16px;
}

.profile-save-area {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 30px;
}

.profile-save-area .primary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 600px) {
  .two-column-fields {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .profile-form-section {
    padding: 18px;
  }

  .profile-save-area {
    justify-content: stretch;
  }

  .profile-save-area .primary-button {
    width: 100%;
    justify-content: center;
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
Write-Host "findafriend profile editing built successfully." -ForegroundColor Green
Write-Host "Created: real profile loading, editing, validation, and saving." -ForegroundColor Green
Write-Host "Connected: name, birthday, gender, location, bio, and interests." -ForegroundColor Green
Write-Host ""
