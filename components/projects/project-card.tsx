import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/data/projects'

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className="block hover-raise">
      <Card>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image src={p.cover} alt={p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <CardHeader>
          <CardTitle>{p.title}</CardTitle>
          <CardDescription>{p.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>平台：{p.platform.join(' / ')}</span>
            <span>·</span>
            <span>职责：{p.role}</span>
            <span>·</span>
            <span>时间：{p.period}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

