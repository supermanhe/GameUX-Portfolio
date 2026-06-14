import { notFound } from 'next/navigation'
import { projects, getProjectBySlug } from '@/data/projects'
import { Badge } from '@/components/ui/badge'
import { ProjectWorkWall } from '@/components/projects/project-work-wall'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { GsapReveal } from '@/components/motion/gsap-reveal'
import { MarkReturnProject } from '@/components/projects/mark-return-project'
import { ProjectDetailNav } from '@/components/projects/project-detail-nav'
import { ProjectFeaturedCases } from '@/components/projects/project-featured-cases'
import { MediaLightbox } from '@/components/projects/media-lightbox'
import { CoverVideo } from '@/components/projects/cover-video'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

function orderProjectCases(project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>) {
  if (project.slug !== 'myth-quest') return project

  const cases = [...project.cases]
  const payIndex = cases.findIndex((item) => item.id === 'pay process')
  const battlepassIndex = cases.findIndex((item) => item.id === 'battlepass')
  if (payIndex === -1 || battlepassIndex === -1 || battlepassIndex < payIndex) return project

  const [battlepass] = cases.splice(battlepassIndex, 1)
  cases.splice(payIndex, 0, battlepass)
  return { ...project, cases }
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const sourceProject = await getProjectBySlug(params.slug)
  if (!sourceProject) return notFound()
  const project = orderProjectCases(sourceProject)
  const subtitleIsTag = project.tags.some((tag) => tag === project.subtitle)
  const featuredCaseIds =
    project.slug === 'myth-quest'
      ? ['Consistency', 'UEprocess']
      : project.slug === 'dahua2'
        ? ['manage', 'ui-guidelines', 'desktop-to-mobile']
        : []

  return (
    <div className="container space-y-16 pb-16 pt-4">
      <MarkReturnProject slug={project.slug} />
      <ProjectDetailNav project={project} />
      <header className="space-y-10">
        <GsapReveal>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <h1 className="font-editorial text-5xl font-black leading-none md:text-7xl lg:text-8xl">
                {project.title}
              </h1>
              {!subtitleIsTag && (
                <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{project.subtitle}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.platform.map((p) => (
                  <Badge key={p}>{p}</Badge>
                ))}
                {project.tags.map((t) => (
                  <Badge key={t} className="border-border/70 bg-secondary text-secondary-foreground">
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="mt-8 max-w-2xl text-sm leading-7 text-muted-foreground">{project.summary}</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-2 shadow-soft">
              {project.coverVideo ? (
                <CoverVideo
                  src={project.coverVideo}
                  poster={project.cover}
                  containerClassName="aspect-[16/11] w-full overflow-hidden rounded-md bg-muted"
                />
              ) : (
                <SkeletonImage
                  src={project.cover}
                  alt={project.title}
                  fill
                  className="object-cover"
                  containerClassName="relative aspect-[16/11] w-full overflow-hidden rounded-md bg-muted"
                  sizes="(max-width:1024px) 100vw, 58vw"
                  priority
                />
              )}
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

      </header>

      <ProjectFeaturedCases project={project} />

      <section className="key-design space-y-4">
        <ProjectWorkWall project={project} hiddenCaseIds={featuredCaseIds} />
      </section>
      <MediaLightbox scope=".key-design" />
    </div>
  )
}
