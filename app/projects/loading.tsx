import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'

export default function Loading() {
  return (
    <div className="container space-y-6 pb-12 pt-16">
      <div>
        <div className="h-7 w-32 rounded-md bg-muted/60" />
        <div className="mt-2 h-4 w-64 rounded-md bg-muted/60" />
      </div>
      <ProjectsGridSkeleton items={4} />
    </div>
  )
}
