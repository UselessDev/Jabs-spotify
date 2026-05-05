import { Play, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function PlaylistsSection({
  playlists,
  songs,
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onAddSongToPlaylist,
  onRemoveSongFromPlaylist,
  onReorder,
  onPlayAll,
  onPreviewSong,
}) {
  const [name, setName] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">Playlists</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setOpenCreateModal(true)
            }}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-900"
          >
            Create Playlist
          </button>
        </div>

        {playlists.map((playlist) => (
          <div key={playlist.id} className="rounded-xl border border-white/10 bg-[#171b22] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <input
                value={playlist.name}
                onChange={(event) => onRenamePlaylist(playlist.id, event.target.value)}
                className="rounded border border-white/10 bg-[#0f1318] px-2 py-1 font-semibold text-slate-100"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPlayAll(playlist)}
                  className="flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-slate-200"
                >
                  <Play size={14} />
                  Play All
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePlaylist(playlist.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <select
                defaultValue=""
                onChange={(event) => {
                  const songId = event.target.value
                  if (songId) onAddSongToPlaylist(playlist, songId)
                }}
                className="rounded border border-white/10 bg-[#0f1318] px-2 py-1 text-sm"
              >
                <option value="" disabled>
                  Add song to playlist
                </option>
                {songs.map((song) => (
                  <option key={song.id} value={song.id}>
                    {song.title} - {song.artist}
                  </option>
                ))}
              </select>
              <Plus size={16} className="text-slate-400" />
            </div>

            <div className="space-y-2">
              {playlist.playlist_songs?.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded border border-white/10 px-2 py-1 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => row.songs && onPreviewSong(row.songs)}
                    className="text-left text-slate-200 hover:text-emerald-300"
                  >
                    {row.songs?.title ?? 'Unknown song'}
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onReorder(playlist, idx, idx - 1)}
                      className="rounded bg-white/10 px-2 py-0.5 disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={idx === playlist.playlist_songs.length - 1}
                      onClick={() => onReorder(playlist, idx, idx + 1)}
                      className="rounded bg-white/10 px-2 py-0.5 disabled:opacity-40"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveSongFromPlaylist(row.id)}
                      className="rounded bg-white/10 px-2 py-0.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      {openCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0f1318] p-4">
            <label className="text-sm text-slate-300">
              Playlist name
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Chill Mix"
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#171b22] px-3 py-2 text-slate-100"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenCreateModal(false)}
                className="rounded border border-white/20 px-3 py-1.5 text-sm text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) return
                  onCreatePlaylist(name.trim())
                  setName('')
                  setOpenCreateModal(false)
                }}
                className="rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-900"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
