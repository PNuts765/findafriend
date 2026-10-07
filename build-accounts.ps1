$files = @{}

$files["src/app/login/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>

        <h1>Log in</h1>
        <p className="form-subtitle">Welcome back.</p>

        <form className="form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Password" />
          </label>

          <button type="submit" className="primary-button">
            Log In
          </button>
        </form>

        <Link href="/forgot-password" className="text-link">
          Forgot password?
        </Link>

        <div className="form-footer">
          Don't have an account?{' '}
          <Link href="/create-account">Create one</Link>
        </div>
      </div>
    </main>
  );
}
"@

$files["src/app/create-account/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function CreateAccountPage() {
  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>

        <h1>Create account</h1>
        <p className="form-subtitle">Join people around you.</p>

        <form className="form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create a password" required />
          </label>

          <label>
            Birthday
            <input type="date" required />
          </label>

          <label className="checkbox-row">
            <input type="checkbox" required />
            <span>I am 18 or older.</span>
          </label>

          <button type="submit" className="primary-button">
            Continue
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{' '}
          <Link href="/login">Log in</Link>
        </div>
      </div>
    </main>
  );
}
"@

$files["src/app/forgot-password/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>

        <h1>Forgot password?</h1>
        <p className="form-subtitle">
          Enter your email and we'll send you a secure reset link.
        </p>

        <form className="form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" required />
          </label>

          <button type="submit" className="primary-button">
            Send Reset Link
          </button>
        </form>

        <Link href="/login" className="text-link">
          Back to Log In
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/profile/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="form-page">
      <div className="form-card profile-form-card">
        <div className="form-brand">findafriend</div>

        <h1>Create your profile</h1>
        <p className="form-subtitle">
          Keep it simple. Tell people a little about you.
        </p>

        <form className="form">
          <div className="photo-upload">
            <div className="photo-placeholder">+</div>
            <div>
              <strong>Add your photos</strong>
              <span>Free members can add up to 3 photos.</span>
            </div>
          </div>

          <label>
            First name
            <input type="text" placeholder="First name" required />
          </label>

          <label>
            Gender
            <select defaultValue="">
              <option value="" disabled>Select one</option>
              <option>Man</option>
              <option>Woman</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </label>

          <label>
            Location
            <input type="text" placeholder="City, State" />
          </label>

          <label>
            About Me
            <textarea
              placeholder="Tell people a little about yourself..."
              rows={5}
            />
          </label>

          <label>
            Interests
            <input
              type="text"
              placeholder="Music, hiking, movies..."
            />
          </label>

          <button type="submit" className="primary-button">
            Start Finding People
          </button>
        </form>

        <Link href="/" className="text-link">
          Back to findafriend
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/me/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function MePage() {
  return (
    <main className="me-page">
      <header className="simple-header">
        <Link href="/" className="form-brand">findafriend</Link>
      </header>

      <section className="me-content">
        <div className="me-photo">Profile Photo</div>

        <h1>Toy, 35</h1>
        <p className="me-location">Richmond, IN</p>

        <div className="me-section">
          <h2>About Me</h2>
          <p>
            Tell people about yourself and what makes you unique.
          </p>
        </div>

        <div className="me-section">
          <h2>Interests</h2>
          <p>Music · Movies · Food · Travel</p>
        </div>

        <div className="me-actions">
          <Link href="/profile" className="secondary-button">
            Edit Profile
          </Link>

          <Link href="/pro" className="secondary-button">
            Pro
          </Link>

          <Link href="/settings" className="secondary-button">
            Settings
          </Link>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/settings/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <main className="settings-page">
      <header className="simple-header">
        <Link href="/" className="form-brand">findafriend</Link>
      </header>

      <section className="settings-content">
        <h1>Settings</h1>

        <div className="settings-list">
          <label>
            Discovery distance
            <select defaultValue="100">
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
            </select>
          </label>

          <div className="setting-row">
            <span>Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>

          <Link href="/forgot-password" className="setting-link">
            Change Password
          </Link>

          <button className="setting-link danger">
            Log Out
          </button>

          <button className="setting-link danger">
            Delete Account
          </button>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/pro/page.tsx"] = @"
'use client';

import Link from 'next/link';

export default function ProPage() {
  return (
    <main className="pro-page">
      <div className="pro-card">
        <div className="form-brand">findafriend</div>

        <h1>Pro</h1>

        <p className="pro-tagline">
          More freedom. That's it.
        </p>

        <div className="pro-features">
          <div>
            <strong>Unlimited messages</strong>
            <span>No weekly message limit.</span>
          </div>

          <div>
            <strong>Up to 30 photos</strong>
            <span>Show more of yourself.</span>
          </div>
        </div>

        <div className="pricing">
          <div>
            <strong>$5.99</strong>
            <span>/ month</span>
          </div>

          <div>
            <strong>$59.99</strong>
            <span>/ year</span>
          </div>
        </div>

        <button className="primary-button">
          Get Pro
        </button>

        <p className="small-note">
          Cancel anytime.
        </p>

        <Link href="/" className="text-link">
          Back to findafriend
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/globals.css"] += @"

.form-page {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 16px;
}

.form-card {
  width: min(100%, 480px);
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  padding: 34px;
  box-shadow: 0 10px 35px rgba(0,0,0,.06);
}

.form-brand {
  display: inline-block;
  color: #111;
  text-decoration: none;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 28px;
}

.form-card h1 {
  margin: 0;
  font-size: 32px;
  letter-spacing: -1px;
}

.form-subtitle {
  color: #707070;
  line-height: 1.5;
  margin: 8px 0 25px;
}

.form {
  display: grid;
  gap: 18px;
}

.form label {
  display: grid;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
}

.form input,
.form select,
.form textarea {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 9px;
  background: white;
  color: #171717;
  font: inherit;
  font-weight: 400;
}

.form textarea {
  resize: vertical;
}

.primary-button {
  width: 100%;
  border: 0;
  border-radius: 9px;
  background: #111;
  color: white;
  padding: 14px;
  font-weight: 700;
  cursor: pointer;
}

.checkbox-row {
  display: flex !important;
  grid-template-columns: none !important;
  align-items: center;
  gap: 9px !important;
}

.checkbox-row input {
  width: auto;
}

.text-link {
  display: block;
  color: #333;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.form-footer {
  text-align: center;
  color: #707070;
  font-size: 14px;
  margin-top: 28px;
}

.form-footer a {
  color: #111;
  font-weight: 700;
}

.photo-upload {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px dashed #cfcfcf;
  border-radius: 12px;
}

.photo-placeholder {
  width: 62px;
  height: 62px;
  border-radius: 10px;
  background: #f0f0f0;
  display: grid;
  place-items: center;
  font-size: 28px;
  color: #777;
}

.photo-upload strong,
.photo-upload span {
  display: block;
}

.photo-upload span {
  color: #777;
  font-size: 13px;
  margin-top: 4px;
}

.me-page,
.settings-page {
  min-height: 100vh;
  background: #fff;
}

.simple-header {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 28px;
  border-bottom: 1px solid #e8e8e8;
}

.me-content,
.settings-content {
  width: min(100%, 650px);
  margin: 0 auto;
  padding: 40px 20px;
}

.me-photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #ededed;
  display: grid;
  place-items: center;
  color: #888;
  margin-bottom: 22px;
}

.me-content h1 {
  margin: 0;
  font-size: 32px;
}

.me-location {
  color: #777;
}

.me-section {
  margin-top: 30px;
}

.me-section h2 {
  font-size: 18px;
  margin-bottom: 7px;
}

.me-section p {
  color: #555;
  line-height: 1.6;
}

.me-actions {
  display: grid;
  gap: 10px;
  margin-top: 35px;
}

.secondary-button {
  display: block;
  text-align: center;
  padding: 13px;
  border: 1px solid #d8d8d8;
  border-radius: 9px;
  color: #171717;
  text-decoration: none;
  font-weight: 600;
}

.settings-content h1 {
  font-size: 34px;
}

.settings-list {
  display: grid;
  gap: 12px;
  margin-top: 25px;
}

.settings-list label,
.setting-row,
.setting-link {
  padding: 17px;
  border: 1px solid #e7e7e7;
  border-radius: 10px;
  background: white;
  color: #222;
}

.settings-list label {
  display: grid;
  gap: 9px;
  font-size: 14px;
  font-weight: 600;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-link {
  display: block;
  text-decoration: none;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.danger {
  color: #a00000;
}

.pro-page {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 16px;
}

.pro-card {
  width: min(100%, 500px);
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 36px;
  text-align: center;
  box-shadow: 0 10px 35px rgba(0,0,0,.06);
}

.pro-card h1 {
  font-size: 42px;
  margin: 0;
}

.pro-tagline {
  color: #707070;
  margin-bottom: 30px;
}

.pro-features {
  display: grid;
  gap: 10px;
  text-align: left;
}

.pro-features div {
  padding: 17px;
  border: 1px solid #e7e7e7;
  border-radius: 10px;
}

.pro-features strong,
.pro-features span {
  display: block;
}

.pro-features span {
  color: #777;
  font-size: 14px;
  margin-top: 4px;
}

.pricing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 25px 0;
}

.pricing div {
  border: 1px solid #e7e7e7;
  border-radius: 10px;
  padding: 18px 10px;
}

.pricing strong {
  font-size: 25px;
}

.pricing span {
  color: #777;
}

.small-note {
  color: #777;
  font-size: 13px;
}
"@

foreach ($path in $files.Keys) {
    $directory = Split-Path $path -Parent

    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force $directory | Out-Null
    }

    Set-Content -Path $path -Value $files[$path] -Encoding UTF8
}

Write-Host ""
Write-Host "findafriend Accounts + Profiles build completed." -ForegroundColor Green
Write-Host "Created: Login, Create Account, Forgot Password, Profile, Me, Settings, Pro." -ForegroundColor Green
Write-Host ""
