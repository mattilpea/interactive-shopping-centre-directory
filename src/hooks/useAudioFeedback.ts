import { useEffect, useMemo, useRef } from "react"

type Options = {
  enabled: boolean
  volume?: number // 0 to 1
}

export function useAudioFeedback({ enabled, volume = 0.4 }: Options) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const canPlay = useMemo(() => enabled && !!audioRef.current, [enabled])

  useEffect(() => {
    const a = new Audio("/sounds/click.mp3")
    a.preload = "auto"
    a.volume = volume
    audioRef.current = a
  }, [volume])

  const playClick = () => {
    if (!enabled || !audioRef.current) return
    const a = audioRef.current
    a.pause()
    a.currentTime = 0
    a.play().catch((err) => console.log("play blocked:", err))
  }

  return { playClick, canPlay }
}
