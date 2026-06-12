"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type PetCaseStoryProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

/**
 * 复杂度地图 → 三道闸（灵魂区）：先铺开复杂度碎片，再让三道闸依次点亮。
 * 进视口时碎片淡入，三道闸 stagger 抬升点亮；reduced-motion 直接终态。
 */
function ComplexityGates({ data }: { data: NonNullable<CaseStory['complexityGates']> }) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set('.pcs-load-chip, .pcs-gate', { autoAlpha: 1, y: 0 })
        return
      }
      gsap
        .timeline({
          scrollTrigger: { trigger: '.pcs-gates', start: 'top 76%', toggleActions: 'play none none reverse' },
        })
        .fromTo(
          '.pcs-load-chip',
          { autoAlpha: 0, y: 10, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.035, ease: 'power2.out', clearProps: 'transform' },
        )
        .fromTo(
          '.pcs-gate',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.18, ease: 'power3.out', clearProps: 'transform' },
          '+=0.15',
        )
    },
    { scope },
  )

  return (
    <div className="cs-block pcs-gates work-copy" ref={scope}>
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="pcs-load">
        <span className="pcs-load-label font-pixel" aria-hidden="true">
          玩家要面对的复杂度
        </span>
        <div className="pcs-load-chips">
          {data.load.map((c) => (
            <span key={c} className="pcs-load-chip">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="pcs-funnel" aria-hidden="true">
        <span className="pcs-funnel-line" />
        <span className="pcs-funnel-text font-pixel">三道闸 · 逐层收纳</span>
        <span className="pcs-funnel-line" />
      </div>

      <div className="pcs-gate-track" role="list">
        {data.gates.map((g) => (
          <div key={g.key} role="listitem" className="pcs-gate">
            <div className="pcs-gate-head">
              <span className="pcs-gate-no font-pixel" aria-hidden="true">
                {g.no}
              </span>
              <div className="pcs-gate-titles">
                <span className="pcs-gate-label">{g.label}</span>
                <span className="pcs-gate-principle font-pixel">{g.principle}</span>
              </div>
            </div>
            <p className="pcs-gate-how">{g.how}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 方案抉择（决策聚焦）：N 个候选方案卡，选用版高亮，可接原型视频。 */
function SchemeChoice({ data }: { data: NonNullable<CaseStory['schemeChoice']> }) {
  return (
    <div className="cs-block pcs-scheme work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="pcs-scheme-grid">
        {data.options.map((o) => (
          <figure key={o.label} className={cn('pcs-scheme-card work-media', o.chosen && 'is-chosen')}>
            <div className="pcs-scheme-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pcs-scheme-img" src={o.src} alt={`${o.label} · ${o.verdict}`} loading="lazy" />
              <span className={cn('pcs-scheme-verdict font-pixel', o.chosen ? 'is-chosen' : 'is-out')}>
                {o.verdict}
              </span>
            </div>
            <figcaption className="pcs-scheme-cap">
              <span className="pcs-scheme-name font-pixel">{o.label}</span>
              <span className="pcs-scheme-note">{o.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {data.video && (
        <figure className="cs-figure pcs-scheme-video work-media">
          <div className="cs-spotlight-frame">
            <video className="cs-spotlight-media" src={data.video.src} controls muted loop playsInline preload="metadata" />
          </div>
          {data.video.caption && <figcaption className="cs-cap">{data.video.caption}</figcaption>}
        </figure>
      )}
    </div>
  )
}

/** 骨架拆解（单态 tour）：tab 切页，恒定骨架示意条 + 当前页一句说明。 */
function SkeletonTour({ data }: { data: NonNullable<CaseStory['skeletonTour']> }) {
  const [active, setActive] = useState(0)
  const tab = data.tabs[active] ?? data.tabs[0]

  return (
    <div className="cs-block pcs-tour work-copy">
      <div className="pcs-tour-top">
        <div className="pcs-tour-copy">
          {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
          {data.title && <h3 className="cs-block-title">{data.title}</h3>}
          {data.intro && <p className="cs-tour-intro">{data.intro}</p>}
        </div>

        {data.zones && data.zones.length >= 3 && (
          <div className="pcs-skeleton" aria-hidden="true">
            <span className="pcs-skeleton-label font-pixel">恒定骨架 · 切 tab 不变</span>

            <div className="pcs-skeleton-body">
              {/* 左：竖排一级 tab，镜像真实 tab、随选择同步高亮 */}
              <div className="pcs-skeleton-tabcol">
                {data.tabs.map((t, i) => (
                  <span key={t.key} className={cn('pcs-skeleton-tab', i === active && 'is-active')}>
                    {t.label}
                  </span>
                ))}
              </div>

              {/* 幻兽列表：单列矩形，选中项高亮、贯穿不变 */}
              <div className="pcs-skeleton-col is-stable pcs-skeleton-listcol">
                <span className="pcs-skeleton-pin font-pixel">不变</span>
                <div className="pcs-skeleton-list">
                  <span className="pcs-skeleton-item is-on" />
                  <span className="pcs-skeleton-item" />
                  <span className="pcs-skeleton-item" />
                  <span className="pcs-skeleton-item" />
                </div>
                <span className="pcs-skeleton-tag">{data.zones[0]}</span>
              </div>

              {/* 中：幻兽模型，恒定居中 */}
              <div className="pcs-skeleton-col is-stable pcs-skeleton-model">
                <span className="pcs-skeleton-pin font-pixel">不变</span>
                <span className="pcs-skeleton-modelglyph" />
                <span className="pcs-skeleton-tag">{data.zones[1]}</span>
              </div>

              {/* 右：属性 / 成长，随 tab 切换 */}
              <div className="pcs-skeleton-col is-active">
                <span className="pcs-skeleton-pin font-pixel">随 tab 换</span>
                <div className="pcs-skeleton-lines">
                  <span className="pcs-skeleton-line" />
                  <span className="pcs-skeleton-line" />
                  <span className="pcs-skeleton-line is-short" />
                </div>
                <span className="pcs-skeleton-tag">{data.zones[2]}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="cs-tour-tabs" role="tablist" aria-label="养成子页骨架">
        {data.tabs.map((t, i) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={cn('cs-tour-tab font-pixel', i === active && 'is-active')}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab?.summary && <p className="cs-tour-summary">{tab.summary}</p>}

      <figure className="cs-tour-figure work-media">
        <div className="cs-tour-frame">
          {data.tabs.map((t, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={t.key}
              className={cn('cs-tour-img', i === active && 'is-active')}
              src={t.src}
              alt={t.caption ?? t.label}
              aria-hidden={i !== active}
              loading="lazy"
            />
          ))}
        </div>
        {tab?.caption && <figcaption className="cs-cap">{tab.caption}</figcaption>}
      </figure>
    </div>
  )
}

/** 渐进披露细节：左文案 + 右截图（网页层标注，字不画进图），逐条左右交替。 */
function ProgressiveReveal({ data }: { data: NonNullable<CaseStory['progressiveReveal']> }) {
  return (
    <div className="cs-block pcs-reveal work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="pcs-reveal-list">
        {data.items.map((item, i) => (
          <div key={item.title} className={cn('pcs-reveal-item', i % 2 === 1 && 'is-flip')}>
            <div className="pcs-reveal-copy">
              <h4 className="pcs-reveal-title">{item.title}</h4>
              <p className="pcs-reveal-body">{item.body}</p>
            </div>
            <figure className="pcs-reveal-figure work-media">
              <div className="cs-deepentry-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.media.src} alt={item.media.caption ?? item.title} loading="lazy" />
                {item.annotations?.map((a) => (
                  <span key={a.label} className="cs-annotate" style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}>
                    <span className="cs-annotate-ring" />
                    <span className="cs-annotate-label">{a.label}</span>
                  </span>
                ))}
              </div>
              {item.media.caption && <figcaption className="cs-cap">{item.media.caption}</figcaption>}
            </figure>
          </div>
        ))}
      </div>
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
            <video className="cs-spotlight-media" src={data.media.src} controls muted loop playsInline preload="metadata" />
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
      <p className="cs-kicker font-pixel">结果 · 上线表现</p>
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

export function PetCaseStory({ id, index, title, story }: PetCaseStoryProps) {
  const badges = story.complexityGates?.gates.map((g) => g.label) ?? []
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
    <section ref={sectionRef} id={id} className="work-item cs cs-linear pcs scroll-mt-24">
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
          <span className="font-pixel text-3xl text-primary tabular-nums">{String(index + 1).padStart(2, '0')}</span>
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
        {story.complexityGates && <ComplexityGates data={story.complexityGates} />}
        {story.schemeChoice && <SchemeChoice data={story.schemeChoice} />}
        {story.skeletonTour && <SkeletonTour data={story.skeletonTour} />}
        {story.progressiveReveal && <ProgressiveReveal data={story.progressiveReveal} />}
        {story.liveResult && <LiveResult data={story.liveResult} />}
        {story.metrics && story.metrics.length > 0 && <HonestFacts metrics={story.metrics} />}
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
