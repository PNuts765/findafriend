'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function finishAuth() {
      await new Promise(resolve =>
        window.setTimeout(resolve, 200)
      );

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (session) {
        router.replace('/profile');
        return;
      }

      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          if (!active || !nextSession) {
            return;
          }

          router.replace('/profile');
        }
      );

      window.setTimeout(() => {
        subscription.unsubscribe();

        if (active) {
          router.replace(
            '/login?error=confirmation'
          );
        }
      }, 5000);
    }

    void finishAuth();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="app-shell">
      <div className="loading-state">
        Confirming your email...
      </div>
    </main>
  );
}