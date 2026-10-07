'use client';

import {
  use,
  useEffect,
  useState
} from 'react';

import {
  ArrowLeft,
  Send,
  Shield
} from 'lucide-react';

import Link from 'next/link';

import {
  getCurrentUser,
  getMessages
} from '@/lib/data';

import {
  sendMessageWithLimit
} from '@/lib/messages';

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default function ConversationPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [text, setText] = useState('');

  const [userId, setUserId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const [messageResult, userResult] =
        await Promise.all([
          getMessages(id),
          getCurrentUser()
        ]);

      setMessages(
        messageResult.messages as Message[]
      );

      setUserId(
        userResult.user?.id ?? null
      );

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleSend() {
    const clean = text.trim();

    if (!clean || sending) {
      return;
    }

    setError('');
    setSending(true);

    const result =
      await sendMessageWithLimit(id, clean);

    if (result.error) {
      setError(result.error.message);
      setSending(false);
      return;
    }

    if (result.message) {
      setMessages((current) => [
        ...current,
        result.message as Message
      ]);

      setText('');
    }

    setSending(false);
  }

  return (
    <main className="conversation-page">
      <header className="conversation-header">
        <Link
          href="/messages"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </Link>

        <div className="conversation-person">
          <div className="mini-photo">
            Photo
          </div>

          <div>
            <strong>Conversation</strong>
            <span>findafriend</span>
          </div>
        </div>

        <div />
      </header>

      <section className="conversation-body">
        <div className="conversation-safety">
          <Shield size={17} />

          <span>
            Never share passwords, financial
            information, security codes, or
            sensitive personal information.
          </span>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading messages...
          </div>
        ) : (
          <div className="message-thread">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender_id === userId
                    ? 'message-bubble mine'
                    : 'message-bubble theirs'
                }
              >
                {message.body}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="form-error message-error">
            {error}

            {error.includes('upgrade to Pro') && (
              <Link href="/pro">
                Upgrade to Pro
              </Link>
            )}
          </div>
        )}
      </section>

      <div className="composer-area">
        <div className="message-composer">
          <input
            type="text"
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder="Write a message..."
            disabled={sending}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="composer-footer">
          <span>
            Free: 10 outgoing messages per week
          </span>

          <Link href="/pro">
            Go Pro
          </Link>
        </div>
      </div>
    </main>
  );
}