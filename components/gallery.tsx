"use client"

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EMBED_IFRAME_ALLOW, EMBED_IFRAME_SANDBOX } from '@/lib/embed-config'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type Media = {
  type: 'image' | 'gif' | 'video' | 'embed'
  src: string
  caption?: string
  poster?: string
  local?: boolean
}

export function Gallery({ items }: { items: Media[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const current = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  const gridCols = useMemo(() => (items.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'), [items.length])

  return (
    <div>
      <div className={`grid gap-3 ${gridCols}`}>
        {items.map((m, i) => (
          <button
            key={i}
            className="group relative overflow-hidden rounded-xl border border-border focus-ring"
            onClick={() => openAt(i)}
          >
            {m.type === 'image' ? (
              <Image
                src={m.src}
                alt={m.caption || 'media'}
                width={600}
                height={400}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : m.type === 'gif' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.src}
                alt={m.caption || 'media'}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            ) : m.type === 'video' ? (
              <video
                src={m.src}
                poster={m.poster}
                className="h-full w-full object-cover"
                preload="none"
                muted
              />
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">点击查看嵌入内容</div>
            )}
            {m.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left text-xs text-white">
                {m.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0">
          <div className="relative">
            <button className="absolute right-2 top-2 z-10" onClick={() => setOpen(false)} aria-label="关闭">
              <X className="h-5 w-5" />
            </button>
            <div className="relative flex max-h-[80vh] min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-black">
              {current?.type === 'image' || current?.type === 'gif' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.caption || ''} className="max-h-[80vh] w-auto" />
              ) : current?.type === 'video' ? (
                <video src={current.src} poster={current.poster} controls className="max-h-[80vh]">
                  您的浏览器不支持视频播放。
                </video>
              ) : (
                <iframe
                  src={current?.src}
                  className="h-[80vh] w-full"
                  allow={EMBED_IFRAME_ALLOW}
                  sandbox={EMBED_IFRAME_SANDBOX}
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="text-sm text-muted-foreground">{current?.caption}</div>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" disabled={!hasPrev} onClick={() => setIndex((x) => x - 1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" disabled={!hasNext} onClick={() => setIndex((x) => x + 1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

