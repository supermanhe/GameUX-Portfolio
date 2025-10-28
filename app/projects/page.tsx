import { Suspense } from 'react'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{'\u53C2\u4E0E\u9879\u76EE'}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {'\u5C55\u793A\u4E24\u6B3E\u4E0A\u7EBF\u6E38\u620F\u7684\u5173\u952E\u5DE5\u4F5C\u4E0E\u6210\u679C\u3002'}
        </p>
      </div>

      <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={4} /></DelayedRender>}>
        <ProjectsGrid className="sm:grid-cols-2" />
      </Suspense>
    </div>
  )
}
