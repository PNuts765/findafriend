$files = @{}

$files["src/app/messages/page.tsx"] = @"
'use client';

import { MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

const conversations = [
  {
    id: 1,
    name: 'Jessica',
    age: 29,
    distance: 14,
    preview: 'Hey! How is your week going?',
    time: '2m'
  },
  {
    id: 2,
    name: 'Marcus',
    age: 34,
    distance: 22,
    preview: 'That sounds like a great idea.',
    time: '1h'
  }
];

export default function MessagesPage() {
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
                  <strong>
                    {conversation.name}, {conversation.age}
                  </strong>

                  <span>{conversation.time}</span>
                </div>

                <p>{conversation.preview}</p>

                <div className="distance">
                  <MapPin size={13} />
                  {conversation.distance} miles away
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="message-limit-card">
          <MessageCircle size={20} />

          <div>
            <strong>Free messaging</strong>
            <p>20 outgoing messages per week.</p>
          </div>

          <Link href="/pro">Go Pro</Link>
        </div>
      </section>
    </main>
  );
}
"@

$files["src/app/messages/[id]/page.tsx"] = @"
'use client';

import { ArrowLeft, MoreVertical, Send, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const messages = [
  {
    id: 1,
    sender: 'them',
    text: 'Hey! How is your week going?'
  },
  {
    id: 2,
    sender: 'me',
    text: 'Pretty good! I just discovered this app.'
  },
  {
    id: 3,
    sender: 'them',
    text: 'Same here. It seems refreshingly simple.'
  }
];

export default function ConversationPage({
  params
}: {
  params: { id: string }
}) {
  const [text, setText] = useState('');

  return (
    <main className="conversation-page">
      <header className="conversation-header">
        <Link href="/messages" aria-label="Back">
          <ArrowLeft size={22} />
        </Link>

        <Link href="/profile/1" className="conversation-person">
          <div className="mini-photo">Photo</div>

          <div>
            <strong>Jessica, 29</strong>
            <span>14 miles away</span>
          </div>
        </Link>

        <button className="icon-button" aria-label="Conversation options">
          <MoreVertical size={22} />
        </button>
      </header>

      <section className="conversation-body">
        <div className="conversation-safety">
          <Shield size={17} />
          <span>
            Never share passwords, financial information, or sensitive personal
            information.
          </span>
        </div>

        <div className="message-thread">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender === 'me'
                  ? 'message-bubble mine'
                  : 'message-bubble theirs'
              }
            >
              {message.text}
            </div>
          ))}
        </div>
      </section>

      <div className="composer-area">
        <div className="message-composer">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a message..."
          />

          <button
            type="button"
            aria-label="Send message"
            onClick={() => setText('')}
          >
            <Send size={20} />
          </button>
        </div>

        <div className="composer-footer">
          <span>Free: 20 outgoing messages per week</span>
          <Link href="/pro">Go Pro</Link>
        </div>
      </div>
    </main>
  );
}
"@

$files["src/app/safety/page.tsx"] = @"
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
"@

$files["src/app/report/[id]/page.tsx"] = @"
'use client';

import { Flag } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage({
  params
}: {
  params: { id: string }
}) {
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

        <Link href={`/profile/${params.id}`} className="text-link">
          Cancel
        </Link>
      </div>
    </main>
  );
}
"@

$files["src/app/blocked/page.tsx"] = @"
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
"@

$files["src/app/globals.css"] += @"

.message-list {
  width: min(100%, 700px);
  margin: 0 auto;
  display: grid;
  gap: 10px;
}

.conversation-card {
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 14px;
  padding: 13px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
}

.conversation-photo,
.mini-photo {
  background: #ededed;
  display: grid;
  place-items: center;
  color: #999;
}

.conversation-photo {
  width: 62px;
  height: 62px;
  border-radius: 10px;
}

.conversation-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.conversation-top span {
  color: #888;
  font-size: 12px;
}

.conversation-content p {
  margin: 5px 0;
  color: #555;
  font-size: 14px;
}

.message-limit-card {
  width: min(100%, 700px);
  margin: 18px auto 0;
  padding: 16px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-limit-card div {
  flex: 1;
}

.message-limit-card strong {
  display: block;
}

.message-limit-card p {
  margin: 3px 0 0;
  color: #777;
  font-size: 13px;
}

.message-limit-card a {
  color: #111;
  font-weight: 700;
}

.conversation-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

.conversation-header {
  height: 72px;
  padding: 0 20px;
  border-bottom: 1px solid #e7e7e7;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 10px;
}

.conversation-header > a:first-child,
.icon-button {
  color: #222;
}

.conversation-person {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.mini-photo {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 10px;
}

.conversation-person strong,
.conversation-person span {
  display: block;
}

.conversation-person span {
  color: #777;
  font-size: 12px;
  margin-top: 2px;
}

.icon-button {
  background: transparent;
  border: 0;
  cursor: pointer;
}

.conversation-body {
  flex: 1;
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 25px 20px 120px;
}

.conversation-safety {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 9px;
  color: #666;
  font-size: 12px;
  line-height: 1.45;
  margin-bottom: 24px;
}

.message-thread {
  display: grid;
  gap: 10px;
}

.message-bubble {
  max-width: 75%;
  padding: 11px 14px;
  border-radius: 16px;
  line-height: 1.45;
}

.message-bubble.theirs {
  justify-self: start;
  background: #f0f0f0;
}

.message-bubble.mine {
  justify-self: end;
  background: #111;
  color: white;
}

.composer-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-top: 1px solid #e7e7e7;
  padding: 10px 20px;
}

.message-composer {
  width: min(100%, 760px);
  margin: 0 auto;
  display: flex;
  gap: 8px;
}

.message-composer input {
  flex: 1;
  border: 1px solid #d8d8d8;
  border-radius: 22px;
  padding: 12px 16px;
  font: inherit;
}

.message-composer button {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: #111;
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.composer-footer {
  width: min(100%, 760px);
  margin: 5px auto 0;
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 11px;
}

.composer-footer a {
  color: #222;
  font-weight: 700;
}

.settings-intro {
  color: #777;
  margin-bottom: 25px;
}

.safety-cards {
  display: grid;
  gap: 12px;
}

.safety-card {
  display: flex;
  gap: 15px;
  padding: 18px;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
}

.safety-card h2 {
  margin: 0 0 6px;
  font-size: 18px;
}

.safety-card p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.blocked-list {
  display: grid;
  gap: 10px;
  margin-top: 25px;
}

.blocked-row {
  display: grid;
  grid-template-columns: 55px 1fr auto;
  align-items: center;
  gap: 13px;
  padding: 12px;
  border: 1px solid #e7e7e7;
  border-radius: 11px;
}

.blocked-photo {
  width: 55px;
  height: 55px;
  border-radius: 9px;
  background: #ededed;
  display: grid;
  place-items: center;
  color: #999;
  font-size: 11px;
}

.blocked-row strong,
.blocked-row span {
  display: block;
}

.blocked-row span {
  color: #888;
  font-size: 13px;
  margin-top: 3px;
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
Write-Host "findafriend Messaging + Safety build completed." -ForegroundColor Green
Write-Host "Created: Messages, Conversations, Safety, Reports, Blocked Users." -ForegroundColor Green
Write-Host ""
