"use client"

import { useEffect, useRef } from 'react'

export function DelightLayer() {
  const progressRef = useRef<HTMLDivElement | null>(null)
  const haloRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    let scrollFrame = 0
    let pointerFrame = 0
    let pointerX = 0
    let pointerY = 0

    const updateScroll = () => {
      scrollFrame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      progressRef.current?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)
    }

    const handleScroll = () => {
      if (scrollFrame) return
      scrollFrame = window.requestAnimationFrame(updateScroll)
    }

    const updatePointer = () => {
      pointerFrame = 0
      if (!haloRef.current) return
      haloRef.current.style.opacity = '1'
      haloRef.current.style.transform = `translate3d(${pointerX - 130}px, ${pointerY - 130}px, 0)`
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion || coarsePointer) return
      pointerX = event.clientX
      pointerY = event.clientY
      if (pointerFrame) return
      pointerFrame = window.requestAnimationFrame(updatePointer)
    }

    const handlePointerLeave = () => {
      if (haloRef.current) {
        haloRef.current.style.opacity = '0'
      }
    }

    updateScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame)
    }
  }, [])

  return (
    <>
      <div className="delight-progress" aria-hidden="true">
        <div ref={progressRef} className="delight-progress-bar" />
      </div>
      <div ref={haloRef} className="delight-cursor-halo" aria-hidden="true" />
    </>
  )
}
