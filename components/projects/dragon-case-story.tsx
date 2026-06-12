"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'
import { StoryMedia } from '@/components/projects/case-story'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type DragonCaseStoryProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

/**
 * 养成弧线（灵魂区）：三层养成（研究 → 龙鳞附魔 → 龙魂觉醒）逐级抬升的情感 / 付费弧线。
 * 进入视口时三层依次点亮；tierLevel 驱动暖色强度（1 中性 / 2 暖金 / 3 深红）。
 */
function CultivationArc({ arc }: { arc: NonNullable<CaseStory['cultivationArc']> }) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set('.dcs-arc-stage', { autoAlpha: 1, y: 0 })
        return
      }
      gsap.timeline({
        scrollTrigger: { trigger: '.dcs-arc', start: 'top 74%', toggleActions: 'play none none reverse' },
      }).fromTo(
        '.dcs-arc-stage',
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.16, ease: 'power3.out', clearProps: 'transform' },
      )
    },
    { scope },
  )

  return (
    <div className="cs-block dcs-arc work-copy" ref={scope}>
      {arc.kicker && <p className="cs-kicker font-pixel">{arc.kicker}</p>}
      {arc.title && <h3 className="cs-block-title">{arc.title}</h3>}
      {arc.intro && <p className="cs-rationale">{arc.intro}</p>}

      <div className="dcs-arc-track" role="list">
        {arc.stages.map((s, i) => (
          <div
            key={s.key}
            role="listitem"
            className={cn('dcs-arc-stage', `tier-${s.tierLevel}`)}
            style={{ ['--dcs-lift' as string]: `${i * 1.3}rem` }}
          >
            <span className="dcs-arc-mechanic font-pixel">机制 · {s.mechanic}</span>
            <span className="dcs-arc-label">{s.label}</span>
            <span className="dcs-arc-emotion">{s.emotion}</span>
            <span className="dcs-arc-tier font-pixel">{s.tier}</span>
          </div>
        ))}
      </div>

      <div className="dcs-arc-legend font-pixel" aria-hidden="true">
        <span className="dcs-arc-legend-item tier-1">日常产出</span>
        <span className="dcs-arc-legend-item tier-2">元素龙产出</span>
        <span className="dcs-arc-legend-item tier-3">付费产出（付费深度递增）</span>
      </div>
    </div>
  )
}

