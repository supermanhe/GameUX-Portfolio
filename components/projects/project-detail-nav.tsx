"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BgmToggle } from '@/components/audio/bgm-toggle'
import { BackToProjectsButton } from '@/components/projects/back-to-projects-button'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

export function ProjectDetailNav({ project }: { project: Project }) {
  const hiddenCaseIds =
    project.slug === 'myth-quest'
      ? new Set(['Consistency', 'UEprocess'])
      : project.slug === 'dahua2'
        ? new Set(['manage', 'ui-guidelines', 'desktop-to-mobile'])
        : new Set<string>()
  const navCases = project.cases
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !hiddenCaseIds.has(item.id))
  const [activeId, setActiveId] = useState(navCases[0]?.item.id ?? '')
  const linksRef = useRef<HTMLElement>(null)

  const sectionKey = navCases.map(({ item }) => item.id).join('|')

  // 导航条溢出时：悬停滚轮 → 横向滑动；两侧按是否还有被裁内容切换渐变遮罩
  useEffect(() => {
    const el = linksRef.current
    if (!el) return undefined

    const updateEdges = () => {
      const max = el.scrollWidth - el.clientWidth
      el.classList.toggle('is-clip-left', el.scrollLeft > 4)
      el.classList.toggle('is-clip-right', el.scrollLeft < max - 4)
    }

    const onWheel = (event: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      event.preventDefault()
      el.scrollLeft += delta
    }

    updateEdges()
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [sectionKey])

  // 高亮变化（翻页 / 点击）时，把屏幕外的导航点自动滑进可视区（留出渐变遮罩的宽度）
  useEffect(() => {
    const el = linksRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const link = el.querySelector<HTMLElement>('.work-jump-link.is-active')
    if (!link) return

    const pad = 32
    const navRect = el.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    const left = linkRect.left - navRect.left + el.scrollLeft
    const right = left + linkRect.width

    let target: number | null = null
    if (left < el.scrollLeft + pad) target = left - pad
    else if (right > el.scrollLeft + el.clientWidth - pad) target = right - el.clientWidth + pad
    if (target === null) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' })
  }, [activeId])

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

      <nav ref={linksRef} className="project-detail-nav-links" aria-label="设计点导航">
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
