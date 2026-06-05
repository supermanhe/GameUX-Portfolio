"use client"

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef } from 'react'

type ScrollFrameIntroProps = {
  frameCount: number
  framePath: string
  curvePower?: number
}

function formatFramePath(framePath: string, index: number) {
  return framePath.replace('{frame}', String(index).padStart(3, '0'))
}

export function ScrollFrameIntro({ frameCount, framePath, curvePower = 1.55 }: ScrollFrameIntroProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const currentFrameRef = useRef(1)
  const frames = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => formatFramePath(framePath, index + 1)),
    [frameCount, framePath],
  )

  useEffect(() => {
    if (window.location.hash) return

    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }))

    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useEffect(() => {
    frames.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [frames])

  useEffect(() => {
    const root = rootRef.current
    const image = imageRef.current

    if (!root || !image || frames.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const updateFrame = () => {
      if (reduceMotion) {
        if (currentFrameRef.current !== 1) {
          currentFrameRef.current = 1
          image.src = frames[0]
        }
        return
      }

      const scrollRange = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max((window.scrollY - root.offsetTop) / scrollRange, 0), 1)
      const curvedProgress = Math.pow(progress, curvePower)
      const nextFrame = Math.min(Math.max(Math.round(curvedProgress * (frames.length - 1)) + 1, 1), frames.length)

      if (nextFrame !== currentFrameRef.current) {
        currentFrameRef.current = nextFrame
        image.src = frames[nextFrame - 1]
      }
    }

    updateFrame()
    const timer = window.setInterval(updateFrame, 33)

    return () => {
      window.clearInterval(timer)
    }
  }, [curvePower, frames])

  return (
    <section ref={rootRef} className="relative h-[200dvh] bg-background" aria-label="Zoom transition">
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        <img
          ref={imageRef}
          src={frames[0]}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
    </section>
  )
}
