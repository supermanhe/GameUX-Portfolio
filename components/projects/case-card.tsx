"use client"

import type { Project } from '@/data/projects'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { GsapReveal } from '@/components/motion/gsap-reveal'

type CaseCardProps = {
  slug: string
  c: Project['cases'][number]
  index?: number
  onOpen?: (payload: { slug: string; caseId: string; index: number }) => void
}

export function CaseCard({ slug, c, index = 0, onOpen }: CaseCardProps) {
  const cover = c.media.find((m) => m.type === 'image' || m.type === 'gif')
  const video = !cover ? c.media.find((m) => m.type === 'video') : undefined

  return (
    <GsapReveal delay={index * 0.045}>
      <button
        type="button"
        onClick={() => onOpen?.({ slug, caseId: c.id, index })}
        className="group block w-full overflow-hidden rounded-lg border border-border/70 bg-card/80 text-left transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/45 focus-ring"
      >
        <div className="relative overflow-hidden bg-muted">
          {cover?.type === 'gif' ? (
            <SkeletonImage
              src={cover.src}
              alt={cover.caption || c.title}
              width={640}
              height={360}
              className="object-cover object-top transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              containerClassName="relative h-80 w-full"
              sizes="(max-width:768px) 100vw, 50vw"
              unoptimized
            />
          ) : cover ? (
            <SkeletonImage
              src={cover.src}
              alt={cover.caption || c.title}
              width={640}
              height={360}
              className="object-cover object-top transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              containerClassName="relative h-80 w-full"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          ) : video?.poster ? (
            <SkeletonImage
              src={video.poster}
              alt={video.caption || c.title}
              width={640}
              height={360}
              className="object-cover object-top transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              containerClassName="relative h-80 w-full"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          ) : (
            <div className="h-80 w-full bg-primary/[0.12]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/18 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-background/75 px-3 py-1 text-xs font-semibold text-primary">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-xl font-bold leading-tight text-white">{c.title}</h3>
          </div>
        </div>
        <div className="grid gap-2 p-5 text-sm text-muted-foreground">
          {c.highlights.map((h, i) => (
            <div key={i} className="rounded-md bg-secondary/60 px-3 py-2">
              {h}
            </div>
          ))}
        </div>
      </button>
    </GsapReveal>
  )
}
