-- ============================================================
-- FindAFriend Notifications
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),

  recipient_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  actor_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  type text not null,

  like_id uuid null
    references public.likes(id)
    on delete cascade,

  read_at timestamptz null,

  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_created_idx
on public.notifications (
  recipient_user_id,
  created_at desc
);

alter table public.notifications
enable row level security;

drop policy if exists "notifications own read"
on public.notifications;

create policy "notifications own read"
on public.notifications
for select
to authenticated
using (
  auth.uid() = recipient_user_id
);

drop policy if exists "notifications own update"
on public.notifications;

create policy "notifications own update"
on public.notifications
for update
to authenticated
using (
  auth.uid() = recipient_user_id
)
with check (
  auth.uid() = recipient_user_id
);

grant select, update
on public.notifications
to authenticated;

-- ============================================================
-- Automatically create a notification when a new like appears
-- ============================================================

create or replace function public.create_like_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (
    recipient_user_id,
    actor_user_id,
    type,
    like_id
  )
  values (
    new.to_user_id,
    new.from_user_id,
    'like',
    new.id
  );

  return new;
end;
$$;

drop trigger if exists likes_create_notification
on public.likes;

create trigger likes_create_notification
after insert on public.likes
for each row
execute function public.create_like_notification();

-- ============================================================
-- Enable realtime notifications
-- ============================================================

do $$
begin
  alter publication supabase_realtime
    add table public.notifications;
exception
  when duplicate_object then
    null;
end
$$;