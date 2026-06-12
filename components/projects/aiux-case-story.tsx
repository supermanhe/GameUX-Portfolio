"use client"

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, FileCode2 } from 'lucide-react'
import type { CaseStory } from '@/data/projects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type AiuxCaseStoryProps = {
  id: string
  index: number
  title: string
  story: CaseStory
}

/** skill 开源仓库按钮：文档图标 + 仓库名，新窗口打开 GitHub。 */
function RepoButton({ repo }: { repo: { label: string; href: string } }) {
  return (
    <a
      className="aiux-repo"
      href={repo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`查看 ${repo.label} skill 仓库（GitHub，新窗口打开）`}
    >
      <FileCode2 className="aiux-repo-icon" aria-hidden="true" />
      <span className="aiux-repo-label">{repo.label}</span>
      <span className="aiux-repo-tag font-pixel">SKILL</span>
      <ArrowUpRight className="aiux-repo-arrow" aria-hidden="true" />
    </a>
  )
}

/** 三层进化路线：时间轴式逐层点亮，层间可插「你在这里」标记。 */
function EvolutionLadder({ data }: { data: NonNullable<CaseStory['evolutionLadder']> }) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set('.aiux-rung, .aiux-here', { autoAlpha: 1, y: 0 })
        return
      }
      gsap
        .timeline({
          scrollTrigger: { trigger: '.aiux-ladder', start: 'top 76%', toggleActions: 'play none none reverse' },
        })
        .fromTo(
          '.aiux-rung, .aiux-here',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.16, ease: 'power3.out', clearProps: 'transform' },
        )
    },
    { scope },
  )

  return (
    <div className="cs-block aiux-ladder work-copy" ref={scope}>
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-rungs">
        {data.rungs.map((r, i) => (
          <div key={r.key} className="aiux-rung-slot">
            <div className="aiux-rung" style={{ ['--rung' as string]: i }}>
              <div className="aiux-rung-head">
                <span className="aiux-rung-era font-pixel">{r.era}</span>
                <span className="aiux-rung-label">{r.label}</span>
              </div>
              <p className="aiux-rung-thesis">{r.thesis}</p>
              <ul className="aiux-rung-points">
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            {data.hereAfter === i && (
              <div className="aiux-here" aria-label="当前所处位置">
                <span className="aiux-here-line" />
                <span className="aiux-here-tag font-pixel">你在这里</span>
                <span className="aiux-here-line" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** 一源双环管线图（灵魂交互）：设计源 + 双环说明 + 六环节点选，下方详情卡随选切换。 */
function PipelineMap({ data }: { data: NonNullable<CaseStory['pipelineMap']> }) {
  const [active, setActive] = useState(0)
  const station = data.stations[active] ?? data.stations[0]

  return (
    <div className="cs-block aiux-map work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      {/* 核心行：双环收敛为「文字注释 + 发丝线」直连设计源，不再各占一个空盒 */}
      <div className="aiux-map-core-row">
        <div className="aiux-map-loop">
          <span className="aiux-map-loop-label font-pixel">{data.loops[0]?.label}</span>
          <span className="aiux-map-loop-desc">{data.loops[0]?.desc}</span>
        </div>
        <span className="aiux-map-link" aria-hidden="true" />
        <div className="aiux-map-core">
          <span className="aiux-map-core-label">{data.core.label}</span>
          {data.core.sub && <span className="aiux-map-core-sub">{data.core.sub}</span>}
        </div>
        <span className="aiux-map-link" aria-hidden="true" />
        <div className="aiux-map-loop is-right">
          <span className="aiux-map-loop-label font-pixel">{data.loops[1]?.label}</span>
          <span className="aiux-map-loop-desc">{data.loops[1]?.desc}</span>
        </div>
      </div>

      {/* 六环节：一条整轨分段，序号即顺序（去箭头），状态点不再压编号 */}
      <div className="aiux-map-track" role="tablist" aria-label="流程环节">
        {data.stations.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={cn('aiux-station', `is-${s.status}`, i === active && 'is-active')}
            onClick={() => setActive(i)}
          >
            <span className="aiux-station-no font-pixel">{s.no}</span>
            <span className="aiux-station-label">{s.label}</span>
            <span className="aiux-station-dot" aria-hidden="true" />
          </button>
        ))}
      </div>
      <span className="aiux-map-return font-pixel" aria-hidden="true">
        ↺ 六环节产出回流设计源
      </span>

      {station && (
        <div className={cn('aiux-map-detail', `is-${station.status}`)}>
          <div className="aiux-map-detail-head">
            <span className={cn('aiux-status font-pixel', `is-${station.status}`)}>{station.statusLabel}</span>
            <span className="aiux-map-detail-title">
              {station.no} {station.label}
            </span>
            <span className="aiux-map-detail-asset">{station.asset}</span>
          </div>
          <p className="aiux-map-io">
            <span className="aiux-map-io-item">
              <b className="font-pixel">输入</b>
              {station.input}
            </span>
            <span className="aiux-map-io-arrow" aria-hidden="true">
              →
            </span>
            <span className="aiux-map-io-item">
              <b className="font-pixel">输出</b>
              {station.output}
            </span>
          </p>
          <p className="aiux-map-detail-note">{station.note}</p>
          {station.caseHref && (
            <a className="aiux-map-detail-link font-pixel" href={station.caseHref}>
              查看对应案例 ↓
            </a>
          )}
        </div>
      )}
    </div>
  )
}

/** 横向流程条：步骤 + 箭头，编译管线 / agent 工作流共用。 */
function FlowStrip({ data }: { data: NonNullable<CaseStory['flowStrip']> }) {
  return (
    <div className="cs-block aiux-flow work-copy">
      <div className="aiux-block-head">
        {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      </div>
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-flow-strip">
        {data.steps.map((s, i) => (
          <span key={s.label + i} className="aiux-flow-seg">
            {i > 0 && (
              <span className="aiux-flow-arrow" aria-hidden="true">
                →
              </span>
            )}
            <span className={cn('aiux-flow-step', i === data.steps.length - 1 && 'is-last')}>
              <span className="aiux-flow-label">{s.label}</span>
              {s.sub && <span className="aiux-flow-sub">{s.sub}</span>}
            </span>
          </span>
        ))}
      </div>
      {data.caption && <p className="aiux-caption">{data.caption}</p>}
    </div>
  )
}

/** 命名规则 DSL 对照表：节点名（代码样式）→ 编译产物 + 说明。 */
function DslTable({ data }: { data: NonNullable<CaseStory['dslTable']> }) {
  return (
    <div className="cs-block aiux-dsl work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-dsl-table" role="table" aria-label="命名规则对照">
        <div className="aiux-dsl-row is-head" role="row">
          <span role="columnheader" className="font-pixel">
            Figma 节点名
          </span>
          <span role="columnheader" className="font-pixel">
            编译产物
          </span>
          <span role="columnheader" className="font-pixel">
            说明
          </span>
        </div>
        {data.rows.map((r) => (
          <div key={r.rule} className="aiux-dsl-row" role="row">
            <span role="cell">
              <code className="aiux-dsl-rule">{r.rule}</code>
            </span>
            <span role="cell" className="aiux-dsl-effect">
              {r.effect}
            </span>
            <span role="cell" className="aiux-dsl-note">
              {r.note}
            </span>
          </div>
        ))}
      </div>
      {data.caption && <p className="aiux-caption">{data.caption}</p>}
    </div>
  )
}

/** 人机双读文档：左「人读」（ASCII + 重点）/ 右「机读」（规则表 + 重点），同一份文档。 */
function DocDuet({ data }: { data: NonNullable<CaseStory['docDuet']> }) {
  return (
    <div className="cs-block aiux-duet work-copy">
      <div className="aiux-block-head">
        {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      </div>
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-duet-doc">
        <span className="aiux-duet-doc-title">{data.doc.title}</span>
        <span className="aiux-duet-doc-source">{data.doc.source}</span>
      </div>

      <div className="aiux-duet-panels">
        <div className="aiux-duet-panel">
          <span className="aiux-duet-panel-label font-pixel">{data.human.label}</span>
          <pre className="aiux-duet-ascii" aria-label="ASCII 布局示意">
            {data.human.ascii}
          </pre>
          <ul className="aiux-duet-notes">
            {data.human.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <div className="aiux-duet-panel is-machine">
          <span className="aiux-duet-panel-label font-pixel">{data.machine.label}</span>
          <div className="aiux-duet-table" role="table" aria-label="状态规则表">
            <div className="aiux-duet-row is-head" role="row">
              {data.machine.table.head.map((h) => (
                <span key={h} role="columnheader">
                  {h}
                </span>
              ))}
            </div>
            {data.machine.table.rows.map((row) => (
              <div key={row[0]} className="aiux-duet-row" role="row">
                {row.map((cell, i) => (
                  <span key={i} role="cell">
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <ul className="aiux-duet-notes">
            {data.machine.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** 清单墙：六大类手风琴，展开查看检查项。 */
function ChecklistWall({ data }: { data: NonNullable<CaseStory['checklistWall']> }) {
  const [open, setOpen] = useState(0)
  const total = data.groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="cs-block aiux-wall work-copy">
      {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-wall-groups">
        {data.groups.map((g, i) => (
          <div key={g.key} className={cn('aiux-wall-group', i === open && 'is-open')}>
            <button
              type="button"
              className="aiux-wall-head"
              aria-expanded={i === open}
              onClick={() => setOpen(i)}
            >
              <span className="aiux-wall-label">{g.label}</span>
              <span className="aiux-wall-count font-pixel">{g.items.length} 条</span>
            </button>
            <ul className="aiux-wall-items" aria-hidden={i !== open}>
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="aiux-caption">
        共 {data.groups.length} 类 {total} 条{data.note ? ` · ${data.note}` : ''}
      </p>
    </div>
  )
}

/** 多代理角色卡 + 实证产出摘录。 */
function AgentRoster({ data }: { data: NonNullable<CaseStory['agentRoster']> }) {
  return (
    <div className="cs-block aiux-roster work-copy">
      <div className="aiux-block-head">
        {data.kicker && <p className="cs-kicker font-pixel">{data.kicker}</p>}
      </div>
      {data.title && <h3 className="cs-block-title">{data.title}</h3>}
      {data.intro && <p className="cs-rationale">{data.intro}</p>}

      <div className="aiux-agents">
        {data.agents.map((a) => (
          <div key={a.key} className={cn('aiux-agent', a.loop && 'is-loop')}>
            <div className="aiux-agent-head">
              <code className="aiux-agent-cmd">{a.cmd}</code>
              {a.loop && <span className="aiux-agent-looptag font-pixel">review · 收口</span>}
            </div>
            <span className="aiux-agent-role">{a.role}</span>
            <p className="aiux-agent-duty">{a.duty}</p>
          </div>
        ))}
      </div>

      {data.artifact && (
        <div className="aiux-artifact">
          <div className="aiux-artifact-head">
            <span className="aiux-artifact-title">{data.artifact.title}</span>
            <span className="aiux-artifact-meta">{data.artifact.meta}</span>
          </div>
          <ul className="aiux-artifact-lines">
            {data.artifact.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** 跑通样例 / 单图聚焦（复用 cs-spotlight 体系）。 */
function Spotlight({ data }: { data: NonNullable<CaseStory['oneTap']> }) {
  return (
    <div className="cs-block aiux-spotlight work-copy">
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
      <p className="cs-kicker font-pixel">现状 · 设计事实</p>
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

export function AiuxCaseStory({ id, index, title, story }: AiuxCaseStoryProps) {
  const heroRepo = story.flowStrip?.repo ?? story.docDuet?.repo ?? story.agentRoster?.repo

  return (
    <section id={id} className="work-item cs cs-linear aiux scroll-mt-24">
      <header className={cn('cs-hero cs-hero-linear aiux-hero work-copy', story.heroImage && 'has-cover')}>
        {story.heroImage ? (
          <div className="cs-hero-cover" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.heroImage.src}
              alt=""
              style={story.heroImage.objectPosition ? { objectPosition: story.heroImage.objectPosition } : undefined}
            />
            <span className="cs-hero-cover-shade" />
          </div>
        ) : (
          <div className="aiux-hero-grid" aria-hidden="true" />
        )}
        <div className="aiux-hero-copy">
          <div className="cs-hero-head">
            <span className="font-pixel text-3xl text-primary tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span className="cs-archetype">{story.archetype}</span>
          </div>
          <h2 className="cs-title">{title}</h2>
          <p className="cs-oneliner">{story.oneLiner}</p>
          {story.heroKicker && <p className="cs-hero-kicker font-pixel">{story.heroKicker}</p>}
        </div>
        {heroRepo && (
          <div className="aiux-hero-repo">
            <RepoButton repo={heroRepo} />
          </div>
        )}
      </header>

      <div className="cs-linear-body">
        {story.evolutionLadder && <EvolutionLadder data={story.evolutionLadder} />}
        {story.pipelineMap && <PipelineMap data={story.pipelineMap} />}
        {story.docDuet && <DocDuet data={story.docDuet} />}
        {story.agentRoster && <AgentRoster data={story.agentRoster} />}
        {story.flowStrip && <FlowStrip data={story.flowStrip} />}
        {story.dslTable && <DslTable data={story.dslTable} />}
        {story.checklistWall && <ChecklistWall data={story.checklistWall} />}
        {story.oneTap && <Spotlight data={story.oneTap} />}
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
