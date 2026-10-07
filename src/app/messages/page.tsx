'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getConversations } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Conversation = {
  id: string;
  user_one_id: string;
  user_two_id: string;
  updated_at: string;
};

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const result = await getConversations();
      setConversations(
        result.conversations as Conversation[]
      );
      setLoading(false);
    }

    load();
  }, [router]);

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

        {loading ? (
          <div className="loading-state">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={30} />
            <h2>No conversations yet</h2>
            <p>
              When you start talking with someone,
              your conversation will appear here.
            </p>
          </div>
        ) : (
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
                    <strong>Conversation</strong>
                    <span>
                      {new Date(
                        conversation.updated_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p>
                    Open conversation
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
