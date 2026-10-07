'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
      }
    }

    void checkAuth();
  }, [router]);
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link
          href="/"
          className="brand"
        >
          findafriend
        </Link>

        <Link
          href="/settings"
          className="header-link"
        >
          Settings
        </Link>
      </header>

      <section className="content">
        <div className="page-heading">
          <h1>Me</h1>
          <p>Your findafriend profile.</p>
        </div>

        <div className="me-menu">
          <Link href="/profile/studio">
            Edit Profile
          </Link>

          <Link href="/me/photos">
            My Photos
          </Link>

          <Link href="/likes">
            Likes
          </Link>

          <Link href="/messages">
            Messages
          </Link>

          <Link href="/pro">
            Go Bachelor/Bachelorette
          </Link>

          <Link href="/settings">
            Settings
          </Link>

          <Link href="/logout">
            Log Out
          </Link>
        </div>
      </section>
    </main>
  );
}