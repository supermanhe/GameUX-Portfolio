import Image from 'next/image'
import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Badge } from '@/components/ui/badge'
import { CaseCard } from '@/components/projects/case-card'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return notFound()

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
          <Image src={project.cover} alt={project.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-sm text-muted-foreground">{project.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.platform.map((p) => (
              <Badge key={p}>{p}</Badge>
            ))}
            {project.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <p>职责：{project.role}</p>
          <p>周期：{project.period}</p>
          {project.team && <p>团队：{project.team}</p>}
          {project.kpis && (
            <p>
              KPI：{project.kpis.map((k) => `${k.label} ${k.value}`).join(' / ')}
            </p>
          )}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">概述</h2>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">设计点 / 工作内容</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.cases.map((c, idx) => (
                <CaseCard key={c.id} slug={project.slug} c={c} index={idx} />
              ))}
            </div>
      </section>
    </div>
  )
}

