"use client"

import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'
import { FunctionTour } from '@/components/projects/case-story'

type SystemCaseStoryProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

/**
 * 灵魂区：信息架构层级扁平化。
 * 一棵「命卡」养成树，从「强化/铸命 埋在培养二级」坍缩为「四大功能一级平铺」。
 * 进入视口自动播一次 before→after；可手动切换；prefers-reduced-motion 直接给终态。
 */
/** 单个信息架构静态面板（迭代前 / 迭代后），节点与连线由 data-state 的 CSS 决定 */
function IaTreeStage({ state }: { state: 'before' | 'after' }) {
  const isAfter = state === 'after'
  return (
    <div className="cs-iatree-stage" data-state={state}>
      {/* 连线 · 迭代前：命卡 →{镶嵌,分解}，镶嵌→培养→{强化,铸命} */}
      <svg className="cs-iatree-lines is-before" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="20" y1="50" x2="40" y2="30" />
        <line x1="20" y1="50" x2="40" y2="70" />
        <line x1="49" y1="30" x2="60" y2="30" />
        <line x1="70" y1="30" x2="81" y2="19" />
        <line x1="70" y1="30" x2="81" y2="43" />
      </svg>
      {/* 连线 · 迭代后：四大功能一级平铺 */}
      <svg className="cs-iatree-lines is-after" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="18" y1="50" x2="50" y2="14" />
        <line x1="18" y1="50" x2="50" y2="38" />
        <line x1="18" y1="50" x2="50" y2="62" />
        <line x1="18" y1="50" x2="50" y2="86" />
      </svg>

      {/* 根 */}
      <div className="cs-ia-node node-root">
        <span className="cs-ia-node-label">命卡</span>
        <span className="cs-ia-node-sub font-pixel">{isAfter ? '一级导航' : '详情页'}</span>
      </div>

      {/* 培养（迭代前挂在镶嵌下；迭代后溶解） */}
      <div className="cs-ia-node node-peiyang is-parent">
        <span className="cs-ia-node-label">培养</span>
        <span className="cs-ia-tag font-pixel">详情页小按钮 · 二级</span>
      </div>

      {/* 四个功能 */}
      <div className="cs-ia-node node-xiangqian is-func">
        <span className="cs-ia-node-label">镶嵌</span>
      </div>
      <div className="cs-ia-node node-qianghua is-func is-deep">
        <span className="cs-ia-node-label">强化</span>
      </div>
      <div className="cs-ia-node node-zhuming is-func is-deep">
        <span className="cs-ia-node-label">铸命</span>
      </div>
      <div className="cs-ia-node node-fenjie is-func">
        <span className="cs-ia-node-label">分解</span>
      </div>
    </div>
  )
}

/** 信息架构迭代前 / 后两个面板并排同时显示，中间一个 → 箭头 */
function IaTreeCollapse({ tree }: { tree: NonNullable<CaseStory['iaTree']> }) {
  return (
    <div className="cs-iatree cs-iatree-compare">
      <div className="cs-iatree-panel">
        <span className="cs-iatree-panel-label is-before font-pixel">迭代前 · 二级埋藏</span>
        <IaTreeStage state="before" />
        <p className="cs-iatree-note">{tree.beforeNote}</p>
      </div>

      <span className="cs-iatree-arrow" aria-hidden="true">→</span>

      <div className="cs-iatree-panel">
        <span className="cs-iatree-panel-label is-after font-pixel">迭代后 · 一级平铺</span>
        <IaTreeStage state="after" />
        <p className="cs-iatree-note">{tree.afterNote}</p>
      </div>
    </div>
  )
}

function DeepEntry({ data }: { data: NonNullable<CaseStory['deepEntry']> }) {
  return (
    <div className="cs-block cs-deepentry work-copy">
      <div className="cs-deepentry-grid">
        <div className="cs-deepentry-copy">
          {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
          {data.title && <h3 className="cs-block-title">{data.title}</h3>}
          <p className="cs-rationale">{data.body}</p>
        </div>
        <figure className="cs-figure cs-deepentry-figure work-media">
          <div className="cs-deepentry-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.media.src} alt={data.media.caption ?? data.title ?? ''} loading="lazy" />
            {data.annotations?.map((a) => (
              <span
                key={a.label}
                className="cs-annotate"
                style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
              >
                <span className="cs-annotate-ring" />
                <span className="cs-annotate-label font-pixel">{a.label}</span>
              </span>
            ))}
          </div>
          {data.media.caption && <figcaption className="cs-cap">{data.media.caption}</figcaption>}
        </figure>
      </div>
    </div>
  )
}

function OneTap({ data }: { data: NonNullable<CaseStory['oneTap']> }) {
  return (
    <div className="cs-block cs-onetap work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.body && <p className="cs-rationale cs-onetap-body">{data.body}</p>}
      <figure className="cs-figure cs-onetap-figure work-media">
        <div className="cs-spotlight-frame">
          {data.media.type === 'video' ? (
            <video className="cs-spotlight-media" src={data.media.src} controls playsInline preload="metadata" />
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

function LiveResult({ data }: { data: NonNullable<CaseStory['liveResult']> }) {
  return (
    <div className="cs-block cs-liveresult work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.body && <p className="cs-rationale">{data.body}</p>}
      <figure className="cs-figure work-media">
        <div className="cs-spotlight-frame">
          {data.media.type === 'video' ? (
            <video className="cs-spotlight-media" src={data.media.src} controls playsInline preload="metadata" />
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

const FUNC_BADGES = ['镶嵌', '强化', '铸命', '分解']

export function SystemCaseStory({ id, index, title, story }: SystemCaseStoryProps) {
  return (
    <section id={id} className="work-item cs cs-linear scroll-mt-24 pt-10">
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
        <div className="cs-hero-funcs" aria-hidden="true">
          {FUNC_BADGES.map((f) => (
            <span key={f} className="cs-hero-func font-pixel">
              {f}
            </span>
          ))}
        </div>
      </header>

      <div className="cs-linear-body">
        {/* 旧方案问题 · UX 介入迭代前（point 1）：放在信息架构迭代之前 */}
        {story.deepEntry && <DeepEntry data={story.deepEntry} />}

        {/* 灵魂区：信息架构扁平化 */}
        {story.iaTree && (
          <div className="cs-block cs-ia-soul work-copy">
            {story.iaTree.kicker && <p className="cs-kicker font-pixel">{story.iaTree.kicker}</p>}
            {story.iaTree.title && <h3 className="cs-block-title cs-ia-soul-title">{story.iaTree.title}</h3>}
            <IaTreeCollapse tree={story.iaTree} />
          </div>
        )}

        {/* 一键镶嵌（point 3） */}
        {story.oneTap && <OneTap data={story.oneTap} />}

        {/* 四功能逐项规整（point 4） */}
        {story.functionTour && <FunctionTour tour={story.functionTour} />}

        {/* 正式落地效果（point 5） */}
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
