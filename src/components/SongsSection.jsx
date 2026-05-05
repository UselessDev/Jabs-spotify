import { Heart, Pencil, Play, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { COVER_BUCKET, getStoragePublicUrl } from '../services/songService'

function SongItem({
  song,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onPlay,
  onUpdate,
  onPreview,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    title: song.title,
    artist: song.artist,
    coverFile: null,
  })
  const coverUrl = getStoragePublicUrl(COVER_BUCKET, song.cover_url)

  return (
    <div className="rounded-xl border border-white/10 bg-[#171b22] p-3">
      <img
        src={coverUrl || 'https://placehold.co/300x200/1f2937/e2e8f0?text=No+Cover'}
        alt={song.title}
        className="mb-3 h-36 w-full cursor-pointer rounded-lg object-cover"
        onClick={onPreview}
      />
      {editing ? (
        <div className="space-y-2">
          <input
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded border border-white/10 bg-[#0f1318] px-2 py-1 text-sm"
          />
          <input
            value={draft.artist}
            onChange={(event) => setDraft((prev) => ({ ...prev, artist: event.target.value }))}
            className="w-full rounded border border-white/10 bg-[#0f1318] px-2 py-1 text-sm"
          />
          <label className="block text-xs text-slate-300">
            Update cover image
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, coverFile: event.target.files?.[0] ?? null }))
              }
              className="mt-1 block w-full text-xs text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-500/30 file:px-2 file:py-1 file:text-indigo-200"
            />
          </label>
          <button
            type="button"
            onClick={async () => {
              await onUpdate(song, draft)
              setEditing(false)
            }}
            className="rounded bg-indigo-500 px-2 py-1 text-sm"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <h3
            className="cursor-pointer font-semibold text-slate-100 hover:text-emerald-300"
            onClick={onPreview}
          >
            {song.title}
          </h3>
          <p className="mb-3 text-sm text-slate-400">{song.artist}</p>
        </>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={onPlay} className="p-1.5 text-slate-300 hover:text-emerald-300">
          <Play size={16} />
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`p-1.5 ${isFavorite ? 'text-rose-300' : 'text-slate-300 hover:text-rose-300'}`}
        >
          <Heart size={16} />
        </button>
        <button type="button" onClick={() => setEditing((prev) => !prev)} className="p-1.5 text-slate-300 hover:text-indigo-300">
          <Pencil size={16} />
        </button>
        <button type="button" onClick={onDelete} className="p-1.5 text-slate-300 hover:text-rose-300">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function SongsSection({
  songs,
  favorites,
  onToggleFavorite,
  onDeleteSong,
  onPlaySong,
  onUpdateSong,
  onPreviewSong,
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-100">Your Songs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            isFavorite={favorites.has(song.id)}
            onToggleFavorite={() => onToggleFavorite(song.id)}
            onDelete={() => onDeleteSong(song)}
            onPlay={() => onPlaySong(song, index)}
            onUpdate={onUpdateSong}
            onPreview={() => onPreviewSong(song)}
          />
        ))}
      </div>
    </section>
  )
}
