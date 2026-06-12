import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/data/projects'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { GsapReveal } from '@/components/motion/gsap-reveal'
import { CoverVideo } from '@/components/projects/cover-video'

export function ProjectCard({ p, index = 0 }: { p: Project; index?: number }) {
  return (
    <GsapReveal delay={index * 0.08}>
      <Link
        href={`/projects/${p.slug}`}
        className="group block overflow-hidden rounded-lg border border-border/70 bg-card/80 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/45 hover:bg-card"
      >
        <div className="relative">
          {p.coverVideo ? (
            <CoverVideo
              src={p.coverVideo}
              poster={p.cover}
              className="transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              containerClassName="aspect-[16/10] w-full overflow-hidden bg-muted"
            />
          ) : (
            <SkeletonImage
              src={p.cover}
              alt={p.title}
              fill
              className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              containerClassName="relative aspect-[16/10] w-full overflow-hidden bg-muted"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/92 to-transparent" />
        </div>
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {p.platform.map((platform) => (
              <Badge key={platform}>{platform}</Badge>
            ))}
          </div>
          <h3 className="mt-5 text-2xl font-bold leading-tight md:text-3xl">{p.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.subtitle}</p>
          <div className="mt-6 grid gap-2 text-sm text-muted-foreground">
            <p>职责：{p.role}</p>
            <p>周期：{p.period}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t} className="border-border/70 bg-secondary text-secondary-foreground">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </GsapReveal>
  )
}

