"use client"

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type CoverVideoProps = {
  src: string
  /** 兜底封面图：reduced-motion / 加载前显示 */
  poster?: string
  className?: string
  containerClassName?: string
}

/** 项目封面视频：静音循环，仅在视口内播放（省带宽）；prefers-reduced-motion 停留在 poster。 */
export function CoverVideo({ src, poster, className, containerClassName }: CoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) v.play().catch(() => {})
          else v.pause()
        })
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <div className={cn('relative', containerClassName)}>
      <video
        ref={ref}
        className={cn('h-full w-full object-cover', className)}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    </div>
  )
}
