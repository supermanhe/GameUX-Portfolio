"use client"

import { useEffect, useState, type ImgHTMLAttributes } from 'react'
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
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
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
