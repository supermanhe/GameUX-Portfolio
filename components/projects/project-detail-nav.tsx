"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BgmToggle } from '@/components/audio/bgm-toggle'
import { BackToProjectsButton } from '@/components/projects/back-to-projects-button'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

export function ProjectDetailNav({ project }: { project: Project }) {
  const hiddenCaseIds = project.slug === 'myth-quest' ? new Set(['Consistency', 'UEprocess']) : new Set<string>()
  const navCases = project.cases
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !hiddenCaseIds.has(item.id))
  const [activeId, setActiveId] = useState(navCases[0]?.item.id ?? '')

  useEffect(() => {
    const sections = navCases
      .map(({ item }) => document.getElementById(item.id))
      .filter((item): item is HTMLElement => Boolean(item))

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActiveId(visible.target.id)
      },
      {
        rootMargin: '-18% 0px -52% 0px',
        threshold: [0.12, 0.24, 0.4, 0.62],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [navCases])

  return (
    <header className="project-detail-nav">
      <BackToProjectsButton slug={project.slug} className="project-detail-nav-action" aria-label="返回项目列表">
        <ArrowLeft className="h-4 w-4" />
      </BackToProjectsButton>

      <nav className="project-detail-nav-links" aria-label="设计点导航">
        {navCases.map(({ item }, navIndex) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveId(item.id)}
            className={cn('work-jump-link', activeId === item.id && 'is-active')}
          >
            <span className="font-pixel">{String(navIndex + 1).padStart(2, '0')}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <BgmToggle className="project-detail-nav-volume" />
    </header>
  )
}
