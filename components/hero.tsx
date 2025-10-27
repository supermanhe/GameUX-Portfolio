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
          src="https://res.cloudinary.com/dnhjgceru/image/upload/v1761574783/%E6%88%91%E7%9A%84%E8%82%96%E5%83%8F_2_cohql6.png"
          alt="avatar"
          width={128}
          height={128}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">何梓超 · 游戏UX设计师 · 独立开发者</h1>
        <p className="mt-2 max-w-[60ch] text-muted-foreground">
          网易游戏《大话西游2》主交互、昆仑万维《圣境之塔》UX负责人； 
          热爱游戏，专注游戏UX 8年，在昆仑万维从0到1构建UX流程
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
          Figma、Unity、Axure、AI Coding、Photoshop
        </p>
      </motion.div>
    </section>
  )
}
