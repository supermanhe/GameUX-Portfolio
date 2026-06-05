"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SKILL_GROUPS, type SkillTool } from '@/data/skills'

gsap.registerPlugin(useGSAP)

/**
 * “我的工具”页
 *
 * 滚动驱动：进度 -> skill.mp4 的 currentTime（下滑播放 / 停滑冻结 / 上滑倒放），
 * 与第二页（HistoryScroll）一致——用 scroll/resize + rAF 节流逐帧刷，不跑常驻动画帧。
 *
 * 角色从旗杆上滑下、奔向城堡的过程中，右侧技能面板按 at 阈值“依次”浮现：
 * 卡片带节奏地滑入，进度条随之缓缓涨到目标值。上滑则逐组收起、视频倒放。
 */

function SkillBadge({ tool }: { tool: SkillTool }) {
  // 统一的深色玻璃方块 + 品牌色字形（开源单色图标用 mask 着色；缺图标则用短标签占位）
  return (
    <span className="skill-badge" title={tool.name} style={{ ['--c' as string]: tool.color }}>
      {tool.icon ? (
        <span
          className="skill-glyph"
          aria-hidden="true"
          style={{
            backgroundColor: tool.color,
            WebkitMaskImage: `url(${tool.icon})`,
            maskImage: `url(${tool.icon})`,
          }}
        />
      ) : (
        <span className="skill-glyph-text" aria-hidden="true" style={{ color: tool.color }}>
          {tool.label ?? tool.name.slice(0, 2)}
        </span>
      )}
    </span>
  )
}

export function SkillScroll({ src }: { src: string }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastTimeRef = useRef(-1)
  const [revealed, setRevealed] = useState(0)

  // 标题层入场（一次性，进入区块时）
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set('.skill-reveal', { autoAlpha: 1, y: 0 })
        return
      }
      gsap
        .timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
        .fromTo('.skill-kicker', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 })
        .fromTo('.skill-title', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0 }, '-=0.55')
        .fromTo('.skill-sub', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, '-=0.5')
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

  // 滚动驱动：进度 -> 视频 currentTime + 技能组依次浮现
  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const video = videoRef.current
    if (!root || !stage || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setRevealed(SKILL_GROUPS.length)
      stage.style.setProperty('--p', '1')
      return
    }

    let ticking = false

    const update = () => {
      ticking = false
      const range = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-root.getBoundingClientRect().top / range, 0), 1)

      stage.style.setProperty('--p', progress.toFixed(4))

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const safeDuration = Math.max(video.duration - 0.05, 0)
        const nextTime = progress * safeDuration
        if (Math.abs(nextTime - lastTimeRef.current) > 0.01) {
          lastTimeRef.current = nextTime
          video.currentTime = nextTime
        }
      }

      let count = 0
      for (const g of SKILL_GROUPS) if (progress >= g.at) count += 1
      setRevealed((current) => (current === count ? current : count))
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

  return (
    <section ref={rootRef} id="skills" className="relative h-[300dvh] bg-[#1b9cff]" aria-label="我的工具技能展示">
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-[#1b9cff] [--p:0]">
        {/* 背景：滚动驱动的像素视频（角色下滑旗杆 -> 抵达城堡 -> 烟花） */}
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

        {/* 可读性渐变罩：左上压一层让标题清晰、底部轻微压暗承托面板（移动端） */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,hsl(var(--background)/0.55)_0%,transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent md:hidden" />

        {/* 信息层 */}
        <div className="relative z-10 flex h-full flex-col">
          {/* 标题：左上 */}
          <div className="container px-6 pt-[clamp(4.5rem,12vh,7rem)]">
            <p className="skill-reveal skill-kicker font-pixel text-[10px] uppercase tracking-[0.2em] text-primary drop-shadow-[2px_2px_0_rgba(0,0,0,0.55)] md:text-xs">
              My Skills
            </p>
            <h2 className="skill-reveal skill-title font-editorial mt-3 text-4xl font-black leading-tight text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.55)] md:text-6xl">
              我的工具
            </h2>
            <p className="skill-reveal skill-sub mt-4 max-w-md text-base leading-7 text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              精通绘图工具、AI 编程、AI 生成与游戏引擎
            </p>
          </div>

          {/* 技能面板：桌面右侧居中（约束在内容容器内，宽屏不贴边），移动端底部 */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 md:inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            <div className="md:container md:flex md:justify-end md:px-6">
            <div
              data-show={revealed > 0 ? 'true' : 'false'}
              className="skill-panel pointer-events-auto bg-black/35 p-3 backdrop-blur-xl md:w-[clamp(21rem,33vw,27rem)] md:p-4"
            >
              <ul className="space-y-2.5 md:space-y-3">
                {SKILL_GROUPS.map((group, i) => {
                  const show = i < revealed
                  return (
                    <li
                      key={group.id}
                      data-show={show ? 'true' : 'false'}
                      className="skill-row flex items-center gap-3 rounded-[3px] border-2 border-white/10 bg-white/[0.04] p-2.5 md:gap-4 md:p-3"
                    >
                      {/* 图标组：图标 + 名称 */}
                      <div className="flex shrink-0 items-start gap-3.5">
                        {group.tools.map((tool, ti) => (
                          <span
                            key={tool.name}
                            className="skill-badge-wrap flex flex-col items-center gap-1"
                            style={{ ['--bi' as string]: String(ti) }}
                          >
                            <SkillBadge tool={tool} />
                            <span className="skill-badge-name">{tool.name}</span>
                          </span>
                        ))}
                      </div>

                      {/* 文案 + 分段进度条 */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold tracking-wide text-white md:text-[15px]">{group.title}</p>
                        <div className="skill-track mt-2">
                          <span className="skill-bar" style={{ ['--lvl' as string]: `${group.level}%` }} />
                          <span className="skill-bar-grid" aria-hidden="true" />
                        </div>
                      </div>

                      {/* 数值 */}
                      <span className="skill-num font-pixel shrink-0 tabular-nums">{group.level}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
