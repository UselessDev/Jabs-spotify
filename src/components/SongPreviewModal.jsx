import { Pause, Play, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COVER_BUCKET,
  SONG_BUCKET,
  getStoragePublicUrl,
} from '../services/songService'

export default function SongPreviewModal({ song, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const touchStartRef = useRef(0)

  const requestClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => onClose(), 180)
  }, [onClose])

  useEffect(() => {
    if (!song) return
    const handleEsc = (event) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [song, requestClose])

  if (!song) return null

  const togglePlay = async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }
    await audioRef.current.play().catch(() => {})
    setIsPlaying(true)
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 md:items-center ${
        isClosing ? 'animate-[previewFadeOut_180ms_ease-in_forwards]' : 'animate-[previewFadeIn_220ms_ease-out]'
      }`}
      onClick={requestClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border border-white/10 bg-[#171b22] p-4 shadow-2xl ${
          isClosing ? 'animate-[previewScaleOut_180ms_ease-in_forwards]' : 'animate-[previewScaleIn_220ms_ease-out]'
        }`}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartRef.current = event.changedTouches[0].clientY
        }}
        onTouchEnd={(event) => {
          const deltaY = event.changedTouches[0].clientY - touchStartRef.current
          if (deltaY > 90) requestClose()
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">Song: {song.title}</h3>
          <button
            type="button"
            onClick={requestClose}
            className="p-1 text-slate-400 hover:text-slate-100"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>
        <img
          src={
            getStoragePublicUrl(COVER_BUCKET, song.cover_url) ||
            'https://placehold.co/500x260/1f2937/e2e8f0?text=Preview'
          }
          alt={song.title}
          className="h-48 w-full rounded-xl object-cover"
        />
        <div className="mt-4">
          <p className="text-lg font-semibold text-slate-100">{song.title}</p>
          <p className="text-sm text-slate-400">{song.artist}</p>
        </div>

        <audio
          ref={audioRef}
          src={getStoragePublicUrl(SONG_BUCKET, song.audio_url)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  )
}
