"use client"

import { useState } from 'react'
import type { SiteItem } from '@/data/sites'
import { SiteModal } from '@/components/site-modal'
import { Badge } from '@/components/ui/badge'
import { SkeletonImage } from '@/components/ui/media-skeleton'

export function SitesSection({ items }: { items: SiteItem[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((site, i) => (
          <button
            key={site.id}
            className="hover-raise text-left focus-ring"
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
          >
            <div className="card-base">
              <SkeletonImage
                src={site.cover}
                alt={site.name}
                fill
                className="object-cover"
                containerClassName="relative aspect-[16/9] overflow-hidden rounded-2xl"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{site.name}</h3>
                  <span className="text-xs text-muted-foreground">{site.year}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {site.role.map((role) => (
                    <Badge key={role}>{role}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <SiteModal list={items} index={index} onIndex={setIndex} open={open} onOpen={setOpen} />
    </div>
  )
}
