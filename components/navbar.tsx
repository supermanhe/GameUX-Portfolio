"use client"

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '#projects', label: '参与项目' },
  { href: '#sites', label: '已做项目' },
]

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Game UI/UX</Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={isHome ? l.href : `/${l.href}`}
              className={cn('rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground')}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-2" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

