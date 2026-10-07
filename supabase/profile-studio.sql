-- ============================================================
-- FindAFriend Profile Studio
-- ============================================================
-- Creates NEW tables only.
-- Existing profiles/photos/messages/etc. remain untouched.
-- ============================================================

create table if not exists public.profile_designs (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  preset text not null default 'clean',

  settings jsonb not null default '{}'::jsonb,

  custom_css text not null default '',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create table if not exists public.profile_media (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  music_url text,
  music_path text,
  music_title text,

  video_url text,
  video_path text,
  video_title text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

-- ============================================================
-- PROFILE DESIGNS RLS
-- ============================================================

alter table public.profile_designs enable row level security;

drop policy if exists "profile designs public read"
on public.profile_designs;

create policy "profile designs public read"
on public.profile_designs
for select
using (true);

drop policy if exists "profile designs own insert"
on public.profile_designs;

create policy "profile designs own insert"
on public.profile_designs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profile designs own update"
on public.profile_designs;

create policy "profile designs own update"
on public.profile_designs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile designs own delete"
on public.profile_designs;

create policy "profile designs own delete"
on public.profile_designs
for delete
to authenticated
using (auth.uid() = user_id);

grant select on public.profile_designs
to anon, authenticated;

grant insert, update, delete
on public.profile_designs
to authenticated;

-- ============================================================
-- PROFILE MEDIA RLS
-- ============================================================

alter table public.profile_media enable row level security;

drop policy if exists "profile media public read"
on public.profile_media;

create policy "profile media public read"
on public.profile_media
for select
using (true);

drop policy if exists "profile media own insert"
on public.profile_media;

create policy "profile media own insert"
on public.profile_media
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profile media own update"
on public.profile_media;

create policy "profile media own update"
on public.profile_media
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile media own delete"
on public.profile_media;

create policy "profile media own delete"
on public.profile_media
for delete
to authenticated
using (auth.uid() = user_id);

grant select on public.profile_media
to anon, authenticated;

grant insert, update, delete
on public.profile_media
to authenticated;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-media',
  'profile-media',
  true,
  52428800,
  array[
    'audio/mpeg',
    'video/mp4'
  ]
)
on conflict (id)
do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'audio/mpeg',
    'video/mp4'
  ];

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

drop policy if exists "profile media storage public read"
on storage.objects;

create policy "profile media storage public read"
on storage.objects
for select
using (
  bucket_id = 'profile-media'
);

drop policy if exists "profile media storage own insert"
on storage.objects;

create policy "profile media storage own insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile media storage own update"
on storage.objects;

create policy "profile media storage own update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile media storage own delete"
on storage.objects;

create policy "profile media storage own delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);