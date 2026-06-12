"use client"

import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { marked } from 'marked'
import type { Project } from '@/data/projects'
import { transformMediaLinks } from '@/lib/media'
import { CaseStorySection } from '@/components/projects/case-story'
import { SystemCaseStory } from '@/components/projects/system-case-story'
import { DragonCaseStory } from '@/components/projects/dragon-case-story'
import { PetCaseStory } from '@/components/projects/pet-case-story'
import { DiyCaseStory } from '@/components/projects/diy-case-story'
import { AiuxCaseStory } from '@/components/projects/aiux-case-story'
import { AiuxSkillsShowcase } from '@/components/projects/aiux-skills-showcase'
import { LoadableImage } from '@/components/ui/loadable-image'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ProjectWorkWallProps = {
  project: Project
  hiddenCaseIds?: string[]
}

function CaseArticle({ markdown }: { markdown: string }) {
  const html = useMemo(() => transformMediaLinks(marked.parse(markdown) as string), [markdown])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const videos = ref.current.querySelectorAll('video')
    if (!videos.length) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    videos.forEach((v) => {
      v.loop = true
    })

    if (reduceMotion) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.5 },
    )

    videos.forEach((v) => observer.observe(v))
    return () => observer.disconnect()
  }, [html])

  return <div ref={ref} className="work-article" dangerouslySetInnerHTML={{ __html: html }} />
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
    <div ref={rootRef}>
      {project.slug === 'ai-ux' && <AiuxSkillsShowcase />}
      {project.cases.map((item) => {
        if (hiddenCaseIds.includes(item.id)) return null
        visibleIndex += 1
        const index = visibleIndex
        return (
        item.story ? (
          item.story.layout === 'dragon' ? (
            <DragonCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : item.story.layout === 'pet' ? (
            <PetCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : item.story.layout === 'diy' ? (
            <DiyCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : item.story.layout === 'aiux' ? (
            <AiuxCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : item.story.layout === 'linear' ? (
            <SystemCaseStory key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          ) : (
            <CaseStorySection key={item.id} id={item.id} index={index} title={item.title} story={item.story} />
          )
        ) : (
          <section
            key={item.id}
            id={item.id}
            className={`work-item scroll-mt-24${item.cover ? ' work-item-has-cover' : ''}`}
          >
            {item.cover && (
              <div className="legacy-case-cover work-copy">
                <LoadableImage
                  src={item.cover.src}
                  alt={item.cover.alt ?? item.title}
                  containerClassName="absolute inset-0"
                  className="h-full w-full object-cover"
                  style={item.cover.objectPosition ? { objectPosition: item.cover.objectPosition } : undefined}
                />
                <span className="legacy-case-cover-shade" />
                <div className="legacy-case-cover-copy">
                  <div className="legacy-case-cover-head">
                    <span className="font-pixel text-3xl text-primary tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.archetype && <span className="cs-archetype">{item.archetype}</span>}
                  </div>
                  <h2>{item.title}</h2>
                  {item.blurb && <p className="legacy-case-cover-blurb">{item.blurb}</p>}
                </div>
              </div>
            )}

            <div className={`mt-16 grid gap-8 md:mt-24 lg:gap-14${project.slug === 'dahua2' ? '' : ' lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)]'}`}>
              {project.slug !== 'dahua2' && (
                <aside className="work-copy lg:sticky lg:top-28 lg:self-start">
                  <p className="font-pixel text-[0.72rem] uppercase tracking-wider text-primary">重点</p>
                  <div className="mt-5 grid gap-2">
                    {item.highlights.map((highlight) => (
                      <p key={highlight} className="rounded-md bg-secondary/70 px-3 py-2 text-sm text-secondary-foreground">
                        {highlight}
                      </p>
                    ))}
                  </div>
                </aside>
              )}

              <div className="work-media min-w-0">
                <CaseArticle markdown={item.articleMDX} />
              </div>
            </div>
          </section>
        ))
      })}
    </div>
  )
}
