'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useState
} from 'react';

import Link from 'next/link';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';


import { getProfiles } from '@/lib/data';

type Profile = {
  id: string;
  first_name: string;
  birth_date: string | null;
  city: string | null;
  state: string | null;
  about_me?: string | null;
  interests_text?: string | null;
  photos?: {
    id: string;
    storage_path: string;
    display_order: number;
  }[];
};

function getAge(date: string | null) {
  if (!date) return '';

  const birth = new Date(date);
  const now = new Date();

  let result =
    now.getFullYear() -
    birth.getFullYear();

  if (
    now.getMonth() < birth.getMonth() ||
    (
      now.getMonth() === birth.getMonth() &&
      now.getDate() < birth.getDate()
    )
  ) {
    result--;
  }

  return result;
}

function BrowsePageContent() {

  const [people, setPeople] =
    useState<Profile[]>([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const result = await getProfiles();

        if (!active) return;

        if (result.error) {
          setError(result.error.message);
          setPeople([]);
        } else {
          setPeople(
            result.profiles as Profile[]
          );
        }
      } catch (caught) {
        if (!active) return;

        setPeople([]);

        setError(
          caught instanceof Error
            ? caught.message
            : 'Unable to load profiles.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(
        window.location.search
      );

      setSearch(
        params.get('search') ?? ''
      );
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);
  const filteredPeople = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return people;
    }

    return people.filter((person) => {
      const searchable = [
        person.first_name,
        person.city,
        person.state,
        person.about_me,
        person.interests_text
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [people, search]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          findafriend<span>.</span>
        </Link>

        <div className="browse-header-actions">
          <Link
            href="/discover"
            className="header-link"
          >
            Discover
          </Link>

          <Link
            href="/me"
            className="header-link"
          >
            Me
          </Link>
        </div>
      </header>

      <section className="content browse-page">
        <div className="browse-hero">
          <div>
            <span className="section-kicker">
              Manual lookup
            </span>

            <h1>Find someone specific.</h1>

            <p>
              Search people by name, location,
              or interests.
            </p>
          </div>

          <form
            className="browse-search"
            onSubmit={(event) =>
              event.preventDefault()
            }
          >
            <Search size={19} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Name, city, interest..."
              aria-label="Search people"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="browse-toolbar">
          <span>
            {loading
              ? 'Finding people...'
              : `${filteredPeople.length} ${
                  filteredPeople.length === 1
                    ? 'person'
                    : 'people'
                }`}
          </span>

          <button
            type="button"
            className="browse-filter-button"
            disabled
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            Finding people...
          </div>
        ) : error ? (
          <div className="empty-state">
            <h2>We couldn&apos;t load people.</h2>
            <p>{error}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try again
            </button>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="empty-state">
            <h2>
              {search
                ? 'No one matched that search.'
                : 'No profiles yet.'}
            </h2>

            <p>
              {search
                ? 'Try another name, city, or interest.'
                : 'New people will appear here as they join.'}
            </p>

            {search && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSearch('')}
              >
                Show everyone
              </button>
            )}
          </div>
        ) : (
          <div className="browse-grid">
            {filteredPeople.map((person) => {
              const age = getAge(
                person.birth_date
              );

              return (
                <Link
                  href={`/profile/${person.id}`}
                  key={person.id}
                  className="browse-card"
                >
                  <div className="browse-photo">
                    <span>Photo</span>
                  </div>

                  <div className="browse-info">
                    <div className="browse-name">
                      <h2>
                        {person.first_name}
                        {age
                          ? `, ${age}`
                          : ''}
                      </h2>
                    </div>

                    {(person.city ||
                      person.state) && (
                      <div className="distance">
                        <MapPin size={14} />

                        {[
                          person.city,
                          person.state
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}

                    {person.about_me && (
                      <p>
                        {person.about_me}
                      </p>
                    )}

                    {person.interests_text && (
                      <div className="interest-list">
                        {person.interests_text
                          .split(',')
                          .slice(0, 3)
                          .map((interest) => (
                            <span
                              key={interest.trim()}
                            >
                              {interest.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <div className="loading-state">
            Loading profiles...
          </div>
        </main>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}