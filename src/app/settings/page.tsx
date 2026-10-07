'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
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
