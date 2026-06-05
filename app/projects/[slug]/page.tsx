import { notFound } from 'next/navigation'
import { BackToProjectsButton } from '@/components/projects/back-to-projects-button'
import { projects, getProjectBySlug } from '@/data/projects'
import { Badge } from '@/components/ui/badge'
import { ProjectWorkWall } from '@/components/projects/project-work-wall'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { GsapReveal } from '@/components/motion/gsap-reveal'
import { MarkReturnProject } from '@/components/projects/mark-return-project'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return notFound()

  return (
    <div className="container space-y-16 pb-16 pt-10">
      <MarkReturnProject slug={project.slug} />
      <header className="space-y-10">
        <GsapReveal>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <BackToProjectsButton className="text-sm font-semibold text-primary hover:underline">
                返回项目列表
              </BackToProjectsButton>
              <h1 className="font-editorial mt-6 text-5xl font-black leading-none md:text-7xl lg:text-8xl">
                {project.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{project.subtitle}</p>
              <p className="mt-8 max-w-2xl text-sm leading-7 text-muted-foreground">{project.summary}</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-2 shadow-soft">
              <SkeletonImage
                src={project.cover}
                alt={project.title}
                fill
                className="object-cover transition duration-700 hover:scale-[1.02]"
                containerClassName="relative aspect-[16/11] w-full overflow-hidden rounded-md bg-muted"
                sizes="(max-width:1024px) 100vw, 58vw"
                priority
              />
            </div>
          </div>
        </GsapReveal>

        <GsapReveal delay={0.1}>
          <div className="grid gap-4 border-y border-border/70 py-5 text-sm text-muted-foreground md:grid-cols-4">
            <div>
              <p className="font-pixel text-[9px] uppercase tracking-wider text-primary">Role</p>
              <p className="mt-2 text-foreground">{project.role}</p>
            </div>
            <div>
              <p className="font-pixel text-[9px] uppercase tracking-wider text-primary">Period</p>
              <p className="mt-2 text-foreground">{project.period}</p>
            </div>
            {project.team && (
              <div>
                <p className="font-pixel text-[9px] uppercase tracking-wider text-primary">Team</p>
                <p className="mt-2 text-foreground">{project.team}</p>
              </div>
            )}
            {project.kpis && (
              <div>
                <p className="font-pixel text-[9px] uppercase tracking-wider text-primary">Impact</p>
                <p className="mt-2 text-foreground">
                  {project.kpis.map((k) => `${k.label}${k.value.trim() ? ` ${k.value}` : ''}`).join(' / ')}
                </p>
              </div>
            )}
          </div>
        </GsapReveal>

        <GsapReveal delay={0.16}>
          <div className="flex flex-wrap gap-2">
            {project.platform.map((p) => (
              <Badge key={p}>{p}</Badge>
            ))}
            {project.tags.map((t) => (
              <Badge key={t} className="border-border/70 bg-secondary text-secondary-foreground">
                {t}
              </Badge>
            ))}
          </div>
        </GsapReveal>
      </header>

      <section className="space-y-8">
        <GsapReveal>
          <div className="grid gap-5 border-y border-border/60 py-8 md:grid-cols-[0.72fr_0.28fr] md:items-end">
            <div>
            <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary">Case studies</p>
            <h2 className="font-editorial mt-3 text-4xl font-black leading-tight md:text-6xl">
              工作项平铺
            </h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              每个模块直接展开关键截图、动效与说明，方便从项目级别快速扫完整体贡献。
            </p>
          </div>
        </GsapReveal>
        <ProjectWorkWall project={project} />
      </section>
    </div>
  )
}
