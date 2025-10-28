"use client"

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download, Github, Mail } from 'lucide-react'
import { useTrackEvent } from '@/lib/analytics'
import type { HeroContent } from '@/data/hero'
import { SkeletonImage } from '@/components/ui/media-skeleton'

function copyToClipboard(text: string) {
  if (typeof navigator === 'undefined') {
    return Promise.reject(new Error('Clipboard unavailable'))
  }

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (!successful) {
        reject(new Error('Copy command was unsuccessful'))
        return
      }
      resolve()
    } catch (error) {
      reject(error as Error)
    }
  })
}

type HeroProps = {
  data: HeroContent
}

export function Hero({ data }: HeroProps) {
  const track = useTrackEvent()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const handleCopyEmail = useCallback(async () => {
    track({ name: 'cta_copy_email' })
    try {
      await copyToClipboard(data.email)
      setToastMessage(`已复制邮箱地址：${data.email}`)
    } catch (error) {
      setToastMessage(`复制失败，请手动复制：${data.email}`)
    }
  }, [data.email, track])

  return (
    <section className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto h-40 w-40 overflow-hidden rounded-full ring-1 ring-border md:h-40 md:w-40"
      >
        <SkeletonImage
          src={data.avatar}
          alt="avatar"
          width={128}
          height={128}
          className="h-full w-full object-cover"
          containerClassName="h-full w-full"
          priority
        />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{data.headline}</h1>
        <p className="mt-2 max-w-[120ch] text-muted-foreground">{data.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button asChild onClick={() => track({ name: 'cta_download_cv' })}>
            <a href={data.resumeUrl} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> 下载简历 PDF
            </a>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleCopyEmail}
            aria-label="复制邮箱地址"
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button
            asChild
            variant="secondary"
            size="icon"
            onClick={() => track({ name: 'cta_open_github' })}
            aria-label="访问 GitHub"
          >
            <a href={data.githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div className="md:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2 className="mt-8 text-base font-semibold text-muted-foreground">{data.skillsTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{data.skills.join('、')}</p>
      </motion.div>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
