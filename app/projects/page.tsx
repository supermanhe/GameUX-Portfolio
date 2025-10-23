"use client"

import { useMemo, useState } from 'react'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function ProjectsPage() {
  const [q, setQ] = useState('')
  const allPlatforms = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.platform))), [])
  const allTags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), [])
  const [platform, setPlatform] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)

  const list = projects.filter((p) => {
    const matchQ = [p.title, p.subtitle, p.summary, p.role, p.tags.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(q.toLowerCase())
    const matchPlat = platform ? p.platform.includes(platform) : true
    const matchTag = tag ? p.tags.includes(tag) : true
    return matchQ && matchPlat && matchTag
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">参与项目</h1>
        <p className="mt-2 text-sm text-muted-foreground">展示两款上线游戏的关键工作与成果，可按平台/标签筛选并搜索。</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border p-4 md:flex-row md:items-center">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索关键词（标题/标签/摘要）" />
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">平台：</span>
          <button className="text-xs underline underline-offset-4" onClick={() => setPlatform(null)}>
            不限
          </button>
          {allPlatforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p === platform ? null : p)}
              className={
                'rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary ' +
                (platform === p ? 'bg-secondary' : '')
              }
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">标签：</span>
          <button className="text-xs underline underline-offset-4" onClick={() => setTag(null)}>
            不限
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t === tag ? null : t)}
              className={
                'rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary ' +
                (tag === t ? 'bg-secondary' : '')
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">没有匹配的结果，试试其它关键词或取消筛选。</div>
      )}
    </div>
  )
}

