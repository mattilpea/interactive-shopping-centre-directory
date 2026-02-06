import { useEffect, useRef, useState } from "react"

type Options = {
  enabled: boolean
  volume?: number // 0 to 1
}

export function useAudioFeedback({ enabled, volume = 0.4 }: Options) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const a = new Audio("/sounds/click.mp3")
    a.preload = "auto"
    a.volume = volume
    audioRef.current = a
    setReady(true)
  }, [volume])

  const playClick = () => {
    if (!enabled || !audioRef.current) return
    const a = audioRef.current
    a.pause()
    a.currentTime = 0
    a.play().catch((err) => console.log("play blocked:", err))
  }

  const canPlay = enabled && ready

  return { playClick, canPlay }
}