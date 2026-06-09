"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

type CaseStorySectionProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

export function StoryMedia({
  media,
  className,
}: {
  media: { type: 'image' | 'gif' | 'video'; src: string; caption?: string; objectPosition?: string }
  className?: string
}) {
  const cropped = Boolean(media.objectPosition)
  return (
    <figure className={cn('cs-figure work-media', className)}>
      <div className={cn('cs-figure-frame', cropped && 'is-cropped')}>
        {media.type === 'video' ? (
          <video
            className="cs-media"
            src={media.src}
            controls
            playsInline
            preload="metadata"
            style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="cs-media"
            src={media.src}
            alt={media.caption ?? ''}
            loading="lazy"
            style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
          />
        )}
      </div>
      {media.caption && <figcaption className="cs-cap">{media.caption}</figcaption>}
    </figure>
  )
}

function CompareCarousel({
  compare,
}: {
  compare: NonNullable<NonNullable<CaseStory['problem']>['compare']>
}) {
  const slides = compare.slides
  const interval = compare.interval ?? 5000
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animate, setAnimate] = useState(true)
  const compareRef = useRef<HTMLDivElement>(null)
  const lastActive = useRef(active)

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!animate || paused || slides.length < 2) return undefined
    const timer = setTimeout(() => setActive((a) => (a + 1) % slides.length), interval)
    return () => clearTimeout(timer)
  }, [active, paused, animate, slides.length, interval])

  // 迭代前/后切换时用一条时间线协调「图 → 标题 → 重点」依次淡入上浮，
  // 取代标题/重点的瞬时硬切。仅在 active 真正变化时播放：跳过首屏（交给外层
  // 滚动揭示）并对 React StrictMode 的重复挂载安全（active 未变 → 不重播）。
  // 用 clearProps 收尾，结束后不残留内联样式，静止态始终回到 CSS 定义。
  useGSAP(
    () => {
      if (lastActive.current === active) return
      lastActive.current = active

      const root = compareRef.current
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // 图的交叉淡化交给 CSS（叠放 + opacity 过渡），时间线只编排左侧文案。
      const title = root.querySelector('.cs-compare-title')
      const points = root.querySelectorAll('.cs-compare-point')

      gsap
        .timeline({ defaults: { ease: 'power2.out', overwrite: 'auto' } })
        .fromTo(
          title,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, clearProps: 'opacity,transform' },
          0.06,
        )
        .fromTo(
          points,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, clearProps: 'opacity,transform' },
          0.14,
        )
    },
    { scope: compareRef, dependencies: [active] },
  )

  const slide = slides[active]
  const tone = slide.tone ?? 'problem'

  return (
    <div ref={compareRef} className="cs-compare">
      {/* 叙述列（tab + 标题 + 重点）：全宽场景下与对比图并排并垂直居中 */}
      <div className="cs-compare-lede">
        {/* 顶部 tab：统一切换整块 */}
        <div className="cs-compare-tabs" role="tablist" aria-label="迭代前后对比">
          {slides.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={cn('cs-compare-tab', i === active && 'is-active')}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 自动轮播进度条：紧贴 tab 下方，比放在长图底部更易察觉 */}
        {animate && slides.length > 1 && (
          <div className="cs-compare-progress" aria-hidden="true">
            <span
              key={active}
              className={cn('cs-compare-progress-fill', paused && 'is-paused')}
              style={{ animationDuration: `${interval}ms` }}
            />
          </div>
        )}

        {/* 标题 + 重点随 tab 切换 */}
        <h3 className="cs-compare-title">{slide.title}</h3>
        <ul className={cn('cs-compare-points', `tone-${tone}`)}>
          {slide.points.map((point, i) => (
            <li key={point} className="cs-compare-point">
              <span className="cs-compare-point-no font-pixel">
                {tone === 'solution' ? '✓' : String(i + 1).padStart(2, '0')}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 图随 tab 切换：按自然高度铺满整列宽度，长图也能看清。
          仅在悬停右侧对比图时暂停自动轮播（而非整块） */}
      <figure
        className="cs-figure cs-compare-figure work-media"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 所有迭代图叠放在同一网格单元：面板高度恒为「最高的那张」，切换不再跳动；
            非当前图保持挂载并淡出，实现真正的交叉淡化。 */}
        <div className="cs-compare-frame">
          {slides.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.src}
              className={cn('cs-compare-img', i === active && 'is-active')}
              src={s.src}
              alt={s.caption ?? s.label}
              aria-hidden={i !== active}
              loading="lazy"
            />
          ))}
          <span className={cn('cs-compare-badge', tone === 'solution' ? 'is-after' : 'is-before')}>
            {slide.label}
          </span>
        </div>
        {slide.caption && <figcaption className="cs-cap">{slide.caption}</figcaption>}
      </figure>
    </div>
  )
}

