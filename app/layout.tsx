import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

// 8-bit 像素字体（仅拉丁/数字），通过 CSS 变量供“我的工具”面板使用
const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { DelightLayer } from '@/components/motion/delight-layer'
import { BgmProvider } from '@/components/audio/bgm-provider'
import { SiteFooter } from '@/components/site-footer'
import { ImageLoadingEnhancer } from '@/components/ui/image-loading-enhancer'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'He Zichao — Senior Game UX Designer',
    template: '%s | He Zichao',
  },
  description: '移动优先、简洁有趣的游戏UI/UX设计师作品集',
  openGraph: {
    title: 'He Zichao — Senior Game UX Designer',
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
      <body className={`${pixelFont.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <BgmProvider>
            <DelightLayer />
            <ImageLoadingEnhancer />
            <Navbar />
            <main>{children}</main>
            <SiteFooter />
          </BgmProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

