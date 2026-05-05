# Mini Spotify - Personal Music Library

A Spotify-inspired full-stack app where users upload, manage, organize, and play their own songs.

## Stack

- React + Vite
- Supabase (Auth, Postgres, Storage)
- Tailwind CSS
- Lucide React icons

## Features

- Email/password authentication with verification-aware signup UX
- Songs CRUD:
  - upload audio file + cover image
  - edit title/artist/cover image
  - delete song and storage objects
- Playlists CRUD:
  - create/rename/delete playlists
  - add/remove/reorder songs
  - play full playlist queue
- Favorites:
  - like/unlike songs
  - dedicated liked songs card view
- Music player:
  - sticky bottom player
  - play/pause, next/previous, progress
  - queue navigation fixes (songs/favorites/playlists)
  - loop + shuffle modes
- Song preview modal:
  - click song/playlist item for modal preview
  - title, artist, cover, play/pause controls
  - close via button, outside click, Esc, swipe-down
- Popup notifications:
  - animated toast with border countdown timer
  - auto-dismiss + manual close

## Project Structure

```txt
src/
  components/
    BottomPlayer.jsx
    LikedSongsSection.jsx
    Modal.jsx
    PlaylistsSection.jsx
    ProfileSection.jsx
    Sidebar.jsx
    SongForm.jsx
    SongPreviewModal.jsx
    SongsSection.jsx
  context/
    AuthContext.jsx
    PlayerContext.jsx
    auth-context.js
    player-context.js
  hooks/
    useAuth.jsx
    usePlayer.jsx
  lib/
    supabase.js
  pages/
    AuthPage.jsx
    DashboardPage.jsx
  services/
    favoriteService.js
    playlistService.js
    songService.js
  App.jsx
  main.jsx
supabase/
  schema.sql
```

## Setup

1. Install dependencies
   - `npm install`
2. Create local environment file
   - copy `.env.example` to `.env`
   - set:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
3. Configure Supabase
   - run SQL in `supabase/schema.sql`
   - create storage buckets:
     - `songs`
     - `covers`
   - add storage policies for authenticated users (required for uploads)
4. Run the app
   - `npm run dev`

## Scripts

- `npm run dev` - start development server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run eslint

## Supabase Notes

- Database tables are protected with RLS policies.
- Storage paths use `user_id/<filename>` for per-user file ownership.
- If upload fails with storage RLS errors, verify bucket names and storage policies.
