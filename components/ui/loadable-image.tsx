"use client"

import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { PulsatingDots } from '@/components/ui/pulsating-loader'

type LoadableImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string
  loaderClassName?: string
}

export function LoadableImage({
  className,
  containerClassName,
  loaderClassName,
  onLoad,
  onError,
  alt = '',
  ...props
}: LoadableImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // 缓存命中的图片可能在本 effect 执行前就已经 complete，且 load 事件只触发一次——
    // 若无条件重置为 false，会在「load 已发生」后永远卡在 loader（opacity-0）。
    // 因此按图片真实状态同步：已完成则视为已加载，否则等待 load 事件。
    const img = imgRef.current
    setLoaded(Boolean(img?.complete && img.naturalWidth > 0))
  }, [props.src])

  return (
    <span className={cn('relative block overflow-hidden bg-muted/20', containerClassName)}>
      <PulsatingDots
        className={cn(
          'pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300',
          loaded ? 'opacity-0' : 'opacity-100',
          loaderClassName,
        )}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        ref={imgRef}
        alt={alt}
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
        }}
        onError={(event) => {
          setLoaded(true)
          onError?.(event)
        }}
        className={cn('transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', className)}
      />
    </span>
  )
}
