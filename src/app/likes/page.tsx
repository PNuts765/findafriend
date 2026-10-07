'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { getMyLikes } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

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
          <p>People you&apos;ve liked.</p>
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
              and they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="likes-list">
            {likes.map((like) => {
              const person = like.profiles;

              if (!person) return null;

              return (
                <Link
                  href={`/profile/${like.to_user_id}`}
                  className="like-card"
                  key={like.id}
                >
                  <div className="like-photo">
                    Photo
                  </div>

                  <div>
                    <h2>
                      {person.first_name}
                      {getAge(person.birth_date) ? `, ${getAge(person.birth_date)}` : ''}
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


