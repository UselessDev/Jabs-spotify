import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SONG_BUCKET, getStoragePublicUrl } from '../services/songService'
import { usePlayer } from '../hooks/usePlayer'
import NowPlayingModal from './NowPlayingModal'

export default function BottomPlayer() {
  const audioRef = useRef(null)
  const {
    currentSong,
    queue,
    history,
    playNext,
    playPrevious,
    playAtIndex,
    markPlayed,
    isLoopEnabled,
    isShuffleEnabled,
    toggleLoop,
    toggleShuffle,
  } = usePlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false)
  const [nowPlayingSong, setNowPlayingSong] = useState(null)

  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.load()
    audioRef.current.play().catch(() => {})
    setIsPlaying(true)
    setProgress(0)
    setCurrentTime(0)
    markPlayed(currentSong)
  }, [currentSong, markPlayed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handlePrevious = () => {
    if (!audioRef.current) return
    // Standard media-player behavior: restart current track first if already progressed.
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setProgress(0)
      setCurrentTime(0)
      return
    }
    playPrevious()
  }

  const songUrl = currentSong
    ? getStoragePublicUrl(SONG_BUCKET, currentSong.audio_url)
    : ''

  return (
    <footer className="sticky bottom-0 mt-4 border-t border-white/10 bg-[#12161d] p-3">
      <audio
        ref={audioRef}
        src={songUrl}
        onEnded={playNext}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget
          // Guard for divide-by-zero when metadata is not loaded yet.
          if (!audio.duration) return
          setProgress((audio.currentTime / audio.duration) * 100)
          setCurrentTime(audio.currentTime)
        }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-200">
            {currentSong ? `${currentSong.title} - ${currentSong.artist}` : 'Select a song to play'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-1.5 ${isShuffleEnabled ? 'text-emerald-400' : 'text-slate-300'}`}
            title="Toggle shuffle"
          >
            <Shuffle size={16} />
          </button>
          <button type="button" onClick={handlePrevious} className="p-1.5 text-slate-200">
            <SkipBack size={16} />
          </button>
          <button type="button" onClick={togglePlay} className="rounded bg-emerald-500 p-2 text-slate-900">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button type="button" onClick={playNext} className="p-1.5 text-slate-200">
            <SkipForward size={16} />
          </button>
          <button
            type="button"
            onClick={toggleLoop}
            className={`p-1.5 ${isLoopEnabled ? 'text-emerald-400' : 'text-slate-300'}`}
            title="Toggle loop"
          >
            <Repeat size={16} />
          </button>
        </div>
      </div>
      <div className="mt-2 h-1 w-full rounded bg-white/10">
        <div className="h-1 rounded bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Played songs row (click to open modal) */}
      {history.length > 0 && (
        <div className="mx-auto mt-3 max-w-6xl">
          <p className="mb-2 text-xs text-slate-400">Played</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {history.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => {
                  setNowPlayingSong(song)
                  setNowPlayingOpen(true)
                }}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:border-white/20"
                title="Open now playing modal"
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <NowPlayingModal
        key={`${nowPlayingOpen ? 'open' : 'closed'}:${(nowPlayingSong ?? currentSong)?.id ?? 'none'}`}
        open={nowPlayingOpen}
        song={nowPlayingSong ?? currentSong}
        isPlaying={isPlaying}
        isShuffleEnabled={isShuffleEnabled}
        isLoopEnabled={isLoopEnabled}
        currentTime={currentTime}
        onClose={() => setNowPlayingOpen(false)}
        onTogglePlay={togglePlay}
        onNext={() => {
          // If modal was opened for a different song, jump to it in queue first.
          if (nowPlayingSong?.id && nowPlayingSong.id !== currentSong?.id) {
            const idx = queue.findIndex((s) => s.id === nowPlayingSong.id)
            if (idx >= 0) playAtIndex(idx)
            else return
          }
          playNext()
        }}
        onPrevious={() => {
          if (!audioRef.current) return
          if (nowPlayingSong?.id && nowPlayingSong.id !== currentSong?.id) {
            const idx = queue.findIndex((s) => s.id === nowPlayingSong.id)
            if (idx >= 0) {
              playAtIndex(idx)
              audioRef.current.currentTime = 0
              setProgress(0)
              setCurrentTime(0)
              return
            }
          }
          handlePrevious()
        }}
        onToggleShuffle={toggleShuffle}
        onToggleLoop={toggleLoop}
      />
    </footer>
  )
}
