'use client';

import {
  useEffect,
  useState
} from 'react';

import Link from 'next/link';

import {
  Bell,
  Heart,
  ArrowLeft
} from 'lucide-react';

import {
  getNotifications,
  markNotificationRead,
  type Notification
} from '@/lib/notifications';

import {
  supabase
} from '@/lib/supabase';

export default function NotificationsPage() {
  const [items, setItems] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href =
          '/login';
        return;
      }

      const result =
        await getNotifications();

      if (!result.error) {
        setItems(
          result.notifications
        );
      }

      setLoading(false);
    }

    void load();
  }, []);

  async function openNotification(
    item: Notification
  ) {
    if (!item.read_at) {
      await markNotificationRead(
        item.id
      );

      setItems(current =>
        current.map(notification =>
          notification.id === item.id
            ? {
                ...notification,
                read_at:
                  new Date().toISOString()
              }
            : notification
        )
      );
    }

    if (item.type === 'like') {
      window.location.href =
        `/profile/${item.actor_user_id}`;
    }
  }

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <Link
          href="/me"
          className="back"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="brand">
          findafriend<span>.</span>
        </div>

        <Bell size={18} />
      </header>

      <section className="notifications-wrap">
        <div className="heading">
          <div className="eyebrow">
            ACTIVITY
          </div>

          <h1>
            Notifications
          </h1>

          <p>
            See who&apos;s interacting
            with your profile.
          </p>
        </div>

        {loading ? (
          <div className="empty">
            Loading notifications...
          </div>
        ) : items.length === 0 ? (
          <div className="empty">
            <Bell size={30} />

            <strong>
              No notifications yet
            </strong>

            <span>
              When someone likes your
              profile, it will appear here.
            </span>
          </div>
        ) : (
          <div className="notification-list">
            {items.map(item => (
              <button
                type="button"
                key={item.id}
                className={
                  item.read_at
                    ? 'notification read'
                    : 'notification unread'
                }
                onClick={() =>
                  void openNotification(
                    item
                  )
                }
              >
                <span className="icon">
                  <Heart size={18} />
                </span>

                <span className="copy">
                  <strong>
                    {item.actor?.first_name ||
                      'Someone'}
                  </strong>

                  <span>
                    liked your profile.
                  </span>

                  <small>
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </small>
                </span>

                {!item.read_at && (
                  <span className="dot" />
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .notifications-page {
          min-height: 100vh;
          background: #f6f7f9;
          color: #17191c;
          padding-bottom: 70px;
        }

        .notifications-header {
          height: 68px;
          padding: 0 28px;
          background: #fff;
          border-bottom: 1px solid #e5e6ea;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }

        .back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #666d77;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .brand {
          font-size: 19px;
          font-weight: 950;
          letter-spacing: -.055em;
        }

        .brand span {
          color: #e84d78;
        }

        .notifications-header > svg {
          justify-self: end;
          color: #e84d78;
        }

        .notifications-wrap {
          width: min(720px, calc(100% - 30px));
          margin: 0 auto;
          padding-top: 48px;
        }

        .eyebrow {
          color: #e84d78;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .heading h1 {
          margin: 7px 0 6px;
          font-size: clamp(36px, 7vw, 54px);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .heading p {
          margin: 0;
          color: #69717c;
          font-size: 14px;
        }

        .notification-list {
          display: grid;
          gap: 9px;
          margin-top: 28px;
        }

        .notification {
          width: 100%;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          align-items: center;
          gap: 13px;
          padding: 15px;
          text-align: left;
          border-radius: 15px;
          border: 1px solid #e1e3e7;
          background: #fff;
          cursor: pointer;
        }

        .notification.unread {
          border-color: #f1afc2;
          box-shadow:
            0 8px 24px rgba(232,77,120,.08);
        }

        .notification.read {
          opacity: .72;
        }

        .icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #fff0f5;
          color: #e84d78;
        }

        .copy strong {
          margin-right: 4px;
        }

        .copy > span {
          font-size: 14px;
        }

        .copy small {
          display: block;
          margin-top: 4px;
          color: #8b929c;
          font-size: 10px;
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #e84d78;
        }

        .empty {
          margin-top: 30px;
          min-height: 220px;
          border: 1px dashed #d9dce1;
          border-radius: 18px;
          background: rgba(255,255,255,.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #7d848e;
          text-align: center;
        }

        .empty strong {
          color: #353a40;
        }

        .empty span {
          font-size: 13px;
        }
      `}</style>
    </main>
  );
}