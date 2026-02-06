import { useEffect, useRef, useState } from "react"

type Options = {
  enabled: boolean
  volume?: number // 0 to 1
}

export function useAudioFeedback({ enabled, volume = 0.4 }: Options) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ready, setReady] = useState(false)
  const unlockedRef = useRef(false)

  useEffect(() => {
    const src = new URL("sounds/click.mp3", import.meta.env.BASE_URL).toString()
    const a = new Audio(src)
    a.preload = "auto"
    a.volume = volume
    audioRef.current = a
    setReady(true)

    const unlock = () => {
      if (!audioRef.current || unlockedRef.current) return
      const el = audioRef.current
      unlockedRef.current = true
      el.muted = true
      const p = el.play()
      if (p && typeof p.then === "function") {
        p.then(() => {
          el.pause()
          el.currentTime = 0
          el.muted = false
        }).catch(() => {
          unlockedRef.current = false
        })
      } else {
        el.pause()
        el.currentTime = 0
        el.muted = false
      }
    }

    document.addEventListener("pointerdown", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })

    return () => {
      document.removeEventListener("pointerdown", unlock)
      document.removeEventListener("keydown", unlock)
    }
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
