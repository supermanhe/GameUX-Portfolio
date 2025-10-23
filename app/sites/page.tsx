"use client"

import Image from 'next/image'
import { useState } from 'react'
import { sites } from '@/data/sites'
import { SiteModal } from '@/components/site-modal'
import { Badge } from '@/components/ui/badge'

export default function SitesPage() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">已做项目（网站集合）</h1>
        <p className="mt-2 text-sm text-muted-foreground">点击卡片查看详情，支持内嵌交互预览（若被拦截则提供外链）。</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((s, i) => (
          <button key={s.id} className="hover-raise text-left" onClick={() => (setIndex(i), setOpen(true))}>
            <div className="card-base">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image src={s.cover} alt={s.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{s.name}</h3>
                  <span className="text-xs text-muted-foreground">{s.year}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.role.map((r) => (
                    <Badge key={r}>{r}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <SiteModal list={sites} index={index} onIndex={setIndex} open={open} onOpen={setOpen} />
    </div>
  )
}

