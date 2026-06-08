"use client"

import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { marked } from 'marked'
import type { Project } from '@/data/projects'
import { transformMediaLinks } from '@/lib/media'
import { cn } from '@/lib/utils'
import { CaseStorySection } from '@/components/projects/case-story'
import { SystemCaseStory } from '@/components/projects/system-case-story'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ProjectWorkWallProps = {
  project: Project
  hiddenCaseIds?: string[]
}

function CaseArticle({ markdown }: { markdown: string }) {
  const html = useMemo(() => transformMediaLinks(marked.parse(markdown) as string), [markdown])
  return <div className="work-article" dangerouslySetInnerHTML={{ __html: html }} />
}

export function ProjectWorkWall({ project, hiddenCaseIds = [] }: ProjectWorkWallProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  let visibleIndex = -1

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
      {project.cases.map((item) => {
        if (hiddenCaseIds.includes(item.id)) return null
        visibleIndex += 1
        const index = visibleIndex
        return (
        item.story ? (
          item.story.layout === 'linear' ? (
            <SystemCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : (
            <CaseStorySection key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          )
        ) : (
          <section
            key={item.id}
            id={item.id}
            className="work-item scroll-mt-24 grid gap-8 pt-10 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)]"
          >
            <aside className="work-copy lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-pixel text-3xl text-primary tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{item.title}</h2>
              <div className="mt-6 grid gap-2">
                {item.highlights.map((highlight) => (
                  <p key={highlight} className="rounded-md bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground">
                    {highlight}
                  </p>
                ))}
              </div>
            </aside>

            <div className={cn('work-media min-w-0', index % 2 === 1 && 'lg:-mt-16')}>
              <CaseArticle markdown={item.articleMDX} />
            </div>
          </section>
        ))
      })}
    </div>
  )
}
