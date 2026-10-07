'use client';

import { Ban } from 'lucide-react';
import Link from 'next/link';

const blockedUsers = [
  { id: 7, name: 'Blocked User', age: 31 }
];

export default function BlockedPage() {
  return (
    <main className="settings-page">
      <header className="simple-header">
        <Link href="/" className="form-brand">
          findafriend
        </Link>
      </header>

      <section className="settings-content">
        <h1>Blocked users</h1>

        <div className="blocked-list">
          {blockedUsers.map((user) => (
            <div className="blocked-row" key={user.id}>
              <div className="blocked-photo">Photo</div>

              <div>
                <strong>{user.name}, {user.age}</strong>
                <span>Blocked</span>
              </div>

              <Ban size={20} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}