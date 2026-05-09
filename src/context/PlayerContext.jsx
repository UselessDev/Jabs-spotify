import { useState } from 'react'
import { PlayerContext } from './player-context'

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)
  const [history, setHistory] = useState([])

  const currentSong = queue[currentIndex] ?? null

  const playFromList = (songs, startIndex = 0) => {
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
  }

  const playSong = (song) => {
    setQueue([song])
    setCurrentIndex(0)
  }

  const playAtIndex = (index) => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (index < 0 || index >= queue.length) return prev
      return index
    })
  }

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (prev + 1 < queue.length) return prev + 1
      return isLoopEnabled ? 0 : prev
    })
  }

  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (!queue.length) return prev
      if (prev - 1 >= 0) return prev - 1
      return isLoopEnabled ? queue.length - 1 : prev
    })
  }

  const markPlayed = (song) => {
    if (!song?.id) return
    setHistory((prev) => {
      const without = prev.filter((s) => s.id !== song.id)
      return [song, ...without].slice(0, 12)
    })
  }

  const toggleLoop = () => setIsLoopEnabled((prev) => !prev)
  const toggleShuffle = () => setIsShuffleEnabled((prev) => !prev)

  const value = {
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
  }

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  )
}
