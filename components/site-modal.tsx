"use client"

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { SiteItem } from '@/data/sites'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'

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
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const loadTimer = useRef<NodeJS.Timeout | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!open) return
    setLoaded(false)
    loadedRef.current = false
    setFailed(false)
    if (loadTimer.current) {
      clearTimeout(loadTimer.current)
    }
    loadTimer.current = setTimeout(() => {
      if (!loadedRef.current) {
        setFailed(true)
      }
    }, 2000)
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
                setLoaded(true)
                setFailed(false)
                if (loadTimer.current) {
                  clearTimeout(loadTimer.current)
                  loadTimer.current = null
                }
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <p>目标站点可能禁止内嵌预览（X-Frame-Options）</p>
              <Button asChild>
                <a href={item.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> 新窗口打开
                </a>
              </Button>
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
