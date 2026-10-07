'use client';

import { Shield, Ban, Flag } from 'lucide-react';
import Link from 'next/link';

export default function SafetyPage() {
  return (
    <main className="settings-page">
      <header className="simple-header">
        <Link href="/" className="form-brand">
          findafriend
        </Link>
      </header>

      <section className="settings-content">
        <h1>Safety</h1>

        <p className="settings-intro">
          Keep control of who you interact with.
        </p>

        <div className="safety-cards">
          <div className="safety-card">
            <Ban size={22} />

            <div>
              <h2>Block</h2>
              <p>
                Blocked people cannot message you or appear in your discovery
                or browse results.
              </p>
            </div>
          </div>

          <div className="safety-card">
            <Flag size={22} />

            <div>
              <h2>Report</h2>
              <p>
                Report a profile if something violates the community rules or
                makes you uncomfortable.
              </p>
            </div>
          </div>

          <div className="safety-card">
            <Shield size={22} />

            <div>
              <h2>Protect yourself</h2>
              <p>
                Never send money or share passwords, financial information,
                security codes, or sensitive personal information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}