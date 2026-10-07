$files = @{}

$files["src/lib/data.ts"] = @"
import { supabase } from './supabase';

export async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error };
  }

  return { user, error: null };
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      birth_date,
      gender,
      city,
      state,
      about_me,
      interests_text,
      photos (
        id,
        storage_path,
        display_order
      )
    `)
    .eq('is_active', true)
    .eq('is_banned', false)
    .order('created_at', { ascending: false });

  return {
    profiles: data ?? [],
    error
  };
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      birth_date,
      gender,
      city,
      state,
      about_me,
      interests_text,
      photos (
        id,
        storage_path,
        display_order
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_banned', false)
    .single();

  return {
    profile: data,
    error
  };
}

export async function updateMyProfile(profile: {
  first_name?: string;
  birth_date?: string;
  gender?: string;
  city?: string;
  state?: string;
  about_me?: string;
  interests_text?: string;
}) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      profile: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();

  return {
    profile: data,
    error
  };
}

export async function likeProfile(toUserId: string) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      like: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('likes')
    .upsert(
      {
        from_user_id: user.id,
        to_user_id: toUserId
      },
      {
        onConflict: 'from_user_id,to_user_id',
        ignoreDuplicates: true
      }
    )
    .select()
    .maybeSingle();

  return {
    like: data,
    error
  };
}

export async function getMyLikes() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      likes: [],
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      to_user_id,
      created_at,
      profiles:to_user_id (
        id,
        first_name,
        birth_date,
        city,
        state
      )
    `)
    .eq('from_user_id', user.id)
    .order('created_at', { ascending: false });

  return {
    likes: data ?? [],
    error
  };
}

export async function createConversation(otherUserId: string) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      conversation: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const first =
    user.id < otherUserId ? user.id : otherUserId;

  const second =
    user.id < otherUserId ? otherUserId : user.id;

  const { data, error } = await supabase
    .from('conversations')
    .upsert(
      {
        user_one_id: first,
        user_two_id: second
      },
      {
        onConflict: 'user_one_id,user_two_id'
      }
    )
    .select()
    .single();

  return {
    conversation: data,
    error
  };
}

