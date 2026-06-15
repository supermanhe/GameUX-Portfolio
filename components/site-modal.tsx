"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { SiteItem } from '@/data/sites'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'
import { EMBED_IFRAME_ALLOW, EMBED_IFRAME_SANDBOX } from '@/lib/embed-config'
import { DelayedRender } from '@/components/skeletons/delayed-render'
import { cn } from '@/lib/utils'

export function SiteModal({
  list,
  index,
  onIndex,
  open,
  onOpen,
}: {
  list: SiteItem[]
  index: number
  onIndex: (i: number) => void
  open: boolean
  onOpen: (o: boolean) => void
}) {
  const item = list[index]
  const isPortrait = !!item.portrait
  const isCompact = !!item.compact
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const loadTimer = useRef<NodeJS.Timeout | null>(null)
  const loadedRef = useRef(false)
  const [hostOrigin, setHostOrigin] = useState('当前站点')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    loadedRef.current = false
    setFailed(false)
    if (loadTimer.current) {
      clearTimeout(loadTimer.current)
    }
    loadTimer.current = setTimeout(() => {
      if (!loadedRef.current) {
        setFailed(true)
        setLoading(false)
      }
    }, 8000)
    return () => {
      if (loadTimer.current) {
        clearTimeout(loadTimer.current)
        loadTimer.current = null
      }
    }
  }, [open, index])

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent
        className={
          isPortrait
            ? 'flex max-h-[calc(100dvh-1rem)] max-w-[min(96vw,64rem)] flex-col gap-3 overflow-y-auto p-4 sm:p-5'
            : 'max-w-6xl'
        }
      >
        <div className="flex shrink-0 items-center justify-between gap-3">
          <h3 className="min-w-0 truncate text-lg font-semibold">{item.name}</h3>
          <div className="flex gap-2">
            <Button asChild variant="secondary" aria-label="新窗口打开">
              <a href={item.url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">新窗口打开</span>
              </a>
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onOpen(false)} aria-label="关闭">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {!isCompact && (
          <div className="shrink-0">
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            {item.controls && (
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">基本操作</span>
                {item.controls.map((control) => (
                  <span key={control.keys} className="flex items-center gap-2">
                    <kbd className="rounded-md border border-primary/50 bg-primary/10 px-2 py-1 font-mono text-xs font-bold text-primary shadow-[inset_0_-1px_0_hsl(var(--primary)/0.25)]">
                      {control.keys}
                    </kbd>
                    <span>{control.action}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            isPortrait
              ? 'relative -mx-1 flex items-center justify-center px-11 sm:px-20'
              : '',
          )}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl border border-border',
              isPortrait ? 'aspect-[748/1098]' : 'mt-3 h-[60vh] w-full',
            )}
            style={
              isPortrait
                ? {
                    width: `min(748px, calc(100vw - 7rem), calc((100dvh - ${
                      isCompact ? '6.5rem' : '10rem'
                    }) * 748 / 1098))`,
                  }
                : undefined
            }
          >
            {!failed ? (
              <iframe
                ref={iframeRef}
                src={item.url}
                className="h-full w-full"
                onLoad={() => {
                  loadedRef.current = true
                  setFailed(false)
                  setLoading(false)
                  if (loadTimer.current) {
                    clearTimeout(loadTimer.current)
                    loadTimer.current = null
                  }
                }}
                onError={() => {
                  setFailed(true)
                  setLoading(false)
                }}
                allow={EMBED_IFRAME_ALLOW}
                sandbox={EMBED_IFRAME_SANDBOX}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-sm text-muted-foreground">
                <p>
                  目标站点可能禁止内嵌预览（X-Frame-Options 或 Content-Security-Policy frame-ancestors）。
                  如果你维护该站点，请在其部署配置中允许来自本站点的 iframe。
                </p>
                <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
                  Content-Security-Policy: frame-ancestors &#39;self&#39; {hostOrigin}
                </div>
                <Button asChild>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> 新窗口打开
                  </a>
                </Button>
              </div>
            )}
            {!failed && loading && (
              <DelayedRender>
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-muted/30" />
                  <div className="absolute inset-0 animate-pulse bg-muted/50" />
                </div>
              </DelayedRender>
            )}
          </div>

          {isPortrait && (
            <>
              <Button
                variant="secondary"
                disabled={index <= 0}
                onClick={() => onIndex(index - 1)}
                className="absolute left-0 top-1/2 h-11 w-11 -translate-y-1/2 px-0 sm:w-auto sm:px-4"
                aria-label="上一个"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-2" />
                <span className="sr-only sm:not-sr-only">上一个</span>
              </Button>
              <Button
                variant="secondary"
                disabled={index >= list.length - 1}
                onClick={() => onIndex(index + 1)}
                className="absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2 px-0 sm:w-auto sm:px-4"
                aria-label="下一个"
              >
                <span className="sr-only sm:not-sr-only">下一个</span>
                <ChevronRight className="h-4 w-4 sm:ml-2" />
              </Button>
            </>
          )}
        </div>

        {!isPortrait && (
          <div className="flex justify-between">
            <Button variant="secondary" disabled={index <= 0} onClick={() => onIndex(index - 1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> 上一个
            </Button>
            <Button variant="secondary" disabled={index >= list.length - 1} onClick={() => onIndex(index + 1)}>
              下一个 <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
