import { notFound } from 'next/navigation'
import { projects, getProjectBySlug } from '@/data/projects'
import { Badge } from '@/components/ui/badge'
import { CasesShowcase } from '@/components/projects/cases-showcase'
import { SkeletonImage } from '@/components/ui/media-skeleton'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return notFound()

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <SkeletonImage
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover"
          containerClassName="relative aspect-[16/7] w-full overflow-hidden rounded-2xl"
          sizes="100vw"
        />
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
          <p>
            {'\u804C\u8D23\uFF1A'}
            {project.role}
          </p>
          <p>
            {'\u5468\u671F\uFF1A'}
            {project.period}
          </p>
          {project.team && (
            <p>
              {'\u56E2\u961F\uFF1A'}
              {project.team}
            </p>
          )}
          {project.kpis && (
            <p>
              {'KPI\uFF1A'}
              {project.kpis.map((k) => `${k.label} ${k.value}`).join(' / ')}
            </p>
          )}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{'\u6982\u8FF0'}</h2>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{'\u8BBE\u8BA1\u70B9 / \u5DE5\u4F5C\u5185\u5BB9'}</h2>
        <CasesShowcase project={project} />
      </section>
    </div>
  )
}
