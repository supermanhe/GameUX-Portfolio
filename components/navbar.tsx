"use client"

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '#projects', label: '参与项目' },
  { href: '#sites', label: '独立开发' },
]

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  return (
    <header className="sticky top-4 z-30">
      <div className="container">
        <div className="flex h-14 items-center justify-between rounded-full border border-white/10 bg-background/[0.72] px-3 shadow-soft backdrop-blur-xl">
          <Link href="/" className="px-2 text-sm font-bold tracking-tight">
            GameUX Portfolio
          </Link>
          <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={isHome ? l.href : `/${l.href}`}
              className={cn(
                'rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-2" />
          <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

