"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { SiteItem } from '@/data/sites'
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from 'lucide-react'
import { EMBED_IFRAME_ALLOW, EMBED_IFRAME_SANDBOX } from '@/lib/embed-config'

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
      <DialogContent className="max-w-6xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <a href={item.url} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> 新窗口打开
              </a>
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onOpen(false)} aria-label="关闭">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="text-xs text-muted-foreground">角色：{item.role.join(' / ')} · 年份：{item.year}</div>

        <div className="relative mt-3 overflow-hidden rounded-2xl border border-border">
          {!failed ? (
            <iframe
              ref={iframeRef}
              src={item.url}
              className="h-[60vh] w-full"
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
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" disabled={index <= 0} onClick={() => onIndex(index - 1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> 上一个
          </Button>
          <Button variant="secondary" disabled={index >= list.length - 1} onClick={() => onIndex(index + 1)}>
            下一个 <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
