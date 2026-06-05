"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

type TypewriterProps = {
  text: string | string[]
  speed?: number
  initialDelay?: number
  waitTime?: number
  deleteSpeed?: number
  deleteToPrefix?: string
  loop?: boolean
  className?: string
  showCursor?: boolean
  hideCursorOnType?: boolean
  cursorChar?: ReactNode
  cursorAnimationVariants?: {
    initial: Variants['initial']
    animate: Variants['animate']
  }
  cursorClassName?: string
}

export function Typewriter({
  text,
  speed = 58,
  initialDelay = 240,
  waitTime = 1600,
  deleteSpeed = 34,
  deleteToPrefix = '',
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = '_',
  cursorClassName = 'ml-2 inline-block text-primary',
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.42,
        repeatType: 'reverse',
      },
    },
  },
}: TypewriterProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const didStartRef = useRef(false)

  useEffect(() => {
    const currentText = texts[currentTextIndex] ?? ''
    let timeout: ReturnType<typeof setTimeout>

    if (!currentText) {
      return undefined
    }

    if (!didStartRef.current && initialDelay > 0) {
      didStartRef.current = true
      timeout = setTimeout(() => {
        setDisplayText(currentText[0] ?? '')
        setCurrentIndex(1)
      }, initialDelay)
      return () => clearTimeout(timeout)
    }

    if (isDeleting) {
      const deleteTargetLength = currentText.startsWith(deleteToPrefix) ? deleteToPrefix.length : 0

      if (displayText.length <= deleteTargetLength) {
        setIsDeleting(false)
        setCurrentTextIndex((previous) => {
          if (previous === texts.length - 1 && !loop) return previous
          return (previous + 1) % texts.length
        })
        setCurrentIndex(deleteTargetLength)
        return undefined
      }

      timeout = setTimeout(() => {
        setDisplayText((previous) => previous.slice(0, -1))
      }, deleteSpeed)

      return () => clearTimeout(timeout)
    }

    if (currentIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText((previous) => previous + currentText[currentIndex])
        setCurrentIndex((previous) => previous + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }

    if (texts.length > 1 && (loop || currentTextIndex < texts.length - 1)) {
      timeout = setTimeout(() => setIsDeleting(true), waitTime)
      return () => clearTimeout(timeout)
    }

    return undefined
  }, [
    currentIndex,
    currentTextIndex,
    deleteSpeed,
    deleteToPrefix,
    displayText,
    initialDelay,
    isDeleting,
    loop,
    speed,
    texts,
    waitTime,
  ])

  return (
    <span className={cn('inline whitespace-pre-wrap tracking-tight', className)}>
      <span>{displayText}</span>
      {showCursor ? (
        <motion.span
          aria-hidden="true"
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType && (currentIndex < (texts[currentTextIndex]?.length ?? 0) || isDeleting)
              ? 'hidden'
              : '',
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      ) : null}
    </span>
  )
}
