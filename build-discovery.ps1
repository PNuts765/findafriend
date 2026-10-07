$files = @{}

$files["src/app/discover/page.tsx"] = @"
'use client';

import { useState } from 'react';
import { Heart, X, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const people = [
  {
    id: 1,
    name: 'Jessica',
    age: 29,
    distance: 14,
    about: 'Coffee, live music, good food, and meeting interesting people.',
    interests: ['Music', 'Food', 'Travel']
  },
  {
    id: 2,
    name: 'Marcus',
    age: 34,
    distance: 22,
    about: 'Outdoor guy who enjoys hiking, movies, and trying new places.',
    interests: ['Hiking', 'Movies', 'Outdoors']
  },
  {
    id: 3,
    name: 'Ashley',
    age: 26,
    distance: 31,
    about: 'Book lover, animal person, and always up for an adventure.',
    interests: ['Books', 'Animals', 'Travel']
  }
];

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const person = people[currentIndex];

  function nextPerson() {
    setCurrentIndex((currentIndex + 1) % people.length);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          findafriend
        </Link>

        <Link href="/me" className="header-link">
          Me
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Discover</h1>
          <p>Meet people around you.</p>
        </div>

        <div className="discover-area">
          <Link
            href={`/profile/${person.id}`}
            className="profile-card profile-card-link"
          >
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

              <div className="interest-list">
                {person.interests.map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            </div>
          </Link>

          <div className="actions">
            <button
              className="action pass"
              onClick={nextPerson}
              aria-label="Pass"
            >
              <X size={30} />
            </button>

            <button
              className="action like"
              onClick={nextPerson}
              aria-label="Like"
            >
              <Heart size={30} />
            </button>
          </div>

          <div className="swipe-hint">
            Swipe left to pass · Swipe right to like
          </div>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/browse/page.tsx"] = @"
'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';

const people = [
  { id: 1, name: 'Jessica', age: 29, distance: 14 },
  { id: 2, name: 'Marcus', age: 34, distance: 22 },
  { id: 3, name: 'Ashley', age: 26, distance: 31 },
  { id: 4, name: 'Daniel', age: 41, distance: 38 },
  { id: 5, name: 'Megan', age: 32, distance: 44 },
  { id: 6, name: 'Chris', age: 28, distance: 51 }
];

export default function BrowsePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          findafriend
        </Link>

        <Link href="/me" className="header-link">
          Me
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Browse</h1>
          <p>People around you.</p>
        </div>

        <div className="browse-grid">
          {people.map((person) => (
            <Link
              href={`/profile/${person.id}`}
              key={person.id}
              className="browse-card"
            >
              <div className="browse-photo">
                <span>Photo</span>
              </div>

              <div className="browse-info">
                <h2>{person.name}, {person.age}</h2>

                <div className="distance">
                  <MapPin size={14} />
                  {person.distance} miles away
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/profile/[id]/page.tsx"] = @"
'use client';

import { Heart, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

const people: Record<string, {
  name: string;
  age: number;
  distance: number;
  about: string;
  interests: string[];
}> = {
  '1': {
    name: 'Jessica',
    age: 29,
    distance: 14,
    about: 'Coffee, live music, good food, and meeting interesting people.',
    interests: ['Music', 'Food', 'Travel']
  },
  '2': {
    name: 'Marcus',
    age: 34,
    distance: 22,
    about: 'Outdoor guy who enjoys hiking, movies, and trying new places.',
    interests: ['Hiking', 'Movies', 'Outdoors']
  },
  '3': {
    name: 'Ashley',
    age: 26,
    distance: 31,
    about: 'Book lover, animal person, and always up for an adventure.',
    interests: ['Books', 'Animals', 'Travel']
  },
  '4': {
    name: 'Daniel',
    age: 41,
    distance: 38,
    about: 'Always looking for good conversation and new experiences.',
    interests: ['Sports', 'Music', 'Food']
  },
  '5': {
    name: 'Megan',
    age: 32,
    distance: 44,
    about: 'Love exploring new places, cooking, and spending time outside.',
    interests: ['Cooking', 'Travel', 'Outdoors']
  },
  '6': {
    name: 'Chris',
    age: 28,
    distance: 51,
    about: 'Movies, gaming, music, and finding great local restaurants.',
    interests: ['Movies', 'Gaming', 'Food']
  }
};

export default function ProfilePage({
  params
}: {
  params: { id: string }
}) {
  const person = people[params.id] ?? people['1'];

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/browse" className="brand">
          findafriend
        </Link>

        <Link href="/me" className="header-link">
          Me
        </Link>
      </header>

      <section className="profile-detail">
        <div className="detail-photo">
          <span>Profile Photo</span>
        </div>

        <div className="detail-info">
          <h1>{person.name}, {person.age}</h1>

          <div className="distance">
            <MapPin size={16} />
            {person.distance} miles away
          </div>

          <section className="detail-section">
            <h2>About Me</h2>
            <p>{person.about}</p>
          </section>

          <section className="detail-section">
            <h2>Interests</h2>

            <div className="interest-list">
              {person.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>Photos</h2>

            <div className="photo-gallery-preview">
              <div>Photo</div>
              <div>Photo</div>
              <div>Photo</div>
            </div>

            <p className="gallery-note">
              Additional profile photos are available according to the user's
              account type.
            </p>
          </section>

          <div className="profile-actions">
            <button className="secondary-action">
              <Heart size={19} />
              Like
            </button>

            <Link href="/messages" className="primary-action">
              <MessageCircle size={19} />
              Message
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/likes/page.tsx"] = @"
'use client';

import { Heart, MapPin } from 'lucide-react';
import Link from 'next/link';

const likes = [
  { id: 1, name: 'Jessica', age: 29, distance: 14 },
  { id: 3, name: 'Ashley', age: 26, distance: 31 }
];

export default function LikesPage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          findafriend
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Likes</h1>
          <p>People you've liked.</p>
        </div>

        <div className="likes-list">
          {likes.map((person) => (
            <Link
              href={`/profile/${person.id}`}
              className="like-card"
              key={person.id}
            >
              <div className="like-photo">Photo</div>

              <div>
                <h2>{person.name}, {person.age}</h2>

                <div className="distance">
                  <MapPin size={14} />
                  {person.distance} miles away
                </div>
              </div>

              <Heart size={20} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/globals.css"] += @"

.page-heading {
  text-align: center;
  margin-bottom: 30px;
}

.page-heading h1 {
  margin: 0;
  font-size: 34px;
  letter-spacing: -1px;
}

.page-heading p {
  color: #707070;
  margin: 8px 0 0;
}

.header-link {
  color: #222;
  text-decoration: none;
  font-weight: 600;
}

.profile-card-link {
  color: inherit;
  text-decoration: none;
  display: block;
}

.interest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 13px;
}

.interest-list span {
  background: #f1f1f1;
  border-radius: 20px;
  padding: 6px 10px;
  color: #555;
  font-size: 13px;
}

.swipe-hint {
  text-align: center;
  color: #888;
  font-size: 13px;
}

.browse-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.browse-card {
  text-decoration: none;
  color: inherit;
  border: 1px solid #e7e7e7;
  border-radius: 14px;
  overflow: hidden;
  background: white;
}

.browse-photo {
  height: 270px;
  background: #ededed;
  display: grid;
  place-items: center;
  color: #999;
}

.browse-info {
  padding: 15px;
}

.browse-info h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.profile-detail {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 35px 20px 70px;
}

.detail-photo {
  height: 520px;
  background: #ededed;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #999;
}

.detail-info {
  padding: 25px 5px;
}

.detail-info h1 {
  margin: 0 0 7px;
  font-size: 36px;
  letter-spacing: -1px;
}

.detail-section {
  margin-top: 28px;
}

.detail-section h2 {
  font-size: 18px;
  margin-bottom: 7px;
}

.detail-section p {
  color: #555;
  line-height: 1.6;
}

.photo-gallery-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo-gallery-preview div {
  aspect-ratio: 1;
  background: #ededed;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #999;
}

.gallery-note {
  font-size: 13px;
  color: #888 !important;
}

.profile-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 35px;
}

.primary-action,
.secondary-action {
  min-height: 50px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  font: inherit;
}

.primary-action {
  background: #111;
  color: white;
  border: 1px solid #111;
}

.secondary-action {
  background: white;
  color: #111;
  border: 1px solid #d7d7d7;
}

.likes-list {
  width: min(100%, 650px);
  margin: 0 auto;
  display: grid;
  gap: 10px;
}

.like-card {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
}

.like-photo {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: #ededed;
  display: grid;
  place-items: center;
  color: #999;
  font-size: 12px;
}

.like-card h2 {
  margin: 0 0 5px;
  font-size: 18px;
}

@media (max-width: 760px) {
  .browse-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-photo {
    height: 420px;
  }
}

@media (max-width: 500px) {
  .browse-grid {
    grid-template-columns: 1fr;
  }

  .profile-actions {
    grid-template-columns: 1fr;
  }
}
"@

foreach ($path in $files.Keys) {
    $directory = Split-Path $path -Parent

    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force $directory | Out-Null
    }

    [IO.File]::WriteAllText($path, $files[$path], (New-Object System.Text.UTF8Encoding($false)))
}

Write-Host ""
Write-Host "findafriend Discover + Browse + Profiles + Likes build completed." -ForegroundColor Green
Write-Host ""
