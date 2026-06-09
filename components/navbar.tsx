"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
// 亮暗模式开关暂时隐藏，后续可恢复
// import { ThemeToggle } from '@/components/theme-toggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BgmToggle } from '@/components/audio/bgm-toggle'

const links = [
  { href: '#projects', label: '参与项目' },
  { href: '#sites', label: '独立开发' },
  { href: '#skills', label: '我的工具' },
  { href: '#about', label: '关于我' },
]

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isProjectDetail = /^\/projects\/[^/]+\/?$/.test(pathname)
  const [activeId, setActiveId] = useState<string | null>(null)

  // 滚动监听：高亮当前所在区块对应的导航项（仅首页）
  useEffect(() => {
    if (!isHome) {
      setActiveId(null)
      return
    }

    const ids = links.map((l) => l.href.slice(1))
    let ticking = false

    const update = () => {
      ticking = false
      // 区块顶部越过视口约 30% 处即视为进入；取最后一个越线的区块
      const line = window.innerHeight * 0.3
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActiveId((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHome])

  if (isProjectDetail) return null

  return (
    <header className="sticky top-4 z-30">
      <div className="container">
        <div className="flex h-14 items-center justify-between rounded-full border border-white/10 bg-background/[0.72] px-3 shadow-soft backdrop-blur-xl">
          <Link href="/" className="px-2 text-sm font-bold tracking-tight">
            GameUX Portfolio
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const active = isHome && activeId === l.href.slice(1)
              return (
                <Link
                  key={l.href}
                  href={isHome ? l.href : `/${l.href}`}
                  onClick={() => {
                    // 首页点击锚点时通知开场遮罩收起并滚动到目标区块
                    // （Next.js Link 用 pushState 跳 hash，不触发原生 hashchange）
                    if (isHome) {
                      window.dispatchEvent(
                        new CustomEvent('home:intro:navigate', { detail: l.href.slice(1) }),
                      )
                    }
                  }}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3 py-2 text-sm transition hover:bg-secondary/70 hover:text-foreground',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      'pointer-events-none absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.7)] transition-all duration-300 ease-out',
                      active ? 'w-5 opacity-100' : 'w-0 opacity-0',
                    )}
                  />
                </Link>
              )
            })}
            <BgmToggle />
            {/* 亮暗模式开关暂时隐藏，后续可恢复 */}
            {/* <div className="ml-2" />
            <ThemeToggle /> */}
          </nav>
        </div>
      </div>
    </header>
  )
}
