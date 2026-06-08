"use client"

import { usePathname } from 'next/navigation'

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <footer className="container py-12 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} GameUX Portfolio</p>
    </footer>
  )
}
