"use client"

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // forcedTheme 强制恒为暗色：toggle 已注释、站点为纯暗色，避免 localStorage 残留 light 导致整页变白。
  // 若日后恢复 ThemeToggle 想要可切换，删掉 forcedTheme 即可。
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      storageKey="portfolio-theme"
    >
      {children}
    </NextThemesProvider>
  )
}

