"use client"

import Image from 'next/image'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

const gradients = [
  'from-purple-500/40 via-purple-400/20 to-transparent',
  'from-indigo-500/40 via-indigo-400/20 to-transparent',
  'from-cyan-500/40 via-cyan-400/20 to-transparent',
]

type CaseCardProps = {
  slug: string
  c: Project['cases'][number]
  index?: number
  onOpen?: (payload: { slug: string; caseId: string; index: number }) => void
}

export function CaseCard({ slug, c, index = 0, onOpen }: CaseCardProps) {
  const cover = c.media.find((m) => m.type === 'image' || m.type === 'gif')
  const video = !cover ? c.media.find((m) => m.type === 'video') : undefined
  const gradient = gradients[index % gradients.length]

  return (
    <button
      type="button"
      onClick={() => onOpen?.({ slug, caseId: c.id, index })}
      className="block w-full rounded-2xl border border-border/60 bg-card/70 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft focus-ring"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.caption || c.title}
            width={640}
            height={360}
            className="h-36 w-full object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        ) : video?.poster ? (
          <Image
            src={video.poster}
            alt={video.caption || c.title}
            width={640}
            height={360}
            className="h-36 w-full object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        ) : (
          <div className={cn('h-36 w-full bg-gradient-to-br', gradient)} />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-medium">
          {c.title}
        </div>
      </div>
      <div className="space-y-2 p-5 text-sm text-muted-foreground">
        <p>{'\u70B9\u51FB\u6253\u5F00\u53EF\u7F16\u8F91\u5F39\u7A97\uFF0C\u67E5\u770B\u7EC6\u8282\u4E0E\u5A92\u4F53\u3002'}</p>
        <ul className="list-disc space-y-1 pl-4">
          {c.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </button>
  )
}
