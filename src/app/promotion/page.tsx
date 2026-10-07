'use client';

import {
  useState
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  CheckCircle
} from 'lucide-react';

export default function PromotionPage() {
  const router = useRouter();
  const [accepted, setAccepted] =
    useState(false);

  return (
    <main className="pro-page">
      <div className="pro-card promotion-card">
        <Link
          href="/"
          className="form-brand"
        >
          findafriend
        </Link>

        <h1>
          Pro FREE FOR LIFE
        </h1>

        <p className="pro-tagline">
          Enjoy the app. You could win Pro
          FREE FOR LIFE.
        </p>

        <div className="promotion-terms">
          <h2>
            Promotion Terms
          </h2>

          <p>
            No purchase is necessary to
            participate.
          </p>

          <p>
            Eligibility, entry requirements,
            selection method, prize details,
            promotion period, and any
            applicable restrictions are
            governed by the official promotion
            rules.
          </p>

          <p>
            By entering, you acknowledge that
            you have read and understood the
            official rules before submitting
            your entry.
          </p>

          <p>
            Pro FREE FOR LIFE means continued
            Pro access for the applicable
            winner for as long as the
            promotion terms provide.
          </p>

          <p>
            findafriend may verify eligibility
            and may disqualify entries that
            violate the official rules.
          </p>
        </div>

        <label className="promotion-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) =>
              setAccepted(
                event.target.checked
              )
            }
          />

          <span>
            I have read and understand the
            promotion terms.
          </span>
        </label>

        <button
          type="button"
          className="primary-button"
          disabled={!accepted}
          onClick={() => {
            router.push('/promotion/enter');
          }}
        >
          Continue to Entry
        </button>

        <div className="promotion-note">
          <CheckCircle size={17} />

          <span>
            The terms are presented before
            entry so there are no surprise
            rules hiding behind the curtain.
          </span>
        </div>

        <Link
          href="/pro"
          className="text-link"
        >
          Back to Pro
        </Link>
      </div>
    </main>
  );
}