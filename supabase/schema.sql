-- Mini Spotify schema
create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  audio_url text not null,
  cover_url text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists playlist_songs (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references playlists(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  position int not null default 0
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  unique (user_id, song_id)
);

alter table songs enable row level security;
alter table playlists enable row level security;
alter table playlist_songs enable row level security;
alter table favorites enable row level security;

create policy "Users read own songs" on songs for select using (auth.uid() = user_id);
create policy "Users insert own songs" on songs for insert with check (auth.uid() = user_id);
create policy "Users update own songs" on songs for update using (auth.uid() = user_id);
create policy "Users delete own songs" on songs for delete using (auth.uid() = user_id);

create policy "Users read own playlists" on playlists for select using (auth.uid() = user_id);
create policy "Users insert own playlists" on playlists for insert with check (auth.uid() = user_id);
create policy "Users update own playlists" on playlists for update using (auth.uid() = user_id);
create policy "Users delete own playlists" on playlists for delete using (auth.uid() = user_id);

create policy "Users read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "Users insert own favorites" on favorites for insert with check (auth.uid() = user_id);
create policy "Users delete own favorites" on favorites for delete using (auth.uid() = user_id);

create policy "Users read own playlist_songs"
on playlist_songs for select
using (
  exists (
    select 1 from playlists p where p.id = playlist_id and p.user_id = auth.uid()
  )
);

create policy "Users insert own playlist_songs"
on playlist_songs for insert
with check (
  exists (
    select 1 from playlists p where p.id = playlist_id and p.user_id = auth.uid()
  )
);

create policy "Users update own playlist_songs"
on playlist_songs for update
using (
  exists (
    select 1 from playlists p where p.id = playlist_id and p.user_id = auth.uid()
  )
);

create policy "Users delete own playlist_songs"
on playlist_songs for delete
using (
  exists (
    select 1 from playlists p where p.id = playlist_id and p.user_id = auth.uid()
  )
);
