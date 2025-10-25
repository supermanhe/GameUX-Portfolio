import { notFound, redirect } from 'next/navigation'
import { projects } from '@/data/projects'

export default function CasePage({ params }: { params: { slug: string; caseId: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  const kase = project?.cases.find((c) => c.id === params.caseId)

  if (!project || !kase) notFound()

  redirect(`/projects/${project.slug}?case=${kase.id}`)
}
