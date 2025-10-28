import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { SitesSectionLoader } from '@/components/sections/sites-section-loader'
import { HeroSkeleton } from '@/components/skeletons/hero-skeleton'
import { ProjectsGridSkeleton } from '@/components/skeletons/projects-grid-skeleton'
import { SitesSectionSkeleton } from '@/components/skeletons/sites-section-skeleton'
import { DelayedRender } from '@/components/skeletons/delayed-render'

export default function Page() {
  return (
    <div className="space-y-16">
      <Suspense fallback={<DelayedRender><HeroSkeleton /></DelayedRender>}>
        <HeroSection />
      </Suspense>
      <section id="projects" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">参与项目</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            近年主要负责的线上项目，覆盖端游与移动端
          </p>
        </div>
        <Suspense fallback={<DelayedRender><ProjectsGridSkeleton items={4} /></DelayedRender>}>
          <ProjectsGrid />
        </Suspense>
      </section>

      <section id="sites" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">独立开发</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            利用AI Coding和开源美术资源，全栈开发Demo
          </p>
        </div>
        <Suspense fallback={<DelayedRender><SitesSectionSkeleton items={3} /></DelayedRender>}>
          <SitesSectionLoader />
        </Suspense>
      </section>
    </div>
  )
}

