import { Suspense } from 'react'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'
import { GsapReveal } from '@/components/motion/gsap-reveal'

export default function ProjectsPage() {
  return (
    <div className="container space-y-10 pb-12 pt-16">
      <GsapReveal>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">Selected work</p>
          <h1 className="font-editorial mt-3 text-5xl font-black leading-tight md:text-7xl">{'\u53C2\u4E0E\u9879\u76EE'}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
          {'\u4E24\u6B3E\u4E0A\u7EBF\u6E38\u620F\u7684\u5173\u952E\u5DE5\u4F5C\u4E0E\u6210\u679C\uFF0C\u4EE5\u53CA\u4E00\u9879 AI First \u5DE5\u4F5C\u6D41\u7684\u63A2\u7D22\u3002'}
          </p>
        </div>
      </GsapReveal>

      <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={4} /></DelayedRender>}>
        <ProjectsGrid className="sm:grid-cols-2" />
      </Suspense>
    </div>
  )
}
