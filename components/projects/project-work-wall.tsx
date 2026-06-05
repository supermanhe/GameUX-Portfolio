"use client"

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { marked } from 'marked'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { transformMediaLinks } from '@/lib/media'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ProjectWorkWallProps = {
  project: Project
}

function CaseArticle({ markdown }: { markdown: string }) {
  const html = useMemo(() => transformMediaLinks(marked.parse(markdown) as string), [markdown])
  return <div className="work-article" dangerouslySetInnerHTML={{ __html: html }} />
}

export function ProjectWorkWall({ project }: ProjectWorkWallProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [activeId, setActiveId] = useState(project.cases[0]?.id ?? '')

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = project.cases
      .map((item) => document.getElementById(item.id))
      .filter((item): item is HTMLElement => Boolean(item))

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      {
        rootMargin: reduceMotion ? '0px 0px -40% 0px' : '-18% 0px -52% 0px',
        threshold: [0.12, 0.24, 0.4, 0.62],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [project.cases])

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = gsap.utils.toArray<HTMLElement>('.work-item')

      if (reduceMotion) {
        gsap.set('.work-copy, .work-media', { autoAlpha: 1, y: 0 })
        return
      }

      items.forEach((item) => {
        gsap.fromTo(
          item.querySelectorAll('.work-copy, .work-media'),
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      ScrollTrigger.refresh()
    },
    { scope: rootRef, dependencies: [project.slug] },
  )

  return (
    <div ref={rootRef} className="space-y-20 md:space-y-28">
      <nav className="work-jump-nav" aria-label="工作项导航">
        {project.cases.map((item, index) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={cn('work-jump-link', activeId === item.id && 'is-active')}
          >
            <span className="font-pixel">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      {project.cases.map((item, index) => (
        <section
          key={item.id}
          id={item.id}
          className="work-item grid gap-8 border-t border-border/60 pt-10 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)]"
        >
          <aside className="work-copy lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-pixel text-3xl text-primary tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-pixel text-[10px] uppercase tracking-wider">{item.media.length} media</span>
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{item.title}</h2>
            <div className="mt-6 grid gap-2">
              {item.highlights.map((highlight) => (
                <p key={highlight} className="rounded-md bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground">
                  {highlight}
                </p>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}/${item.id}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-foreground"
            >
              打开单项深链
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>

          <div className={cn('work-media min-w-0', index % 2 === 1 && 'lg:-mt-16')}>
            <CaseArticle markdown={item.articleMDX} />
          </div>
        </section>
      ))}
    </div>
  )
}
