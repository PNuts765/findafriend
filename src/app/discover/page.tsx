'use client';

import { useEffect, useState } from 'react';
import { Heart, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getProfiles, likeProfile } from '@/lib/data';

type Profile = {
  id: string;
  first_name: string;
  birth_date: string | null;
  city: string | null;
  state: string | null;
  about_me: string | null;
  interests_text: string | null;
};

function calculateAge(birthDate: string | null) {
  if (!birthDate) return '';

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference =
    today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birth.getDate()
    )
  ) {
    age--;
  }

  return age;
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setError('');

        const result = await getProfiles();

        if (result.error) {
          setError(result.error.message);
          setProfiles([]);
          return;
        }

        setProfiles((result.profiles ?? []) as Profile[]);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load people right now.';

        setError(message);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function next(like: boolean) {
    const person = profiles[index];

    if (!person) return;

    if (like) {
      await likeProfile(person.id);
    }

    setIndex((current) => current + 1);
  }

  if (loading) {
    return (
      <main className="app-shell">
        <div className="loading-state">
          Loading people...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell">
        <div className="empty-state">
          <h1>Something went wrong</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const person = profiles[index];

  if (!person) {
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

        <div className="empty-state">
          <h1>You&apos;ve reached the end.</h1>
          <p>Check back later for more people.</p>
        </div>
      </main>
    );
  }

  const age = calculateAge(person.birth_date);

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
              <h2>
                {person.first_name}
                {age ? `, ${age}` : ''}
              </h2>

              {(person.city || person.state) && (
                <div className="distance">
                  <MapPin size={16} />
                  {[person.city, person.state]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              )}

              <p>
                {person.about_me ||
                  'No introduction yet.'}
              </p>

              {person.interests_text && (
                <div className="interest-list">
                  {person.interests_text
                    .split(',')
                    .map((interest) => (
                      <span key={interest}>
                        {interest.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </Link>

          <div className="actions">
            <button
              className="action pass"
              onClick={() => next(false)}
              aria-label="Pass"
            >
              <X size={30} />
            </button>

            <button
              className="action like"
              onClick={() => next(true)}
              aria-label="Like"
            >
              <Heart size={30} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


