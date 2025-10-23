import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Game UI/UX Portfolio',
    template: '%s | Game UI/UX Portfolio',
  },
  description: '移动优先、简洁有趣的游戏UI/UX设计师作品集',
  openGraph: {
    title: 'Game UI/UX Portfolio',
    description: '移动优先、简洁有趣的游戏UI/UX设计师作品集',
    type: 'website',
    url: 'https://example.com',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="container py-6">{children}</main>
          <footer className="container py-10 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Game UI/UX Portfolio</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

