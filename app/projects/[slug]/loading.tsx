import { ProjectDetailSkeleton } from '@/components/skeletons/project-detail-skeleton'

export default function Loading() {
  return (
    <div className="container pb-12 pt-10">
      <ProjectDetailSkeleton />
    </div>
  )
}
