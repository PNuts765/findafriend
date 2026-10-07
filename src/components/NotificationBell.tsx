'use client';

import {
  useEffect,
  useState
} from 'react';

import Link from 'next/link';

import {
  Bell
} from 'lucide-react';

import {
  getUnreadNotificationCount
} from '@/lib/notifications';

import {
  supabase
} from '@/lib/supabase';

export default function NotificationBell() {
  const [count, setCount] =
    useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      const result =
        await getUnreadNotificationCount();

      if (
        active &&
        !result.error
      ) {
        setCount(result.count);
      }
    }

    void load();

    let channel:
      ReturnType<
        typeof supabase.channel
      > | null = null;

    async function subscribe() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user || !active) {
        return;
      }

      channel = supabase
        .channel(
          `notifications-${user.id}`
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter:
              `recipient_user_id=eq.${user.id}`
          },
          () => {
            if (active) {
              setCount(current =>
                current + 1
              );
            }
          }
        )
        .subscribe();
    }

    void subscribe();

    return () => {
      active = false;

      if (channel) {
        void supabase.removeChannel(
          channel
        );
      }
    };
  }, []);

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="notification-bell"
    >
      <Bell size={18} />

      {count > 0 && (
        <span className="notification-count">
          {count > 99
            ? '99+'
            : count}
        </span>
      )}

      <style jsx>{`
        .notification-bell {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          background: rgba(255,255,255,.55);
          border: 1px solid rgba(0,0,0,.10);
          text-decoration: none;
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e84d78;
          color: #fff;
          font-size: 9px;
          font-weight: 950;
          border: 2px solid #fff;
        }
      `}</style>
    </Link>
  );
}