export function FunctionTour({ tour }: { tour: NonNullable<CaseStory['functionTour']> }) {
  const [activeKey, setActiveKey] = useState(tour.tabs[0]?.key ?? '')
  const [showAfter, setShowAfter] = useState(true)
  const active = tour.tabs.find((t) => t.key === activeKey) ?? tour.tabs[0]
  if (!active) return null

  return (
    <div className="cs-block cs-tour work-copy">
      {tour.kicker && <p className="cs-kicker font-pixel">{tour.kicker}</p>}
      {tour.title && <h3 className="cs-block-title">{tour.title}</h3>}
      {tour.intro && <p className="cs-tour-intro">{tour.intro}</p>}

      {/* 统一版式骨架：四个 tab 切换时这条恒定不动，证明版式语言一致（抽象示意，非精确套色） */}
      {tour.zones && tour.zones.length > 0 && (
        <div className="cs-tour-skeleton" aria-hidden="true">
          <span className="cs-tour-skeleton-label font-pixel">统一骨架</span>
          <div className="cs-tour-skeleton-bar">
            {tour.zones.map((zone) => (
              <span key={zone} className="cs-tour-zone">
                {zone}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 功能 tab：这一排本身就是「四功能合一」的一级导航 */}
      <div className="cs-tour-tabs" role="tablist" aria-label="命卡功能切换">
        {tour.tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active.key}
            className={cn('cs-tour-tab font-pixel', t.key === active.key && 'is-active')}
            onClick={() => setActiveKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <figure className="cs-figure cs-tour-figure work-media">
        <div className="cs-tour-frame">
          {/* 迭代前 / 迭代后 叠放，开关切换避免重排 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cn('cs-tour-img', !showAfter && 'is-active')}
            src={active.before.src}
            alt={active.before.caption ?? `${active.label} · 迭代前`}
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cn('cs-tour-img', showAfter && 'is-active')}
            src={active.after.src}
            alt={active.after.caption ?? `${active.label} · 迭代后`}
            loading="lazy"
          />
          <div className="cs-tour-switch" role="tablist" aria-label="迭代前后切换">
            <button
              type="button"
              role="tab"
              aria-selected={!showAfter}
              className={cn('cs-tour-switch-btn', !showAfter && 'is-before')}
              onClick={() => setShowAfter(false)}
            >
              迭代前
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showAfter}
              className={cn('cs-tour-switch-btn', showAfter && 'is-after')}
              onClick={() => setShowAfter(true)}
            >
              迭代后
            </button>
          </div>
        </div>
        <figcaption className="cs-cap">
          {showAfter ? active.after.caption ?? `${active.label} · 迭代后` : active.before.caption ?? `${active.label} · 迭代前`}
        </figcaption>
      </figure>
    </div>
  )
}

export function CaseStorySection({ id, index, title, story }: CaseStorySectionProps) {
  const [activeStep, setActiveStep] = useState(story.framework?.steps[0]?.key ?? '')
  const sectionRef = useRef<HTMLElement | null>(null)

  // 末阶（如「提效」）通常没有独立决策块，而是由「结果」区承载——
  // 若最后一个框架步骤没有对应决策，则把结果区挂到它的 stepKey 上，使其也可点击跳转。
  const steps = story.framework?.steps ?? []
  const lastStep = steps[steps.length - 1]
  const metricsStepKey =
    lastStep &&
    story.metrics?.length &&
    !story.decisions?.some((decision) => decision.stepKey === lastStep.key)
      ? lastStep.key
      : undefined

  // 所有可跳转的 stepKey（决策块 + 结果区映射）
  const stepTargets = new Set<string>(story.decisions?.map((decision) => decision.stepKey) ?? [])
  if (metricsStepKey) stepTargets.add(metricsStepKey)
  const stepHasTarget = (key: string) => stepTargets.has(key)

  // 滚动监听：高亮当前所在 stepKey（决策块与结果区都带 data-step）
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return undefined
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const key = visible?.target.getAttribute('data-step')
        if (key) setActiveStep(key)
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [story.decisions?.length, metricsStepKey])

  // 点击左侧框架步骤 -> 平滑跳转到对应 stepKey 的区块（决策块或结果区）
  const scrollToStep = (key: string) => {
    const target = sectionRef.current?.querySelector<HTMLElement>(`[data-step="${key}"]`)
    if (!target) return
    setActiveStep(key)
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section ref={sectionRef} id={id} className="work-item cs scroll-mt-24">
      {/* 开场成果 */}
      <header className={cn('cs-hero work-copy', story.heroImage && 'has-cover')}>
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
        <div className="cs-hero-body">
          <p className="cs-oneliner">{story.oneLiner}</p>
          {story.headlineMetric && (
            <div className="cs-headline">
              <span className="cs-headline-value">{story.headlineMetric.value}</span>
              <span className="cs-headline-label">{story.headlineMetric.label}</span>
            </div>
          )}
        </div>
      </header>

      {/* 迭代对比：全宽呈现，先看清前后差异——此处刻意不显示左侧三阶框架 */}
      {story.problem?.compare && (
        <div className="cs-compare-full work-copy">
          <p className="cs-kicker font-pixel">迭代对比</p>
          <CompareCarousel compare={story.problem.compare} />
        </div>
      )}

      <div className="cs-grid">
        {/* 左侧 sticky 框架锚点：进入「分点叙述」后才出现 */}
        {story.framework && (
          <aside className="cs-rail">
            <div className="cs-rail-inner">
              <p className="cs-rail-case">{title}</p>
              <p className="cs-rail-title font-pixel">{story.framework.title}</p>
              <ol className="cs-steps">
                {story.framework.steps.map((step, stepIndex) => {
                  const clickable = stepHasTarget(step.key)
                  return (
                    <li key={step.key}>
                      <button
                        type="button"
                        className={cn('cs-step', activeStep === step.key && 'is-active', clickable && 'is-clickable')}
                        aria-current={activeStep === step.key ? 'step' : undefined}
                        onClick={clickable ? () => scrollToStep(step.key) : undefined}
                        disabled={!clickable}
                      >
                        <span className="cs-step-no font-pixel">{String(stepIndex + 1).padStart(2, '0')}</span>
                        <span className="cs-step-text">
                          <span className="cs-step-label">{step.label}</span>
                          <span className="cs-step-desc">{step.desc}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </aside>
        )}

        {/* 右侧叙事主体 */}
        <div className="cs-body">
          {/* 静态问题（无迭代对比图时的回退叙述）*/}
          {story.problem && !story.problem.compare && (
            <div className="cs-block cs-problem work-copy">
              <p className="cs-kicker font-pixel">问题</p>
              <h3 className="cs-block-title">{story.problem.title}</h3>
              <ul className="cs-frictions">
                {story.problem.points.map((point, i) => (
                  <li key={point} className="cs-friction">
                    <span className="cs-friction-no font-pixel">{String(i + 1).padStart(2, '0')}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {story.problem.media && <StoryMedia media={{ type: 'image', ...story.problem.media }} />}
            </div>
          )}

          {/* 决策聚焦 */}
          {story.decisions?.map((decision) => {
            const step = story.framework?.steps.find((s) => s.key === decision.stepKey)
            return (
              <div
                key={decision.no}
                data-step={decision.stepKey}
                className="cs-block cs-decision"
              >
                <div className="cs-decision-copy work-copy">
                  <div className="cs-decision-head">
                    <span className="cs-decision-no font-pixel">{decision.no}</span>
                    {step && <span className="cs-decision-step font-pixel">{step.label}</span>}
                  </div>
                  <h3 className="cs-block-title">{decision.title}</h3>
                  <p className="cs-rationale">{decision.rationale}</p>
                  <div className="cs-actions">
                    {decision.actions.map((action) => (
                      <span key={action} className="cs-chip">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
                <StoryMedia media={decision.media} className="cs-decision-media" />
              </div>
            )
          })}

          {/* 逐功能前后对比（系统设计型） */}
          {story.functionTour && <FunctionTour tour={story.functionTour} />}

          {/* 结果指标（末阶框架步骤无独立决策时，挂到此处，使其也可点击跳转）*/}
          {story.metrics && story.metrics.length > 0 && (
            <div className="cs-block cs-metrics work-copy" data-step={metricsStepKey}>
              <p className="cs-kicker font-pixel">结果</p>
              <div className="cs-metric-grid">
                {story.metrics.map((metric) => (
                  <div key={metric.label} className="cs-metric">
                    <span className="cs-metric-value">{metric.value}</span>
                    <span className="cs-metric-label">{metric.label}</span>
                    <dl className="cs-metric-meta">
                      {metric.meta.map((m) => (
                        <div key={m.k} className="cs-metric-meta-row">
                          <dt>{m.k}</dt>
                          <dd>{m.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 反思 */}
          {story.reflection && (
            <div className="cs-block cs-reflection work-copy">
              <p className="cs-kicker font-pixel">反思</p>
              <h3 className="cs-block-title">{story.reflection.title}</h3>
              <p className="cs-rationale">{story.reflection.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
