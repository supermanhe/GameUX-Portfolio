"use client"

import { useState } from 'react'
import type { SiteItem } from '@/data/sites'
import { SiteModal } from '@/components/site-modal'
import { Badge } from '@/components/ui/badge'
import { SkeletonImage } from '@/components/ui/media-skeleton'
import { GsapReveal } from '@/components/motion/gsap-reveal'

export function SitesSection({ items }: { items: SiteItem[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((site, i) => (
          <GsapReveal key={site.id} delay={i * 0.06} className="h-full">
            <button
              className="group h-full w-full text-left focus-ring"
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card/80 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/45">
                <SkeletonImage
                  src={site.cover}
                  alt={site.name}
                  fill
                  className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                  containerClassName="relative aspect-[16/10] overflow-hidden bg-muted"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold leading-snug">{site.name}</h3>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">{site.year}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{site.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {site.role.map((role) => (
                      <Badge key={role}>{role}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </GsapReveal>
        ))}
      </div>

      <SiteModal list={items} index={index} onIndex={setIndex} open={open} onOpen={setOpen} />
    </div>
  )
}
