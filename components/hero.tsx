"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download, Mail } from 'lucide-react'
import { useTrackEvent } from '@/lib/analytics'

export function Hero() {
  const track = useTrackEvent()
  return (
    <section className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto h-28 w-28 overflow-hidden rounded-2xl ring-1 ring-border md:h-32 md:w-32"
      >
        <Image
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop"
          alt="avatar"
          width={128}
          height={128}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">某某 · 游戏 UI/UX 设计师</h1>
        <p className="mt-2 max-w-[60ch] text-muted-foreground">
          专注移动与跨平台游戏体验，擅长以数据驱动与可用性测试指导设计决策，用简洁的界面与恰到好处的动效提升留存与转化。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild onClick={() => track({ name: 'cta_download_cv' })}>
            <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> 下载简历 PDF
            </a>
          </Button>
          <Button asChild variant="secondary" onClick={() => track({ name: 'cta_contact' })}>
            <a href="mailto:me@example.com">
              <Mail className="mr-2 h-4 w-4" /> 联系我
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div className="md:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2 className="mt-8 text-base font-semibold text-muted-foreground">技能 / 工具</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Figma、Unity、Unreal、Three.js、Tailwind、shadcn、Framer Motion、Jira、Notion、UserTesting、Mixpanel
        </p>
      </motion.div>
    </section>
  )
}
