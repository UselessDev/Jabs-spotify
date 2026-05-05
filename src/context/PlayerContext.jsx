import { useState } from 'react'
import { PlayerContext } from './player-context'

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)

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

  const toggleLoop = () => setIsLoopEnabled((prev) => !prev)
  const toggleShuffle = () => setIsShuffleEnabled((prev) => !prev)

  const value = {
    queue,
    currentIndex,
    currentSong,
    isLoopEnabled,
    isShuffleEnabled,
    playFromList,
    playSong,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
  }

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  )
}
