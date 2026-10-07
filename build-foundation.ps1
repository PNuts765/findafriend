$files = @{}

$files["src/app/page.tsx"] = @"
'use client';

import { Heart, Users, MessageCircle, User, X, MapPin } from 'lucide-react';

const people = [
  {
    name: 'Jessica',
    age: 29,
    distance: 14,
    about: 'Coffee, live music, good food, and meeting interesting people.'
  },
  {
    name: 'Marcus',
    age: 34,
    distance: 22,
    about: 'Outdoor guy who enjoys hiking, movies, and trying new places.'
  },
  {
    name: 'Ashley',
    age: 26,
    distance: 31,
    about: 'Book lover, animal person, and always up for an adventure.'
  }
];

export default function Home() {
  const person = people[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">findafriend</div>
        <button className="login-button">Log In</button>
      </header>

      <section className="content">
        <div className="hero">
          <h1>Meet people around you.</h1>
          <p>Simple. Affordable. No bullshit.</p>
        </div>

        <nav className="tabs">
          <button className="tab active">
            <Heart size={18} />
            Discover
          </button>

          <button className="tab">
            <Users size={18} />
            Browse
          </button>

          <button className="tab">
            <MessageCircle size={18} />
            Messages
          </button>

          <button className="tab">
            <User size={18} />
            Me
          </button>
        </nav>

        <div className="discover-area">
          <div className="profile-card">
            <div className="profile-photo">
              <span>Profile Photo</span>
            </div>

            <div className="profile-info">
              <h2>{person.name}, {person.age}</h2>

              <div className="distance">
                <MapPin size={16} />
                {person.distance} miles away
              </div>

              <p>{person.about}</p>
            </div>
          </div>

          <div className="actions">
            <button className="action pass" aria-label="Pass">
              <X size={30} />
            </button>

            <button className="action like" aria-label="Like">
              <Heart size={30} />
            </button>
          </div>
        </div>
      </section>

      <footer>
        <span>findafriend</span>
        <span>Meet people. Keep it simple.</span>
      </footer>
    </main>
  );
}
"@

$files["src/app/globals.css"] = @"
:root {
  --background: #ffffff;
  --foreground: #171717;
  --muted: #707070;
  --border: #e8e8e8;
  --soft: #f7f7f7;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

button {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
}

.brand {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -1px;
}

.login-button {
  border: 1px solid #d8d8d8;
  background: white;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.content {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 34px 24px 60px;
  flex: 1;
}

.hero {
  text-align: center;
  margin-bottom: 28px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(30px, 5vw, 46px);
  letter-spacing: -1.5px;
}

.hero p {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 18px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 13px 16px;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: var(--foreground);
  border-bottom-color: var(--foreground);
  font-weight: 700;
}

.discover-area {
  width: min(100%, 430px);
  margin: 0 auto;
}

.profile-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.profile-photo {
  height: 480px;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
}

.profile-info {
  padding: 22px;
}

.profile-info h2 {
  margin: 0 0 7px;
  font-size: 28px;
}

.profile-info p {
  color: #555;
  line-height: 1.55;
  margin-bottom: 0;
}

.distance {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 15px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 28px;
  padding: 22px 0;
}

.action {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: white;
  cursor: pointer;
}

.action.pass,
.action.like {
  border: 2px solid #222;
  color: #222;
}

footer {
  border-top: 1px solid var(--border);
  padding: 22px 32px;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .topbar {
    padding: 0 18px;
  }

  .content {
    padding: 26px 16px 40px;
  }

  .tabs {
    justify-content: space-between;
  }

  .tab {
    padding: 12px 8px;
    font-size: 13px;
  }

  .profile-photo {
    height: 390px;
  }

  footer {
    padding: 18px;
    flex-direction: column;
    gap: 6px;
  }
}
"@

$files["src/app/layout.tsx"] = @"
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'findafriend',
  description: 'Meet people around you.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
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
Write-Host "findafriend foundation created successfully." -ForegroundColor Green
Write-Host ""
