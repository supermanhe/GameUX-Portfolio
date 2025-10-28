"use client"

import { useEffect, useState } from 'react'

type DelayedRenderProps = {
  delay?: number
  children: React.ReactNode
}

export function DelayedRender({ delay = 180, children }: DelayedRenderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!ready) return null
  return <>{children}</>
}
