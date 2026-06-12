"use client"

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { CoverVideo } from '@/components/projects/cover-video'
import type { Project } from '@/data/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ProjectScrollShowcaseProps = {
  projects: Project[]
}

export function ProjectScrollShowcase({ projects }: ProjectScrollShowcaseProps) {
  const rootRef = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const panels = gsap.utils.toArray<HTMLElement>('.project-panel')

      if (reduceMotion) {
        gsap.set('.project-panel-copy, .project-panel-media', { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      const cleanups: Array<() => void> = []

      panels.forEach((panel) => {
        const media = panel.querySelector<HTMLElement>('.project-panel-media')
        const copy = panel.querySelectorAll('.project-panel-copy')

        gsap.fromTo(
          media,
          { yPercent: 10, scale: 1.16 },
          {
            yPercent: -10,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
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

        // 指针跟随：鼠标在封面上移动时，封面图朝光标方向微微位移（叠加在滚动视差之上）
        if (!media) return
        const xTo = gsap.quickTo(media, 'x', { duration: 0.7, ease: 'power3' })
        const yTo = gsap.quickTo(media, 'y', { duration: 0.7, ease: 'power3' })
        const X_MAX = 20
        const Y_MAX = 10

        const handlePointerMove = (event: PointerEvent) => {
          const rect = panel.getBoundingClientRect()
          const relX = event.clientX - rect.left
          const relY = event.clientY - rect.top
          panel.style.setProperty('--spot-x', `${relX}px`)
          panel.style.setProperty('--spot-y', `${relY}px`)
          xTo((relX / rect.width - 0.5) * 2 * X_MAX)
          yTo((relY / rect.height - 0.5) * 2 * Y_MAX)
        }
        const handlePointerLeave = () => {
          xTo(0)
          yTo(0)
        }

        panel.addEventListener('pointermove', handlePointerMove)
        panel.addEventListener('pointerleave', handlePointerLeave)
        cleanups.push(() => {
          panel.removeEventListener('pointermove', handlePointerMove)
          panel.removeEventListener('pointerleave', handlePointerLeave)
        })
      })

      ScrollTrigger.refresh()

      return () => {
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: rootRef, dependencies: [projects.length] },
  )

  return (
    <section ref={rootRef} id="projects" className="relative">
      <div className="overflow-x-clip">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            id={`project-${project.slug}`}
            href={`/projects/${project.slug}`}
            aria-label={`查看「${project.title}」项目详情`}
            onClick={() => {
              try {
                sessionStorage.setItem('returnToProject', project.slug)
              } catch {
                /* ignore */
              }
            }}
            className="project-panel group relative left-1/2 flex min-h-[100dvh] w-screen -translate-x-1/2 items-end overflow-hidden bg-card focus-ring"
          >
            <div className="absolute inset-0 overflow-hidden">
              {project.coverVideo ? (
                <CoverVideo
                  src={project.coverVideo}
                  poster={project.cover}
                  className="project-panel-media will-change-transform"
                  containerClassName="h-full w-full"
                />
              ) : (
                <SkeletonImage
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="project-panel-media object-cover will-change-transform"
                  containerClassName="relative h-full w-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/52 to-background/12" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/34 to-transparent" />
            </div>

            <div className="container relative z-10 pb-14 pt-32 md:pb-20">
              <div className="max-w-4xl">
                <div className="project-panel-copy flex flex-wrap items-center gap-2">
                  <span className="font-pixel rounded-sm bg-primary px-2.5 py-1.5 text-[10px] text-primary-foreground">
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

                <div className="project-panel-copy mt-8 grid max-w-3xl gap-3 text-sm text-white/82 sm:grid-cols-2">
                  <div className="border-l border-white/22 pl-4">
                    <p className="text-xs text-white/48">职责</p>
                    <p className="mt-1 font-semibold">{project.role}</p>
                  </div>
                  <div className="border-l border-white/22 pl-4">
                    <p className="text-xs text-white/48">周期</p>
                    <p className="mt-1 font-semibold">{project.period}</p>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="project-panel-copy delight-cta mt-9 inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-black text-black shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  查看工作项
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
