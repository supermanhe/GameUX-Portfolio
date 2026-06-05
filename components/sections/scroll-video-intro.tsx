"use client"

import { useCallback, useEffect, useRef } from 'react'

type ScrollVideoIntroProps = {
  src: string
  curvePower?: number
}

export function ScrollVideoIntro({ src, curvePower = 1.55 }: ScrollVideoIntroProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (window.location.hash) return

    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }))

    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  const syncVideoMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return

    video.pause()
    video.muted = true
    video.currentTime = 0
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('loadedmetadata', syncVideoMetadata)
    video.load()
    syncVideoMetadata()

    return () => video.removeEventListener('loadedmetadata', syncVideoMetadata)
  }, [syncVideoMetadata])

  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current

    if (!root || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const updateVideoTime = () => {
      if (reduceMotion) {
        video.currentTime = 0
        return
      }

      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const scrollRange = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-root.getBoundingClientRect().top / scrollRange, 0), 1)
      const curvedProgress = Math.pow(progress, curvePower)
      const safeDuration = Math.max(video.duration - 0.02, 0)

      video.currentTime = curvedProgress * safeDuration
    }

    let frame = 0

    const tick = () => {
      updateVideoTime()
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [curvePower])

  return (
    <section ref={rootRef} className="relative h-[200dvh] bg-background" aria-label="Intro video">
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={syncVideoMetadata}
        />
      </div>
    </section>
  )
}
