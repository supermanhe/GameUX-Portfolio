"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Github, Mail } from 'lucide-react'
import { useTrackEvent } from '@/lib/analytics'
import { aboutContent } from '@/data/about'

/**
 * “关于我”页（首页最后一屏）
 *
 * - 背景：循环播放 ending.mp4（城堡通关场景）
 * - 角色对话气泡：进入视口后文案逐字蹦出（约 3 秒），打完再浮现联系方式按钮
 * - 继续下滑：气泡淡出，露出像素大字 “QUEST COMPLETE! / THANK YOU!”
 *
 * 滚动驱动与“我的工具”一致：scroll/resize + rAF 节流，按区块进度切换阶段（不跑常驻动画帧）。
 */

const TYPE_DURATION_MS = 3000

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
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      ok ? resolve() : reject(new Error('Copy command was unsuccessful'))
    } catch (error) {
      reject(error as Error)
    }
  })
}

export function AboutSection({ src = '/ending.mp4' }: { src?: string }) {
  const track = useTrackEvent()
  const rootRef = useRef<HTMLElement | null>(null)
  const fullText = useMemo(() => aboutContent.lines.join('\n'), [])

  // 高亮句在整段文本中的区间（用于打字过程中也能正确着色）
  const [hStart, hEnd] = useMemo(() => {
    const start = aboutContent.highlight ? fullText.indexOf(aboutContent.highlight) : -1
    return start < 0 ? [-1, -1] : [start, start + aboutContent.highlight.length]
  }, [fullText])

  const [typed, setTyped] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [questShown, setQuestShown] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const typingComplete = typingDone || typed >= fullText.length

  // 进入视口后开始逐字蹦出（约 3 秒打完），仅触发一次
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setTyped(fullText.length)
      setTypingDone(true)
      return
    }

    let interval: ReturnType<typeof setInterval> | null = null

    const startTyping = () => {
      if (interval) return
      const stepMs = Math.max(TYPE_DURATION_MS / fullText.length, 16)
      interval = setInterval(() => {
        setTyped((prev) => {
          const next = prev + 1
          if (next >= fullText.length) {
            if (interval) clearInterval(interval)
            interval = null
            setTypingDone(true)
            return fullText.length
          }
          return next
        })
      }, stepMs)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTyping()
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.45 },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      if (interval) clearInterval(interval)
    }
  }, [fullText])

  // 滚动驱动：区块进度越过阈值 -> 气泡淡出、通关大字浮现
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let ticking = false
    const update = () => {
      ticking = false
      const range = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-root.getBoundingClientRect().top / range, 0), 1)
      const past = progress >= 0.45
      setQuestShown((prev) => (prev === past ? prev : past))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleCopyEmail = useCallback(async () => {
    track({ name: 'cta_copy_email' })
    try {
      await copyToClipboard(aboutContent.email)
      setToast(`已复制邮箱地址：${aboutContent.email}`)
    } catch {
      setToast(`复制失败，请手动复制：${aboutContent.email}`)
    }
  }, [track])

  return (
    <section ref={rootRef} id="about" className="relative h-[200dvh] bg-black" aria-label="关于我">
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        {/* 背景：循环播放的通关视频 */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* 可读性渐变罩：顶部稍压暗，承托气泡 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/45 to-transparent" />

        {/* 对话气泡 */}
        <div
          data-hidden={questShown ? 'true' : 'false'}
          className="about-bubble-wrap absolute inset-x-0 top-[clamp(4.5rem,12vh,8rem)] z-10 flex justify-center px-5"
        >
          <div className="about-bubble w-full max-w-[680px] px-6 py-6 md:px-9 md:py-8">
            <p
              className="font-fusion whitespace-pre-wrap text-[15px] leading-[2] text-white/95 md:text-[17px] md:leading-[2.1]"
              aria-label={aboutContent.lines.join(' ')}
            >
              {hStart < 0 ? (
                fullText.slice(0, typed)
              ) : (
                <>
                  {fullText.slice(0, Math.min(typed, hStart))}
                  {typed > hStart ? (
                    <span className="font-semibold text-primary">
                      {fullText.slice(hStart, Math.min(typed, hEnd))}
                    </span>
                  ) : null}
                  {typed > hEnd ? fullText.slice(hEnd, typed) : null}
                </>
              )}
              {!typingComplete ? <span className="about-caret" aria-hidden="true">_</span> : null}
            </p>

            {/* 联系方式按钮：打字结束后浮现 */}
            <div
              data-show={typingComplete ? 'true' : 'false'}
              className="about-actions mt-7 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" onClick={() => track({ name: 'cta_download_cv' })}>
                <a href={aboutContent.resumeUrl} target="_blank" rel="noreferrer">
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
                <a href={aboutContent.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* 通关大字：继续下滑时浮现 */}
        <div
          data-show={questShown ? 'true' : 'false'}
          className="about-quest pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="about-quest-title font-pixel text-[clamp(1.6rem,7vw,4.5rem)] leading-tight">
            QUEST COMPLETE!
          </p>
          <p className="about-quest-sub font-pixel mt-6 text-[clamp(0.9rem,3.4vw,2rem)] leading-tight">
            THANK YOU!
          </p>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
          {toast}
        </div>
      ) : null}
    </section>
  )
}
