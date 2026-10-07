'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await signOut();
      router.push('/');
    }

    logout();
  }, [router]);

  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>
        <h1>Logging out...</h1>
      </div>
    </main>
  );
}