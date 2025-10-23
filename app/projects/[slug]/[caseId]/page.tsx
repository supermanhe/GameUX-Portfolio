"use client"

import { notFound, useParams, useRouter } from 'next/navigation'
import { projects } from '@/data/projects'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Gallery } from '@/components/gallery'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { UploadPanel, readUploadedMedia } from '@/components/upload-panel'

export default function CasePage() {
  const params = useParams<{ slug: string; caseId: string }>()
  const router = useRouter()
  const project = projects.find((p) => p.slug === params.slug)
  const kase = project?.cases.find((c) => c.id === params.caseId)

  const storageKey = project && kase ? `uploads:${project.slug}:${kase.id}` : 'uploads:missing'
  const uploaded = readUploadedMedia(storageKey)
  const media = kase ? [...uploaded, ...kase.media] : uploaded

  if (!project || !kase) return notFound()

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { href: '/', label: '首页' },
          { href: '/projects', label: '参与项目' },
          { href: `/projects/${project.slug}`, label: project.title },
          { label: kase.title },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{kase.title}</h1>
          <p className="text-sm text-muted-foreground">{'目标/方法/指标详见正文与媒体画廊。'}</p>
        </div>
        <Button variant="secondary" onClick={() => router.push(`/projects/${project.slug}`)}>
          {'返回该项目卡片导览'}
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{'媒体画廊'}</h2>
        <Gallery items={media} />
      </section>

      <section className="max-w-none space-y-4 text-base leading-7">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{kase.articleMDX}</ReactMarkdown>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{'本地上传（编辑模式）'}</h2>
        <UploadPanel storageKey={storageKey} />
      </section>
    </div>
  )
}
