import { useCallback, useEffect, useMemo, useState } from 'react'
import BottomPlayer from '../components/BottomPlayer'
import LikedSongsSection from '../components/LikedSongsSection'
import Modal from '../components/Modal'
import PlaylistsSection from '../components/PlaylistsSection'
import ProfileSection from '../components/ProfileSection'
import Sidebar from '../components/Sidebar'
import SongForm from '../components/SongForm'
import SongPreviewModal from '../components/SongPreviewModal'
import SongsSection from '../components/SongsSection'
import { useAuth } from '../hooks/useAuth'
import { usePlayer } from '../hooks/usePlayer'
import { addFavorite, listFavorites, removeFavorite } from '../services/favoriteService'
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  listPlaylists,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  updatePlaylist,
} from '../services/playlistService'
import {
  COVER_BUCKET,
  SONG_BUCKET,
  createSong,
  deleteSong,
  deleteStorageObject,
  listSongs,
  updateSong,
  uploadCoverFile,
  uploadSongFile,
} from '../services/songService'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const { user } = useAuth()
  const { playFromList } = usePlayer()
  const [activeSection, setActiveSection] = useState('home')
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [savingSong, setSavingSong] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    title: '',
    message: '',
  })
  const [previewSong, setPreviewSong] = useState(null)

  const loadData = useCallback(async () => {
    if (!user) return
    // Keep all dashboard data in one place to simplify debugging stale UI state.
    const [songsData, playlistsData, favoritesData] = await Promise.all([
      listSongs(user.id),
      listPlaylists(user.id),
      listFavorites(user.id),
    ])
    setSongs(songsData)
    setPlaylists(playlistsData)
    setFavoriteIds(new Set(favoritesData.map((favorite) => favorite.song_id)))
  }, [user])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [loadData])

  const handleUploadSong = async (form) => {
    if (!user || !form.audioFile) return
    setSavingSong(true)
    try {
      const audioPath = await uploadSongFile(user.id, form.audioFile)
      const coverPath = form.coverFile ? await uploadCoverFile(user.id, form.coverFile) : null
      await createSong({
        title: form.title,
        artist: form.artist,
        user_id: user.id,
        audio_url: audioPath,
        cover_url: coverPath,
      })
      await loadData()
      setFeedbackModal({
        open: true,
        title: 'Song added',
        message: `"${form.title}" has been added to your library.`,
      })
    } finally {
      setSavingSong(false)
    }
  }

  const handleDeleteSong = async (song) => {
    await deleteSong(song.id)
    await deleteStorageObject(SONG_BUCKET, song.audio_url)
    await deleteStorageObject(COVER_BUCKET, song.cover_url)
    await loadData()
    setFeedbackModal({
      open: true,
      title: 'Song deleted',
      message: `"${song.title}" has been removed from your library.`,
    })
  }

  const handleUpdateSong = async (song, updates) => {
    const { coverFile, ...restUpdates } = updates
    const payload = { ...restUpdates }

    if (coverFile) {
      const newCoverPath = await uploadCoverFile(user.id, coverFile)
      payload.cover_url = newCoverPath
      if (song?.cover_url) {
        await deleteStorageObject(COVER_BUCKET, song.cover_url)
      }
    }

    await updateSong(song.id, payload)
    await loadData()
    setFeedbackModal({
      open: true,
      title: 'Song updated',
      message: 'Song details have been updated successfully.',
    })
  }

  const handleToggleFavorite = async (songId) => {
    if (!user) return
    const wasFavorite = favoriteIds.has(songId)
    if (wasFavorite) {
      await removeFavorite(user.id, songId)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(songId)
        return next
      })
      return
    }
    await addFavorite(user.id, songId)
    setFavoriteIds((prev) => new Set(prev).add(songId))
    const favoritedSong = songs.find((song) => song.id === songId)
    setFeedbackModal({
      open: true,
      title: 'Added to Favorites',
      message: `"${favoritedSong?.title ?? 'Song'}" is now in Liked Songs.`,
    })
  }

  const likedSongs = useMemo(
    () => songs.filter((song) => favoriteIds.has(song.id)),
    [songs, favoriteIds],
  )

  const handlePlaySongFromLibrary = (song, index) => {
    // Keep queue in sync with current view so next/previous navigation works.
    playFromList(songs, index)
  }

  const handlePlaySongFromLiked = (song, index) => {
    playFromList(likedSongs, index)
  }

  const handleCreatePlaylist = async (name) => {
    await createPlaylist({ name, user_id: user.id })
    await loadData()
  }

  const handleRenamePlaylist = async (playlistId, name) => {
    await updatePlaylist(playlistId, { name })
    setPlaylists((prev) =>
      prev.map((playlist) => (playlist.id === playlistId ? { ...playlist, name } : playlist)),
    )
  }

  const handleDeletePlaylist = async (playlistId) => {
    const playlistToDelete = playlists.find((playlist) => playlist.id === playlistId)
    await deletePlaylist(playlistId)
    await loadData()
    setFeedbackModal({
      open: true,
      title: 'Playlist deleted',
      message: `"${playlistToDelete?.name ?? 'Playlist'}" has been deleted.`,
    })
  }

  const handleAddSongToPlaylist = async (playlist, songId) => {
    const position = playlist.playlist_songs?.length ?? 0
    await addSongToPlaylist(playlist.id, songId, position)
    await loadData()
  }

  const handleReorderPlaylist = async (playlist, from, to) => {
    const rows = [...playlist.playlist_songs]
    const [moved] = rows.splice(from, 1)
    rows.splice(to, 0, moved)
    await reorderPlaylistSongs(playlist.id, rows)
    await loadData()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[#101317] text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 md:flex-row">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 space-y-4 pb-24">
          <div className="flex justify-end">
            <button type="button" onClick={handleSignOut} className="rounded-lg border border-white/20 px-3 py-1 text-sm">
              Sign Out
            </button>
          </div>
          {activeSection === 'home' && (
            <>
              <SongForm onSubmit={handleUploadSong} isSubmitting={savingSong} />
              <SongsSection
                songs={songs}
                favorites={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onDeleteSong={handleDeleteSong}
                onPlaySong={handlePlaySongFromLibrary}
                onUpdateSong={handleUpdateSong}
                onPreviewSong={setPreviewSong}
              />
            </>
          )}

          {activeSection === 'library' && (
            <PlaylistsSection
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={handleCreatePlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onAddSongToPlaylist={handleAddSongToPlaylist}
              onRemoveSongFromPlaylist={async (playlistSongId) => {
                await removeSongFromPlaylist(playlistSongId)
                await loadData()
              }}
              onReorder={handleReorderPlaylist}
              onPlayAll={(playlist) => {
                const playlistSongs = (playlist.playlist_songs ?? [])
                  .map((row) => row.songs)
                  .filter(Boolean)
                playFromList(playlistSongs, 0)
              }}
              onPreviewSong={setPreviewSong}
            />
          )}

          {activeSection === 'liked' && (
            <LikedSongsSection likedSongs={likedSongs} onPlay={handlePlaySongFromLiked} />
          )}

          {activeSection === 'profile' && <ProfileSection user={user} />}
        </main>
      </div>
      <BottomPlayer />
      <Modal
        open={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onClose={() => setFeedbackModal({ open: false, title: '', message: '' })}
        primaryAction={() => setFeedbackModal({ open: false, title: '', message: '' })}
      />
      <SongPreviewModal
        key={previewSong?.id ?? 'no-preview'}
        song={previewSong}
        onClose={() => setPreviewSong(null)}
      />
    </div>
  )
}
