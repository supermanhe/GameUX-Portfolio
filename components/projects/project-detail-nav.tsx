"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BgmToggle } from '@/components/audio/bgm-toggle'
import { BackToProjectsButton } from '@/components/projects/back-to-projects-button'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

export function ProjectDetailNav({ project }: { project: Project }) {
  const hiddenCaseIds =
    project.slug === 'myth-quest'
      ? new Set(['Consistency', 'UEprocess'])
      : project.slug === 'dahua2'
        ? new Set(['manage'])
        : new Set<string>()
  const navCases = project.cases
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !hiddenCaseIds.has(item.id))
  const [activeId, setActiveId] = useState(navCases[0]?.item.id ?? '')

  const sectionKey = navCases.map(({ item }) => item.id).join('|')

  useEffect(() => {
    const ids = sectionKey.split('|').filter(Boolean)
    if (!ids.length) return undefined

    let raf = 0

    const update = () => {
      raf = 0
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))
      if (!sections.length) return

      // 当前章节 = 顶部已越过视口上方 1/3 参考线的最后一个章节
      const line = window.innerHeight * 0.34
      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id
      }

      // 滚动到页面底部时,强制高亮最后一个章节
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id
      }

      setActiveId((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [sectionKey])

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
