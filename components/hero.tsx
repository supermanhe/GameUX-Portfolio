"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { Download, Github, Mail } from 'lucide-react'
import { useTrackEvent } from '@/lib/analytics'
import type { HeroContent } from '@/data/hero'
import { Typewriter } from '@/components/ui/typewriter'

gsap.registerPlugin(useGSAP)

function copyToClipboard(text: string) {
  if (typeof navigator === 'undefined') {
    return Promise.reject(new Error('Clipboard unavailable'))
  }

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (!successful) {
        reject(new Error('Copy command was unsuccessful'))
        return
      }
      resolve()
    } catch (error) {
      reject(error as Error)
    }
  })
}

type HeroProps = {
  data: HeroContent
}

export function Hero({ data }: HeroProps) {
  const track = useTrackEvent()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set('.hero-reveal', { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      gsap
        .timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
        .fromTo('.hero-kicker', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 })
        .fromTo('.hero-title', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0 }, '-=0.55')
        .fromTo('.hero-copy', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, '-=0.5')
        .fromTo('.hero-actions', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0 }, '-=0.45')
        .fromTo('.hero-skill', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, '-=0.48')
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const handleCopyEmail = useCallback(async () => {
    track({ name: 'cta_copy_email' })
    try {
      await copyToClipboard(data.email)
      setToastMessage(`已复制邮箱地址：${data.email}`)
    } catch (error) {
      setToastMessage(`复制失败，请手动复制：${data.email}`)
    }
  }, [data.email, track])

  return (
    <section id="hero" ref={rootRef} className="relative flex min-h-dvh items-center overflow-hidden py-16">
      <div className="container relative z-10 w-full">
        <div className="mx-auto max-w-[1500px] text-center">
          <p className="hero-reveal hero-kicker font-pixel text-[10px] uppercase leading-relaxed tracking-[0.18em] text-primary md:text-xs">
            Game UX designer / indie developer
          </p>
          <h1
            className="hero-reveal hero-title font-editorial mt-5 min-h-[2.88em] text-5xl font-black leading-[0.96] md:min-h-[1.92em] md:text-6xl lg:text-7xl"
            aria-label={data.headline.join('；')}
          >
            <Typewriter
              text={data.headline}
              speed={72}
              waitTime={1500}
              deleteSpeed={36}
              deleteToPrefix="你好，我"
              cursorChar="_"
            />
          </h1>
          <p className="hero-reveal hero-copy mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {data.description}
          </p>
        </div>

        <div className="hero-reveal hero-actions mx-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" onClick={() => track({ name: 'cta_download_cv' })}>
            <a href={data.resumeUrl} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> 下载简历 PDF
            </a>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleCopyEmail}
            aria-label="复制邮箱地址"
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button
            asChild
            variant="secondary"
            size="icon"
            onClick={() => track({ name: 'cta_open_github' })}
            aria-label="访问 GitHub"
          >
            <a href={data.githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 border-y border-border/60 py-5 md:grid-cols-[0.9fr_1.2fr_0.9fr] md:items-center">
          <div className="hero-reveal hero-skill text-center md:text-left">
            <p className="font-pixel text-4xl tabular-nums">9</p>
            <p className="mt-2 font-pixel text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
              years in game UX
            </p>
          </div>
          <div className="hero-reveal hero-skill flex flex-wrap justify-center gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-primary/22 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="hero-reveal hero-skill text-center md:text-right">
            <p className="font-pixel text-4xl tabular-nums">2</p>
            <p className="mt-2 font-pixel text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
              shipped games
            </p>
          </div>
        </div>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </section>
  )
}
