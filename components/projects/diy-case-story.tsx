"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type DiyCaseStoryProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

/** 与真实设计一致：开关记住玩家上次的选择（页面里也用 localStorage 复刻这一点） */
const MODE_STORAGE_KEY = 'diy-mode-switch'

/** CSS 重画的手机示意图：单手竖持 / 双手横持，拇指落点示意（不放竞品截图，字不画进图） */
function PhoneGlyph({ hands }: { hands: 1 | 2 }) {
  return (
    <span className={cn('diy-phone', hands === 2 && 'is-landscape')} aria-hidden="true">
      <span className="diy-phone-screen">
        <span className="diy-phone-grid" />
        {hands === 1 ? (
          <span className="diy-thumb is-right" />
        ) : (
          <>
            <span className="diy-thumb is-left" />
            <span className="diy-thumb is-right" />
          </>
        )}
      </span>
    </span>
  )
}

/** 竞品范式扫描（灵魂区前奏）：两张范式卡进视口 stagger 点亮，收束到一句洞察。 */
function ParadigmScan({ data }: { data: NonNullable<CaseStory['paradigmScan']> }) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set('.diy-rival, .diy-insight', { autoAlpha: 1, y: 0 })
        return
      }
      gsap
        .timeline({
          scrollTrigger: { trigger: '.diy-scan', start: 'top 76%', toggleActions: 'play none none reverse' },
        })
        .fromTo(
          '.diy-rival',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.18, ease: 'power3.out', clearProps: 'transform' },
        )
        .fromTo(
          '.diy-insight',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' },
          '+=0.1',
        )
    },
    { scope },
  )

  return (
    <div className="cs-block diy-scan work-copy" ref={scope}>
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="diy-rivals">
        {data.rivals.map((r) => (
          <div key={r.name} className="diy-rival">
            <div className="diy-rival-head">
              <span className="diy-rival-mode font-pixel">{r.mode}</span>
              <span className="diy-rival-name">{r.name}</span>
            </div>
            {r.media ? (
              <figure className="diy-rival-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.media.src} alt={r.media.alt ?? `${r.name} ${r.mode}操作界面`} loading="lazy" />
              </figure>
            ) : (
              <PhoneGlyph hands={r.hands} />
            )}
            <p className="diy-rival-tagline">{r.tagline}</p>
            <ul className="diy-rival-traits">
              {r.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="diy-rival-suits">
              <span className="font-pixel">适合</span>
              {r.suits}
            </p>
          </div>
        ))}
      </div>

      <div className="diy-insight">
        <span className="diy-insight-tag font-pixel">洞察</span>
        <p>{data.insight}</p>
      </div>
    </div>
  )
}

/** 模式开关（灵魂区）：可交互的「单手 / 双手」开关，默认单手、localStorage 记住上次选择。 */
function ModeSwitch({ data }: { data: NonNullable<CaseStory['modeSwitch']> }) {
  const [active, setActive] = useState(0)

  // 与真实设计一致：默认单手，记住上次选择。挂载后再读 localStorage，避免 SSR 水合不一致。
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MODE_STORAGE_KEY)
      if (saved !== null) {
        const i = Number(saved)
        if (Number.isInteger(i) && i >= 0 && i < data.modes.length) setActive(i)
      }
    } catch {
      /* localStorage 不可用时保持默认单手 */
    }
  }, [data.modes.length])

  const pick = (i: number) => {
    setActive(i)
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, String(i))
    } catch {
      /* 忽略写入失败 */
    }
  }

  const mode = data.modes[active] ?? data.modes[0]

  return (
    <div className="cs-block diy-mode work-copy">
      <div className="diy-mode-layout">
        <div className="diy-mode-content">
          {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
          {data.title && <h3 className="cs-block-title">{data.title}</h3>}
          {data.intro && <p className="cs-rationale">{data.intro}</p>}

          <div className="diy-switch-row">
            <div className="diy-switch" role="tablist" aria-label="单手 / 双手模式切换">
              <span
                className="diy-switch-knob"
                style={{ transform: `translateX(${active * 100}%)` }}
                aria-hidden="true"
              />
              {data.modes.map((m, i) => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={cn('diy-switch-option font-pixel', i === active && 'is-active')}
                  onClick={() => pick(i)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {data.defaultNote && <p className="diy-switch-note">{data.defaultNote}</p>}
          </div>

          <div className="diy-mode-copy">
            {data.modes.map((m, i) => (
              <div key={m.key} className={cn('diy-mode-pane', i === active && 'is-active')} aria-hidden={i !== active}>
                <span className="diy-mode-suits font-pixel">{m.suits}</span>
                <ul className="diy-mode-points">
                  {m.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <figure className="diy-mode-figure work-media">
          <div className="diy-mode-frame">
            {data.modes.map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={m.key}
                className={cn('diy-mode-img', i === active && 'is-active')}
                src={m.media.src}
                alt={m.media.caption ?? m.label}
                aria-hidden={i !== active}
                loading="lazy"
              />
            ))}
          </div>
          {mode?.media.caption && <figcaption className="cs-cap">{mode.media.caption}</figcaption>}
        </figure>
      </div>
    </div>
  )
}

/** 画板全景：单图聚焦，托住「专业度上限」的论点。 */
function BoardSpotlight({ data }: { data: NonNullable<CaseStory['oneTap']> }) {
  return (
    <div className="cs-block diy-board work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.body && <p className="cs-rationale">{data.body}</p>}
      <figure className="cs-figure work-media">
        <div className="cs-spotlight-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cs-spotlight-media" src={data.media.src} alt={data.media.caption ?? data.title ?? ''} loading="lazy" />
        </div>
        {data.media.caption && <figcaption className="cs-cap">{data.media.caption}</figcaption>}
      </figure>
    </div>
  )
}

/** 创作生态链：顶部链路 chips（创作→分享→交易→评比），下接对应实证卡。 */
function Ecosystem({ data }: { data: NonNullable<CaseStory['ecosystem']> }) {
  return (
    <div className="cs-block diy-eco work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="diy-eco-chain" aria-hidden="true">
        {data.steps.map((s, i) => (
          <span key={s.label} className="diy-eco-chain-seg">
            {i > 0 && <span className="diy-eco-arrow">→</span>}
            <span className="diy-eco-chip font-pixel">{s.label}</span>
          </span>
        ))}
      </div>

      <div className="diy-eco-grid">
        {data.steps.map((s) => (
          <figure key={s.label} className="diy-eco-card work-media">
            <div className="diy-eco-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="diy-eco-img" src={s.media.src} alt={s.media.caption ?? s.title} loading="lazy" />
            </div>
            <figcaption className="diy-eco-cap">
              <span className="diy-eco-label font-pixel">{s.label}</span>
              <span className="diy-eco-title">{s.title}</span>
              <span className="diy-eco-body">{s.body}</span>
            </figcaption>
          </figure>
        ))}
      </div>
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

export function DiyCaseStory({ id, index, title, story }: DiyCaseStoryProps) {
  const badges = story.modeSwitch?.modes.map((m) => m.label) ?? []

  return (
    <section id={id} className="work-item cs cs-linear diy scroll-mt-24">
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
        {story.paradigmScan && <ParadigmScan data={story.paradigmScan} />}
        {story.modeSwitch && <ModeSwitch data={story.modeSwitch} />}
        {story.oneTap && <BoardSpotlight data={story.oneTap} />}
        {story.ecosystem && <Ecosystem data={story.ecosystem} />}
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
