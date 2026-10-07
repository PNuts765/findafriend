$files = @{}

$files["src/lib/limits.ts"] = @"
import { supabase } from './supabase';

export const FREE_PHOTO_LIMIT = 3;
export const PRO_PHOTO_LIMIT = 30;
export const FREE_WEEKLY_MESSAGE_LIMIT = 10;

export type AccountPlan = 'free' | 'pro';

export async function getMyPlan(): Promise<AccountPlan> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return 'free';

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, is_lifetime')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!data) return 'free';

  if (data.is_lifetime) return 'pro';

  if (
    data.plan === 'monthly' ||
    data.plan === 'yearly'
  ) {
    return 'pro';
  }

  return 'free';
}

export async function getPhotoLimit() {
  const plan = await getMyPlan();

  return plan === 'pro'
    ? PRO_PHOTO_LIMIT
    : FREE_PHOTO_LIMIT;
}

export async function getWeeklyOutgoingMessageCount() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count } = await supabase
    .from('messages')
    .select('id', {
      count: 'exact',
      head: true
    })
    .eq('sender_id', user.id)
    .gte('created_at', weekAgo.toISOString());

  return count ?? 0;
}

export async function canSendMessage() {
  const plan = await getMyPlan();

  if (plan === 'pro') {
    return {
      allowed: true,
      remaining: null
    };
  }

  const count =
    await getWeeklyOutgoingMessageCount();

  return {
    allowed: count < FREE_WEEKLY_MESSAGE_LIMIT,
    remaining: Math.max(
      0,
      FREE_WEEKLY_MESSAGE_LIMIT - count
    )
  };
}

export async function canAddPhoto() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      allowed: false,
      remaining: 0
    };
  }

  const limit = await getPhotoLimit();

  const { count } = await supabase
    .from('photos')
    .select('id', {
      count: 'exact',
      head: true
    })
    .eq('user_id', user.id);

  const currentCount = count ?? 0;

  return {
    allowed: currentCount < limit,
    remaining: Math.max(
      0,
      limit - currentCount
    )
  };
}
"@

$files["src/lib/messages.ts"] = @"
import { canSendMessage } from './limits';
import { sendMessage as sendDatabaseMessage } from './data';

export async function sendMessageWithLimit(
  conversationId: string,
  body: string
) {
  const cleanBody = body.trim();

  if (!cleanBody) {
    return {
      message: null,
      error: new Error('Message cannot be empty.')
    };
  }

  const limit = await canSendMessage();

  if (!limit.allowed) {
    return {
      message: null,
      error: new Error(
        'You have used all 10 of your free outgoing messages for this week. You can send messages again when your weekly allowance resets, or upgrade to Pro for unlimited messaging.'
      )
    };
  }

  return sendDatabaseMessage(
    conversationId,
    cleanBody
  );
}
"@

$files["src/app/messages/[id]/page.tsx"] = @"
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
Write-Host "findafriend messaging rule corrected successfully." -ForegroundColor Green
Write-Host "Free: 10 outgoing messages per week. Incoming messages do not count." -ForegroundColor Green
Write-Host "After 10 outgoing messages: sending locked until reset or Pro upgrade." -ForegroundColor Green
Write-Host "Conversations remain open indefinitely." -ForegroundColor Green
Write-Host "Pro: unlimited outgoing messages." -ForegroundColor Green
Write-Host ""
