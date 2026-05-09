import { useCallback, useMemo, useState } from 'react'
import { PlayerContext } from './player-context'

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)
  const [history, setHistory] = useState([])

  const currentSong = queue[currentIndex] ?? null

  const playFromList = useCallback((songs, startIndex = 0) => {
    if (!songs?.length) return
    const normalizedSongs = [...songs]
    if (isShuffleEnabled) {
      const selectedSong = normalizedSongs[startIndex] ?? normalizedSongs[0]
      const rest = normalizedSongs.filter((song) => song.id !== selectedSong.id)
      const shuffledRest = rest.sort(() => Math.random() - 0.5)
      setQueue([selectedSong, ...shuffledRest])
      setCurrentIndex(0)
      return
    }
    setQueue(normalizedSongs)
    setCurrentIndex(startIndex)
  }, [isShuffleEnabled])

  const playSong = useCallback((song) => {
    setQueue([song])
    setCurrentIndex(0)
  }, [])

  const playAtIndex = useCallback((index) => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (index < 0 || index >= queue.length) return prev
      return index
    })
  }, [queue.length])

  const playNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (prev + 1 < queue.length) return prev + 1
      return isLoopEnabled ? 0 : prev
    })
  }, [isLoopEnabled, queue.length])

  const playPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (prev - 1 >= 0) return prev - 1
      return isLoopEnabled ? queue.length - 1 : prev
    })
  }, [isLoopEnabled, queue.length])

  const markPlayed = useCallback((song) => {
    if (!song?.id) return
    setHistory((prev) => {
      const without = prev.filter((s) => s.id !== song.id)
      return [song, ...without].slice(0, 12)
    })
  }, [])

  const toggleLoop = useCallback(() => setIsLoopEnabled((prev) => !prev), [])
  const toggleShuffle = useCallback(
    () => setIsShuffleEnabled((prev) => !prev),
    [],
  )

  const value = useMemo(
    () => ({
      queue,
      currentIndex,
      currentSong,
      history,
      isLoopEnabled,
      isShuffleEnabled,
      playFromList,
      playSong,
      playAtIndex,
      playNext,
      playPrevious,
      markPlayed,
      toggleLoop,
      toggleShuffle,
    }),
    [
      queue,
      currentIndex,
      currentSong,
      history,
      isLoopEnabled,
      isShuffleEnabled,
      playFromList,
      playSong,
      playAtIndex,
      playNext,
      playPrevious,
      markPlayed,
      toggleLoop,
      toggleShuffle,
    ],
  )

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  )
}