/** 镜头切换包装（主线亮点）：一组帧（强化 / 切换部位 / 切换元素）点选切换主图 + 可交互原型视频。 */
function LensSwitch({ data }: { data: NonNullable<CaseStory['lensSwitch']> }) {
  const [active, setActive] = useState(0)
  const frame = data.frames[active] ?? data.frames[0]

  return (
    <div className="cs-block dcs-lens work-copy">
      <div className="dcs-lens-grid">
        <div className="dcs-lens-copy">
          {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
          {data.title && <h3 className="cs-block-title">{data.title}</h3>}
          {data.body && <p className="cs-rationale dcs-lens-body">{data.body}</p>}
        </div>

        <div className="dcs-lens-stage">
          <div className="dcs-lens-tabs" role="tablist" aria-label="镜头切换演示">
            {data.frames.map((f, i) => (
              <button
                key={f.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={cn('cs-tour-tab font-pixel', i === active && 'is-active')}
                onClick={() => setActive(i)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <figure className="cs-figure dcs-lens-figure work-media">
            <div className="cs-spotlight-frame">
              {data.frames.map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={f.src}
                  className={cn('cs-spotlight-media dcs-lens-img', i === active && 'is-active')}
                  src={f.src}
                  alt={f.caption ?? f.label}
                  aria-hidden={i !== active}
                  loading="lazy"
                />
              ))}
            </div>
            {frame?.caption && <figcaption className="cs-cap">{frame.caption}</figcaption>}
          </figure>
        </div>
      </div>

      {data.video && (
        <figure className="cs-figure dcs-lens-video work-media">
          <div className="cs-spotlight-frame">
            <video
              className="cs-spotlight-media"
              src={data.video.src}
              controls
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          {data.video.caption && <figcaption className="cs-cap">{data.video.caption}</figcaption>}
        </figure>
      )}
    </div>
  )
}

/** 包装翻译：机制原名 → 玩家包装 + 一句说明。 */
function PackagingMap({ data }: { data: NonNullable<CaseStory['packagingMap']> }) {
  return (
    <div className="cs-block dcs-pack work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="dcs-pack-list">
        {data.rows.map((r) => (
          <div key={r.from + r.to} className="dcs-pack-row">
            <span className="dcs-pack-from">{r.from}</span>
            <span className="dcs-pack-arrow font-pixel" aria-hidden="true">→</span>
            <span className="dcs-pack-to font-pixel">{r.to}</span>
            <span className="dcs-pack-note">{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 需求背景 + 我负责什么。 */
function Background({ data }: { data: NonNullable<CaseStory['background']> }) {
  return (
    <div className="cs-block dcs-bg work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      <p className="cs-rationale">{data.body}</p>
      {data.roles && data.roles.length > 0 && (
        <div className="dcs-role">
          {data.roleLabel && <span className="dcs-role-label font-pixel">{data.roleLabel}</span>}
          <div className="dcs-role-list">
            {data.roles.map((r) => (
              <span key={r} className="dcs-role-item">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LiveResult({ data }: { data: NonNullable<CaseStory['liveResult']> }) {
  return (
    <div className="cs-block dcs-live work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.body && <p className="cs-rationale">{data.body}</p>}
      <figure className="cs-figure work-media">
        <div className="cs-spotlight-frame">
          {data.media.type === 'video' ? (
            <video
              className="cs-spotlight-media"
              src={data.media.src}
              controls
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cs-spotlight-media" src={data.media.src} alt={data.media.caption ?? data.title ?? ''} loading="lazy" />
          )}
        </div>
        {data.media.caption && <figcaption className="cs-cap">{data.media.caption}</figcaption>}
      </figure>
    </div>
  )
}

function HonestFacts({ metrics }: { metrics: NonNullable<CaseStory['metrics']> }) {
  return (
    <div className="cs-block cs-facts work-copy">
      <p className="cs-kicker font-pixel">结果 · 定性</p>
      <div className="cs-fact-list">
        {metrics.map((m) => (
          <div key={m.label} className="cs-fact-row">
            <span className="cs-fact-value font-pixel">{m.value}</span>
            <div className="cs-fact-body">
              <span className="cs-fact-label">{m.label}</span>
              <dl className="cs-fact-meta">
                {m.meta.map((x) => (
                  <div key={x.k} className="cs-fact-meta-row">
                    <dt>{x.k}</dt>
                    <dd>{x.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DragonCaseStory({ id, index, title, story }: DragonCaseStoryProps) {
  const badges = story.cultivationArc?.stages.map((s) => s.label) ?? []
  const sectionRef = useRef<HTMLElement>(null)

  // 案例内视频：静音循环 + 仅在视口内自动播放（省带宽）；prefers-reduced-motion 不自动播。
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const videos = Array.from(root.querySelectorAll('video'))
    if (!videos.length) return
    videos.forEach((v) => {
      v.muted = true
      v.loop = true
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) v.play().catch(() => {})
          else v.pause()
        })
      },
      { threshold: 0.4 },
    )
    videos.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id={id} className="work-item cs cs-linear dcs scroll-mt-24">
      {/* 开场立论（去数字） */}
      <header className={cn('cs-hero cs-hero-linear work-copy', story.heroImage && 'has-cover')}>
        {story.heroImage && (
          <div className="cs-hero-cover" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.heroImage.src}
              alt=""
              style={story.heroImage.objectPosition ? { objectPosition: story.heroImage.objectPosition } : undefined}
            />
            <span className="cs-hero-cover-shade" />
          </div>
        )}
        <div className="cs-hero-head">
          <span className="font-pixel text-3xl text-primary tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="cs-archetype">{story.archetype}</span>
        </div>
        <h2 className="cs-title">{title}</h2>
        <p className="cs-oneliner">{story.oneLiner}</p>
        {story.heroKicker && <p className="cs-hero-kicker font-pixel">{story.heroKicker}</p>}
        {badges.length > 0 && (
          <div className="cs-hero-funcs" aria-hidden="true">
            {badges.map((b) => (
              <span key={b} className="cs-hero-func font-pixel">
                {b}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="cs-linear-body">
        {/* 需求背景 + 我负责什么 */}
        {story.background && <Background data={story.background} />}

        {/* 总点：前期数值养成翻译（养成弧线·设计骨架 + 机制→玩家对照表） */}
        {(story.cultivationArc || story.packagingMap) && (
          <div className="dcs-translate">
            {story.cultivationArc && <CultivationArc arc={story.cultivationArc} />}
            {story.packagingMap && <PackagingMap data={story.packagingMap} />}
          </div>
        )}

        {/* 主线亮点：镜头切换包装 */}
        {story.lensSwitch && <LensSwitch data={story.lensSwitch} />}

        {/* 正式落地效果 */}
        {story.liveResult && <LiveResult data={story.liveResult} />}

        {/* 诚实结果 */}
        {story.metrics && story.metrics.length > 0 && <HonestFacts metrics={story.metrics} />}

        {/* 反思 */}
        {story.reflection && (
          <div className="cs-block cs-reflection work-copy">
            <p className="cs-kicker font-pixel">反思</p>
            <h3 className="cs-block-title">{story.reflection.title}</h3>
            <p className="cs-rationale">{story.reflection.body}</p>
          </div>
        )}
      </div>
    </section>
  )
}
