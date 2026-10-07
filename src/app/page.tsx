'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X
} from 'lucide-react';

import { likeProfile } from '@/lib/data';

type Photo = {
  id: string;
  storage_path: string;
  display_order: number;
};

type Person = {
  id: string;
  first_name: string;
  birth_date: string | null;
  city: string | null;
  state: string | null;
  about_me: string | null;
  interests_text: string | null;
  photos?: Photo[];
};

const fallbackPeople: Person[] = [
  {
    id: 'demo-1',
    first_name: 'Jessica',
    birth_date: '1997-04-12',
    city: 'Richmond',
    state: 'IN',
    about_me:
      'Coffee, live music, good food, and meeting interesting people.',
    interests_text: 'Music, Coffee, Travel',
    photos: []
  },
  {
    id: 'demo-2',
    first_name: 'Marcus',
    birth_date: '1992-08-19',
    city: 'Richmond',
    state: 'IN',
    about_me:
      'Outdoor guy who enjoys hiking, movies, and trying new places.',
    interests_text: 'Hiking, Movies, Food',
    photos: []
  },
  {
    id: 'demo-3',
    first_name: 'Ashley',
    birth_date: '2000-01-28',
    city: 'Connersville',
    state: 'IN',
    about_me:
      'Book lover, animal person, and always up for an adventure.',
    interests_text: 'Books, Animals, Travel',
    photos: []
  }
];

const demoPhotos = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85'
];

function getAge(date: string | null) {
  if (!date) return '';

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

  return age;
}

function getPhoto(person: Person, index: number) {
  const photo = [...(person.photos ?? [])]
    .sort(
      (a, b) =>
        a.display_order - b.display_order
    )[0];

  if (photo?.storage_path) {
    return null;
  }

  return demoPhotos[index % demoPhotos.length];
}

function getInitials(person: Person) {
  return person.first_name
    .slice(0, 1)
    .toUpperCase();
}

function getLocation(person: Person) {
  return [
    person.city,
    person.state
  ]
    .filter(Boolean)
    .join(', ');
}

