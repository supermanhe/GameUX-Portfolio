"use client"

import Link from 'next/link'
import { type PointerEvent, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ProjectScrollShowcaseProps = {
  projects: Project[]
}

export function ProjectScrollShowcase({ projects }: ProjectScrollShowcaseProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const totalCases = useMemo(
    () => projects.reduce((sum, project) => sum + project.cases.length, 0),
    [projects],
  )

  const handlePanelPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const panels = gsap.utils.toArray<HTMLElement>('.project-panel')

      if (reduceMotion) {
        gsap.set('.project-panel-copy, .project-panel-media', { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      panels.forEach((panel) => {
        const media = panel.querySelector('.project-panel-media')
        const copy = panel.querySelectorAll('.project-panel-copy')

        gsap.fromTo(
          media,
          { yPercent: -7, scale: 1.08 },
          {
            yPercent: 7,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )

        gsap.fromTo(
          copy,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 62%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      ScrollTrigger.refresh()
    },
    { scope: rootRef, dependencies: [projects.length] },
  )

  return (
    <section ref={rootRef} id="projects" className="relative">
      <div className="container py-14 md:py-20">
        <div className="grid gap-8 border-y border-border/60 py-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">Selected work</p>
            <h2 className="font-editorial mt-3 max-w-4xl text-4xl font-black leading-[1.02] md:text-7xl">
              参与项目
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm md:min-w-[360px]">
            <div>
              <p className="font-editorial text-4xl font-black tabular-nums">{projects.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">上线项目</p>
            </div>
            <div>
              <p className="font-editorial text-4xl font-black tabular-nums">{totalCases}</p>
              <p className="mt-1 text-xs text-muted-foreground">工作项</p>
            </div>
            <div>
              <p className="font-editorial text-4xl font-black tabular-nums">8</p>
              <p className="mt-1 text-xs text-muted-foreground">年游戏UX</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-10">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            onPointerMove={handlePanelPointerMove}
            className={cn(
              'project-panel group relative mx-auto flex min-h-[92dvh] w-full max-w-[1600px] items-end overflow-hidden bg-card',
              index % 2 === 0 ? 'md:rounded-r-lg' : 'md:rounded-l-lg',
            )}
          >
            <div className="absolute inset-0 overflow-hidden">
              <SkeletonImage
                src={project.cover}
                alt={project.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className="project-panel-media object-cover transition duration-700 group-hover:scale-[1.03]"
                containerClassName="relative h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/52 to-background/12" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/34 to-transparent" />
            </div>

            <div className="container relative z-10 pb-14 pt-32 md:pb-20">
              <div className="max-w-4xl">
                <div className="project-panel-copy flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-black text-primary-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {project.platform.map((platform) => (
                    <Badge key={platform} className="border-white/18 bg-black/24 text-white backdrop-blur">
                      {platform}
                    </Badge>
                  ))}
                </div>

                <h3 className="project-panel-copy mt-6 text-5xl font-black leading-[0.92] text-white md:text-8xl">
                  {project.title}
                </h3>
                <p className="project-panel-copy mt-4 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                  {project.subtitle}
                </p>
                <p className="project-panel-copy mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                  {project.summary}
                </p>

                <div className="project-panel-copy mt-8 grid max-w-3xl gap-3 text-sm text-white/82 sm:grid-cols-3">
                  <div className="border-l border-white/22 pl-4">
                    <p className="text-xs text-white/48">职责</p>
                    <p className="mt-1 font-semibold">{project.role}</p>
                  </div>
                  <div className="border-l border-white/22 pl-4">
                    <p className="text-xs text-white/48">周期</p>
                    <p className="mt-1 font-semibold">{project.period}</p>
                  </div>
                  <div className="border-l border-white/22 pl-4">
                    <p className="text-xs text-white/48">工作项</p>
                    <p className="mt-1 font-semibold">{project.cases.length} 个模块</p>
                  </div>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="project-panel-copy delight-cta mt-9 inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-black text-black shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground focus-ring"
                >
                  查看工作项
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
