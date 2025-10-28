"use client"

import Image, { type ImageProps } from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type SkeletonContainerProps = {
  children: React.ReactNode
  className?: string
  skeletonClassName?: string
  loaded: boolean
}

function SkeletonContainer({ children, className, skeletonClassName, loaded }: SkeletonContainerProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-muted/60 transition-opacity duration-300',
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse',
          skeletonClassName,
        )}
      />
      {children}
    </div>
  )
}

function useDelayedLoaded(loaded: boolean, delay = 150) {
  const [delayedLoaded, setDelayedLoaded] = useState(loaded)

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setDelayedLoaded(true), delay)
      return () => clearTimeout(timer)
    }
    setDelayedLoaded(false)
    return undefined
  }, [loaded, delay])

  return delayedLoaded
}

type SkeletonImageProps = ImageProps & {
  containerClassName?: string
  skeletonClassName?: string
}

export function SkeletonImage({
  containerClassName,
  skeletonClassName,
  className,
  onLoadingComplete,
  alt,
  ...props
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false)
  const delayedLoaded = useDelayedLoaded(loaded)

  const handleComplete = useCallback(
    (result: Parameters<NonNullable<ImageProps['onLoadingComplete']>>[0]) => {
      setLoaded(true)
      onLoadingComplete?.(result)
    },
    [onLoadingComplete],
  )

  return (
    <SkeletonContainer className={containerClassName} skeletonClassName={skeletonClassName} loaded={delayedLoaded}>
      <Image
        {...props}
        alt={alt}
        onLoadingComplete={handleComplete}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          delayedLoaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </SkeletonContainer>
  )
}

type SkeletonVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  containerClassName?: string
  skeletonClassName?: string
}

export function SkeletonVideo({
  containerClassName,
  skeletonClassName,
  className,
  onLoadedData,
  onLoadedMetadata,
  ...props
}: SkeletonVideoProps) {
  const [loaded, setLoaded] = useState(false)
  const delayedLoaded = useDelayedLoaded(loaded)

  const markLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleLoadedData = useCallback<NonNullable<SkeletonVideoProps['onLoadedData']>>(
    (event) => {
      markLoaded()
      onLoadedData?.(event)
    },
    [onLoadedData, markLoaded],
  )

  const handleLoadedMetadata = useCallback<NonNullable<SkeletonVideoProps['onLoadedMetadata']>>(
    (event) => {
      markLoaded()
      onLoadedMetadata?.(event)
    },
    [onLoadedMetadata, markLoaded],
  )

  return (
    <SkeletonContainer className={containerClassName} skeletonClassName={skeletonClassName} loaded={delayedLoaded}>
      <video
        {...props}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          delayedLoaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </SkeletonContainer>
  )
}