function getInterests(person: Person) {
  return (person.interests_text ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

const nav = [
  {
    href: '/discover',
    label: 'Discover',
    icon: Heart
  },
  {
    href: '/browse',
    label: 'Browse',
    icon: Users
  },
  {
    href: '/likes',
    label: 'Likes',
    icon: Heart
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: MessageCircle
  },
  {
    href: '/me',
    label: 'Me',
    icon: User
  }
];

export default function Home() {
  const router = useRouter();

  const [people, setPeople] =
    useState<Person[]>(fallbackPeople);

  const [index, setIndex] =
    useState(0);

  const [dragX, setDragX] =
    useState(0);

  const [dragging, setDragging] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const startX =
    useRef<number | null>(null);

  const navigationLockRef =
    useRef(false);

  const person =
    people[index % people.length];

  const nextPerson =
    people[(index + 1) % people.length];

  const photo =
    getPhoto(person, index);

  const nextPhoto =
    getPhoto(nextPerson, index + 1);

  const interests =
    getInterests(person);

  const age =
    getAge(person.birth_date);

  function advance(
    direction: 'left' | 'right'
  ) {
    if (navigationLockRef.current) {
      return;
    }

    const step =
      direction === 'right' ? -1 : 1;

    const currentIndex = index;
    const nextIndex = currentIndex + step;

    if (
      nextIndex < 0 ||
      nextIndex >= people.length
    ) {
      return;
    }

    navigationLockRef.current = true;

    setDragX(
      direction === 'right'
        ? 520
        : -520
    );

    window.setTimeout(() => {
      setIndex(nextIndex);
      setDragX(0);
      navigationLockRef.current = false;
    }, 190);
  }

  async function likeCurrent() {
    if (
      !person.id.startsWith('demo-')
    ) {
      await likeProfile(person.id);
    }

    advance('right');
  }

  useEffect(() => {
    function handleDeckKeyboard(
      event: KeyboardEvent
    ) {
      if (
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight'
      ) {
        return;
      }

      const target =
        event.target as HTMLElement | null;

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === 'ArrowLeft') {
        advance('right');
      } else {
        advance('left');
      }
    }

    window.addEventListener(
      'keydown',
      handleDeckKeyboard
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleDeckKeyboard
      );
    };
  }, [index, people.length]);
  function beginDrag(clientX: number) {
    startX.current = clientX;
    setDragging(true);
  }

  function moveDrag(clientX: number) {
    if (startX.current === null) {
      return;
    }

    setDragX(
      clientX - startX.current
    );
  }

  function finishDrag() {
    if (startX.current === null) {
      return;
    }

    const distance = dragX;

    startX.current = null;
    setDragging(false);

    if (Math.abs(distance) < 90) {
      setDragX(0);
      return;
    }

    if (distance > 0) {
      void likeCurrent();
    } else {
      advance('left');
    }
  }

  const searchUrl = useMemo(() => {
    const query = search.trim();

    if (!query) {
      return '/browse';
    }

    return `/browse?search=${encodeURIComponent(query)}`;
  }, [search]);

  function submitSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    router.push(searchUrl);
  }

  return (
    <main className="app-shell home-page">
      <header className="topbar home-topbar">
        <Link href="/" className="brand">
          findafriend<span>.</span>
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="header-link"
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="home-auth">
          <Link
            href="/login"
            className="home-login"
          >
            Log in
          </Link>

          <Link
            href="/create-account"
            className="home-join"
          >
            Join free
          </Link>
        </div>
      </header>

      <section className="home-discovery">
        <div className="home-copy">
          <span className="home-kicker">
            <Sparkles size={14} />
            Find someone new
          </span>

          <h1 className="home-tagline">
            Find someone who matches your vibe.
            <br />
            <span>Enter their space.</span>
            <br />
            <span className="home-brand-line">findafriend.</span>
          </h1>

          <p className="home-lead">
            Discover people nearby, find someone
            who catches your attention, and start
            a conversation.
          </p>

          <div className="home-primary-actions">
            <Link
              href="/discover"
              className="home-primary"
            >
              Start discovering
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/create-account"
              className="home-secondary"
            >
              Create a free profile
            </Link>
          </div>

          <form
            className="home-search"
            onSubmit={submitSearch}
          >
            <Search size={19} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search people by name, city, or interest"
              aria-label="Search people"
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="home-stat-row">
            <div>
              <strong>
                <Heart size={15} />
                Discover
              </strong>
              <span>
                Swipe through profiles
              </span>
            </div>

            <div>
              <strong>
                <Search size={15} />
                Search
              </strong>
              <span>
                Find someone specific
              </span>
            </div>

            <div>
              <strong>
                <MessageCircle size={15} />
                Connect
              </strong>
              <span>
                Start a conversation
              </span>
            </div>
          </div>
        </div>

        <div className="home-deck">
          <div className="deck-heading">
            <div>
              <span>Discover</span>
              <strong>People near you</strong>
            </div>

            <Link href="/discover">
              See all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="deck">
            <article
              className="profile-deck-card card-back"
              aria-hidden="true"
            >
              <div
                className="profile-visual"
                style={
                  nextPhoto
                    ? {
                        backgroundImage:
                          `url("${nextPhoto}")`
                      }
                    : undefined
                }
              >
                {!nextPhoto && (
                  <span className="photo-fallback">
                    {getInitials(nextPerson)}
                  </span>
                )}
              </div>
            </article>

            <article
              className={
                `profile-deck-card card-active ${
                  dragging ? 'is-dragging' : ''
                }`
              }
              style={{
                transform:
                  `translateX(${dragX}px) ` +
                  `rotate(${dragX * 0.045}deg)`,
                transition: dragging
                  ? 'none'
                  : 'transform 190ms ease'
              }}
              onPointerDown={(event) => {
                beginDrag(
                  event.clientX
                );

                event.currentTarget.setPointerCapture(
                  event.pointerId
                );
              }}
              onPointerMove={(event) =>
                moveDrag(event.clientX)
              }
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
            >
              <div
                className="profile-visual"
                style={
                  photo
                    ? {
                        backgroundImage:
                          `url("${photo}")`
                      }
                    : undefined
                }
              >
                {!photo && (
                  <span className="photo-fallback">
                    {getInitials(person)}
                  </span>
                )}

                <span className="profile-badge">
                  <span />
                  Online
                </span>

                <div className="photo-gradient" />
              </div>

              <div className="deck-info">
                <div className="deck-name-line">
                  <div>
                    <h2>
                      {person.first_name}
                      {age
                        ? `, ${age}`
                        : ''}
                    </h2>

                    {getLocation(person) && (
                      <div className="deck-location">
                        <MapPin size={14} />
                        {getLocation(person)}
                      </div>
                    )}
                  </div>

                  <span className="verified">
                    <ShieldCheck size={13} />
                    Profile
                  </span>
                </div>

                {person.about_me && (
                  <p>{person.about_me}</p>
                )}

                {interests.length > 0 && (
                  <div className="deck-interests">
                    {interests.map(
                      (interest) => (
                        <span
                          key={interest}
                        >
                          {interest}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="deck-controls">
  <button
    type="button"
    className="deck-button previous"
    aria-label="Previous profile"
    onClick={() =>
      advance('right')
    }
  >
    <ChevronLeft size={23} />
  </button>

  <button
    type="button"
    className="deck-button like"
    aria-label="Like"
    onClick={() =>
      void likeCurrent()
    }
  >
    <Heart
      size={25}
      fill="currentColor"
    />
  </button>

  <button
    type="button"
    className="deck-button next"
    aria-label="Next profile"
    onClick={() =>
      advance('left')
    }
  >
    <ChevronRight size={23} />
  </button>
</div>

<div className="deck-hint">
  <span>Previous</span>
  <span>Like</span>
  <span>Next</span>
</div>
        </div>
      </section>

      <section className="home-how">
        <div className="home-section-intro">
          <span className="home-section-kicker">
            How it works
          </span>

          <h2>
            Find people the way
            <br />
            you want.
          </h2>

          <p>
            Swipe when you want something quick.
            Search when you already know what
            you are looking for.
          </p>
        </div>

        <div className="home-how-grid">
          <Link
            href="/discover"
            className="how-card featured"
          >
            <div className="how-number">
              01
            </div>

            <div className="how-icon">
              <Heart size={22} />
            </div>

            <h3>
              Discover
            </h3>

            <p>
              Swipe through people nearby,
              pass profiles that are not your
              thing, and like the ones that are.
            </p>

            <span className="how-link">
              Start discovering
              <ArrowRight size={15} />
            </span>
          </Link>

          <Link
            href="/browse"
            className="how-card"
          >
            <div className="how-number">
              02
            </div>

            <div className="how-icon">
              <Search size={22} />
            </div>

            <h3>
              Search
            </h3>

            <p>
              Looking for someone specific?
              Search by name, city, or interests.
            </p>

            <span className="how-link">
              Search people
              <ArrowRight size={15} />
            </span>
          </Link>

          <Link
            href="/messages"
            className="how-card"
          >
            <div className="how-number">
              03
            </div>

            <div className="how-icon">
              <MessageCircle size={22} />
            </div>

            <h3>
              Connect
            </h3>

            <p>
              When you find someone interesting,
              take the next step and start talking.
            </p>

            <span className="how-link">
              See messages
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      <section className="home-connection">
        <div className="connection-visual">
          <div className="connection-photo photo-one" />
          <div className="connection-photo photo-two" />
          <div className="connection-photo photo-three" />
        </div>

        <div className="connection-copy">
          <span className="home-section-kicker">
            More than a profile
          </span>

          <h2>
            Good conversations
            <br />
            start somewhere.
          </h2>

          <p>
            Show people who you are with photos,
            interests, and a little bit about
            yourself. Then let the right
            conversation happen naturally.
          </p>

          <div className="connection-points">
            <div>
              <ShieldCheck size={18} />
              <span>
                Profiles with safety tools
              </span>
            </div>

            <div>
              <Users size={18} />
              <span>
                People nearby
              </span>
            </div>

            <div>
              <MessageCircle size={18} />
              <span>
                Private conversations
              </span>
            </div>
          </div>

          <Link
            href="/create-account"
            className="home-secondary-cta"
          >
            Create your profile
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="home-bottom-cta">
        <div>
          <span className="home-section-kicker">
            Your next connection
          </span>

          <h2>
            Someone interesting
            <br />
            could be one swipe away.
          </h2>

          <p>
            Join free and start discovering
            people around you.
          </p>
        </div>

        <Link
          href="/create-account"
          className="home-primary"
        >
          Join findafriend
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="home-footer">
        <span>
          findafriend<span>.</span>
        </span>

        <span>
          Meet people. Keep it simple.
        </span>
      </footer>

      <nav
        className="mobile-nav"
        aria-label="Mobile navigation"
      >
        {nav.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-item"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}