"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Typewriter } from '@/components/ui/typewriter'
import type { HeroContent } from '@/data/hero'

gsap.registerPlugin(useGSAP)

/**
 * 里程碑（请按真实履历调整 year / title / 进度 at）。
 * at = 在视频/滚动进度 0~1 上的位置，与 history.mp4 里蘑菇、宝箱出现的时刻对齐。
 */
type Milestone = {
  at: number
  year: string
  title: string
  subtitle: string
}

const MILESTONES: Milestone[] = [
  {
    at: 0,
    year: '2015',
    title: '中山大学',
    subtitle: '交互设计硕士',
  },
  {
    at: 0.34,
    year: '2017',
    title: '网易游戏',
    subtitle: '《大话西游2》 · UX 负责人',
  },
  {
    at: 0.67,
    year: '2022',
    title: '昆仑万维 · 方舟游戏',
    subtitle: '《圣境之塔》 · UX 负责人',
  },
  {
    at: 1,
    year: '未来',
    title: 'To Be Continued',
    subtitle: 'AI 提效 · 全栈 Demo',
  },
]

// 表示“用户主动滚动意图”的按键（用于打断自动播放 / 点击跳转的缓动）
const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar']

export function HistoryScroll({ data, src }: { data: HeroContent; src: string }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastTimeRef = useRef(-1)
  const [activeIndex, setActiveIndex] = useState(0)
  // 末尾滑动提醒计时器
  const hintTimerRef = useRef(0)
  const jumpTweenRef = useRef<gsap.core.Tween | null>(null)
  const [showHint, setShowHint] = useState(false)

  // 点击里程碑：把页面缓动到该节点对应的滚动位置；滚动过程中由上面的 scroll 监听
  // 逐帧刷新视频 -> 视频随之平滑 scrub（不硬切）。手动滚动/上键则中断缓动，交还控制。
  const jumpToMilestone = useCallback((index: number) => {
    const root = rootRef.current
    if (!root) return
    const at = MILESTONES[index].at

    // 停掉上一次跳转缓动
    jumpTweenRef.current?.kill()

    const range = Math.max(root.offsetHeight - window.innerHeight, 1)
    const startY = window.scrollY + root.getBoundingClientRect().top
    const maxY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
    const target = Math.min(Math.max(Math.round(startY + at * range), 0), maxY)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      window.scrollTo(0, target)
      return
    }

    const proxy = { y: window.scrollY }
    const dist = Math.abs(target - proxy.y)
    if (dist < 2) return
    // 点击里程碑跳转的缓动时长：拉长以让视频 scrub 过渡更平缓（原 0.45~1.2s -> 0.9~2.4s）
    const duration = Math.min(2.4, Math.max(0.9, dist / 1100))

    const cleanup = () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', onKey)
    }
    const stop = () => {
      jumpTweenRef.current?.kill()
      jumpTweenRef.current = null
      cleanup()
    }
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(e.key)) stop()
    }
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchmove', stop, { passive: true })
    window.addEventListener('keydown', onKey)

    jumpTweenRef.current = gsap.to(proxy, {
      y: target,
      duration,
      ease: 'none',
      onUpdate: () => window.scrollTo(0, proxy.y),
      onComplete: cleanup,
    })
  }, [])

  useEffect(() => {
    return () => {
      jumpTweenRef.current?.kill()
    }
  }, [])

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set('.hist-reveal', { autoAlpha: 1, y: 0 })
        return
      }
      gsap
        .timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
        .fromTo('.hist-kicker', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 })
        .fromTo('.hist-title', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0 }, '-=0.55')
        .fromTo('.hist-rail', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, '-=0.4')
    },
    { scope: rootRef },
  )

  // 视频准备：静音、暂停、归零，便于按 currentTime 逐帧刷
  const primeVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.muted = true
    if (Number.isFinite(video.duration)) video.currentTime = 0
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.addEventListener('loadedmetadata', primeVideo)
    video.load()
    primeVideo()
    return () => video.removeEventListener('loadedmetadata', primeVideo)
  }, [primeVideo])

  // 滚动驱动：进度 -> 视频 currentTime + 进度条 + 里程碑高亮
  // 用 scroll/resize 事件 + rAF 节流（不跑常驻动画帧），停止滚动即停止刷新与播放
  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const video = videoRef.current
    if (!root || !stage || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ticking = false
    // 起点（中山大学）引导提示：玩家任意交互后永久关闭
    let startHintDismissed = false

    const update = () => {
      ticking = false
      const range = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-root.getBoundingClientRect().top / range, 0), 1)

      stage.style.setProperty('--p', progress.toFixed(4))

      if (!reduceMotion && Number.isFinite(video.duration) && video.duration > 0) {
        const safeDuration = Math.max(video.duration - 0.05, 0)
        const nextTime = progress * safeDuration
        if (Math.abs(nextTime - lastTimeRef.current) > 0.01) {
          lastTimeRef.current = nextTime
          video.currentTime = nextTime
        }
      }

      let next = 0
      for (let i = 0; i < MILESTONES.length; i += 1) {
        if (progress >= MILESTONES[i].at) next = i
      }
      setActiveIndex((current) => (current === next ? current : next))

      // 起点（中山大学）或末尾（To Be Continued）静止停留超过 3 秒 -> 浮出滑动提醒。
      // 一旦页面真的滚动离开起点区域（滚轮滚动、点击下方时间轴跳转等任何使页面滚动的
      // 交互），就永久关闭“起点”引导——再滚回起点也不再出现；单纯移动鼠标 / 点击 / 按非
      // 滚动键不会改变滚动进度，引导保留。末尾引导不受影响。
      const atEnd = progress >= 0.995
      if (progress > 0.02) startHintDismissed = true
      const atStart =
        progress <= 0.02 && !startHintDismissed && !document.querySelector('[data-home-intro]')
      window.clearTimeout(hintTimerRef.current)
      if (atEnd || atStart) {
        hintTimerRef.current = window.setTimeout(() => setShowHint(true), 3000)
      } else {
        setShowHint(false)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    // 开场遮罩消失后重新评估，以便玩家落在起点时开始计时
    const onIntro = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail === false) update()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('bgm:intro', onIntro as EventListener)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('bgm:intro', onIntro as EventListener)
      window.clearTimeout(hintTimerRef.current)
    }
  }, [])

  return (
    <section ref={rootRef} id="hero" className="relative -mt-14 h-[320dvh] bg-background" aria-label="工作经历像素之旅">
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-black [--p:0]">
        {/* 背景：滚动驱动的横版像素视频 */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={src.replace(/\.mp4$/, '-poster.webp')}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={primeVideo}
        />

        {/* 可读性渐变罩：顶部压暗放标题，底部压暗放时间轴，中部留白露出角色 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-background/88 via-background/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* 信息层 */}
        <div className="relative z-10 flex h-full flex-col">
          <div className="container mt-[10px] px-6 pt-[clamp(5rem,17vh,10rem)] text-center">
            <p className="hist-reveal hist-kicker font-pixel text-[10px] uppercase leading-relaxed tracking-[0.18em] text-primary md:text-xs">
              Game UX designer / indie developer
            </p>
            <h1
              className="hist-reveal hist-title font-editorial mx-auto mt-4 min-h-[2.2em] max-w-[20ch] text-4xl font-black leading-[1.02] drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)] md:min-h-[2.1em] md:text-6xl lg:text-7xl"
              aria-label={data.headline.join('；')}
            >
              <Typewriter
                text={data.headline}
                speed={72}
                waitTime={2400}
                deleteSpeed={36}
                deleteToPrefix="你好，我"
                cursorChar="_"
              />
            </h1>
          </div>

          {/* 底部时间轴 */}
          <div className="hist-reveal hist-rail container relative z-10 mt-auto px-6 pb-[clamp(1.5rem,5vh,3rem)]">
            <div className="relative mx-auto mt-4 max-w-5xl">
              {/* 轨道 */}
              <div className="relative h-[3px] rounded-full bg-foreground/15">
                {/* 进度填充 */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/60 via-primary to-accent"
                  style={{ width: 'calc(var(--p, 0) * 100%)' }}
                />
                {/* 奔跑的角色标记 */}
                <div
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                  style={{ left: 'calc(var(--p, 0) * 100%)' }}
                  aria-hidden="true"
                >
                  🏃
                </div>
                {/* 里程碑节点 */}
                {MILESTONES.map((m, i) => {
                  const reached = i <= activeIndex
                  return (
                    <button
                      type="button"
                      key={m.title + m.year}
                      onClick={() => jumpToMilestone(i)}
                      aria-label={`跳转到 ${m.year} ${m.title}`}
                      className="group absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center p-2 focus-ring"
                      style={{ left: `${m.at * 100}%` }}
                    >
                      <span
                        className={[
                          'h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 group-hover:scale-150',
                          reached
                            ? 'scale-110 border-primary bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.8)]'
                            : 'border-foreground/40 bg-background group-hover:border-primary',
                        ].join(' ')}
                      />
                    </button>
                  )
                })}
              </div>

              {/* 节点文案 —— 与圆点同一 left 对齐 */}
              <div className="relative mt-4 h-[78px]">
                {MILESTONES.map((m, i) => {
                  const reached = i <= activeIndex
                  const isFirst = i === 0
                  const isLast = i === MILESTONES.length - 1
                  const anchor = isFirst
                    ? 'translate-x-0 text-left'
                    : isLast
                      ? '-translate-x-full text-right'
                      : '-translate-x-1/2 text-center'
                  return (
                    <button
                      type="button"
                      key={m.title + m.year + 'label'}
                      onClick={() => jumpToMilestone(i)}
                      aria-label={`跳转到 ${m.year} ${m.title}`}
                      className={[
                        'group absolute top-0 w-[7.5rem] sm:w-[12rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:opacity-100 focus-ring',
                        anchor,
                        reached ? 'opacity-100' : 'opacity-45',
                      ].join(' ')}
                      style={{ left: `${m.at * 100}%` }}
                    >
                      <span className="block font-editorial text-lg font-black tabular-nums leading-none text-foreground transition-colors group-hover:text-primary">
                        {m.year}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-foreground/90">{m.title}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{m.subtitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 滑动提醒（复用首页样式）：起点（中山大学）或末尾（To Be Continued）停留 3 秒后浮现，滚动/交互即隐藏 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(7rem,20vh,11rem)] z-20 flex justify-center">
          <span className="scroll-hint" data-hidden={!showHint} aria-hidden="true">
            <span className="scroll-hint-mouse">
              <span className="scroll-hint-wheel" />
            </span>
            <span className="scroll-hint-label">滑动翻页</span>
          </span>
        </div>
      </div>
    </section>
  )
}
