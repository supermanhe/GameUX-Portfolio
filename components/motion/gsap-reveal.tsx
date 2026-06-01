"use client"

import { ReactNode, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type GsapRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export function GsapReveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set(element, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            once,
          },
        },
      )
    },
    { scope: ref, dependencies: [delay, once, y], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
