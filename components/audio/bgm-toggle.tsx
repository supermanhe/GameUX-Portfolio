"use client"

import { Volume2, VolumeX } from 'lucide-react'
import { useBgm } from '@/components/audio/bgm-provider'
import { cn } from '@/lib/utils'

export function BgmToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useBgm()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? '关闭背景音乐' : '开启背景音乐'}
      title={enabled ? '关闭背景音乐' : '开启背景音乐'}
      className={cn(
        'ml-1 rounded-full p-2 text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground focus-ring',
        enabled && 'text-foreground',
        className,
      )}
    >
      {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      <span className="sr-only">{enabled ? '背景音乐已开启' : '背景音乐已关闭'}</span>
    </button>
  )
}
