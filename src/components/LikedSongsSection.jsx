import { Play } from 'lucide-react'
import { COVER_BUCKET, getStoragePublicUrl } from '../services/songService'

export default function LikedSongsSection({ likedSongs, onPlay }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-100">Liked Songs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {likedSongs.map((song, index) => (
          <div
            key={song.id}
            className="rounded-xl border border-white/10 bg-[#171b22] p-3"
          >
            <img
              src={
                getStoragePublicUrl(COVER_BUCKET, song.cover_url) ||
                'https://placehold.co/300x200/1f2937/e2e8f0?text=Liked+Song'
              }
              alt={song.title}
              className="mb-3 h-32 w-full rounded-lg object-cover"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-100">{song.title}</p>
                <p className="text-sm text-slate-400">{song.artist}</p>
              </div>
              <button
                type="button"
                onClick={() => onPlay(song, index)}
                className="p-1.5 text-slate-300 hover:text-emerald-300"
              >
                <Play size={16} />
              </button>
            </div>
          </div>
        ))}
        {likedSongs.length === 0 && (
          <p className="text-sm text-slate-400">You have no liked songs yet.</p>
        )}
      </div>
    </section>
  )
}
