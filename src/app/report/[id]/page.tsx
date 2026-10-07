import { Flag } from 'lucide-react';
import Link from 'next/link';

export default async function ReportPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return (
    <main className="form-page">
      <div className="form-card">
        <div className="form-brand">findafriend</div>

        <Flag size={28} />

        <h1>Report profile</h1>

        <p className="form-subtitle">
          Tell us what is wrong. Reports are reviewed appropriately.
        </p>

        <form className="form">
          <label>
            Reason
            <select defaultValue="">
              <option value="" disabled>Select a reason</option>
              <option>Fake or misleading profile</option>
              <option>Harassment</option>
              <option>Spam</option>
              <option>Inappropriate content</option>
              <option>Safety concern</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Details
            <textarea
              rows={5}
              placeholder="Tell us what happened..."
            />
          </label>

          <button type="submit" className="primary-button">
            Submit Report
          </button>
        </form>

        <Link href={`/profile/${id}`} className="text-link">
          Cancel
        </Link>
      </div>
    </main>
  );
}