export async function getConversations() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      conversations: [],
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(
      `user_one_id.eq.${user.id},user_two_id.eq.${user.id}`
    )
    .order('updated_at', { ascending: false });

  return {
    conversations: data ?? [],
    error
  };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      conversation_id,
      sender_id,
      body,
      created_at
    `)
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  return {
    messages: data ?? [],
    error
  };
}

export async function sendMessage(
  conversationId: string,
  body: string
) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      message: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const cleanBody = body.trim();

  if (!cleanBody) {
    return {
      message: null,
      error: new Error('Message cannot be empty.')
    };
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: cleanBody
    })
    .select()
    .single();

  return {
    message: data,
    error
  };
}

export async function createPromotionEntry() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return {
      entry: null,
      error: userError ?? new Error('You must be logged in.')
    };
  }

  const { data, error } = await supabase
    .from('promotion_entries')
    .upsert(
      {
        user_id: user.id
      },
      {
        onConflict: 'user_id'
      }
    )
    .select()
    .single();

  return {
    entry: data,
    error
  };
}
"@

$files["src/app/discover/page.tsx"] = @"
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
      const result = await getProfiles();

      if (result.error) {
        setError(result.error.message);
      }

      setProfiles(result.profiles as Profile[]);
      setLoading(false);
    }

    load();
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
          <h1>You've reached the end.</h1>
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
"@

$files["src/app/browse/page.tsx"] = @"
'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { getProfiles } from '@/lib/data';

type Profile = {
  id: string;
  first_name: string;
  birth_date: string | null;
  city: string | null;
  state: string | null;
};

function age(date: string | null) {
  if (!date) return '';

  const birth = new Date(date);
  const now = new Date();

  let result = now.getFullYear() - birth.getFullYear();

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

export default function BrowsePage() {
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getProfiles();
      setPeople(result.profiles as Profile[]);
      setLoading(false);
    }

    load();
  }, []);

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

        {loading ? (
          <div className="loading-state">
            Loading profiles...
          </div>
        ) : people.length === 0 ? (
          <div className="empty-state">
            <h2>No profiles yet</h2>
            <p>New people will appear here as they join.</p>
          </div>
        ) : (
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
                  <h2>
                    {person.first_name}
                    {age(person.birth_date)
                      ? `, ${age(person.birth_date)}`
                      : ''}
                  </h2>

                  {(person.city || person.state) && (
                    <div className="distance">
                      <MapPin size={14} />
                      {[person.city, person.state]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
"@

$files["src/app/profile/[id]/page.tsx"] = @"
'use client';

import { use, useEffect, useState } from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getProfile, likeProfile, createConversation } from '@/lib/data';

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

function getAge(date: string | null) {
  if (!date) return '';

  const birth = new Date(date);
  const now = new Date();

  let result = now.getFullYear() - birth.getFullYear();

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

export default function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [person, setPerson] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const result = await getProfile(id);

      if (result.profile) {
        setPerson(result.profile as Profile);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleLike() {
    await likeProfile(id);
    setMessage('Profile liked.');
  }

  async function handleMessage() {
    const result = await createConversation(id);

    if (result.error || !result.conversation) {
      setMessage(
        result.error?.message ||
        'Unable to start conversation.'
      );
      return;
    }

    window.location.href =
      `/messages/${result.conversation.id}`;
  }

  if (loading) {
    return (
      <main className="app-shell">
        <div className="loading-state">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="app-shell">
        <div className="empty-state">
          <h1>Profile unavailable</h1>
          <Link href="/browse">
            Back to Browse
          </Link>
        </div>
      </main>
    );
  }

  const personAge = getAge(person.birth_date);

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
          <h1>
            {person.first_name}
            {personAge ? `, ${personAge}` : ''}
          </h1>

          {(person.city || person.state) && (
            <div className="distance">
              <MapPin size={16} />
              {[person.city, person.state]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}

          <section className="detail-section">
            <h2>About Me</h2>
            <p>
              {person.about_me ||
                'No introduction yet.'}
            </p>
          </section>

          {person.interests_text && (
            <section className="detail-section">
              <h2>Interests</h2>

              <div className="interest-list">
                {person.interests_text
                  .split(',')
                  .map((interest) => (
                    <span key={interest}>
                      {interest.trim()}
                    </span>
                  ))}
              </div>
            </section>
          )}

          {message && (
            <div className="form-success">
              {message}
            </div>
          )}

          <div className="profile-actions">
            <button
              className="secondary-action"
              onClick={handleLike}
            >
              <Heart size={19} />
              Like
            </button>

            <button
              className="primary-action"
              onClick={handleMessage}
            >
              <MessageCircle size={19} />
              Message
            </button>
          </div>

          <div className="safety-links">
            <Link href={`/report/${id}`}>
              Report profile
            </Link>

            <Link href="/safety">
              Safety
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

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { getMyLikes } from '@/lib/data';

type LikeRow = {
  id: string;
  to_user_id: string;
  profiles: {
    id: string;
    first_name: string;
    birth_date: string | null;
    city: string | null;
    state: string | null;
  } | null;
};

function getAge(date: string | null) {
  if (!date) return '';

  const birth = new Date(date);
  const now = new Date();

  let result = now.getFullYear() - birth.getFullYear();

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

export default function LikesPage() {
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getMyLikes();
      setLikes(result.likes as LikeRow[]);
      setLoading(false);
    }

    load();
  }, []);

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
          <h1>Likes</h1>
          <p>People you've liked.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading likes...
          </div>
        ) : likes.length === 0 ? (
          <div className="empty-state">
            <Heart size={30} />
            <h2>No likes yet</h2>
            <p>
              Like someone while discovering people
              and they'll appear here.
            </p>
          </div>
        ) : (
          <div className="likes-list">
            {likes.map((like) => {
              const person = like.profiles;

              if (!person) return null;

              return (
                <Link
                  href={`/profile/${person.id}`}
                  className="like-card"
                  key={like.id}
                >
                  <div className="like-photo">
                    Photo
                  </div>

                  <div>
                    <h2>
                      {person.first_name}
                      {getAge(person.birth_date)
                        ? `, ${getAge(person.birth_date)}`
                        : ''}
                    </h2>

                    <p>
                      {[person.city, person.state]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>

                  <Heart size={20} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
"@

$files["src/app/messages/page.tsx"] = @"
'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getConversations } from '@/lib/data';

type Conversation = {
  id: string;
  user_one_id: string;
  user_two_id: string;
  updated_at: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getConversations();
      setConversations(
        result.conversations as Conversation[]
      );
      setLoading(false);
    }

    load();
  }, []);

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
          <h1>Messages</h1>
          <p>Your conversations.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={30} />
            <h2>No conversations yet</h2>
            <p>
              When you start talking with someone,
              your conversation will appear here.
            </p>
          </div>
        ) : (
          <div className="message-list">
            {conversations.map((conversation) => (
              <Link
                href={`/messages/${conversation.id}`}
                key={conversation.id}
                className="conversation-card"
              >
                <div className="conversation-photo">
                  Photo
                </div>

                <div className="conversation-content">
                  <div className="conversation-top">
                    <strong>Conversation</strong>
                    <span>
                      {new Date(
                        conversation.updated_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p>
                    Open conversation
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
"@

$files["src/app/messages/[id]/page.tsx"] = @"
'use client';

import {
  use,
  useEffect,
  useState
} from 'react';

import {
  ArrowLeft,
  Send,
  Shield
} from 'lucide-react';

import Link from 'next/link';

import {
  getCurrentUser,
  getMessages,
  sendMessage
} from '@/lib/data';

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default function ConversationPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [text, setText] = useState('');
  const [userId, setUserId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const [messageResult, userResult] =
        await Promise.all([
          getMessages(id),
          getCurrentUser()
        ]);

      setMessages(
        messageResult.messages as Message[]
      );

      setUserId(userResult.user?.id ?? null);
      setLoading(false);
    }

    load();
  }, [id]);

  async function handleSend() {
    const clean = text.trim();

    if (!clean || sending) return;

    setSending(true);

    const result = await sendMessage(id, clean);

    if (result.message) {
      setMessages((current) => [
        ...current,
        result.message as Message
      ]);

      setText('');
    }

    setSending(false);
  }

  return (
    <main className="conversation-page">
      <header className="conversation-header">
        <Link
          href="/messages"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </Link>

        <div className="conversation-person">
          <div className="mini-photo">
            Photo
          </div>

          <div>
            <strong>Conversation</strong>
            <span>findafriend</span>
          </div>
        </div>

        <div />
      </header>

      <section className="conversation-body">
        <div className="conversation-safety">
          <Shield size={17} />

          <span>
            Never share passwords, financial information,
            security codes, or sensitive personal information.
          </span>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <MessageCircleFallback />
            <h2>Start the conversation</h2>
          </div>
        ) : (
          <div className="message-thread">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender_id === userId
                    ? 'message-bubble mine'
                    : 'message-bubble theirs'
                }
              >
                {message.body}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="composer-area">
        <div className="message-composer">
          <input
            type="text"
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder="Write a message..."
            disabled={sending}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="composer-footer">
          <span>
            Free: 20 outgoing messages per week
          </span>

          <Link href="/pro">
            Go Pro
          </Link>
        </div>
      </div>
    </main>
  );
}

function MessageCircleFallback() {
  return (
    <div className="empty-icon">
      ??
    </div>
  );
}
"@

$files["src/app/globals.css"] += @"

.loading-state {
  width: min(100%, 700px);
  margin: 70px auto;
  text-align: center;
  color: #777;
  padding: 30px;
}

.empty-state {
  width: min(100%, 600px);
  margin: 70px auto;
  padding: 35px 20px;
  text-align: center;
  color: #666;
}

.empty-state h1,
.empty-state h2 {
  color: #222;
  margin-top: 15px;
}

.empty-state p {
  line-height: 1.6;
}

.empty-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.safety-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 22px;
  font-size: 13px;
}

.safety-links a {
  color: #777;
}

.like-card p {
  margin: 4px 0 0;
  color: #777;
  font-size: 13px;
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
Write-Host "findafriend real data layer connected successfully." -ForegroundColor Green
Write-Host "Connected: profiles, discovery, browse, likes, conversations, and messages." -ForegroundColor Green
Write-Host ""
