import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COVER_BUCKET, getStoragePublicUrl } from '../services/songService'

function parseLrc(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const parsed = []
  for (const line of lines) {
    const match = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/)
    if (!match) {
      parsed.push({ time: null, text: line })
      continue
    }
    const min = Number(match[1])
    const sec = Number(match[2])
    const ms = match[3] ? Number(match[3].padEnd(3, '0')) : 0
    const time = min * 60 + sec + ms / 1000
    parsed.push({ time, text: match[4] || '' })
  }
  return parsed
}

function getActiveLyricIndex(items, currentTime) {
  if (!items?.length) return -1
  const timed = items.filter((i) => typeof i.time === 'number')
  if (!timed.length) return -1
  let idx = -1
  for (let i = 0; i < items.length; i++) {
    if (typeof items[i].time !== 'number') continue
    if (items[i].time <= currentTime) idx = i
  }
  return idx
}

export default function NowPlayingModal({
  open,
  song,
  isPlaying,
  isShuffleEnabled,
  isLoopEnabled,
  currentTime = 0,
  onClose,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleLoop,
}) {
  const [isClosing, setIsClosing] = useState(false)
  const [editingLyrics, setEditingLyrics] = useState(false)
  const [lyricsDraft, setLyricsDraft] = useState(() => '')
  const touchStartRef = useRef(0)

  const requestClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => onClose?.(), 180)
  }, [onClose])

  useEffect(() => {
    if (!open || !song?.id) return
    const saved = localStorage.getItem(`lyrics:${song.id}`) ?? ''
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLyricsDraft(saved)
  }, [open, song?.id])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, requestClose])

  const lyricsItems = useMemo(() => parseLrc(lyricsDraft), [lyricsDraft])
  const activeLyricIndex = useMemo(
    () => getActiveLyricIndex(lyricsItems, currentTime),
    [lyricsItems, currentTime],
  )

  if (!open || !song) return null

  const coverUrl =
    getStoragePublicUrl(COVER_BUCKET, song.cover_url) ||
    'https://placehold.co/500x500/1f2937/e2e8f0?text=Cover'

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-3 md:items-center ${
        isClosing
          ? 'animate-[previewFadeOut_180ms_ease-in_forwards]'
          : 'animate-[previewFadeIn_220ms_ease-out]'
      }`}
      onClick={requestClose}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl border border-white/10 bg-[#171b22] shadow-2xl ${
          isClosing
            ? 'animate-[previewScaleOut_180ms_ease-in_forwards]'
            : 'animate-[previewScaleIn_220ms_ease-out]'
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
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">Now Playing</p>
            <p className="truncate text-xs text-slate-400">{song.title}</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="p-1 text-slate-400 hover:text-slate-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Left: Controls */}
          <section className="space-y-4 p-4">
            <div className="flex gap-4">
              <img
                src={coverUrl}
                alt={song.title}
                className="h-28 w-28 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-100">
                  {song.title}
                </p>
                <p className="truncate text-sm text-slate-400">{song.artist}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleShuffle}
                    className={`p-2 ${
                      isShuffleEnabled ? 'text-emerald-300' : 'text-slate-300'
                    }`}
                    title="Shuffle"
                  >
                    <Shuffle size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="p-2 text-slate-200"
                    title="Previous"
                  >
                    <SkipBack size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="rounded-full bg-emerald-500 p-3 text-slate-900"
                    title="Play/Pause"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="p-2 text-slate-200"
                    title="Next"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onToggleLoop}
                    className={`p-2 ${
                      isLoopEnabled ? 'text-emerald-300' : 'text-slate-300'
                    }`}
                    title="Loop"
                  >
                    <Repeat size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0f1318] p-3">
              <p className="text-xs text-slate-400">Tip</p>
              <p className="text-sm text-slate-200">
                Add synced lyrics using LRC timestamps like <code>[00:12.00]</code>.
              </p>
            </div>
          </section>

          {/* Right: Lyrics */}
          <section className="border-t border-white/10 p-4 md:border-l md:border-t-0">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-100">Lyrics</h4>
              <div className="flex gap-2">
                {editingLyrics ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem(`lyrics:${song.id}`, lyricsDraft)
                        setEditingLyrics(false)
                      }}
                      className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-900"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const saved = localStorage.getItem(`lyrics:${song.id}`) ?? ''
                        setLyricsDraft(saved)
                        setEditingLyrics(false)
                      }}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingLyrics(true)}
                    className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-200"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {editingLyrics ? (
              <textarea
                value={lyricsDraft}
                onChange={(e) => setLyricsDraft(e.target.value)}
                placeholder="[00:10.00] First line..."
                className="h-64 w-full resize-none rounded-xl border border-white/10 bg-[#0f1318] p-3 text-sm text-slate-100 outline-none"
              />
            ) : (
              <div className="h-64 overflow-auto rounded-xl border border-white/10 bg-[#0f1318] p-3">
                {lyricsItems.filter((i) => i.text !== '').length ? (
                  <div className="space-y-2">
                    {lyricsItems.map((item, idx) => {
                      const active = idx === activeLyricIndex
                      return (
                        <p
                          key={`${item.time ?? 'x'}:${idx}`}
                          className={`text-sm transition ${
                            active ? 'text-emerald-300' : 'text-slate-300'
                          }`}
                        >
                          {item.text}
                        </p>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No lyrics yet. Click <b>Edit</b> to add them (optionally in LRC format).
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

