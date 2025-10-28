import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/data/projects'
import { SkeletonImage } from '@/components/ui/media-skeleton'

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className="block hover-raise">
      <Card>
        <SkeletonImage
          src={p.cover}
          alt={p.title}
          fill
          className="object-cover"
          containerClassName="relative aspect-[16/9] w-full overflow-hidden rounded-2xl"
          sizes="(max-width:768px) 100vw, 50vw"
        />
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

